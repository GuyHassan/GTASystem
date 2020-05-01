import React, { Fragment } from 'react';

const MaterialView = () => {
    const materials = [{ subTopic: [{ subTopicName: 'rational shvarim' }, { subTopicName: 'not rational shvarim' }], topicName: 'shvarim' }, { topicName: 'multiple' }]
    const subTopicRender = (subTopic) => {
        return subTopic.map((topic, idTopic) => {
            return (
                <ul style={{ marginTop: '20px', fontSize: '20px'}}>
                    <li>
                        {topic.subTopicName}
                    </li>
                </ul>
            )
        })

    }
    const renderMaterials = () => {
        return materials.map((material, idMaterial) => {
            return (
                <div className="item" key={idMaterial}>
                    <div className="content" style={{ color: '#1a75ff' }}>
                        <h2>
                            <ul>
                                <li>
                                    {material.topicName}
                                    {material.subTopic ? subTopicRender(material.subTopic) : null}
                                </li>
                            </ul>

                        </h2>
                    </div>
                </div >
            )
        })
    }
    return (
        <div className="ui container" style={{ marginTop: '20px' }}>
            <div className="ui celled list">
                <h1 style={{ textDecoration: 'underline' }}>Material View</h1><br />
                {renderMaterials()}
                <br /><br />
            </div>
        </div>
    )
}
export default MaterialView;