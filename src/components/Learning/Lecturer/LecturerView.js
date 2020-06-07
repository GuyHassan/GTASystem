import React from 'react';
// import StudyMaterials from '../LecturerAndStudent/StudyMaterials';
import { Link } from 'react-router-dom';
import Professions from '../LecturerAndStudent/Professions';
const LecturerView = () => {
    return (
        <div className="ui container" >
            <Professions>
                <Link to='/LecturerView/CreateClassroom' className="right floated ui green button">Add New Class</Link>
            </Professions>
        </div>
    )
}

export default LecturerView;