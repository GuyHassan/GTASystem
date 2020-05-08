import React, { useState } from 'react';
import { server } from '../../../Apis/server';
const AddFile = () => {
    const [fileUp, setFileUp] = useState();
    const fileUploadHandler = (event) => {
        setFileUp(event.target.files[0]);
    }
    const onSubmitFile = () => {
        const fd = new FormData();
        
        fd.append("pdf", fileUp, fileUp.name);
        console.log(fd)
        server.post('/uploadFile', fd).then((res) => {
            console.log(res);
        })
    }
    return (
        <div>
            <h1>Add File</h1>
            <input type="file" onChange={fileUploadHandler} />
            <button onClick={onSubmitFile}>Submit file</button>
        </div>
    )
}
export default AddFile;