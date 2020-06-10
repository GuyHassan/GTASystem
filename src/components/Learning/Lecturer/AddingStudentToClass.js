import React, { useState, useEffect } from 'react';
import { server } from '../../../Apis/server';
import { useHistory } from 'react-router';
const AddingStudentToClass = ({ match: { params } }) => {
    const [studentExists, setStudentExists] = useState({})
    const [newStudent, setNewStudent] = useState([])
    const history = useHistory();
    const listNewStudent = (newS) => {
        newStudent.includes(newS)
            ? setNewStudent([...newStudent.filter((currStudent) => currStudent !== newS)])
            : setNewStudent([...newStudent, newS])
    }
    const renderStudents = () => {

        return Object.values(studentExists).map(student => {
            return (
                <div className="item" key={student.id}>
                    <ul>
                        <li className="renderText" onClick={() => listNewStudent(student.id)}
                            style={{ color: newStudent.includes(student.id) ? "red" : "green", fontSize: '20px' }}>
                            {student.name} - {student.id}
                        </li>
                    </ul>
                </div>
            )
        })
    }
    const addNewStudent = () => {
        const { user } = JSON.parse(localStorage.getItem("userCredential"));
        const details = {
            lecturerName: user, professionName: params.profession,
            className: params.className, students: newStudent
        }
        if (newStudent.length) {
            server.post("/LecturerView/addStudentsToClass", details);
            history.goBack();
        }
        else alert("Must Enter Some Student");
    }
    useEffect(() => {
        const getStudentCanAdded = () => {
            return server.get(`/getStudentsForAddToClass/${params.profession}/${params.className}`
            )
                .then(students => { setStudentExists(students.data) })
                .catch(err => { alert("No Student to add..") })
        }
        getStudentCanAdded();
    }, [params]);
    return (
        <div className="ui container" style={{ marginTop: '20px' }}>
            <h1 className="titleComp">Choose student to - {params.className}</h1><br />
            {renderStudents()}

            <button className="ui right floated black button" onClick={addNewStudent}>Add To Class</button>
            <br /><br />
        </div>
    )
}
export default AddingStudentToClass;