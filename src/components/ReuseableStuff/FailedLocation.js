import React from 'react';

const FailedLocation = ({ message }) => {
    const styleCompon = { color: '#8B0000', width: '700', textAlign: 'center' }
    return (
        <div>
            <h1 style={styleCompon}>
                {message}
            </h1>
        </div>
    )
}

export default FailedLocation;