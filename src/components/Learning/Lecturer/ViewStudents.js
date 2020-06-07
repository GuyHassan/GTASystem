import React, { useEffect } from 'react';
import { getStudents } from '../../../Redux/actions';
import { connect } from 'react-redux';

const ViewStudent = ({ students, match: { params }, getStudents }) => {
    const studentDiagram = ({ id, name }) => {
        //{id: "yinon123", name: "yinon hirary"}
        // here need to render the specific student diagram
    }
    const renderStudent = () => {
        return students.map(student => {
            return (
                <div className="item" key={student.id}>
                    <div className="content" >
                        <h2>
                            <ul>
                                <li className="renderText" onClick={() => studentDiagram(student)}/* style={{ opacity: '1', cursor: 'default' }} */>
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
                    <button className='ui green button right floated' style={{ margin: '10px' }} >Class Diagram</button>
                </div>
            </div>
        </div>

    )
}
const mapStateToProps = (state) => {
    return { students: Object.values(state.students) };
}
export default connect(mapStateToProps, { getStudents })(ViewStudent);