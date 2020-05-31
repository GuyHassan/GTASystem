import React, { useEffect } from 'react';
import { getStudents } from '../../../Redux/actions';
import { connect } from 'react-redux';
const ViewStudent = ({ students, match: { params }, getStudents }) => {
    const renderStudent = () => {
        return students.map(student => {
            return (
                <div className="item" key={student.id}>
                    <div className="content" style={{ color: '#1a75ff' }}>
                        <h2>
                            <ul>
                                <li className="renderText" style={{ opacity: '1', cursor: 'default' }}>
                                    {student.name}
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
        return () => { getStudents({}) }
    }, [getStudents, params])
    return (
        <div>
            <h1 className="titleComp">Students </h1>
            <div className="ui container" style={{ marginTop: '20px' }}>
                <div className="ui celled list">
                    {renderStudent()}
                </div>
            </div>
        </div>

    )
}
const mapStateToProps = (state) => {
    return { students: Object.values(state.students) };
}
export default connect(mapStateToProps, { getStudents })(ViewStudent);