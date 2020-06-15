import React, { useState, useEffect } from 'react';
import { server } from '../../../Apis/server';
import ReactFilestack from 'filestack-react';
import history from '../../../history';
import { connect } from 'react-redux';
import { getMaterialPages } from '../../../Redux/actions'

const details = { title: '', freeText: '', file: '', streamLink: '' }

/**This component Allow to the lecturer build a page of  material with the suitable field */
const CreateMaterialPages = ({ getMaterialPages, materialPages, match: { params: { keyCollection, profession, className } } }) => {
    const [detailsPage, setDetailsPage] = useState(details);
    const [listPages, setListPages] = useState([])
    const [counterPages, setCounterPages] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [fileUploadName, setFileUploadName] = useState('');
    // when the user change the string inside the field
    const onChange = ({ target: { value, name } }) => {
        let changer = '';
        if (name === 'streamLink') changer = value.includes('youtube') ? value.replace('watch?v=', 'embed/') : value;
        else changer = value
        setDetailsPage({ ...detailsPage, [name]: changer });
    }
    // validate the input !
    const validate = (type) => {
        if (type === 'onNextPage' && !Object.values(detailsPage).some(value => { return value !== ''; })) {
            setErrorMessage("Must Enter one of fields");
            return false;
        }
        else if (type === 'onFinish' && Object.values(detailsPage).some(value => { return value !== ''; })) {
            setErrorMessage("Must Click Next Page Button Before Finish");
            return false;
        }
        return true
    }
    // on click next page button
    const onNextPage = () => {
        if (validate('onNextPage')) {
            setCounterPages(counterPages + 1)
            setListPages([...listPages, detailsPage])
            setDetailsPage(details)
            setFileUploadName('')
            setErrorMessage('')
        }
    }
    // handle the file that we get from the fileStack API
    const handleFileUpload = ({ filesUploaded }) => {
        if (filesUploaded.length) {
            setDetailsPage({ ...detailsPage, file: filesUploaded[0].url })
            setFileUploadName(filesUploaded[0].filename)
            return true;
        }
    }
    // on finish button 
    const onFinish = () => {
        if (validate('onFinish'))
            server.post('/addTopicMaterials', { newArr: listPages, keyCollection, type: 'pages' }).then(res => {
                alert("Pages Uploaded !");
                history.push(`/MaterialView/${profession}/${className}`);
            })
    }
    useEffect(() => {
        getMaterialPages(keyCollection);
    }, [getMaterialPages, keyCollection])
    useEffect(() => {
        setCounterPages(materialPages.length);
    }, [materialPages])
    return (
        <div>
            <h1 className="titleComp">{`Page ${counterPages}`}</h1>
            <form className="ui error form">
                <label >Title Page (optional)</label>
                <input name="title" type="text" value={detailsPage.title} onChange={onChange} />
                <br /><br />
                <textarea name="freeText" value={detailsPage.freeText} onChange={onChange} placeholder="Write free text (optional)" cols="100" rows="3" />
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
                <input name="streamLink" type="text" placeholder="youtube.com" value={detailsPage.streamLink} onChange={onChange} />
                <br /><br />
                <div className='ui error message header' style={{ fontSize: '1em', marginBottom: '10px', marginTop: '-15px' }}>
                    {errorMessage}
                </div>
            </form>
            <button onClick={onNextPage} className="ui button green"> Next Page </button>
            <button onClick={onFinish} className="ui button black"> Finish </button>
            <br /><br />
        </div>
    )
}
const mapStateToProps = (state) => {
    return { materialPages: state.materialPages };
}
export default connect(mapStateToProps, { getMaterialPages })(CreateMaterialPages);