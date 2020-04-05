import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import { createStudent } from '../../../Redux/actions';

const StudentPermissions = ({ createStudent }) => {
    const [state, setState] = useState({ username: '', password: '', errorUsername: '', errorPassword: '' });
    const history = useHistory();
    const generateRandomizePass = () => {
        const randomPassword = Math.random().toString(15).replace(/[^a-z1-9]+/g, '').substr(0, 7)
        setState({ ...state, password: randomPassword });
    }

    const handleChange = (event) => {
        if (event.target.name === 'username') {
            setState({ ...state, username: event.target.value, errorUsername: '' })
        }
        else if (event.target.name === 'password') {
            setState({ ...state, password: event.target.value, errorPassword: '' })
        }
    }
    const validate = () => {
        if (!state.username && !state.password) {
            setState({ ...state, errorUsername: "Must enter Username", errorPassword: "Must enter Password" });
            return false;
        }
        else if (!state.username) {
            console.log('username validate')
            setState({ ...state, errorUsername: "Must enter Username" });
            return false;
        }
        else if (!state.password) {
            console.log('password validate')
            setState({ ...state, errorPassword: "Must enter Password" });
            return false;
        }
        return true;
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const isValid = validate();
        if (isValid) {
            console.log(state)
        }
    }
    const genderChoosen = () => {
        return ['Gender', 'Male', 'Female', 'Other'].map((gender, index) => {
            const isHidden = gender === 'Gender';
            return (
                <option hidden={isHidden} key={index} value={gender} >
                    {gender}
                </option>
            );
        });
    };
    return (
        <form
            className="ui error form"
            onSubmit={handleSubmit}>
            <h1>Student Permissions</h1>
            <label>First Name:</label>
            <input placeholder="First Name" name="username" type="text" value={state.username} onChange={handleChange} />
            <label>Last Name:</label>
            <input placeholder="lastName" name="username" type="text" value={state.username} onChange={handleChange} />
            <label htmlFor="cars">Gender</label>
            <select name="genderlist" multiple={false} defaultValue={0} >
                {genderChoosen()}
            </select>
            <label>Student Username:</label>
            <input placeholder="Username" name="username" type="text" value={state.username} onChange={handleChange} />
            <div className='ui error message header' style={{ width: '25vw' }}>
                {state.errorUsername}
            </div>
            <br />
            <label>Student Password:</label>
            <input placeholder="Password" name='password' type="text" value={state.password} onChange={handleChange} />
            <div className='ui error message header' style={{ width: '25vw' }}>
                {state.errorPassword}
            </div>
            <br />
            <br />
            <button className="ui button primary" type="submit" value="Submit" >Submit</button>
            <button className="ui button purple" type="button" onClick={generateRandomizePass} >Randomize Passowrd</button>
            <button onClick={history.goBack} className="ui button green">Back</button>
            <br />
            <br />
        </form>

    )
}

export default connect(null, { createStudent })(StudentPermissions);