
//firestoreDefinition functions
const { getArrayFromFirestore, addTopicMaterial } = require("../firestoreDefinition");


const app = require("../serverDefinition");


//NEED {keyCollection,type}=> type is pages or questions
app.get("/getTopicMaterials", (req, res) => {
    const { keyCollection, type } = req.query;
    getArrayFromFirestore(keyCollection, type).then(materialArray => {
        res.send(materialArray);
    });
});

//NEED {keyCollection,type}=> type is pages or questions
app.post("/addTopicMatrials", (req, res) => {
    const { keyCollection, newArr, type } = req.body;
    addTopicMaterial(keyCollection, newArr, type);
    res.send(true);
});


//////////////////////////////////////////////////////// FIRESTORE ////////////////////////////////////

app.post("/createMaterialPages", (req, res) => {

});
