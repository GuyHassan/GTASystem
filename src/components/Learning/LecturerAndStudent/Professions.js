import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getProfessions } from '../../../Redux/actions/index';

const Professions = ({ children, getProfessions, professions }) => {
    const { isLecturer, className } = JSON.parse(localStorage.getItem('userCredential'));

    const renderProfessions = () => {
        return professions.map((currProfession, idProfession) => {
            return (
                <div className="item" key={idProfession}>
                    <div className="content" style={{ margin: '5px' }}>
                        {isLecturer
                            ? (<Link
                                to={`/LecturerView/Classrooms/${currProfession}`}
                                style={{ fontSize: '30px', fontWeight: '600' }} >
                                {currProfession}
                            </Link>)
                            : (<Link to={`/MaterialView/${currProfession}/${className}`}
                                style={{ fontSize: '30px', fontWeight: '600' }} >
                                {currProfession}
                            </Link>)}
                    </div>
                </div >
            )
        })
    }
    useEffect(() => {
        getProfessions()
        return () => getProfessions()
    }, [getProfessions])
    return (
        <div className="ui container" style={{ marginTop: '20px' }}>
            <div className="ui celled list">
                <h1 style={{ textDecoration: 'underline' }}>Professions</h1><br />
                {renderProfessions()}
                <br />
                {children}
                <br /><br />
            </div>
        </div>
    )
}
const mapStateToProps = (state) => {
    return { professions: state.profession }
}
export default connect(mapStateToProps, { getProfessions })(Professions);