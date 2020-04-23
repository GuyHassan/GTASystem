import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getProfessions } from '../../../Redux/actions/index';

const Professions = ({ children, getProfessions, professions }) => {
    const [id, setId] = useState('');
    const { isLecturer } = JSON.parse(localStorage.getItem('userCredential'));
    const typeUser = isLecturer ? '/LecturerView' : '/StudentView';

    const renderProfessions = () => {
        return professions.map((currProfession, idProfession) => {
            return (
                <div className="item" key={idProfession}>
                    <div className="content">
                        {isLecturer ?
                            (<Link
                                to={ `/LecturerView/Classrooms/${currProfession}`} 
                                style={{ fontSize: '30px', fontWeight: '600' }} >
                                {currProfession}
                            </Link>)
                            : (<Link to='/StudentView/StudyMaterial'
                                style={{ fontSize: '30px', fontWeight: '600' }} >
                                {currProfession}
                            </Link>)}
                    </div>
                </div >
            )
        })
    }
    useEffect(() => { getProfessions() }, [getProfessions])
    return (
        <div className="ui container" style={{ marginTop: '20px' }}>
            <div className="ui celled list">
                <h1 style={{ textDecoration: 'underline' }}>Professions</h1><br />
                {renderProfessions()}
                {children}
                <br /><br />
            </div>
        </div>
    )
}
const mapStateToProps = (state) => {
    return { professions: state.learningProperties }
}
export default connect(mapStateToProps, { getProfessions })(Professions);