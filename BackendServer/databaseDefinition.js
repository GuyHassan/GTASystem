const firebase = require("./firebaseDefinition");
const {addLinkToTopic} = require("./firestoreDefinition");
const database = firebase.database();


//function for check if username and password are exist NEED {USERNAME,PASSWORD}
const checkUsernamePassword = async (details) => {
    try {
        const { isLecturer, password } = (await database.ref(`users/${details.Username}`).once("value")).val();
        if (details.Password == password) {
            const newDetails = { username: details.Username, isLecturer};
            if(!isLecturer)
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
    const userDetailsTree = { id: userDetails.ID, name: userDetails.name, gender: userDetails.gender }
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


/* 
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
const getStudentFromSpecificClassroom = async (lecturerName, professionName, className) => {
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
        objArray.push({ [type]: materialTree[i][type], details: { grade: -1, needHelp: -1 } });
        if (materialTree[i].hasOwnProperty("subTopics")) {
            objArray[i]["subTopics"] = initialArrayOfObj(materialTree[i].subTopics, "subTopicName");
        }
    }
    return objArray;
}



//WORKING!!! 
//inside method, add keyCollection for the firestore
const addKeyCollection =async (materialTree,type) =>{
    let keyCollection ;
    for (let i = 0; i < materialTree.length; i++) {
        if (materialTree[i].hasOwnProperty("subTopics")) {
            await addKeyCollection(materialTree[i].subTopics, "subTopicName");
        }
        else{
            if(!(materialTree[i].hasOwnProperty("keyCollection"))){
                keyCollection = (await addLinkToTopic(materialTree[i][type]));
                materialTree[i]['keyCollection']=keyCollection;
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


const addStudentToClassroom = async ({ lecturerName, professionName, className, students }) => {
    getStudentFromSpecificClassroom(lecturerName, professionName, className).then(response => {
        response
            ? database.ref(`classrooms/${lecturerName}/${professionName}/${className}/students`).set(response.concat(students))
            : database.ref(`classrooms/${lecturerName}/${professionName}/${className}/students`).set(students);
    });
    const materialTree = await getMaterials(lecturerName, professionName, className);
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
    getStudentsNamesAsObject(professionName, className, true).then(students => {
        students.forEach(student => {buildGradeAndHelpTree(student.id, professionName, materialTree)
        });
    });
    //send to addKeyColletion and add key val 
    addKeyCollection(materialTree,"topicName").then(materialTree =>{
        database.ref(`classrooms/${lecturerName}/${professionName}/${className}/topics`).set(materialTree);
    });
    return true;
}


//function for students and lecturers!!!
//need to get username, professionName, className,isLecturer
//also need a root to get to the inside DB

const getMaterials = async (username, professionName, className,isLecturer) => {
    if(isLecturer){
        return (await (database.ref(`classrooms/${username}/${professionName}/${className}/topics`).once("value"))).val();
    }
    return (await (database.ref(`students/${username}/materials/${professionName}/needHelpAndGrades`).once("value"))).val();

}


//delete student from class : NEED {studentName,LecturerNama,professionName,className}
const deleteStudentFromClass = (studentDetails) => {
    deleteTree(`classrooms/${studentDetails.lecturerName}/${studentDetials.professionName}/${studentDetails.className}/studnets/${studentDetails.studentName}`);
    deleteTree(`students/${studentDetails.studentName}/materials/${studentDetials.professionName}/`);
}




//DELETE TOPIC/SUBTOPIC
const deleteMaterialTopic =(lecturerName,professionName,className,topicDetails)=>{

}


/////Test!!!!!!!!!!!!!!
//let user = { username: "yinon123", password: 12345, ID: 203409024, name: "yinon hirary", gender: "male" };
//addStudent(user);
//deleteTree("users","yinon123");
//deleteTree("students","yinon123");
//getClassrooms("tamar123").then(val =>{console.log(val.includes("sdsako"));});
//getSizeOfChilds("lecturers/tamar123/classes").then(val =>{console.log(val);});
//let addClass = { lecturerName: "tamar123", professionName: "physics", className: "cita b", description: "special class for physics" };
//addClassrooms(addClass);
//let studentDetailsForClassroom={lecturerName:"tamar123",professionName:"physics",studentsNames:["guy123","yinon123"]};
//addStudentToClassroom(studentDetailsForClassroom);

//addClassrooms(addClass)

////example for addMaterials


/*
{ subTopics:
   [ { subTopicName: 'rational shvarim' },
     { subTopicName: 'regular shvarim' } ],
  topicName: 'shvarim' } [ { topicName: 'multiple' } ]
*/



// database.ref(`students/guy123/materials/english/needHelpAndGrades`).once("value").then(val => {
//     console.log(val.val());
// });







module.exports = { addMaterials, getMaterials, getProfession, addStudentToClassroom, getStudentsNamesAsObject, getClassrooms, existInDB, checkUsernamePassword, addUsers, addClassrooms };
