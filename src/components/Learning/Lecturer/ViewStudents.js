import React, { useEffect } from 'react';
import { getStudents } from '../../../Redux/actions';
import { connect } from 'react-redux';
const ViewStudent = ({ students, match: { params }, getStudents }) => {
    const renderStudent = () => {
        return students.map(student => {
            return (
                <div className="item" key={Object.keys(student)}>
                    <div className="content" style={{ color: '#1a75ff' }}>
                        <h2>
                            <ul>
                                <li>
                                    {Object.values(student)}
                                </li>
                            </ul>
                        </h2>
                    </div>
                </div >
            )
        })
    }
    useEffect(() => {
        getStudents(params);
    }, [getStudents, params])
    return (
        <div>
            <h1>Students </h1>
            <div className="ui container" style={{ marginTop: '20px' }}>
                <div className="ui celled list">
                    {renderStudent()}
                </div>
            </div>
        </div>

    )
}
const mapStateToProps = (state) => {
    return { students: [state.students] }
}
export default connect(mapStateToProps, { getStudents })(ViewStudent);