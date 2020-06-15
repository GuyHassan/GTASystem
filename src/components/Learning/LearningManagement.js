import React from "react";
import { Switch } from "react-router-dom";
import ProtectedRoute from '../ReuseableComponents/ProtectedRoute';
import DeleteMaterial from '../Learning/Lecturer/DeleteMaterial';
import CreateClassroom from './Lecturer/CreateClassroom';
import StudentView from '../Learning/Student/StudentView';
import LecturerView from '../Learning/Lecturer/LecturerView';
import StudentPermission from "./Lecturer/StudentPermission";
import Classrooms from "./Lecturer/Classrooms";
import ViewStudents from "./Lecturer/ViewStudents";
import AddingStudentToClass from "./Lecturer/AddingStudentToClass";
import MaterialView from "./LecturerAndStudent/MaterialView";
import CreateMaterialPages from "./Lecturer/CreateMaterialPages";
import CreateMaterialQuestions from "./Lecturer/CreateMaterialQuestions";
import DisplayPagesAndTests from "./LecturerAndStudent/DisplayPagesAndTests";
import DisplayHint from "./Student/DisplayHint";
import StudentDiagram from "./Lecturer/StudentDiagram";
import StudentFeedback from "./Student/StudentFeedback";
/**routing for all learning section includes protecte on him !*/
const LearningManagement = () => {
    return (
        <Switch>
            <ProtectedRoute path="/ShowHint/:question" exact component={DisplayHint} />
            <ProtectedRoute path="/LecturerView/StudentDiagram/:className/:profession/:student?" exact component={StudentDiagram} />
            <ProtectedRoute path="/StudentView/StudentProgress" exact component={StudentFeedback} />
            <ProtectedRoute path="/LecturerView/CreateMaterialQuestions/:profession/:className/:keyCollection/:type" exact component={CreateMaterialQuestions} />
            <ProtectedRoute path="/LecturerView/CreateMaterialPages/:profession/:className/:keyCollection" exact component={CreateMaterialPages} />
            <ProtectedRoute path="/LecturerView/Profession" exact component={LecturerView} />
            <ProtectedRoute path="/LecturerView/ViewStudents/:profession/:className" exact component={ViewStudents} />
            <ProtectedRoute path="/LecturerView/DeleteMaterial/:id" exact component={DeleteMaterial} />
            <ProtectedRoute path="/MaterialView/:profession/:className" exact component={MaterialView} />
            <ProtectedRoute path="/LecturerView/AddingStudentToClass/:profession/:className" exact component={AddingStudentToClass} />
            <ProtectedRoute path="/LecturerView/CreateClassroom" exact component={CreateClassroom} />
            <ProtectedRoute path="/LecturerView/StudentPermissions" exact component={StudentPermission} />
            <ProtectedRoute path="/StudentView/Profession" exact component={StudentView} />
            <ProtectedRoute path="/StudentView/DisplayMaterials/:profession/:className/:keyCollection/:indexTopic/:type" exact component={DisplayPagesAndTests} />
            <ProtectedRoute path="/LecturerView/Classrooms/:profession" exact component={Classrooms} />
        </Switch>
    )
}

export default LearningManagement;