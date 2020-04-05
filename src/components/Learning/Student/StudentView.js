import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getMaterials } from '../../../Redux/actions';


const StudentView = ({ getMaterials, materials }) => {
    const [isClickButton, setIsClickButton] = useState({ id: '' });
    const onClickSubject = (id) => {
        setIsClickButton({ id: id });
    }
    const renderList = () => {
        return materials.map(material => {
            return (
                <div className="item content" key={material.id}>
                    <h3 onClick={() => onClickSubject(material.id)} style={{ color: 'red' }}>
                        {material.type}
                    </h3>
                    <h6>{material.description}</h6>
                    {isClickButton.id === material.id ?
                        (
                            <div>
                                <button className="ui button primary">View Subjects</button>
                                <button className="ui button green">View Class</button>
                            </div>)
                        : ''}
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
                <h1 style={{ fontWeight: '700' }}>Materials List - Student</h1><br />
                {renderList()}
            </div>
        </div>
    )
}
const mapStateToProps = (state) => {
    return { materials: Object.values(state.materials) }
}
export default connect(mapStateToProps, { getMaterials })(StudentView);