import React, { useEffect } from 'react';
import { getStudents } from '../../../Redux/actions';
import { connect } from 'react-redux';
const ViewStudent = ({ students, match: { params }, getStudents }) => {
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
        console.log('params - ', params)
        getStudents(params);
    }, [getStudents, params])
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