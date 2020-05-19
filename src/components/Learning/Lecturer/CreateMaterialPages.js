import React, { useState, useEffect } from 'react';
import { server } from '../../../Apis/server';
import ReactFilestack from 'filestack-react';

const details = { title: '', freeText: '', file: '', streamLink: '' }
// i need get from the backend the amount of pages that have in this material !! (length of  array) for updates
const CreateMaterialPages = ({ match: { params: { keyCollection } } }) => {
    const [detailsPage, setDetailsPage] = useState(details);
    const [listPages, setListPages] = useState([])
    const [counterPages, setCounterPages] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [fileUploadName, setFileUploadName] = useState('');

    const onChange = ({ target: { value, name } }) => {
        let changer = '';
        if (name === 'streamLink') changer = value.includes('youtube') ? value.replace('watch?v=', 'embed/') : value;
        else changer = value
        setDetailsPage({ ...detailsPage, [name]: changer });
    }

    const onNextPage = () => {
        if (!Object.values(detailsPage).some(value => { return value !== ''; }))
            setErrorMessage("Must Enter one of fields")
        else {
            setCounterPages(counterPages + 1)
            setListPages([...listPages, detailsPage])
            setDetailsPage(details)
            setErrorMessage('')
        }
    }
    const handleFileUpload = ({ filesUploaded }) => {
        if (filesUploaded.length) {
            setDetailsPage({ ...detailsPage, file: filesUploaded[0].url })
            setFileUploadName(filesUploaded[0].filename)
            return true;
        }

        // filesFailed: []
        // filesUploaded:
    }
    const onFinish = () => {
        if (Object.values(detailsPage).some(value => { return value !== ''; }))
            setErrorMessage("Must Click Next Page Button Before Finish")

        //implement method from backend !!
        server.post('/addTopicMatrials', { newArr: listPages, keyCollection, type: 'pages' })
    }
    useEffect(() => {
        const getAmountOfPages = () => {
            return server.get(`/getTopicMaterials?keyCollection=${keyCollection}&type=pages`)
                .then(response => setCounterPages(response.data.length))
        }
        getAmountOfPages();
    }, [keyCollection])
    return (
        <div>
            <h1 style={{ textDecoration: 'underline' }}>{`Page ${counterPages}`}</h1>
            <form className="ui error form">
                <label >Title Page (optional)</label>
                <input name="title" type="text" onChange={onChange} value={detailsPage.title} />
                <br /><br />
                <textarea name="freeText" onChange={onChange} value={detailsPage.freeText} placeholder="Write free text (optional)" cols="100" rows="3" />
                <label >Choose a file instead of free text </label>
                <br />
                <ReactFilestack
                    apikey={'AUHgQzKrtS3iZmAm17VZtz'}
                    componentDisplayMode={{
                        type: 'button',
                        customText: 'Upload File',
                        customClass: 'ui basic black button'
                    }}
                    onSuccess={handleFileUpload}
                    onError={(err) => alert(err)}
                />
                <br />
                <h3 style={{ color: 'green' }}>{fileUploadName}</h3>
                <label >Streaming link:</label>
                <input name="streamLink" type="text" placeholder="youtube.com" onChange={onChange} value={detailsPage.streamLink} /><br /><br />
                <div className='ui error message header' style={{ fontSize: '1em', marginBottom: '10px', marginTop: '-15px' }}>
                    {errorMessage}
                </div>
            </form>
            <button onClick={onNextPage} className="ui button primary"> Next Page </button>
            <button onClick={onFinish} className="ui button black"> Finish </button>
            <br /><br />
        </div>
    )
}
export default CreateMaterialPages;