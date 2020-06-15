import React from 'react';
import Modal from '../../ReuseableComponents/Modal';
import { useHistory } from 'react-router';
/**This component is a popup with a hint if is exist in the specific question */
const DisplayHint = ({ location: { hint } }) => {
    const history = useHistory();
    return (
        < Modal
            show={true}
            title="Hint"
            className="ui container" >
            <p style={{ fontWeight: '600', fontSize: '15px' }}>{hint}</p>
            <div style={{ marginRight: '50px' }}>
                <button onClick={history.goBack} className="ui basic button red" style={{ position: 'absolute', bottom: '7%' }}>Back</button>
            </div>
        </Modal >
    )
}

export default DisplayHint;