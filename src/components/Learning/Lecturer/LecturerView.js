import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getMaterials } from '../../../Redux/actions';
import { Link } from 'react-router-dom';
const LecturerView = ({ getMaterials, materials }) => {

    const [idChanged, setIdChanged] = useState('');
    //when we click on title material he change the id of click
    const onClickSubject = ({ id }) => {
        setIdChanged(id);
    }
    //return buttons by the specific id clicked
    const buttonsCreate = ({ id }) => {
        if (idChanged === id) {
            return (
                <div>
                    <button className="ui button primary">View Class</button>
                    <button className="ui button primary">View Subjects</button>
                    <button className="ui button green">Edit</button>
                    <Link to={`LecturerView/deleteMaterial/${id}`} className="ui button red">Delete</Link>
                </div>
            )
        }
        else return null;
    }

    const renderList = () => {
        return materials.map(material => {
            return (
                <div className="item" key={material.id}>
                    <div className="content">
                        <h3 onClick={() => onClickSubject(material)} style={{ color: 'blue' }}>
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
                <h1 style={{ fontWeight: '700' }}>Materials List - Lecturer</h1><br />
                {renderList()}
                <Link to='/newMaterial' className="ui right floated primary button">Add Metarial</Link>
            </div>
        </div>
    )
}
const mapStateToProps = (state) => {
    return {
        materials: Object.values(state.materials)
    }
}
export default connect(mapStateToProps, { getMaterials })(LecturerView);