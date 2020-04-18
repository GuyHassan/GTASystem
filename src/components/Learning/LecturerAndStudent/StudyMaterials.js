import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getMaterials } from '../../../Redux/actions';
import { Link } from 'react-router-dom';
const StudyMaterials = ({ getMaterials, materials, children, userMessage }) => {
    const [idChanged, setIdChanged] = useState('');
    const { isLecturer } = JSON.parse(localStorage.getItem("userCredential"));

    const lecturerButtons = () => {
        return isLecturer ?
            <React.Fragment>
                <button className="ui button red">Edit</button>
                <Link to={`/LecturerView/DeleteMaterial/${idChanged}`} className="ui button red">Delete</Link>
            </React.Fragment> : null;
    }
    //return buttons by the specific id clicked
    const buttonsCreate = ({ id }) => {
        const userType = isLecturer ? 'LecturerView' : 'StudentView';
        return idChanged === id ? (
            (
                <React.Fragment>
                    <Link to={`/${userType}/ViewClass`} className="ui button green">View Class</Link>
                    <button className="ui button primary">View Subjects</button>
                    {lecturerButtons()}
                </React.Fragment>
            )
        ) : null;
    }

    const renderList = () => {
        return materials.map(material => {
            return (
                <div className="item" key={material.id}>
                    <div className="content">
                        <h3 onClick={() => setIdChanged(material.id)} style={{ color: 'green' }}>
                            {material.type}
                        </h3>
                        <h6>{material.description}</h6>
                    </div>
                    {buttonsCreate(material)}
                </div >
            )
        })
    }

    /* when the value in getMaterials is changed useEffect call again to this function,
         but the value never change that way is call only 1 time, (like componentDidMount) */
    useEffect(() => { getMaterials(); }, [getMaterials])

    return (
        <div className="ui container" style={{ marginTop: '20px' }}>
            <div className="ui celled list">
                <h1 style={{ fontWeight: '700' }}>Materials List - {userMessage}</h1><br />
                {renderList()}
                {children}
                <br /><br />
            </div>
        </div>
    )
}
const mapStateToProps = (state) => {
    return {
        materials: Object.values(state.materials)
    }
}
export default connect(mapStateToProps, { getMaterials })(StudyMaterials);