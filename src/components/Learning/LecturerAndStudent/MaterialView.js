import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getMaterials } from '../../../Redux/actions';
import { server } from '../../../Apis/server';
import { Link } from "react-router-dom";
import { Icon } from 'semantic-ui-react'
import history from '../../../history';
import '../../Style/MaterialView.css';

const MaterialView = ({ getMaterials, match: { params }, materials }) => {
    const [stateMaterial, setStateMaterial] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [showButtonsID, setShowButtonsID] = useState('');
    const { isLecturer, user } = JSON.parse(localStorage.getItem('userCredential'))
    const { profession, className } = params;
    const onClickFinalTest = () => {
        alert("Final Test !!");
    }

    const Buttons = ({ topic: { subTopicName, keyCollection, topicName }, indexes }) => {
        const name = subTopicName ? subTopicName : topicName;
        if (showButtonsID === name) {
            return isLecturer
                ? <div style={{ margin: '10px' }}>
                    <Link to={`/LecturerView/CreateMaterialPages/${profession}/${className}/${keyCollection}`}
                        className='ui basic black button small'>Add Pages</Link>
                    <Link to={`/LecturerView/CreateMaterialQuestions/${profession}/${className}/${keyCollection}/questions`}
                        className='ui basic black button small'>Add Practice Question</Link>
                    <Link to={`/LecturerView/CreateMaterialQuestions/${profession}/${className}/${keyCollection}/testQuestions`}
                        className='ui basic black button small'>Add Test Question</Link>
                </div>
                : <div style={{ margin: '10px' }}>
                    <Link to={`/StudentView/DisplayMaterials/${profession}/${className}/${keyCollection}/${indexes}/MaterialPages`}
                        className='ui basic red button small'>Learn Topic</Link>
                    {'Here i need to check if the student finish to learn the topic' ?
                        <Link to={`/StudentView/DisplayMaterials/${profession}/${className}/${keyCollection}/${indexes}/MaterialQuestions`}
                            className='ui basic green button small'>Practice Topic</Link> : null}
                </div >

        }
        return null;

    }
    // this function updates the state that hold the material section.
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
    const onFinishEdit = () => {
        server.post("/addMaterials", { professionName: profession, className, lecturerName: user, materialTree: stateMaterial }).then((res) => {
            history.push(`/LecturerView/Classrooms/${profession}`);
        })
    }
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
                    <li className="subTopics" onClick={() => setShowButtonsID(topic.subTopicName)}>
                        {topic.subTopicName}
                        <Buttons topic={topic} indexes={[parentIndex, idTopic]} />
                    </li>

                </ul>
        })
    }
    const renderEditMode = () => {
        console.log(stateMaterial)
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
            const finalExamRoute = `/StudentView/DisplayMaterials/${profession}/${className}/${material.keyCollection}/${idMaterial}/MaterialQuestions`;
            return (
                <div className="item" key={idMaterial}>
                    <div className="content" style={{ color: '#1a75ff' }}>
                        <ul>
                            <li style={{ color: 'green' }}>
                                <h2 className="renderText" style={{ opacity: material.subTopics && '1' }} onClick={!material.subTopics ? () => setShowButtonsID(material.topicName) : null}>
                                    {material.topicName}
                                </h2>
                                {material.subTopics && subTopicRender(material.subTopics, idMaterial)}
                                <Buttons topic={material} indexes={idMaterial} />
                                {!isLecturer && <Link to={finalExamRoute} className="iconExam" style={checkIsFinalMaterial(material) ? {} : { pointerEvents: 'none' }}>
                                    <span style={{ fontWeight: '700' }}>Final Exam</span>
                                    <Icon name='file outline' size='large' ></Icon>
                                </Link>}
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
            {isLecturer && <button className="ui right floated primary button " onClick={() => { setEditMode(!editMode) }}> Edit Mode </button>}
            <br /><br />
        </div>

    )
}
const mapStateToProps = (state) => {
    return { materials: Object.values(state.materialTopics) }
}
export default connect(mapStateToProps, { getMaterials })(MaterialView);