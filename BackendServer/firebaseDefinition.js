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

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

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
module.exports = { checkUsernamePassword };

