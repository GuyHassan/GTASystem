import React, { useEffect } from 'react';
import { getStudents, getClasses } from '../../../Redux/actions';
import { connect } from 'react-redux';
const ViewStudent = ({ students, match, getStudents }) => {
    const renderStudent = () => {
        return students.map(student => {
            return (
                <div className="item" key={Object.keys(student)}>
                    <div className="content">
                        <h3>
                            {Object.values(student)} 
                        </h3>
                    </div>
                </div >
            )
        })
    }
    useEffect(() => {
        getStudents(match.params);
    }, [getStudents])
    return (
        <div>
            <h1>Student </h1>
            {renderStudent()}
        </div>
    )
}
const mapStateToProps = (state) => {
    return { students: [state.students] }
}
export default connect(mapStateToProps, { getStudents })(ViewStudent);