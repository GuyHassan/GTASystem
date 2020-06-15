import React, { useEffect } from 'react';
import { getStudents } from '../../../Redux/actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
/**This component introduces all students to the lecturer.
 * allows for diagrams describing the progress of the students */
const ViewStudent = ({ students, match: { params }, getStudents }) => {
    //rendering a student on a screen
    const renderStudent = () => {
        return students.map(student => {
            return (
                <div className="item" key={student.id}>
                    <div className="content" >
                        <h2>
                            <ul>
                                <Link to={`/LecturerView/StudentDiagram/${params.className}/${params.profession}/${student.id}`}>
                                    <li className="renderText">
                                        {student.name}
                                    </li>
                                </Link>
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

                    <Link to={{
                        pathname: `/LecturerView/StudentDiagram/${params.className}/${params.profession}`, students
                    }}
                        className='ui green button right floated' style={{ margin: '10px' }}>
                        Class Diagram
                    </Link>
                </div>
            </div>
        </div >

    )
}
const mapStateToProps = (state) => {
    return { students: Object.values(state.students) };
}
export default connect(mapStateToProps, { getStudents })(ViewStudent);