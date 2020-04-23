// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
const firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
require('firebase/database');

//define our firebase
const firebaseConfig = {
    apiKey: "AIzaSyBF4C3_e9Z0Knmj2P_6BLu4qeczO0Lh6uA",
    authDomain: "gtasystem-3e9ee.firebaseapp.com",
    databaseURL: "https://gtasystem-3e9ee.firebaseio.com",
    projectId: "gtasystem-3e9ee",
    storageBucket: "gtasystem-3e9ee.appspot.com",
    messagingSenderId: "31370967459",
    appId: "1:31370967459:web:75495237af3ad131a90216",
    measurementId: "G-RMWLSFVZ9M"
};

//initial the database
firebase.initializeApp(firebaseConfig);

// enter to DB 
const database = firebase.database();

//function for check if username and password are exist
const checkUsernamePassword = async (details) => {
    try {
        const { isLecturer, password } = (await database.ref(`users/${details.Username}`).once("value")).val();
        if (details.Password == password) {
            const newDetails = { username: details.Username, isLecturer: isLecturer };
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

//******************************************** NEED TO ADD ***********************************************/




/// FIXED !!! inside method to get student tree FOR getStudentsAsObject getStudentClasses!!!
const getStudentsTree = async () => {
    const students = await (database.ref("students").once("value"));
    return students.val();
}


/// FIXED!!! 
/* 
manage by needForSpecificClass boolean option , have 2 option!!! : 
    1.false - get all the student that not exist in specific class!! FOR know which one to get .
    2.true -  get the students that inside the class we send FOR view the students we have inside this class.
*/
const getStudentsNamesAsObject = (professionName, className, isForSpecificClass) => {
    // [{id:'guy123',name:"guy hassan"},{id:'yinon123',name:"yinon hassan"}]
    return getStudentsTree().then(key => {
        const studentsNames = {};
        Object.values(key).forEach((value, index) => {
            if ((("materials" in value === false) || (professionName in value.materials === false)) && (isForSpecificClass === false)) {
                if (value.className === className)
                    studentsNames[Object.keys(key)[index]] = value.name;
            }
            else if ((isForSpecificClass === true) && (value.hasOwnProperty("materials"))) {
                if ((professionName in value.materials)) {
                    studentsNames[Object.keys(key)[index]] = value.name;
                }
            }
        });
        return studentsNames;
    });
}

/// WORKING!!!
const getSizeOfChilds = async (root) => {
    const sizeOfChilds = await (database.ref(`${root}`).once("value"));
    return sizeOfChilds.numChildren();
}

//################################################
/// FIXED!!!  NEED :: lecturerName,professionName,className,description
const addClassrooms = (classroomDetails) => {
    const classroomDetailsTree = { description: classroomDetails.description };
    getSizeOfChilds(`lecturers/${classroomDetails.lecturerName}/classes/${classroomDetails.professionName}`).then(response => {
        const newClassroom = {};
        newClassroom[response] = classroomDetails.className;
        database.ref(`classrooms/${classroomDetails.lecturerName}/${classroomDetails.professionName}/${classroomDetails.className}`).set(classroomDetailsTree);
        database.ref(`lecturers/${classroomDetails.lecturerName}/classes/${classroomDetails.professionName}`).update(newClassroom)
    });
}

//WORKING!!! inside method to get student list FOR addStudentToClassroom !!!
const getStudentFromSpecificClassroom = async (lecturerName, professionName, className) => {
    const students = await (database.ref(`classrooms/${lecturerName}/${professionName}/${className}/students`).once("value"));
    return students.val();
}

// inside method : add class root for specific username at first give child link as null for addStudentsToClassroom
const addClassForSpecificStudent = (username, professionName) => {
    database.ref(`students/${username}/materials/${professionName}`).set({ link: "null" });
    getSizeOfChilds(`students/${username}/professionList`).then((size) => {
        database.ref(`students/${username}/professionList`).update({ [size]: professionName });
    });
}

///FIXED!!!!     need to give {studentsNames},LecturerName,professionName,className
const addStudentToClassroom = (classroomDetails) => {
    getStudentFromSpecificClassroom(classroomDetails.lecturerName, classroomDetails.professionName, classroomDetails.className).then(response => {
        response
            ? database.ref(`classrooms/${classroomDetails.lecturerName}/${classroomDetails.professionName}/${classroomDetails.className}/students`).set(response.concat(classroomDetails.studentsNames))
            : database.ref(`classrooms/${classroomDetails.lecturerName}/${classroomDetails.professionName}/${classroomDetails.className}/students`).set(classroomDetails.studentsNames);
    });
    classroomDetails.studentsNames.forEach(student => {
        addClassForSpecificStudent(student, classroomDetails.professionName)
    });
}

/// FIXED!!! return all the classrooms for specific lecturer/students!!!
const getProfession = async (username, isLecturer) => {
    return isLecturer
        ? Object.keys(await (await (database.ref(`lecturers/${username}/classes`).once("value"))).exportVal())
        : await (await (database.ref(`students/${username}/professionList`).once("value"))).val()

}


const getClassrooms = async (username, professionName) => {
    return await (await (database.ref(`lecturers/${username}/classes/${professionName}`).once("value"))).val();
}

//******************************************** END NEED TO ADD ***********************************************/


const deleteTree = (root) => {
    database.ref(`${root}`).remove();
}

//delete student from class : NEED {studentName,LecturerNama,professionName,className}
const deleteStudentFromClass = (studentDetails) => {
    deleteTree(`classrooms/${studentDetails.lecturerName}/${studentDetials.professionName}/${studentDetails.className}/studnets/${studentDetails.studentName}`);
    deleteTree(`students/${studentDetails.studentName}/materials/${studentDetials.professionName}/`);
}

    /*
    control by getSizeChilds and build enter rootTree inside Method 
    topics
        -> 1:
            -> name:
            -> finishTopic(boolean):Backend initial FALSE
            -> subTopics:(if needed)
                ->subTopicName:
                ->finishTopic(boolean):Backend initial FALSE
        -> 2: 
    
    */


//function for initial materials NEED {lecturerName, professionName, className, materialsTree}
const addMaterials = (materialsDetails) => {
    
}

//function for students and lecturers!!!
//need to get username,isLecturer 
//also need a root to get to the inside DB
const getMaterials = async (username, professionName, className,isLecturer) => {
    const materialTree = await (database.ref(`classrooms/${username}/${professionName}/${className}/topics`).once("value"));
    return materialTree.val();
}

//lecturerPermission!!!  NEED TO SET ALL THE materials Tree!!!
const addTopics = (lecturerName, professionName, className, ) => {

}








/////Test!!!!!!!!!!!!!!
//let user = { username: "yinon123", password: 12345, ID: 203409024, name: "yinon hirary", gender: "male" };
//addStudent(user);
//deleteTree("users","yinon123");
//deleteTree("students","yinon123");
//getClassrooms("tamar123").then(val =>{console.log(val.includes("sdsako"));});
//getSizeOfChilds("lecturers/tamar123/classes").then(val =>{console.log(val);});
let addClass={lecturerName:"tamar123",professionName:"physics",className:"cita b",description:"special class for physics"};
//addClassrooms(addClass);
//let studentDetailsForClassroom={lecturerName:"tamar123",professionName:"physics",studentsNames:["guy123","yinon123"]};
//addStudentToClassroom(studentDetailsForClassroom);

//getMaterials("tamar123","english","cita b",true).then(val=>{console.log(val)})
//addClassrooms(addClass)
const check=[ { subTopic: { subTopicName: 'rational shvarim' },topicName: 'shvarim' },{ topicName: 'multiple' } ]
const addMaterialsTree=[{topicName:"kinematics",subTopic1:{subTopicName:"accelerate"},subTopic2:{subTopicName:"vectors"}},{topicName:"force",subTopic1:{subTopicName:"newton rule 1"},subTopic2:{subTopicName:"newton rule 2"}}]
getClassrooms("tamar123","english").then(val=>{console.log(val)});

module.exports = { getProfession, addStudentToClassroom, getStudentsNamesAsObject, getClassrooms, existInDB, checkUsernamePassword, addUsers, addClassrooms };

