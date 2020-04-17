
const { checkUsernamePassword, addStudent,checkIfUsernameExist } = require("./firebaseDefinition");
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

let user = { username: "yinon123", password: 12345, studentID: 203409024, name: "yinon hirary", gender: "male" };

app.post("/LecturerView/StudentPermissions", (req, res) => {
  const userDetails = req.body;
  console.log(req.body);
  checkIfUsernameExist(userDetails.username).then((response) => {
    if (response === true) {
      res.status("404").send("the username is used");
      return;
    }
    addStudent(user);
    console.log("the user is added to the DB");
    res.send(response);
  });


});




app.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`)
);