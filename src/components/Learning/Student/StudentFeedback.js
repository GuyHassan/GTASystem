import React, { useEffect, useState } from 'react';
import { server } from '../../../Apis/server';
/**This component shows the student feedback.
 * which subjects are weak and which subjects are strong where they need to improve.
 * in addition show what their grade is in each part. */
const StudentFeedback = () => {
    const [studentFeedback, setStudentFeedback] = useState([])
    const { user } = JSON.parse(localStorage.getItem("userCredential"))
    // this function check each  grade and return a message Depending on the grade
    const gradeMessage = (grade) => {
        const color = grade === -1 ? 'blue' : grade <= 80 ? 'red' : 'green';
        const feedBackMessage = grade === -1
            ? "You Haven't Tested On That Part Yet :)"
            : grade >= 80
                ? `${grade} - Excellent !!`
                : grade >= 70 && grade < 80
                    ? `${grade} - You Good !!! But still need to get better !`
                    : grade >= 60 && grade < 70
                        ? `${grade} - Must More practice ! Have to get Better ...`
                        : grade >= 56 && grade < 60
                            ? `${grade} - You Almost fails !! you have to learn better !`
                            : grade < 56 && grade >= 0
                            && `${grade} - You Fails !! Send Email To Your Teacher for more helper !`
        return <span style={{ color }}>{feedBackMessage}</span>
    }
    const listFeedbacks = studentFeedback.map(({ professionName, topics }) =>
        <div key={professionName}>
            <h3 className="titleComp" style={{ color: '#A52A2A', textTransform: 'capitalize' }}>{professionName}</h3>
            <ul >
                {topics.map(({ topicName, subTopics, finalTestGrade }) => {
                    return <li key={topicName}>
                        <h3 style={{ textTransform: 'capitalize', margin: '15px' }}>{topicName}<br />  <span style={{ fontSize: "15px" }}>{subTopics === undefined && gradeMessage(finalTestGrade)}</span></h3>
                        <ul>
                            {subTopics
                                && subTopics.map(({ subTopicName, finalTestGrade }) => {
                                    return <li key={subTopicName} style={{ textTransform: 'capitalize' }}>
                                        {subTopicName} -  {gradeMessage(finalTestGrade)}
                                    </li>
                                })
                            }
                        </ul>
                    </li>
                })}
            </ul>
        </div>
    );
    useEffect(() => {
        server.get(`/getStudentFeedback?studentName=${user}`).then(feedback => {
            setStudentFeedback(feedback.data)
        })
    }, [user])
    return (
        <div>
            <h1 className="titleComp">Student Feedback</h1>
            {listFeedbacks}

        </div>
    )
}
export default StudentFeedback;