const firebase = require("./firebaseDefinition");

//IMPORTANT !!!!!
/*
NEED TO CHECK!!!

1. IN ADDPAGES CHECK IF WE WANT TO DELETE THE LAST ONES AND ADD NEW ONE!!!
*/


/*
NEED TO ADD!!!!!
OPTION: 
1.ADD PAGES
2.ADD QUESTIONS
3.DELETE PAGES
4.DELETE QUESTIONS
*/


// enter to firestore 
const firestore = firebase.firestore();

//function to ADD Link for specific topic FOR USE TO DATABASE.JS
//NEED topicname
const addLinkToTopic = async (topicName) => {
    const key = await (firestore.collection("topics").add({ topicName: topicName, pages: [], questions: [], testQuestions: [] }));
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
                : details.data().testQuestions;
    });
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
        else {
            const existTestQuestions = details.data().testQuestions;
            firestore.collection("topics").doc(keyCollection).update({ testQuestions: existTestQuestions.concat(newArr) });
        }
    });
}

//inside method !! to get Questions for specific keyCollection
// RETURN obj : {keyCollection string,testQuestion array}
const getSpecificTestQuestion = async (keyCollection, index) => {
    return await firestore.collection("topics").doc(keyCollection).get().then(details => {
        const routeDict = { "index": index, "keyCollection": keyCollection, "testQuestions": details.data().testQuestions };
        return routeDict;
    })
}

//פונקציה בשביל החזרת מבחן 
//function to get all the question for specific topic !!
//NEED (keyCollection Array) !!
//RETURN an array like this : [{keyCollection,testQuestion},{keyCollection,testQuestion}]
const getTestQuestionsFromFirestore = async (keyCollectionArray) => {
    let testQuestions = [];
    keyCollectionArray.forEach((keyCollection, index) => {
        testQuestions.push(getSpecificTestQuestion(keyCollection, index));
    });
    testQuestions = await Promise.all(testQuestions);
    return testQuestions;
}




const deleteArrayFromFirestore = (keyCollection, type) => {

}




module.exports = { addLinkToTopic, getArrayFromFirestore, addTopicMaterial, getTestQuestionsFromFirestore };