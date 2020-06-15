import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getProfessions } from '../../../Redux/actions/index';
/**This component show all profession that the lecturer is teaching and the student is learn */
const Professions = ({ children, getProfessions, professions }) => {
    const { isLecturer, className } = JSON.parse(localStorage.getItem('userCredential'));
    const renderProfessions = () => {
        return professions.map((currProfession, idProfession) => {
            return (
                <div className="item" key={idProfession}>
                    <div className="content renderText" style={{ margin: '5px' }}>
                        {isLecturer
                            ? (<Link className="renderText"
                                to={`/LecturerView/Classrooms/${currProfession}`}>
                                {currProfession}
                            </Link>)
                            : (<Link className="renderText" to={`/MaterialView/${currProfession}/${className}`} >
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
                <h1 className="titleComp">Professions</h1><br />
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