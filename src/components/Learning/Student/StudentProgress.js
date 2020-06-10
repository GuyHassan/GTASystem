import React from 'react';

const StudentProgress = () => {
    const test = [{ profession: 'English', topic: [{ topicName: 'introduction', subTopics: [{ type: 'what is english', grade: 72 }, { type: 'intro', grade: 62 }] }] },
    { profession: 'Python', topic: [{ topicName: 'introduction', subTopics: [{ type: 'what is python', grade: 73 }, { type: 'what is programming', grade: 67 }] }, { topicName: 'Function', subTopics: [{ type: 'lambda', grade: 70 }, { type: 'Void Function', grade: 56 }, { type: 'High Order Function', grade: 40 }] }] }]
    const gradeMessage = (grade) => {
        return grade >= 70 && grade < 80
            ? 'You Good !!! But still need to get better !'
            : grade >= 60 && grade < 70
                ? 'Must More practice ! Have to get Better ...'
                : grade >= 56 && grade < 60
                    ? 'You Almost fails !! you have to learn better !'
                    : grade < 56 && grade >= 0
                    && 'You Fails !! Send Email To Your Teacher for more helper !'
    }
    const listItems = test.map(({ profession, topic }) =>
        <div>
            <h3 className="titleComp" style={{ color: '#A52A2A' }}>{profession}</h3>
            <ul>
                
                {topic.map(({ topicName, subTopics }) => {
                    return <li key={topicName}>
                        {topicName}
                        <ul>
                            {subTopics
                                && subTopics.map(({ type, grade }) => {
                                    return <li key={type}>
                                        {type} -  <span style={{ color: 'red' }}>{gradeMessage(grade)}</span>
                                    </li>
                                })
                            }
                        </ul>
                    </li>

                })}
            </ul>
        </div>
    );

    return (
        <div>
            <h1 className="titleComp">Student Feedback</h1>
            {listItems}

        </div>
    )
}
export default StudentProgress;