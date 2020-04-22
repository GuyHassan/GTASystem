import React from 'react';
import StudyMaterials from '../LecturerAndStudent/StudyMaterials';
import Classrooms from '../LecturerAndStudent/Classrooms';

const StudentView = () => {
    return (
        <div className="ui container" style={{ marginTop: '20px' }}>
            {/* <StudyMaterials userMessage={"Student Mode"} /> */}
            <Classrooms />
        </div>
    )
}

export default StudentView;