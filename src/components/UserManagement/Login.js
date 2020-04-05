import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getUsers, SignIn } from '../../Redux/actions';
import history from '../../history';
import FormField from '../ReuseableStuff/FormFields';

const Login = ({ users, SignIn, getUsers }) => {

    const setLocalStorage = (currUser) => {
        const user = {
            'user': currUser.username,
            'isLecturer': currUser.isLecturer
        }
        localStorage.setItem('userCredential', JSON.stringify(user))
    }
    // when the user click on the button this function called
    const onSubmit = (formValues) => {
        let isExist = false;
        users.forEach(user => {
            if (formValues.Username === user.username
                &&
                formValues.Password === user.password) {
                SignIn({ userID: user.username, isLecturer: user.isLecturer })
                setLocalStorage(user)
                isExist = !isExist;
                if (user.isLecturer)
                    history.push("/LecturerView");
                else
                    history.push("/StudentView");
            }
        })
        if (!isExist) alert("User Not Exist");

    }

    useEffect(() => { getUsers(); }, [getUsers])

    return (
        <div>
            <h1 style={{ fontWeight: '700', textDecoration: 'underline' }}>Sign In</h1>
            <br />
            <FormField onSubmit={onSubmit} FirstField={'Username'} SecondField={'Password'} />
        </div>
    );
};



const mapStateToProps = (state) => {
    return { users: Object.values(state.listOfUsers) }
}

export default connect(mapStateToProps, { getUsers, SignIn })(Login)