import React from "react";
import { Switch } from "react-router-dom";
import ProtectedRoute from '../ReuseableComponents/ProtectedRoute';
import ViewClass from './Lecturer/StudentInClass';
import DeleteMaterial from '../Learning/Lecturer/DeleteMaterial';
import CreateClassroom from './Lecturer/CreateClassroom';
import StudentView from '../Learning/Student/StudentView';
import LecturerView from '../Learning/Lecturer/LecturerView';
import StudentPermission from "./Lecturer/StudentPermission";
import StudyMaterials from "./LecturerAndStudent/StudyMaterials";
import Classrooms from "./Lecturer/Classrooms";
import ViewStudents from "./Lecturer/ViewStudents";
import StudentInClass from "./Lecturer/StudentInClass";
const LearningManagement = () => {
    return (
        <Switch>
            <ProtectedRoute path={`/${('LecturerView', 'StudentView')}/StudyMaterial`} exact component={StudyMaterials} />
            <ProtectedRoute path="/LecturerView/Profession" exact component={LecturerView} />
            <ProtectedRoute path="/LecturerView/ViewStudents/:profession/:className" exact component={ViewStudents} />
            <ProtectedRoute path={`/${("LecturerView", "StudentView")}/ViewClass`} exact component={ViewClass} />
            <ProtectedRoute path="/LecturerView/DeleteMaterial/:id" exact component={DeleteMaterial} />
            <ProtectedRoute path="/LecturerView/StudentInClass" exact component={StudentInClass} />
            <ProtectedRoute path="/LecturerView/CreateClassroom" exact component={CreateClassroom} />
            <ProtectedRoute path="/LecturerView/StudentPermissions" exact component={StudentPermission} />
            <ProtectedRoute path="/StudentView/Profession" exact component={StudentView} />
            <ProtectedRoute path="/LecturerView/Classrooms/:id" exact component={Classrooms} />
        </Switch>
    )
}

export default LearningManagement;