import React, { useState, useEffect } from 'react';
import CanvasJSReact from '../../../assets/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const StudentDiagram = ({ match: { params: { className, id } } }) => {
    const [options, setOptions] = useState({})
    const addSymbols = (e) => {
        var suffixes = ["", "K", "M", "B"];
        var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
        if (order > suffixes.length - 1)
            order = suffixes.length - 1;
        var suffix = suffixes[order];
        return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
    }
    useEffect(() => {
        setOptions({
            animationEnabled: true,
            theme: "light2",
            title: {
                //the title for the main chart we need to change for 2 option : per student ,per topic
                text: `Class Name ${className}`
            },
            axisX: {
                //HERE WE NEED TO CHANGE THE TITLE TO GRADES BETWEEN 0-100
                title: "Students Name",
                reversed: true,
            },
            axisY: {
                //HERE WE NEED TO CHANGE TO StudentsName////topicNames
                maximum: 100,
                title: "Grades",
                labelFormatter: addSymbols
            },
            data: [{
                type: "bar",
                /*
                this is the dataPoints we change :  the label to be the same as the topics name////the students name
                                                 : the y to be the grade for this given label
                 */
                dataPoints: [
                    { y: 90, label: "Guy Hassan" },
                    { y: 82, label: "Yinon Hirari" },
                    { y: 70, label: "Yahav Mizrahi" },
                    { y: 62, label: "Guy Cohen" },
                ]
            }]
        })
    })
    return (
        <div>
            <CanvasJSChart options={options}
            // onRef={ref => this.chart = ref}
            />
            {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
        </div>
    );
}


export default StudentDiagram;                              