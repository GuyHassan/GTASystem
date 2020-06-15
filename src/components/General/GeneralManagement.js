import React from "react";
import { Switch, Route } from "react-router-dom";
import IntroductionMain from "./IntroductionMain";
import Login from "../UserManagement/Login";
import AboutUs from "./AboutUs";
import FailedLocation from '../ReuseableComponents/FailedLocation';
import AdminPermission from "./AdminPermission";

const GeneralManagement = () => {
    const loginPermission = () => {
        return localStorage.length ? <FailedLocation message={'You are already connected !!'} /> : <Login />;
    }
    const adminPermission = () => {
        const details = JSON.parse(localStorage.getItem('userCredential'));
        const { user } = details ? details : { user: null }
        return user === ('GuyHassan' || 'YinonHirary') ? <AdminPermission /> : <FailedLocation message={'You Dont Have High Permission !'} />
    }
    // {/* <Switch> - is a tag that tell to the browser go to first Route that equal to your Path!*/ }
    return (
        <Switch>
            <Route path="/" exact component={IntroductionMain} />
            <Route path="/AboutUs" exact component={AboutUs} />
            <Route path="/Login" exact render={props => { return loginPermission() }} />
            <Route path="/AdminPermission" exact render={props => { return adminPermission() }} />
        </Switch>
    );
}

export default GeneralManagement;