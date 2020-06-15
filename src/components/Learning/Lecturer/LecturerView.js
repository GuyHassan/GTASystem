import React from 'react';
import { Link } from 'react-router-dom';
import Professions from '../LecturerAndStudent/Professions';
/**first component of lecturer view  */
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