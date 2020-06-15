import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getClasses } from '../../../Redux/actions/index';
/**This component shows the classes the lecturer teaches.
 * it also presents buttons that allow him to say what he wants to do with the same class at that moment (see students, add students, see \ add study material) */
const Classrooms = ({ children, getClasses, classes, match: { params: { profession } } }) => {
    const [showButtonsID, setShowButtonsID] = useState('');
    const { isLecturer } = JSON.parse(localStorage.getItem('userCredential'));

    //rendering buttons when the user click on one of classroom name
    const Buttons = ({ idClass }) => {
        return showButtonsID === idClass
            && <div>
                {isLecturer && <Link to={`/LecturerView/ViewStudents/${profession}/${idClass}`} className="ui green basic button small" style={{ marginBottom: '5px' }}>View Students</Link>}
                <Link to={`/MaterialView/${profession}/${idClass}`} className="ui brown basic button small">View Materials</Link>
                {isLecturer && <Link to={`/LecturerView/AddingStudentToClass/${profession}/${idClass}`} className="ui blue basic button small">Add Student</Link>}
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
    // after the component rendering in the screen he call to redux to get the classes
    useEffect(() => {
        getClasses(profession)
    }, [getClasses, profession])
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
export default connect(mapStateToProps, { getClasses })(Classrooms);