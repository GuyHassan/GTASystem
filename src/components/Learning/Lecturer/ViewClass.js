import React, { useState } from 'react';

const ViewClass = () => {
    const students = ["YinonHirary", 'GuyHassan', 'Yahav231', 'Shmual784']
    const [newStudent, setNewStudent] = useState([])
    const listNewStudent = (newS) => {
        newStudent.includes(newS)
            ? setNewStudent([...newStudent.filter((currStudent) => currStudent !== newS)])
            : setNewStudent([...newStudent, newS])
    }
    const renderStudents = () => {
        return students.map((student, index) => {
            return (
                <div className="item" key={index}>
                    <ul>
                        <li onClick={() => listNewStudent(student)}
                            style={{ color: newStudent.includes(student) ? "blue" : "red", fontSize: '20px', textDecoration: 'underline' }}>
                            {student}
                        </li>
                    </ul >

                </div >
            )
        })
    }
    const addNewStudent = () => {
        // implement here to DB
        if (newStudent.length) {
            console.log('here need to send the new chosen student array to DB')
        }
        else alert("Must Enter Some Student");
    }
    return (

        <div className="ui container" style={{ marginTop: '20px' }}>
            <h1 style={{ textDecoration: 'underline' }}>Choose Student To Class</h1><br/>
                {renderStudents()}
                <button className="ui right floated black button" onClick={addNewStudent}>Add To Class</button>
        </div>
    )
}
export default ViewClass;