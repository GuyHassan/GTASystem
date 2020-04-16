import React from 'react';
import StudyMaterials from '../LecturerAndStudent/StudyMaterials';

import { Link } from 'react-router-dom';
const LecturerView = () => {
    return (
        <div className="ui container" >
            <StudyMaterials userMessage={'Lecturer Mode'}>
                <Link style={{ marginTop: '-10px' }}
                    to='/LecturerView/NewMaterial' className="ui right floated primary button">
                    Add Metarial
                </Link>
            </StudyMaterials>
        </div>
    )
}

export default LecturerView;