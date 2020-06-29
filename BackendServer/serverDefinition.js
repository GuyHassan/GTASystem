
//for databaseDefinition!!
const { addMaterials, getMaterials, getProfession,
  addStudentToClassroom, getStudentsNamesAsObject, checkUsernamePassword,
  addUsers, existInDB, getClassrooms, addClassrooms, setIsFinishQuestions,
  initialArrayToGrades, getTopicGrades, getTestQuestions, calcFinalStudyGrade,
  getStudentDetails, getStudentGradesDiagram, getStudentsGradeDiagram
} = require("./databaseDefinition");

const { getArrayFromFirestore, addTopicMaterial,
  setPassingGrade, getPassingGrade } = require("./firestoreDefinition");

const PORT = process.env.PORT || 3005;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// Website you wish to allow to connect need to add here the github root to the website !!!
app.use(function (req, res, next) {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://guyhassan.github.io"
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // res.setHeader("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE, PATCH");
  next();
});

// create a login request and check if the user exist
app.post('/loginRequest', (req, res) => {
  const userDetails = req.body;
  checkUsernamePassword(userDetails).then((response) => {
    if (response === null) {
      res.status("404").send("Login Error");
      return;
    }
    res.send(response);
  });
});


pathPermission = ["/LecturerView/StudentPermissions", '/AdminPermission'];
//new user to the DB 
app.post(pathPermission, (req, res) => {
  const userDetails = { ...req.body, path: req.url };
  existInDB("users", userDetails.username).then((response) => {
    //if the path is exist so the username is taken
    if (response === true) {
      res.status("404").send("The Username Is Used");
      return;
    }
    addUsers(userDetails);
    console.log("The User Is Added To The DB");
    res.send(response);
  });
});

//get class for specific lecturer : NEED lecturerName , RETURN : classesList!!
app.get("/getClasses/:username/:professionName", (req, res) => {
  const { username, professionName } = req.params;
  getClassrooms(username, professionName).then(classesList => {
    if (classesList.length === 0) {
      res.status("404").send("you don't have classes in this profession");
      return;
    }
    res.send(classesList);
  });
});

app.get("/getProfession/:username/:isLecturer", (req, res) => {
  const { username, isLecturer } = req.params;
  getProfession(username, (isLecturer === 'true')).then(professionList => {
    if (Array.isArray(professionList) && professionList.length === 0) {
      res.status("404").send("you don't have profession yet");
      return;
    }
    res.send(professionList);
  });
});

//add class for the lecturer : NEED {lecturerName,className,professionName,description} , RETURN new classroomList !!!
//choose another URL name !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post("/LecturerView/createClassroom", (req, res) => {
  const classDetails = req.body;
  getClassrooms(classDetails.lecturerName, classDetails.professionName).then((classesList) => {
    //if the path is exist so the classroom is used\
    if (classesList !== null && classesList.indexOf(classDetails.className) > -1) {
      res.status("404").send("you have this Classroom in your list");
      return false;
    }
    addClassrooms(classDetails);
    res.send("The class was successfully added");
    console.log("The class Is Added To The DB");
  });
});

//get list of students to add to the class : NEED {professionName} ,RETURN studentList{username:studentName} THAT NOT EXIST IN THIS CLASS!! 
app.get("/getStudentsForAddToClass/:professionName/:className", (req, res) => {
  const { professionName, className } = req.params;
  getStudentsNamesAsObject(professionName, className, false).then(studentsName => {
    if (studentsName.length === 0) {
      res.status("404").send("you don't have students in this class that you can add!!");
      return;
    }
    res.send(studentsName);
  });
});

//add list of students to given class : NEED {lecturerName,professionName,className,{studentsUsername}} ,RETURN None
app.post("/LecturerView/addStudentsToClass", (req, res) => {
  addStudentToClassroom(req.body);
  res.send("the student's are added to the class");
});


//get list of students that inside the class : NEED {professionName} ,RETURN studentList THAT IN THIS CLASS!! 
app.get("/getStudentsClass", (req, res) => {
  const { professionName, className } = req.query;
  getStudentsNamesAsObject(professionName, className, true).then(studentsName => {
    if (studentsName.length === 0) {
      res.send([])
      return;
    }
    res.send(studentsName);
  });
});

//get Materials Tree : NEED {username,professionName,className} RETURN materials tree .
app.get("/getMaterials", (req, res) => {
  const { username, professionName, className, isLecturer } = req.query;
  getMaterials(username, professionName, className, isLecturer === 'true').then(materialTree => {
    if (materialTree === null) {
      // res.status("404").send("you don't have materials for this class");
      res.send([])
      return;
    }
    res.send(materialTree);
  });
});


//function for add materials
//NEED : {lecturerName, professionName, className, materialsTree}
app.post("/addMaterials", (req, res) => {
  addMaterials(req.body).then(response => {
    res.send(response);
  });
});

//NEED (studentName,professionName,topicIndexes)
//NEED THIS ROUTE  => /setIsFinishQuestion?studentName=${studentName}&professionName=${professionName}&topicIndexes=${topicIndexes}
app.patch("/setIsFinishQuestion", (req, res) => {
  const { studentName, professionName, topicIndexes } = req.query;
  setIsFinishQuestions(studentName, professionName, topicIndexes);
});

//NEED (studentName,professionName,topicIndexes,gradeType,grade)=> grade Type is string with two option : 1.'studyGrades' => FOR STUDY!! 2. 'testGrades' => FOR TEST!!
//NEED THIS ROUTE => /setArrayGrade?studentName=${studentName}&professionName=${professionName}&topicIndexes=${topicIndexes}&gradeType=${gradeType}&grade=${grade}
app.patch("/setArrayGrade", (req, res) => {
  const { studentName, professionName, topicIndexes, gradeType, grade } = req.query;
  initialArrayToGrades(studentName, professionName, topicIndexes, gradeType, grade).then(gradeArray => {
    res.send(true);
  });
});


//NEED (studentName,professionName,topicIndexes,gradeType)=> grade Type is string with two option : 1.'studyGrades' => FOR STUDY!! 2. 'testGrades' => FOR TEST!!
//NEED THIS ROUTE => /getArrayGrade?studentName=${studentName}&professionName=${professionName}&topicIndexes=${topicIndexes}&gradeType=${gradeType}
app.get("/getArrayGrade", (req, res) => {
  const { studentName, professionName, topicIndexes, gradeType } = req.query;
  getTopicGrades(studentName, professionName, topicIndexes, gradeType).then(gradesArr => {
    if (Array.isArray(gradesArr)) {
      res.send(gradesArr);
    }
    else {
      res.send("isEmpty");
    }
  });
});

//NEED (studentName, professionName,topicIndex)=> the index of the topic only !!!
//NEED THIS ROUTE => /getTestQuestions?studentName=${studentName}&professionName=${professionName}&topicIndex=${topicIndex}
app.get("/getTestQuestions", (req, res) => {
  const { studentName, professionName, topicIndex } = req.query;
  getTestQuestions(studentName, professionName, topicIndex).then(testQuestion => {
    res.send(testQuestion);
  });
});

//NEED (studentName,professionName,topicIndexes)
//NEED THIS ROUTE => /calcFinalGrade?studentName=${studentName}&professionName=${professionName}&topicIndexes=${topicIndexes}&keyCollection=${keyCollection}
app.patch("/calcFinalGrade", (req, res) => {
  const { studentName, professionName, topicIndexes, keyCollection } = req.query;
  calcFinalStudyGrade(studentName, professionName, topicIndexes, keyCollection);
});


/////////////////////FEEDBACK
//NEED (studentName)
//NEED THIS ROUTE => /getStudentFeedback?studentName=${studentName}
app.get("/getStudentFeedback", (req, res) => {
  const { studentName } = req.query;
  getStudentDetails(studentName).then(feedbackDetails => {
    res.send(feedbackDetails);
  });
});


//NEED (studentName,professionName)
//NEED THIS ROUTE => /getStudentsGradeDiagram?studentsNames=${studentsNames}&professionName=${professionName}
app.get("/getStudentsGradeDiagram", (req, res) => {
  const { studentsNames, professionName } = req.query;
  getStudentsGradeDiagram(JSON.parse(studentsNames), professionName).then(studentsDiagram => {
    res.send(studentsDiagram);
  });
});


//NEED (studentName,professionName)
//NEED THIS ROUTE => /getStudentGradesDiagram?studentName=${studentName}&professionName=${professionName}
app.get("/getStudentGradesDiagram", (req, res) => {
  const { studentName, professionName } = req.query;
  getStudentGradesDiagram(studentName, professionName, true).then(studentDiagram => {
    res.send(studentDiagram);
  });
});


//////////////////////////////////////////////////////// FIRESTORE ////////////////////////////////////

//NEED {keyCollection,type}=> type is pages or questions
app.get("/getTopicMaterials", (req, res) => {
  const { keyCollection, type } = req.query;
  getArrayFromFirestore(keyCollection, type).then(materialArray => {
    res.send(materialArray);
  });
});

//NEED {keyCollection,newArr,type}=> type is pages or questions or testQuestions
app.post("/addTopicMaterials", (req, res) => {
  const { keyCollection, newArr, type } = req.body;
  addTopicMaterial(keyCollection, newArr, type);
  res.send(true);
});

//setFunction for passingGrade
//NEED (keyCollection,passingGrade)
//NEED THIS ROUTE => /setPassingGrade?keyCollection=${keyCollection}&passingGrade=${passingGrade}
app.patch("/setPassingGrade", (req, res) => {
  const { keyCollection, passingGrade } = req.query;
  setPassingGrade(keyCollection, passingGrade);
})

//getFunction for passingGrade 
//NEED (keyCollection)
//NEED THIS ROUTE => /getPassingGrade?keyCollection=${keyCollection}
app.get("/getPassingGrade", (req, res) => {
  const { keyCollection } = req.query;
  getPassingGrade(keyCollection).then(grade => {
    res.send(grade.toString());
  });
});





// inital the server in default PORT (3005)
app.listen(PORT, () =>
  console.log(`App listening on port ${PORT}!`)
);


//module.exports = app;
