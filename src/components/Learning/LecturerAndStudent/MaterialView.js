import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { getMaterials } from '../../../Redux/actions';
import { Link } from "react-router-dom";
import { Icon } from 'semantic-ui-react'
import '../../Style/MaterialView.css';
// const materials = [{ subTopic: [{ subTopicName: 'rational shvarim' }, { subTopicName: 'not rational shvarim' }], topicName: 'shvarim' }, { topicName: 'multiple' }]
const MaterialView = ({ getMaterials, match: { params }, materials }) => {
    const [stateMaterial, setStateMaterial] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const { isLecturer } = JSON.parse(localStorage.getItem('userCredential'))
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
    const onFinishEdit = (event) => {
        event.preventDefault()

        console.log(stateMaterial)
        // const newListMaterial = []
        // for (let i = 0; i < event.target.length - 1; i++) {
        //     console.log(event.target)
        //     const currentMaterial = {}
        //     if (event.target[i].name === 'topicName')
        //         currentMaterial[event.target[i].name] = event.target[i].value
        //     if (event.target[i + 1].name === 'subTopicName') {
        //         currentMaterial.subTopic = []
        //         for (let subTopicName = 'subTopicName'; subTopicName === event.target[i + 1].name; i++) {
        //             currentMaterial.subTopic.push({ subTopicName: event.target[i + 1].value })
        //         }
        //     }
        //     newListMaterial.push(currentMaterial)
        // }
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
                <ul style={{ marginTop: '20px', fontSize: '20px' }} key={idTopic}>
                    <li >
                        <Link to={``}>{topic.subTopicName}</Link>
                    </li>
                </ul>
        })
    }
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
                            <Icon onClick={() => { updateMaterials(idMaterial) }}
                                name='plus circle' size='large' style={{ margin: '10px' }} />
                        </div>
                        {material.subTopics ? subTopicRender(material.subTopics, idMaterial) : null}
                    </li>
                </ul>

            )
        })
    }

    const renderMaterials = () => {
        return stateMaterial.map((material, idMaterial) => {
            return (
                <div className="item" key={idMaterial}>
                    <div className="content" style={{ color: '#1a75ff' }}>
                        <ul>
                            <li >
                                <h2>
                                    {material.subTopics ? material.topicName : <Link to={``}>{material.topicName}</Link>}
                                </h2>
                                {material.subTopics ? subTopicRender(material.subTopics, idMaterial) : null}
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
                <h1 style={{ textDecoration: 'underline' }}>Material View</h1><br />
                {/* <form */}
                {/* // onSubmit={onFinishEdit}> */}
                {editMode ? renderEditMode() : renderMaterials()}

                {/* </form> */}
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
    return { materials: Object.values(state.materials) }
}
export default connect(mapStateToProps, { getMaterials })(MaterialView);