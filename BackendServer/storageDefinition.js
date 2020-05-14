
const firebase=require("./firebaseDefinition");

// enter to storage 
const storage = firebase.storage();

const uploadFile= (file) =>{
    storage.ref(`userName/professionName/className/topics/subject 1`).put(file);
}


module.exports={uploadFile};