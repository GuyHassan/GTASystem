import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getClasses } from '../../../Redux/actions/index';

const Professions = ({ children, getClasses, classes, match: { params } }) => {
    const [id, setId] = useState('');
    const { isLecturer } = JSON.parse(localStorage.getItem('userCredential'));
    const typeUser = isLecturer ? '/LecturerView' : '/StudentView';

    const renderClasses = () => {
        return classes.map((classroom, idClassroom) => {
            return (
                <div className="item" key={idClassroom}>
                    <div className="content">
                        <h2>
                            <Link to={`/LecturerView/ViewStudents/${params.id}/${classroom}`} > {classroom}</Link>
                        </h2>
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