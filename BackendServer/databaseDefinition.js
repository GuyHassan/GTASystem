const firebase = require("./firebaseDefinition");
const { addLinkToTopic, getArrayFromFirestore, getTestQuestionsFromFirestore } = require("./firestoreDefinition");
const database = firebase.database();
//{ profession: 'English', topic: [{ topicName: 'introduction', subTopics: [{ type: 'what is english', grade: 72 }, { type: 'intro', grade: 62 }] }] 

//function for check if username and password are exist NEED {USERNAME,PASSWORD}
const checkUsernamePassword = async (details) => {
    try {
        const { isLecturer, password } = (await database.ref(`users/${details.Username}`).once("value")).val();
        if (details.Password == password) {
            const newDetails = { username: details.Username, isLecturer };
            if (!isLecturer)
                newDetails['className'] = (await database.ref(`students/${details.Username}/className`).once("value")).val();
            return newDetails;
        }
        console.log("the password don't match");
        return null;
    }
    catch (e) {
        console.log("the username don't exist");
        return null;
    }
}

/* 
    root - the main node of tree
    child - branch of current root
    function - return promise if the child is exist in the root or not (true/false)!
*/
const existInDB = async (root, child) => {
    const ans = await (database.ref(`${root}/${child}`).once("value"));
    return ans.exists();
}


// function that add lecturers or students
const addUsers = (userDetails) => {
    const isLecturer = userDetails.path === '/AdminPermission' ? true : false;
    const userLoginTree = { password: userDetails.password, isLecturer: isLecturer };
    const userDetailsTree = { id: userDetails.ID, name: userDetails.name, gender: userDetails.gender, className: userDetails.className }
    isLecturer
        ? database.ref(`lecturers/${userDetails.username}`).set(userDetailsTree)
        : database.ref(`students/${userDetails.username}`).set(userDetailsTree);
    database.ref(`users/${userDetails.username}`).set(userLoginTree);
    return true;
}

//inside method to get student tree FOR getStudentsAsObject getStudentClasses!!!
const getStudentsTree = async () => {
    const students = await (database.ref("students").once("value"));
    return students.val();
}


/* s
manage by needForSpecificClass boolean option , have 2 option!!! : 
    1.false - get all the student that not exist in specific class!! FOR know which one to get .
    2.true -  get the students that inside the class we send FOR view the students we have inside this class.
*/
const getStudentsNamesAsObject = (professionName, className, isForSpecificClass) => {
    return getStudentsTree().then(key => {
        const studentsNames = [];
        Object.values(key).forEach((item, index) => {
            if ((!item.hasOwnProperty("materials") || (!(professionName in item.materials))) && (isForSpecificClass === false)) {
                if (item.className === className) {
                    studentsNames.push({ id: Object.keys(key)[index], name: item.name })
                }
            }
            else if ((isForSpecificClass === true) && (item.hasOwnProperty("materials") && (item.className === className))) {
                if ((professionName in item.materials)) {
                    studentsNames.push({ id: Object.keys(key)[index], name: item.name })
                }
            }
        });
        return studentsNames;
    });
}

const getSizeOfChilds = async (root) => {
    const sizeOfChilds = await (database.ref(`${root}`).once("value"));
    return sizeOfChilds.numChildren();
}

//function for adding classrooms !!  NEED :: lecturerName,professionName,className,description
const addClassrooms = (classroomDetails) => {
    const classroomDetailsTree = { description: classroomDetails.description };
    getSizeOfChilds(`lecturers/${classroomDetails.lecturerName}/classes/${classroomDetails.professionName}`).then(response => {
        const newClassroom = {};
        newClassroom[response] = classroomDetails.className;
        database.ref(`classrooms/${classroomDetails.lecturerName}/${classroomDetails.professionName}/${classroomDetails.className}`).set(classroomDetailsTree);
        database.ref(`lecturers/${classroomDetails.lecturerName}/classes/${classroomDetails.professionName}`).update(newClassroom)
    });
}

// inside method to get student list FOR addStudentToClassroom !!!
const getStudentsFromSpecificClassroom = async (lecturerName, professionName, className) => {
    const students = await (database.ref(`classrooms/${lecturerName}/${professionName}/${className}/students`).once("value"));
    return students.val();
}

// inside method : add class root for specific username at first give child link as null for addStudentsToClassroom
const addClassForSpecificStudent = (username, professionName, lecturerName) => {
    database.ref(`students/${username}/materials/${professionName}`).set({ link: "null", lecturerName: lecturerName });
    getSizeOfChilds(`students/${username}/professionList`).then((size) => {
        database.ref(`students/${username}/professionList`).update({ [size]: professionName });
    });
}

//inside method FOR buildGradeAndHelpTree  !!!
const initialArrayOfObj = (materialTree, type) => {
    let objArray = [];
    for (let i = 0; i < materialTree.length; i++) {
        if (type == "subTopicName" || (!(materialTree[i].hasOwnProperty("subTopics")))) {
            objArray.push({ [type]: materialTree[i][type], keyCollection: materialTree[i].keyCollection, details: { testGrades: -1, studyGrades: -1, finalStudyGrade: -1, finalTestGrade: -1, needHelp: -1, isFinishQuestions: -1 } });
        }
        else {
            objArray.push({ [type]: materialTree[i][type], details: { testGrades: -1, finalTestGrade: -1, subTopicCounter: 0 } });
        }
        if (materialTree[i].hasOwnProperty("subTopics")) {
            objArray[i]["subTopics"] = initialArrayOfObj(materialTree[i].subTopics, "subTopicName");
        }
    }
    return objArray;
}



//WORKING!!! 
//inside method, add keyCollection for the firestore
const addKeyCollection = async (materialTree, type) => {
    let keyCollection;
    for (let i = 0; i < materialTree.length; i++) {
        if (materialTree[i].hasOwnProperty("subTopics")) {
            await addKeyCollection(materialTree[i].subTopics, "subTopicName");
        }
        else {
            if (!(materialTree[i].hasOwnProperty("keyCollection"))) {
                keyCollection = (await addLinkToTopic(materialTree[i][type]));
                materialTree[i]['keyCollection'] = keyCollection;
            }
        }
    }
    return materialTree;
}


//inside method FOR addStudentToClassroom AND addMaterials
const buildGradeAndHelpTree = (student, professionName, materialTree) => {
    const gradeAndNeedHelpTree = initialArrayOfObj(materialTree, "topicName");
    database.ref(`students/${student}/materials/${professionName}/needHelpAndGrades`).set(gradeAndNeedHelpTree);
}

//function for adding students to classroom 
const addStudentToClassroom = async ({ lecturerName, professionName, className, students }) => {
    getStudentsFromSpecificClassroom(lecturerName, professionName, className).then(response => {
        response
            ? database.ref(`classrooms/${lecturerName}/${professionName}/${className}/students`).set(response.concat(students))
            : database.ref(`classrooms/${lecturerName}/${professionName}/${className}/students`).set(students);
    });
    const materialTree = await (getMaterials(lecturerName, professionName, className, true));
    students.forEach(student => {
        addClassForSpecificStudent(student, professionName, lecturerName);
        if (materialTree) {
            buildGradeAndHelpTree(student, professionName, materialTree);
        }
    });
}

//return all the classrooms for specific lecturer/students!!!
const getProfession = async (username, isLecturer) => {
    return isLecturer
        ? Object.keys(await (await (database.ref(`lecturers/${username}/classes`).once("value"))).exportVal())
        : await (await (database.ref(`students/${username}/professionList`).once("value"))).val()

}

//return all the classrooms for specific professionName and lecturerName
const getClassrooms = async (lecturerName, professionName) => {
    return await (await (database.ref(`lecturers/${lecturerName}/classes/${professionName}`).once("value"))).val();
}

//NOT BEEN USE !!!!
// DELETE tree with given root !!
const deleteTree = (root) => {
    database.ref(`${root}`).remove();
}


//function for initial materials NEED {lecturerName, professionName, className, materialTree}
const addMaterials = async ({ lecturerName, professionName, className, materialTree }) => {
    //send to addKeyColletion and add key val 
    addKeyCollection(materialTree, "topicName").then(materialTree => {
        database.ref(`classrooms/${lecturerName}/${professionName}/${className}/topics`).set(materialTree);
        getStudentsFromSpecificClassroom(lecturerName, professionName, className).then(students => {
            if (Array.isArray(students)) {
                students.forEach(student => {
                    buildGradeAndHelpTree(student, professionName, materialTree);
                });
            }

        });
    });
    return true;
}

//function for students and lecturers!!!
//need to get username, professionName, className,isLecturer
//also need a root to get to the inside DB

const getMaterials = async (username, professionName, className, isLecturer) => {
    if (isLecturer) {
        return (await (database.ref(`classrooms/${username}/${professionName}/${className}/topics`).once("value"))).val();
    }
    return (await (database.ref(`students/${username}/materials/${professionName}/needHelpAndGrades`).once("value"))).val();
}



///////////////////////////////////////////////////////////////////                  NEW               /////////////////////////////////////

const getArrayIndexes = (stringIndexes) => {
    return stringIndexes.split(',').map(x => parseInt(x));
}

//function that update if the student finish the questions
//NEED (studentName,professionName,topicIndexes)
//NO RETURN!! 
const setIsFinishQuestions = (studentName, professionName, topicIndexes) => {
    const topicIndexesArray = getArrayIndexes(topicIndexes);
    if (topicIndexes.length > 1) {
        database.ref(`students/${studentName}/materials/${professionName}/needHelpAndGrades/${topicIndexesArray[0]}/subTopics/${topicIndexesArray[1]}/details`).update({ isFinishQuestions: 1 });
    }
    else {
        database.ref(`students/${studentName}/materials/${professionName}/needHelpAndGrades/${topicIndexesArray[0]}/details`).update({ isFinishQuestions: 1 });
    }
}

//FUNCTION to get grades we have 2 types of grades : 1.testGrades , 2.studyGrades 
//WORKING FOR initialArrayToGrades AND for server to check the condition of the student in the front!!! 
//NEED (studentName,professionName,topicIndexes,gradeType)=> grade Type is string with two option : 1.'studyGrades' => FOR STUDY!! 2. 'testGrades' => FOR TEST!!
//RETURN TWO OPTION: 1. -1 VALUE NOT RECOMMEND , 2. Array type. 
const getTopicGrades = async (studentName, professionName, topicIndexes, gradeType) => {
    let gradeArr, topicIndexesArray = topicIndexes;
    if (!Array.isArray(topicIndexesArray))
        topicIndexesArray = getArrayIndexes(topicIndexes);
    if (topicIndexesArray.length > 1) {
        gradeArr = await (database.ref(`students/${studentName}/materials/${professionName}/needHelpAndGrades/${topicIndexesArray[0]}/subTopics/${topicIndexesArray[1]}/details/${gradeType}`)).once("value");
        return gradeArr.val();
    }
    gradeArr = await (database.ref(`students/${studentName}/materials/${professionName}/needHelpAndGrades/${topicIndexesArray[0]}/details/${gradeType}`)).once("value");
    return gradeArr.val();

}

//INSIDE METHOD to set grades we have 2 types of grades : 1.testGrades , 2.studyGrades 
//WORKING FOR initialArrayToGrades!!! 
//NEED (studentName,professionName,topicIndexes,gradeType)=> grade Type is string with two option : 1.'studyGrades' => FOR STUDY!! 2. 'testGrades' => FOR TEST!!
//NO RETURN!!!
const setTopicGrades = async (studentName, professionName, topicIndexes, gradeType, gradeArray) => {
    if (topicIndexes.length > 1) {
        database.ref(`students/${studentName}/materials/${professionName}/needHelpAndGrades/${topicIndexes[0]}/subTopics/${topicIndexes[1]}/details/${gradeType}`).set(gradeArray);
    }
    else {
        database.ref(`students/${studentName}/materials/${professionName}/needHelpAndGrades/${topicIndexes[0]}/details/${gradeType}`).set(gradeArray);
    }
}



//FUNCTION to set grades ,we have 2 types of grades : 1.testGrades , 2.studyGrades 
//NEED (studentName,professionName,topicIndexes,gradeType,grade)=> grade Type is string with two option : 1.'studyGrades' => FOR STUDY!! 2. 'testGrades' => FOR TEST!!
//NO RETURN !!!
const initialArrayToGrades = async (studentName, professionName, topicIndexes, gradeType, grade) => {
    const topicIndexesArray = getArrayIndexes(topicIndexes);
    return await getTopicGrades(studentName, professionName, topicIndexesArray, gradeType).then(gradeArray => {
        if (Array.isArray(gradeArray)) {
            gradeArray.push(grade);
            setTopicGrades(studentName, professionName, topicIndexesArray, gradeType, gradeArray);
        }
        else {
            setTopicGrades(studentName, professionName, topicIndexesArray, gradeType, [grade]);
        }
    });
}
//inside method that calculate average of array 
const arrAvg = async (arr) => {
    if (Array.isArray(arr)) {
        return arr.reduce((a, b) => parseInt(a) + parseInt(b), 0) / arr.length;
    }
}

//update the final test grade inside the subTopics and push the final grade inside the topic!
//ONLY FOR TOPICS WITH SUBTOPICS!! 
const updateFinalTestGrade = (studentName, professionName, topicIndex, subTopicsIndex) => {
    database.ref(`students/${studentName}/materials/${professionName}/needHelpAndGrades/${topicIndex}/subTopics/${subTopicsIndex}/details`).once("value").then(async subTopicDetails => {
        if (Array.isArray(subTopicDetails.val().testGrades)) {
            let avg = await arrAvg(subTopicDetails.val().testGrades);
            database.ref(`students/${studentName}/materials/${professionName}/needHelpAndGrades/${topicIndex}/subTopics/${subTopicsIndex}/details/finalTestGrade`).set(avg);
            let testGradeArray = await getTopicGrades(studentName, professionName, topicIndex, "testGrades");
            if (testGradeArray == -1) {
                testGradeArray = [];
            }
            testGradeArray.push(avg);
            setTopicGrades(studentName, professionName, [topicIndex], "testGrades", testGradeArray);
        }
    });
}


//FINAL METHOD TO SET FINAL TEST GRADE FOR TOPICS!!
const setFinalTestGrade = async (studentName, professionName, topicIndex, subTopicIndex = null) => {
    database.ref(`students/${studentName}/materials/${professionName}/needHelpAndGrades/${topicIndex}/details`).once("value").then(async topicDetails => {
        let avg = await arrAvg(topicDetails.val().testGrades);
        database.ref(`students/${studentName}/materials/${professionName}/needHelpAndGrades/${topicIndex}/details/finalTestGrade`).set(avg);
    });
}




//INSIDE METHOD FOR getTestQuestions AND for the refresh of the screen 
const updateCounter = async (studentName, professionName, topicIndex, counter) => {
    await (database.ref(`students/${studentName}/materials/${professionName}/needHelpAndGrades/${topicIndex}/details/subTopicCounter`)).set(counter);
}


///////NEW FUNCTION MANAGES THE QUESTIONS IN THE TEST !!!!
const getTestQuestions = async (studentName, professionName, topicIndex) => {
    return await database.ref(`students/${studentName}/materials/${professionName}/needHelpAndGrades/${topicIndex}`).once("value").then(async topicTree => {
        if (topicTree.val().hasOwnProperty("subTopics")) {
            let counter = topicTree.val().details.subTopicCounter;
            let testQuestionsArr = [];
            while (counter < topicTree.val().subTopics.length) {
                testQuestionsArr = await Promise.resolve(getArrayFromFirestore(topicTree.val().subTopics[counter].keyCollection, "testQuestions"));
                if (testQuestionsArr.length < 1) {
                    counter++;
                    await (updateCounter(studentName, professionName, topicIndex, counter));
                    continue;
                }
                else if (testQuestionsArr.length > topicTree.val().subTopics[counter].details.testGrades.length || topicTree.val().subTopics[counter].details.testGrades == -1) {
                    return { subTopicsIndex: counter, questions: testQuestionsArr };
                }
                else {
                    updateFinalTestGrade(studentName, professionName, topicIndex, counter);
                    counter++;
                    await updateCounter(studentName, professionName, topicIndex, counter);
                }
            }
            setFinalTestGrade(studentName, professionName, topicIndex);
            return ['Finish'];
        }
        else {
            let topicDetails = topicTree.val().details;
            let testQuestions = await getArrayFromFirestore(topicTree.val().keyCollection, "testQuestions");
            if (topicDetails.testGrades.length < testQuestions.length || topicDetails.testGrades == -1) {
                return { questions: testQuestions };
            }
            else {
                setFinalTestGrade(studentName, professionName, topicIndex);
                return ['Finish'];
            }
        }
    });
}

//function to update finalGrade of the studyGrade!!!
const calcFinalStudyGrade = (studentName, professionName, topicIndexes) => {
    getTopicGrades(studentName, professionName, topicIndexes, "studyGrades").then(async gradesArr => {
        console.log(gradesArr);
        const avg = await arrAvg(gradesArr);
        if (!Array.isArray(topicIndexes))
            topicIndexesArray = getArrayIndexes(topicIndexes);
        if (topicIndexesArray.length > 1) {
            database.ref(`students/${studentName}/materials/${professionName}/needHelpAndGrades/${topicIndexesArray[0]}/subTopics/${topicIndexesArray[1]}/details/finalStudyGrade`).set(avg);
        }
        else {
            database.ref(`students/${studentName}/materials/${professionName}/needHelpAndGrades/${topicIndexesArray[0]}/details/finalStudyGrade`).set(avg);
        }
    });
}

//////////////////////////////////////////////////////////////// THIS FUNCTIONS FOR THE DIAGRAMS!!!


//INSIDE METHOD FOR getStudentGrade !!
// the function build 2 things depend on the isForSpecificStudent
//? return objTopicGrades for specific student
//: return the avg of the student for this gradeTree
const buildGradesTree = (gradesTree, isForSpecificStudent) => {
    const objTopicGrades = [];
    let gradeSum = 0;
    let gradeCounter = 0;
    gradesTree.forEach(topic => {
        if (!isForSpecificStudent && topic.details.finalTestGrade != -1) {
            gradeSum += topic.details.finalTestGrade;
            gradeCounter++;
        }
        objTopicGrades.push({ label: topic.topicName, y: topic.details.finalTestGrade });
    });
    return isForSpecificStudent
        ? objTopicGrades
        : gradeSum / gradeCounter;
}

//function that getStudentGrade with 2 options with boolean isForSpecificStudent : 
/*
? we return array of topics and their finalGrade THIS IS FOR SERVER USE !!!!
: we return object of name and total final grade THIS IS FOR INSIDE USE => getStudentsGrades!!!!
*/
//NEED (studentName,professionName,isForSpecificStudent)=>isForSpecificStudent boolean!!
//RETURN 2 options see above!!
const getStudentGradesDiagram = async (studentName, professionName, isForSpecificStudent) => {
    const needHelpAndGradesTree = (await (database.ref(`students/${studentName}/materials/${professionName}/needHelpAndGrades`).once("value"))).val();
    const gradeTree = buildGradesTree(needHelpAndGradesTree, isForSpecificStudent);
    return isForSpecificStudent
        ? gradeTree
        : { label: studentName, y: gradeTree };
}

//function to return array of studentName and their totalGrade
//NEED (studentsNames,professionName)
//RETURN array of obj =>[{studentName,grade}]
const getStudentsGradeDiagram = async (studentsNames, professionName) => {
    let studentsGrades = [];
    studentsNames.forEach(student => {
        studentsGrades.push(getStudentGradesDiagram(student.id, professionName, false));
    });
    studentsGrades = await Promise.all(studentsGrades);
    return studentsGrades;
}



//////////////////////////////////////////////////////////////// END FUNCTIONS FOR THE DIAGRAMS!!!


/////////////////////////////////////////////////////////// THIS IS FOR STUDENT FEEDBACK

const getStudentTree = async (studentName) => {
    const studentTree = await database.ref(`students/${studentName}`).once("value");
    return studentTree.val();
}



const buildProfessionFeedbackTree = (professionTree, type) => {
    let objArray = [];
    for (let i = 0; i < professionTree.length; i++) {
        objArray.push({ [type]: professionTree[i][type], finalTestGrade: professionTree[i].details.finalTestGrade });
        if (professionTree[i].hasOwnProperty("subTopics")) {
            objArray[i]["subTopics"] = buildProfessionFeedbackTree(professionTree[i].subTopics, "subTopicName");
        }
    }
    return objArray;
}

//function  that give all the student profession and their grades
const getStudentDetails = async (studentName) => {
    const studentTree = await getStudentTree(studentName);
    const studentGradeTree = [];
    studentTree.professionList.forEach(professionName => {
        studentGradeTree.push({ professionName: professionName, topics: buildProfessionFeedbackTree(studentTree.materials[professionName].needHelpAndGrades, "topicName") })
    });
    return studentGradeTree;
}







/////////////////////////////////////////////////////////// END FOR STUDENT FEEDBACK





//DELETE TOPIC/SUBTOPIC
//NEED (lecturerName,professionName,className,topicDetails)
//topicDetails
// IMPORTENT!!! the topicDetails contain string as the topicName if we need to delete topic and NUMBER/topicName/NUMBER/subTopicName to delete subTopicName
const deleteMaterialTopic = (lecturerName, professionName, className, topicDetails) => {

}

//delete student from class : NEED {studentName,LecturerNama,professionName,className}
const deleteStudentFromClass = (studentDetails) => {
    deleteTree(`classrooms/${studentDetails.lecturerName}/${studentDetials.professionName}/${studentDetails.className}/studnets/${studentDetails.studentName}`);
    deleteTree(`students/${studentDetails.studentName}/materials/${studentDetials.professionName}/`);
}




module.exports = {
    addMaterials, getMaterials, getProfession, addStudentToClassroom, getClassrooms,
    getStudentsNamesAsObject, existInDB, checkUsernamePassword, addUsers, addClassrooms,
    initialArrayToGrades, setIsFinishQuestions, getTopicGrades, getTestQuestions, calcFinalStudyGrade,
    getStudentDetails, getStudentGradesDiagram, getStudentsGradeDiagram

};