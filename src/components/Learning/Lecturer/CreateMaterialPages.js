import React, { useState } from 'react';
import { server } from '../../../Apis/server';
const details = { title: '', freeText: '', file: '', streamLink: '' }
// i need get from the backend the amount of pages that have in this material !! (length of  array) for updates
const CreateMaterialPages = ({ currentPage }) => {
    const [detailsPage, setDetailsPage] = useState(details);
    const [listPages, setListPages] = useState([])
    const [counterPages, setCounterPages] = useState(0);
    const onChange = ({ target: { value, name, files } }) => {
        let changer = name === 'file' ? new FormData() : '';
        if (name === 'file') changer.append(files[0].type, files[0], files[0].name);
        else if (name === 'streamLink') changer = value.replace('watch?v=', 'embed/');
        else changer = value
        setDetailsPage({ ...detailsPage, [name]: changer });
    }
    const onNextPage = () => {
        setCounterPages(counterPages + 1)
        setListPages([...listPages, detailsPage])
        setDetailsPage(details)
        // const fd = new FormData();
        // fd.append("pdf", detailsPage.file, detailsPage.file.name);
        // server.post('/uploadFile', fd).then((res) => {
        //     console.log(res);
        // })
    }
    const onFinish = () => {
        //need check if the userClick on finish beforoe next page and check the object if is include some properties
        console.log(detailsPage)
        console.log(listPages)
        //implement method from backend !!
    }
    return (
        <div >
            <h1 style={{ textAlign: 'center', textDecoration: 'underline' }}>{`Page ${counterPages}`}</h1>
            <form className="ui error form">
                <label >Title Page (optional)</label>
                <input name="title" type="text" onChange={onChange} value={detailsPage.title} />
                <br /><br />
                <textarea name="freeText" onChange={onChange} value={detailsPage.freeText} placeholder="Write free text (optional)" cols="100" rows="3" />
                <label >Choose a file instead of free text </label>
                <input name="file" type="file" value={detailsPage.file} onChange={onChange} />
                <label >Streaming link:</label>
                <input name="streamLink" type="text" placeholder="youtube.com" onChange={onChange} value={detailsPage.streamLink} /><br /><br />
            </form>
            <button onClick={onNextPage} className="ui button primary"> Next Page </button>
            <button onClick={onFinish} className="ui button black"> Finish </button>
            <br /><br />
        </div>
    )
}
export default CreateMaterialPages;