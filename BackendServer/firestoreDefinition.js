const firebase = require("./firebaseDefinition");

// enter to firestore 
const firestore = firebase.firestore();

//function to ADD Link for specific topic FOR USE TO DATABASE.JS
//NEED topicname
const addLinkToTopic = async (topicName) => {
    const key = await (firestore.collection("topics").add({ topicName: topicName, pages: [], questions: [], testQuestions: [], passingGrade: -1,extraPages:[] }));
    return key.id;
}


//function for get array of pages or question depending on the type 
//NEED (keyCollection,type)
//RETURN Array of pages or questions depending on the inserted type
const getArrayFromFirestore = async (keyCollection, type = null) => {
    return await firestore.collection("topics").doc(keyCollection).get().then(details => {
        return type === "pages"
            ? details.data().pages
            : type === 'questions'
                ? details.data().questions
                :type=== 'testQuestions'
                    ? details.data().testQuestions
                    : details.data().extraPages;
    });
}

//function to set the passing grade for topic/subTopic
const setPassingGrade = (keyCollection, passingGrade) => {
    firestore.collection("topics").doc(keyCollection).update({ passingGrade: passingGrade });
}

//function to get the passing grade for topic/subTopic
const getPassingGrade = async (keyCollection) => {
    return (await (firestore.collection("topics").doc(keyCollection).get())).data().passingGrade;
}


//WORKED!!!!
//addTopicMaterial worked with the arrays : 1. questions    2. pages     3. testQuestion
//NEED (keyCollection , newArr , type) 
//NO RETURN!!!
const addTopicMaterial = (keyCollection, newArr, type) => {
    firestore.collection("topics").doc(keyCollection).get().then(details => {
        if (type === "pages") {
            const existPage = details.data().pages;
            firestore.collection("topics").doc(keyCollection).update({ pages: existPage.concat(newArr) });
        }
        else if (type === "questions") {
            const existQuestions = details.data().questions;
            firestore.collection("topics").doc(keyCollection).update({ questions: existQuestions.concat(newArr) });
        }
        else if(type==="testQuestions"){
            const existTestQuestions = details.data().testQuestions;
            firestore.collection("topics").doc(keyCollection).update({ testQuestions: existTestQuestions.concat(newArr) });
        }
        else{
            const existExtraPages = details.data().extraPages;
            firestore.collection("topics").doc(keyCollection).update({ extraPages: existExtraPages.concat(newArr) });
        }
    });
}



module.exports = { addLinkToTopic, getArrayFromFirestore, addTopicMaterial, 
                   setPassingGrade,getPassingGrade,
                 };
