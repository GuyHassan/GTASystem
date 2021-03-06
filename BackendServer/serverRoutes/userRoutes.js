const app = require("../serverDefinition");


//dataabaseDefinition functions 
const { addMaterials, getMaterials, getProfession,
    addStudentToClassroom, getStudentsNamesAsObject, checkUsernamePassword,
    addUsers, existInDB, getClassrooms, addClassrooms } = require("../databaseDefinition");

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
        if (professionList.length === 0) {
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
//choose another URL name !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
    getMaterials(username, professionName, className, isLecturer).then(materialTree => {
        console.log('asdasd', materialTree);
        if (materialTree === null) {
            // res.status("404").send("you don't have materials for this class");
            res.send([])
            return;
        }
        console.log('asdadasd')
        res.send(materialTree);
    });
});


//function for add materials NEED : {lecturerName, professionName, className, materialsTree}
app.post("/addMaterials", (req, res) => {
    addMaterials(req.body).then(response => {
        res.send(response);
    });
});