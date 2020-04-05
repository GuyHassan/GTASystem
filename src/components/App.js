import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import Header from './General/Header';
import AboutUs from './General/AboutUs';
import history from '../history';
import Login from './UserManagement/Login';
import LecturerView from './Learning/Lecturer/LecturerView';
import StudentView from './Learning/Student/StudentView';
import IntroductionMain from './General/IntroductionMain';
import NewMaterial from './Learning/Lecturer/NewMaterial';
import DeleteMaterial from './Learning/Lecturer/DeleteMaterial';
import StudentPermissions from '../components/Learning/Lecturer/StudentPermissions';
const App = () => {
    return (
        <div>
            <Router history={history} >
                {/* <Switch> - is a tag that tell to the browser go to first Route that equal to your Path!*/}
                <Header />
                <div className='ui container'>
                    <Switch>
                        <Route path="/" exact component={IntroductionMain} />
                        <Route path="/Login" exact component={Login} />
                        <Route path="/LecturerView" exact component={LecturerView} />
                        <Route path="/StudentView" exact component={StudentView} />
                        <Route path="/AboutUs" exact component={AboutUs} />
                        <Route path="/newMaterial" exact component={NewMaterial} />
                        <Route path="/studentPermissions" exact component={StudentPermissions} />
                        <Route path="/LecturerView/deleteMaterial/:id" exact component={DeleteMaterial} />
                        <Route path="*" exact component={() => { return (<h1 style={{ textAlign: "center" }}>404 NOT FOUND</h1>) }} />
                    </Switch>
                </div>

            </Router>

        </div>
    );
}
export default App;