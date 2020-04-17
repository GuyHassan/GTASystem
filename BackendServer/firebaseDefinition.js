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

//make const to enter the DB 
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

//function that get the 
const checkIfObjExist = async (root,obj) => {
    const ans = await (database.ref(`${root}/${obj}`).once("value"));
    return ans.exists();
}


const addStudent = (studentDetails) => {
    const studentLoginTree = { password: studentDetails.password, isLecturer: false };
    const studentDetailsTree = { id: studentDetails.studentID, name: studentDetails.name, gender: studentDetails.gender }
    firebase.database().ref(`users/${studentDetails.username}`).set(studentLoginTree);
    firebase.database().ref(`students/${studentDetails.username}`).set(studentDetailsTree);
    return true;
}
const deleteTree = (root, username) => {
    database.ref(`${root}/${username}`).remove();
}

const getClassRooms =async (LectureName)=>{
    return  await (database.ref(`lecturers/${LectureName}`).once("value"));
}

const addClassRooms = (classRoomDetails)=>{

}

const removeClassrooms = ()=>{

}

const addStudentToClassroom = ()=>{

}






/////Test!!!!!!!!!!!!!!
//let user = { username: "yinon123", password: 12345, studentID: 203409024, name: "yinon hirary", gender: "male" };
//addStudent(user);
 //deleteTree("users","yinon123");
 //deleteTree("students","yinon123");


module.exports = { checkIfObjExist,checkUsernamePassword, addStudent };

