import React, { useState, useEffect } from 'react';
import CanvasJSReact from '../../../assets/canvasjs.react';
import { server } from '../../../Apis/server';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const StudentDiagram = ({ match: { params: { profession, className, student } }, location: { students } }) => {
    const [options, setOptions] = useState({})
    const onRender = (studentDetails) => {
        setOptions({
            animationEnabled: true,
            theme: "light2",
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
    useEffect(() => {
        //check if we want specific student or all class
        student !== undefined
            ? server.get(`/getStudentGradesDiagram?studentName=${student}&professionName=${profession}`).then(studentDetails => {
                onRender(studentDetails.data)
            })
            : server.get(`/getStudentsGradeDiagram?studentsNames=${JSON.stringify(students)}&professionName=${profession}`).then(studentDetails => {
                console.log(studentDetails.data)
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