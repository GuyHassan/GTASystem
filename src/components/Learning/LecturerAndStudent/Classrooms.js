import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Classrooms = ({ children }) => {
    const classroom = ['Yud - 1', 'Gimel - 2']
    const [id, setId] = useState('');
    const { isLecturer } = JSON.parse(localStorage.getItem('userCredential'));
    const typeUser = isLecturer ? '/LecturerView' : '/StudentView';
    const renderClasses = () => {
        return classroom.map((currentClass, idClass) => {
            return (
                <div className="item" key={currentClass}>
                    <div className="content">
                        <Link to={`${typeUser}/StudyMaterial`} >
                            <h3 value={idClass} style={{ color: 'blue' }}>
                                {currentClass}
                            </h3>
                        </Link >
                    </div>
                </div >
            )
        })
    }
    const onClickClassroom = () => {

    }
    return (
        <div className="ui container" style={{ marginTop: '20px' }}>
            <div className="ui celled list">
                <h1 style={{ textDecoration: 'underline' }}>Classrooms</h1><br />
                {renderClasses()}
                {children}
                <br /><br />
            </div>
        </div>
    )
}
export default Classrooms;