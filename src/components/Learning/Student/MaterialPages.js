import React from 'react';

const MaterialPages = ({ page: { title, freeText, file, streamLink }, numberPage }) => {
    return (
        <div style={{ textAlign: 'center' }}>
            <h1 style={{ textDecoration: 'underline', marginBottom: '20px' }}>{`Material Page  ${numberPage}`}</h1>
            <h3 style={{ textDecoration: 'underline' }}>{title}</h3>
            <p>{freeText}</p>
            {file ? <a style={{ marginBottom: '10px' }} className="ui basic green button small" target="_blank" rel="noopener noreferrer" href={file}>Open File</a> : null}
            <br />

            <iframe title="youtube" width="400" height="250vh" src={streamLink} frameBorder="0" allowFullScreen></iframe>

        </div >
    )
}
export default MaterialPages;