
<<<<<<< HEAD
const { getClassRooms,checkUsernamePassword, addStudent, existInDB } = require("./firebaseDefinition");
=======
const { checkUsernamePassword, addUsers, existInDB } = require("./firebaseDefinition");
>>>>>>> 2dbb7b86d112233f36f2801e53038fea6fcd0bc9
const PORT = process.env.PORT || 3005;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// Website you wish to allow to connect need to add here the github root to the website !!!
app.use(function (req, res, next) {
  const allowedOrigins = [
    "http://localhost:3000"//,"github"
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// create a login request and check if the user exist
app.post('/loginRequest', (req, res) => {
  console.log(req.body)
  const userDetails = req.body;
  checkUsernamePassword(userDetails).then((response) => {
    if (response === null) {
      res.status("404").send("Login Error");
      return;
    }
    res.send(response);
  });
});

<<<<<<< HEAD
let user = { username: "yinon123", password: 12345, ID: 203409024, name: "yinon hirary", gender: "male" };
pathPermission = ["/LecturerView/StudentPermissions", '/AdminPermission'];
//new user to the DB 
app.post(pathPermission, (req, res) => {
=======
//new student to the DB 
app.post("/LecturerView/StudentPermissions", (req, res) => {
<<<<<<< HEAD
  const userDetails = req.body;
=======
>>>>>>> 40d8f417416f13be892a319a05ab36a92864a114
  //Added for test !!!
  // const userDetails = user;
  const userDetails = { ...req.body, path: req.url };
>>>>>>> 2dbb7b86d112233f36f2801e53038fea6fcd0bc9
  existInDB("users", userDetails.username).then((response) => {
    if (response === true) {
      res.status("404").send("The Username Is Used");
      return;
    }
<<<<<<< HEAD
    addUsers(userDetails);
    console.log("The User Is Added To The DB");
=======
    addStudent(userDetails);
    console.log("the user is added to the DB");
>>>>>>> 40d8f417416f13be892a319a05ab36a92864a114
    res.send(response);
  });


});


//choose another URL name !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get("LecturerView/Classes",(req,res)=>{
  console.log(getClassRooms("tamar123"));
  //res.send(getClassRooms(req.body.username));
});


// inital the server in default PORT (3005)
app.listen(PORT, () =>
  console.log(`App listening on port ${PORT}!`)
);