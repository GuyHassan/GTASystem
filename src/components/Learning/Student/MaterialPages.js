import React from 'react';
import '../../Style/MaterialPages.css';
// : { title, freeText, file, streamLink }
const MaterialPages = ({ page: { title, freeText, streamLink, file }, numberPage }) => {
    return (
        <div style={{ textAlign: 'center' }}>
            <h1 className="titleComp" style={{ marginBottom: '20px' }}>{`Material Page  ${numberPage}`}</h1>
            <h3 style={{ textDecoration: 'underline' }}>{title}</h3>
            <p>{freeText}</p>
            {file ? <a style={{ marginBottom: '10px' }} className="ui basic green button small" target="_blank" rel="noopener noreferrer" href={file}>Open File</a> : null}
            <br />
            <iframe className="frameStream" title="youtube" width="400" height="250vh" src={streamLink} frameBorder="0" allowFullScreen></iframe>
        </div >
    )
}
export default MaterialPages;