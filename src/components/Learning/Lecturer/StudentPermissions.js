import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import { createStudent } from '../../../Redux/actions';

const StudentPermissions = ({ createStudent }) => {
    const [state, setState] = useState({
        username: '', password: '', firstName: '', lastName: '', studentID: '',
        errorUsername: '', errorPassword: ''
    });
    const history = useHistory();
    const generateRandomizePass = () => {
        const randomPassword = Math.random().toString(15).replace(/[^a-z1-9]+/g, '').substr(0, 7)
        setState({ ...state, password: randomPassword });
    }

    const handleChange = (event) => {
        if (event.target.name === 'username')
            setState({ ...state, username: event.target.value, errorUsername: '' })
        else if (event.target.name === 'password')
            setState({ ...state, password: event.target.value, errorPassword: '' })
        else if (event.target.name === 'firstName')
            setState({ ...state, firstName: event.target.value })
        else if (event.target.name === 'lastName')
            setState({ ...state, lastName: event.target.value })
        else if (event.target.name === 'studentID')
            setState({ ...state, studentID: event.target.value })
    }
    const validate = () => {
        if (!state.username && !state.password) {
            setState({ ...state, errorUsername: "Must enter Username", errorPassword: "Must enter Password" });
            return false;
        }
        else if (!state.username) {
            setState({ ...state, errorUsername: "Must enter Username" });
            return false;
        }
        else if (!state.password) {
            setState({ ...state, errorPassword: "Must enter Password" });
            return false;
        }
        return true;
    }
    const handleSubmit = (event) => {
        //if we use preventDefault is ignore the default submit that the js give us.
        event.preventDefault();
        const isValid = validate();
        if (isValid) {
            //submit here !!
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
            <div>
                <label>First Name:</label>
                <input placeholder="First Name" name="firstName" type="text" value={state.firstName} onChange={handleChange} />
            </div>
            <div>
                <label>Last Name:</label>
                <input placeholder="Last Name" name="lastName" type="text" value={state.lastName} onChange={handleChange} />
            </div>
            <div>
                <label>Student ID:</label>
                <input placeholder="Student ID" name="studentID" type="text" value={state.ID} onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="cars">Gender</label>
                <select name="genderlist" multiple={false} defaultValue={0} >
                    {genderChoosen()}
                </select>
            </div>
            <div>
                <label>Student Username:</label>
                <input placeholder="Username" name="username" type="text" value={state.username} onChange={handleChange} />
                <div className='ui error message header' style={{ width: '25vw', fontSize: '1em' }}>
                    {state.errorUsername}
                </div>
            </div>
            <br />
            <div>
                <label>Student Password:</label>
                <input placeholder="Password" name='password' type="text" value={state.password} onChange={handleChange} />
                <div className='ui error message header' style={{ width: '25vw', fontSize: '1em' }}>
                    {state.errorPassword}
                </div>
            </div>
            <br />
            <br />
            <div>
                <button className="ui button primary" type="submit" value="Submit" >Submit</button>
                <button className="ui button purple" type="button" onClick={generateRandomizePass} >Randomize Passowrd</button>
                <button onClick={history.goBack} className="ui button green">Back</button>
            </div>
            <br />
            <br />
        </form>

    )
}

export default connect(null, { createStudent })(StudentPermissions);