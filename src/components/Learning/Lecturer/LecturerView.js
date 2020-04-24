import React from 'react';
// import StudyMaterials from '../LecturerAndStudent/StudyMaterials';
import { Link } from 'react-router-dom';
import Professions from '../LecturerAndStudent/Professions';
const LecturerView = () => {
    return (
        <div className="ui container" >
            {/* <StudyMaterials userMessage={'Lecturer Mode'}>
                <Link to='/LecturerView/NewMaterial' className="right floated ui primary button">
                    Add Metarial </Link>
                <button className="right floated ui button black">Add Students</button>
                
            </StudyMaterials> */}
            <Professions>
                <Link to='/LecturerView/CreateClassroom' className="right floated ui primary button">Add New Class</Link>
            </Professions>
        </div>
    )
}

export default LecturerView;