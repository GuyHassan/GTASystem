import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import IntroductionMain from "./IntroductionMain";
import Login from "../UserManagement/Login";
import AboutUs from "./AboutUs";
import FailedLocation from '../ReuseableStuff/FailedLocation';

const GeneralManagement = () => {
    {/* <Switch> - is a tag that tell to the browser go to first Route that equal to your Path!*/ }
    return (
        <Switch>
            <Route path="/" exact component={IntroductionMain} />
            <Route path="/AboutUs" exact component={AboutUs} />
            <Route
                path="/Login"
                exact
                render={props => {
                    if (localStorage.length) {
                        return <FailedLocation message={'You are already connected !!'} />;
                    } else {
                        return <Login />;
                    }
                }}
            />
        </Switch>
    );
}

export default GeneralManagement;