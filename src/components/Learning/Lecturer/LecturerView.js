import React, { Fragment } from 'react';
import StudyMaterials from '../LecturerAndStudent/StudyMaterials';
import { Link } from 'react-router-dom';
import Classrooms from '../LecturerAndStudent/Classrooms';
const LecturerView = () => {
    return (
        <div className="ui container" >
            {/* <StudyMaterials userMessage={'Lecturer Mode'}>
                <Link to='/LecturerView/NewMaterial' className="right floated ui primary button">
                    Add Metarial </Link>
                <button className="right floated ui button black">Add Students</button>
                
            </StudyMaterials> */}
            <Classrooms>
                <Link to='/LecturerView/NewClassroom' className="right floated ui primary button">Add New Class</Link>
            </Classrooms>
        </div>
    )
}

export default LecturerView;