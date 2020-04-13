import React from "react";
import { Switch } from "react-router-dom";
import ProtectedRoute from '../ReuseableStuff/ProtectedRoute';
import StudentPermissions from '../Learning/Lecturer/StudentPermissions';
import ViewClass from '../Learning/Lecturer/ViewClass';
import DeleteMaterial from '../Learning/Lecturer/DeleteMaterial';
import NewMaterial from '../Learning/Lecturer/NewMaterial';
import StudentView from '../Learning/Student/StudentView';
import LecturerView from '../Learning/Lecturer/LecturerView';

const LearningManagement = () => {
    return (
        <Switch>
            <ProtectedRoute path="/LecturerView" exact component={LecturerView} />
            <ProtectedRoute path={`/${"LecturerView" || "StudentView"}/ViewClass`} exact component={ViewClass} />
            <ProtectedRoute path="/LecturerView/DeleteMaterial/:id" exact component={DeleteMaterial} />
            <ProtectedRoute path="/LecturerView/NewMaterial" exact component={NewMaterial} />
            <ProtectedRoute path="/LecturerView/StudentPermissions" exact component={StudentPermissions} />
            <ProtectedRoute path="/StudentView" exact component={StudentView} />
        </Switch>
    )
}

export default LearningManagement;