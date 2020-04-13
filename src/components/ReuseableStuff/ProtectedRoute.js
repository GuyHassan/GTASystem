import React from "react";
import { Route, Redirect } from "react-router-dom";
import FailedLocation from "./FailedLocation";

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const blockStudentPermission = () => {
        //return true if LecturerView is in the url path
        return String(rest.path).includes('LecturerView');
    }
    return (
        <Route
            {...rest}
            render={props => {
                const existsStorage = JSON.parse(localStorage.getItem('userCredential'))

                if ((existsStorage && (existsStorage.isLecturer || !blockStudentPermission()))) {
                    return <Component {...props} />;
                }
                else if (blockStudentPermission() && existsStorage) {
                    return <FailedLocation message={"Student Account Dont Have Permission For That Route !"} />
                }
                else {
                    return <Redirect to={{ pathname: "/" }} />;
                }

            }}
        />
    );
};

export default ProtectedRoute;