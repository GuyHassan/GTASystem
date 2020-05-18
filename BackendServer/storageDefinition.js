
const firebase = require("./firebaseDefinition");

// enter to storage 
// const storage = firebase.storage();

const uploadFile = (keyCollection, pageNumber, file) => {
    const storageRef = firebase.storage().ref('upload/' + file.filename);
    const task = storageRef.put(file)
    
    // const task = storage.child("p.jpg").put(file);
    // task.then(snapshot => snapshot.ref.getDownloadURL()).
    //     then(url => {
    //         console.log(url);
    //     })
}





module.exports = { uploadFile };