import React from 'react';
import StudyMaterials from '../LecturerAndStudent/StudyMaterials';

const StudentView = () => {
    return (
        <div className="ui container" style={{ marginTop: '20px' }}>
            <StudyMaterials userMessage={"Student Mode"} />
        </div>
    )
}

export default StudentView;