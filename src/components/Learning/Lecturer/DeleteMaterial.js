import React, { useEffect } from 'react';
import Modal from '../../ReuseableStuff/Modal';
import { Link } from 'react-router-dom';
import history from '../../../history';
import { connect } from 'react-redux';
import { getMaterials, deleteMaterial } from '../../../Redux/actions';

const DeleteMaterial = ({ material, match, getMaterials, deleteMaterial }) => {
    useEffect(() => { getMaterials(match.params.id) }, [getMaterials, match.params.id]);
    const renderAction = () => {
        const { id } = match.params;
        return (
            //React.Fragment - when we want to return a multiple elements to another component without create a new node
            <React.Fragment>
                <button onClick={() => deleteMaterial(id)} className="ui button negative">Delete</button>
                <Link to='/LecturerView' className="ui button">Cancel</Link>
            </React.Fragment>
        )
    }

    const renderContent = () => {
        if (!material) {
            return <p>Are you sure you want to delete this Material ?</p>
        }
        return <p style={{ paddingTop: '15px' }}>
            Are you sure you want to delete this stream:
                <span style={{ padding: '5px', color: 'blue', fontWeight: '700' }}>
                {material.type}
            </span> ?
        </p>
    }
    return (
        // Model is "popup" option on the screen, and we pass props to do Modal a reusable component
        <Modal
            show={true}
            title="Delete Material"
            actions={renderAction()}
            onDismiss={() => history.push("/LecturerView")}
            className="ui container">
            {renderContent()}
        </Modal>
    )
}
/* after the ComponentDidMount done.
 this function(mapStateToProps) call again and give us the current stream that we called (with the specific id) */
const mapStateToPorps = (state, ownProps) => {
    return { material: state.materials[ownProps.match.params.id] }
}
export default connect(mapStateToPorps, { getMaterials, deleteMaterial })(DeleteMaterial);