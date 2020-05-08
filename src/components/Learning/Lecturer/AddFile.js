import React from 'react';

const AddFile = () => {
    const fileUploadHandler = (event) => {
        console.log(event.target.files)
    }
    return (
        <div>
            <h1>Add File</h1>
            <input type="file" onChange={fileUploadHandler} />
        </div>
    )
}
export default AddFile;