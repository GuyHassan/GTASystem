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


const addLinkToTopic = async (topicName) => {
    const key = await (firestore.collection("topics").add({ topicName: topicName, pages: [], questions: [] }));
    return key.id;
}

const getArrayFromFirestore =async (string, type = null) => {
    return await firestore.collection("topics").doc(string).get().then(details => {
       return type === "pages"
            ? details.data().pages
            : details.data().questions;
    });
}


//getArrayFromFirestore("LsW9LCsDRrp4uKsHEOkn","pages")


const deleteArrayFromFirestore = (string, type) => {

}

//WORKED!!!!
const addTopicMaterial = (string, newArr, type) => {
    firestore.collection("topics").doc(string).get().then(details => {
        if (type == "pages") {
            const existPage = details.data().pages;
            firestore.collection("topics").doc(string).update({ pages: existPage.concat(newArr) });
        }
        else {
            const existQuestions = details.data().questions;
            firestore.collection("topics").doc(string).update({ questions: existQuestions.concat(newArr) });
        }
    });
}

//firestore.collection("topics").add({"s":"a"}).then(val=>{console.log(val.id)});
// let setAda = docRef.set({first: 'Ada',last: 'Lovelace',born: 1815});





// let setTopic = topics.set({TopicName:"shvarim", subTopics:[ { subTopicName: 'rational shvarim' },{ subTopicName: 'regular shvarim' } ]});


// firestore.collection('tamar').doc('english/cita b/topics').get()
//   .then((snapshot) => {
//       console.log(snapshot.data());
//   })
//   .catch((err) => {
//     console.log('Error getting documents', err);
//   });


// //add function is add a new hash string as a doc !!!
//   let addDoc = firestore.collection('cities').add({
//     name: 'Tokyo',
//     country: 'Japan'
//   }).then(ref => {
//     console.log('Added document with ID: ', ref.id);
//   });





module.exports = { addLinkToTopic, getArrayFromFirestore,addTopicMaterial };