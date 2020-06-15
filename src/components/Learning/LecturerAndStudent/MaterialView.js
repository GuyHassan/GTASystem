import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { getMaterials } from '../../../Redux/actions';
import { server } from '../../../Apis/server';
import { Link } from "react-router-dom";
import { Icon } from 'semantic-ui-react'
import history from '../../../history';
import '../../Style/MaterialView.css';

/**This component shows all the study material that the lecturer teaches or the student learns */
const MaterialView = ({ getMaterials, match: { params }, materials }) => {
    const [stateMaterial, setStateMaterial] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [showButtonsID, setShowButtonsID] = useState('');
    const [passingGrade, setPassingGrade] = useState('')
    const { isLecturer, user } = JSON.parse(localStorage.getItem('userCredential'))
    const { profession, className } = params;

    // when the lecturer need to set pass grade we check if the grade is correct, if true he update the DB
    const submitPassGrade = (e, keyCollection) => {
        e.preventDefault();
        if (!(passingGrade >= 1 && passingGrade <= 100))
            alert("Min Grade Must Be Between 1-100")
        else {
            server.patch(`/setPassingGrade?keyCollection=${keyCollection}&passingGrade=${passingGrade}`)
            alert("Grade is Updated");
            setPassingGrade('')
        }
    }
    // get passingGrade from the DB
    const getPassingGrade = (keyCollection) => {
        server.get(`/getPassingGrade?keyCollection=${keyCollection}`).then(grade => {
            setPassingGrade(grade.data)
        })
    }
    // submited the passing grade the belong to this keyCollection
    const passingGradeJsx = (keyCollection) => {
        if (passingGrade === '')
            getPassingGrade(keyCollection)
        return passingGrade >= -1
            && <Fragment>
                <label style={{ marginRight: '10px' }}>Passing Grade: </label>
                <form className="ui input" onChange={({ target: { value } }) => setPassingGrade(value)} onSubmit={(e) => submitPassGrade(e, keyCollection)}>
                    <input name="passGrade" defaultValue={passingGrade} type="text" className='gradeInput' />
                    <button className="ui basic green button tiny" style={{ height: '27px', marginLeft: '10px' }} >Submit</button>
                </form>
            </Fragment>
    }
    //display buttons on click one of topic or subtopic, check the type of user (student or lecture )
    const Buttons = ({ topic: { subTopicName, keyCollection, topicName }, indexes }) => {
        const name = subTopicName ? subTopicName : topicName;
        if (showButtonsID === name) {
            return isLecturer
                ? <div style={{ margin: '10px' }}>
                    <Link to={`/LecturerView/CreateMaterialPages/${profession}/${className}/${keyCollection}`}
                        className='ui basic black button small'
                        style={{ marginBottom: '5px' }}>Add Pages</Link>
                    <Link to={`/LecturerView/CreateMaterialQuestions/${profession}/${className}/${keyCollection}/questions`}
                        className='ui basic black button small'
                        style={{ marginBottom: '5px' }}>Add Practice Question</Link>
                    <Link to={`/LecturerView/CreateMaterialQuestions/${profession}/${className}/${keyCollection}/testQuestions`}
                        className='ui basic black button small'>Add Test Question</Link>
                    <br /><br />
                    {passingGradeJsx(keyCollection)}
                </div>
                : <div style={{ margin: '10px' }}>
                    <Link to={`/StudentView/DisplayMaterials/${profession}/${className}/${keyCollection}/${indexes}/MaterialPages`}
                        className='ui basic red button small' style={{ margin: '5px' }}>Learn Topic</Link>
                    {'Here i need to check if the student finish to learn the topic' ?
                        <Link to={`/StudentView/DisplayMaterials/${profession}/${className}/${keyCollection}/${indexes}/MaterialQuestions`}
                            className='ui basic green button small'>Practice Topic</Link> : null}
                </div >

        }
        return null;

    }
    // updates the state that hold the material section.
    const updateMaterials = (parentIndex = null, newValue = null, childIndex = null) => {
        const newMaterial = [...stateMaterial]
        if (parentIndex !== null && childIndex !== null && newValue !== null)
            newMaterial[parentIndex].subTopics[childIndex] = { subTopicName: newValue }
        else if (parentIndex !== null && newValue !== null)
            newMaterial[parentIndex].topicName = newValue
        else if (parentIndex !== null) {
            if (!newMaterial[parentIndex].subTopics)
                newMaterial[parentIndex].subTopics = []
            newMaterial[parentIndex].subTopics.push({ subTopicName: '' })
        }
        setStateMaterial(newMaterial)
    }
    // when the lecturer finish edit the material sction
    const onFinishEdit = () => {
        server.post("/addMaterials", { professionName: profession, className, lecturerName: user, materialTree: stateMaterial }).then((res) => {
            history.push(`/LecturerView/Classrooms/${profession}`);
        })
    }
    // check if i can give to student the option to do the Final Test !
    const checkIsFinalMaterial = (material) => {
        if (!isLecturer)
            return material.subTopics
                ? material.subTopics.every(val => val.details.isFinishQuestions !== -1)
                : material.details.isFinishQuestions !== -1
    }
    const subTopicRender = (subTopic, parentIndex) => {
        return subTopic.map((topic, idTopic) => {
            return editMode ? (
                < ul key={idTopic} >
                    <li >
                        <div className="ui input" style={{ margin: '10px' }}>
                            <input type="text"
                                name="subTopicName"
                                defaultValue={topic.subTopicName}
                                onChange={e => { updateMaterials(parentIndex, e.target.value, idTopic) }}
                            />
                        </div>
                    </li>
                </ul >
            )
                :
                <ul style={{ marginTop: '10px', fontSize: '20px' }} key={idTopic}>
                    <li className="subTopics" onClick={() => {
                        setShowButtonsID(topic.subTopicName)
                        setPassingGrade('')
                    }}>
                        {topic.subTopicName}
                    </li>
                    <Buttons topic={topic} indexes={[parentIndex, idTopic]} />

                </ul>
        })
    }
    //when the user click on edit mode, we are rendering the new data with input text and give him option to chagne or add
    const renderEditMode = () => {
        return stateMaterial.map((material, idMaterial) => {
            return (
                <ul key={idMaterial} >
                    <li >
                        <div className="ui input" style={{ margin: '10px' }}>
                            <input type="text"
                                name="topicName"
                                defaultValue={material.topicName}
                                onChange={e => { updateMaterials(idMaterial, e.target.value) }}
                            />
                            {(material.subTopics || !material.keyCollection) && <Icon onClick={() => { updateMaterials(idMaterial) }}
                                name='plus circle' size='large' style={{ margin: '10px' }} />}
                        </div>
                        {material.subTopics && subTopicRender(material.subTopics, idMaterial)}
                    </li>
                </ul>

            )
        })
    }

    const renderMaterials = () => {
        return stateMaterial.map((material, idMaterial) => {
            const finalExamRoute = `/StudentView/DisplayMaterials/${profession}/${className}/${material.keyCollection}/${idMaterial}/MaterialTestQuestion`;
            return (
                <div className="item" key={idMaterial}>
                    <div className="content" style={{ color: '#1a75ff' }}>
                        <ul>
                            <li style={{ color: 'green' }}>
                                <h2 className="renderText" style={{ opacity: material.subTopics && '1' }} onClick={() => {
                                    !material.subTopics && setShowButtonsID(material.topicName)
                                    setPassingGrade('')
                                }}>
                                    {material.topicName}
                                </h2>
                                {material.subTopics && subTopicRender(material.subTopics, idMaterial)}
                                <Buttons topic={material} indexes={idMaterial} />
                                {!isLecturer && <Link to={finalExamRoute} className="iconExam" style={{ margin: '25px', ...checkIsFinalMaterial(material) ? {} : { pointerEvents: 'none' } }}>
                                    <span style={{ fontWeight: '700' }}>Final Exam</span>
                                    <Icon name='file outline' size='large' ></Icon>
                                </Link>}
                                <br /><br />

                            </li>
                        </ul>
                    </div>
                </div >
            )
        })
    }
    useEffect(() => {
        getMaterials(params)
        return () => getMaterials({})
    }, [getMaterials, params])
    useEffect(() => {
        setStateMaterial(materials)
    }, [materials])
    return (
        <div className="ui container" style={{ marginTop: '20px' }}>
            <div className="ui celled list">
                <h1 className="titleComp">Material View</h1><br />
                {editMode ? renderEditMode() : renderMaterials()}
            </div>
            {editMode
                ? < Icon onClick={() => {
                    const newMaterial = [...stateMaterial]
                    newMaterial.push({ topicName: '' })
                    setStateMaterial(newMaterial)
                }} name='plus' size='large' style={{ margin: '10px' }} /> : null}
            {editMode && <button name="finish" className="ui right floated black button " onClick={onFinishEdit}> Finish Edit </button>}
            {isLecturer && <button className="ui right floated green button " onClick={() => { setEditMode(!editMode) }}>{editMode ? 'Normal Mode' : 'Edit Mode'} </button>}
            <br /><br />
        </div>

    )
}
const mapStateToProps = (state) => {
    return { materials: Object.values(state.materialTopics) }
}
export default connect(mapStateToProps, { getMaterials })(MaterialView);