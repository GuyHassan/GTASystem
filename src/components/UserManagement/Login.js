import React from 'react';
import { connect } from 'react-redux';
import { SignIn } from '../../Redux/actions';
import history from '../../history';
import FormField from '../ReuseableComponents/FormFields';
import { server } from '../../Apis/server';


const Login = ({ SignIn }) => {
    const setLocalStorage = (username, isLecturer) => {
        const user = { 'user': username, 'isLecturer': isLecturer }
        localStorage.setItem('userCredential', JSON.stringify(user))
    }
    const userType = ({ username, isLecturer }) => {
        SignIn({ userID: username, isLecturer: isLecturer })
        setLocalStorage(username, isLecturer)
        if (isLecturer)
            history.push("/LecturerView");
        else
            history.push("/StudentView");
    }

    // when the user click on the button this function called
    const onSubmit = (formValues) => {
        server.post('/loginRequest', formValues)
            .then((response) => {
                const userDetails = response.data;
                userType(userDetails);
            }, (error) => {
                console.log(error);
                alert("username or password are incorrect");
            });
    }

    return (
        <div>
            <h1 style={{ fontWeight: '700', textDecoration: 'underline' }}>Sign In</h1>
            <br />
            <FormField onSubmit={onSubmit} FirstField={'Username'} SecondField={'Password'} />
        </div>
    );
};



// const mapStateToProps = (state) => {
//     return { users: Object.values(state.listOfUsers) }
// }

export default connect(null, { SignIn })(Login)