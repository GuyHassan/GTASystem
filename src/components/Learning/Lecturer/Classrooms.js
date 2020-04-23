import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getClasses } from '../../../Redux/actions/index';

const Professions = ({ children, getClasses, classes, match: { params } }) => {
    const [showButtonsID, setShowButtonsID] = useState('');
    const { isLecturer } = JSON.parse(localStorage.getItem('userCredential'));
    const typeUser = isLecturer ? '/LecturerView' : '/StudentView';
    // to={`/LecturerView/ViewStudents/${params.id}/${classroom}`}
    const Buttons = ({ idClass }) => {
        return showButtonsID === idClass ?
            (
                <div>
                    <Link to={`/LecturerView/ViewStudents/${params.id}/${idClass}`} className="ui red basic button small">View Students</Link>
                    <button className="ui red basic button small">View Materials</button>
                    <button className="ui violet basic button small">Add Student</button>
                    <button className="ui violet basic button small">Add Material</button>
                </div>
            ) : null;
    }
    const renderClasses = () => {
        return classes.map((classroom, idClassroom) => {
            return (
                <div className="item" key={idClassroom}>
                    <div className="content">
                        <h2>
                            <a onClick={() => setShowButtonsID(classroom)}> {classroom}</a>
                        </h2>
                        {<Buttons idClass={classroom} />}
                    </div>
                </div >
            )
        })
    }
    useEffect(() => { getClasses(params.id) }, [getClasses])
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
const mapStateToProps = (state) => {
    console.log(state)
    return { classes: state.learningProperties }
}
export default connect(mapStateToProps, { getClasses })(Professions);