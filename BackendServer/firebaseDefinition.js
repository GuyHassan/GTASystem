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


const addUsers = (userDetails) => {
    const isLecturer = userDetails.path === '/AdminPermission' ? true : false;
    const userLoginTree = { password: userDetails.password, isLecturer: isLecturer };
    const userDetailsTree = { id: userDetails.ID, name: userDetails.name, gender: userDetails.gender }
    isLecturer
        ? firebase.database().ref(`lecturers/${userDetails.username}`).set(userDetailsTree)
        : firebase.database().ref(`students/${userDetails.username}`).set(userDetailsTree);
    firebase.database().ref(`users/${userDetails.username}`).set(userLoginTree);
    console.log("check merge");
    return true;
}
const deleteTree = (root, username) => {
    database.ref(`${root}/${username}`).remove();
}

const getClassRooms = async (LectureName) => {
    return await (database.ref(`lecturers/${LectureName}`).once("value"));
}

const addClassRooms = (classRoomDetails) => {

}

const removeClassrooms = () => {

}

const addStudentToClassroom = () => {

}






/////Test!!!!!!!!!!!!!!
//let user = { username: "yinon123", password: 12345, ID: 203409024, name: "yinon hirary", gender: "male" };
//addStudent(user);
//deleteTree("users","yinon123");
//deleteTree("students","yinon123");


module.exports = { existInDB, checkUsernamePassword, addUsers };

