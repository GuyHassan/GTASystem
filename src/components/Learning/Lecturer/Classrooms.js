import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getClasses } from '../../../Redux/actions/index';

const Professions = ({ children, getClasses, classes, match: { params } }) => {
    const [showButtonsID, setShowButtonsID] = useState('');
    const { isLecturer } = JSON.parse(localStorage.getItem('userCredential'));

    const Buttons = ({ idClass }) => {
        return showButtonsID === idClass
            && <div>
                {isLecturer && <Link to={`/LecturerView/ViewStudents/${params.profession}/${idClass}`} className="ui green basic button small">View Students</Link>}
                <Link to={`/MaterialView/${params.profession}/${idClass}`} className="ui brown basic button small">View Materials</Link>
                {isLecturer && <Link to={`/LecturerView/AddingStudentToClass/${params.profession}/${idClass}`} className="ui blue basic button small">Add Student</Link>}
            </div>
    }
    const renderClasses = () => {
        return classes.map((classroom, idClassroom) => {
            return (
                <div className="item" key={idClassroom}>
                    <div className="content" /* style={{ color: '#1a75ff' }} */>
                        <h2 className="renderText" onClick={() => setShowButtonsID(classroom)} >
                            {classroom}
                        </h2>
                        <Buttons idClass={classroom} />
                    </div>
                </div >
            )
        })
    }
    useEffect(() => { getClasses(params.profession) }, [getClasses, params])
    return (
        <div className="ui container" style={{ marginTop: '20px' }}>
            <div className="ui celled list">
                <h1 className="titleComp">Classrooms</h1><br />
                {renderClasses()}
                {children}
                <br /><br />
            </div>
        </div>
    )
}
const mapStateToProps = (state) => {
    return { classes: state.classes }
}
export default connect(mapStateToProps, { getClasses })(Professions);