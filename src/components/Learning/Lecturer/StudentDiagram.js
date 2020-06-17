import React, { useState, useEffect } from 'react';
import CanvasJSReact from '../../../assets/canvasjs.react';
import { server } from '../../../Apis/server';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
/**This component shows the diagrams to the lecturer.
 * as soon as a lecturer selects a specific student.
 * all the subjects of the student and his grades will appear to him.
 * Once you have chosen to see the entire class, the average of each student's grade and name will appear. */
const StudentDiagram = ({ match: { params: { profession, className, student } }, location: { students } }) => {
    const [options, setOptions] = useState({})

    useEffect(() => {
        // when we get  the list of data from the DB we call this function and he rendering the diagram on the screen
        const onRender = (studentDetails) => {
            setOptions({
                animationEnabled: true,
                theme: student !== undefined ? "light2" : "light1",
                title: {
                    //the title for the main chart we need to change for 2 option : per student ,per topic
                    text: student !== undefined ? `Student User - ${student}` : `Class Name ${className}`
                },
                axisX: {
                    title: student !== undefined ? `Topics` : `Student Names`,
                    reversed: true,
                },
                axisY: {
                    maximum: 100,
                    title: student !== undefined ? "Grades" : "Average Grades",
                },
                data: [{
                    // type specifies what the diagram will look like
                    type: student !== undefined ? "bar" : "column",
                    // dataPoints is the list of student with their grade
                    dataPoints: studentDetails
                }]
            })
        }
        //check if we want specific student or all class
        student !== undefined
            ? server.get(`/getStudentGradesDiagram?studentName=${student}&professionName=${profession}`).then(studentDetails => {
                onRender(studentDetails.data)
            })
            : server.get(`/getStudentsGradeDiagram?studentsNames=${JSON.stringify(students)}&professionName=${profession}`).then(studentDetails => {
                console.log(studentDetails.data);
                onRender(studentDetails.data)
            })

    }, [setOptions, className, student, profession, students])
    return (
        <div>
            <CanvasJSChart options={options}
            // onRef={ref => this.chart = ref}
            />
        </div>
    );
}


export default StudentDiagram;                              