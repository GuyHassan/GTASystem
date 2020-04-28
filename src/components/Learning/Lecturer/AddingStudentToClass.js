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
                        <li onClick={() => listNewStudent(student.id)}
                            style={{ color: newStudent.includes(student.id) ? "red" : "blue", fontSize: '20px' }}>
                            {student.name} - {student.id}
                        </li>
                    </ul >

                </div >
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
    const getStudentCanAdded = async () => {
        return await server.get(`/getStudentsForAddToClass/${params.profession}/${params.className}`);
    }
    useEffect(() => {
        getStudentCanAdded().then(students => { setStudentExists(students.data) })
    }, [])
    return (

        <div className="ui container" style={{ marginTop: '20px' }}>
            <h1 style={{ textDecoration: 'underline' }}>Choose student to - {params.className}</h1><br />
            {renderStudents()}

            <button className="ui right floated black button" onClick={addNewStudent}>Add To Class</button>
        </div>
    )
}
export default AddingStudentToClass;