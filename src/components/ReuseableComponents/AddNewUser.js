import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { server } from '../../Apis/server';
const details = { username: '', password: '', firstName: '', lastName: '', ID: '', gender: '' }

const AddNewUser = ({ titleMessage, classNameJsx }) => {
    const { pathname } = useLocation();
    if (classNameJsx) details.className = ''
    const [state, setState] = useState(details);
    const [errorState, setErrorState] = useState(details);
    const history = useHistory();

    const generateRandomizePass = () => {
        const randomPassword = Math.random().toString(36).replace(/[^a-z1-9]+/g, '').substr(0, 8)
        setState({ ...state, password: randomPassword });
    }
    const setNewValues = (key, value) => {
        setState({ ...state, [key]: value })
        setErrorState({ ...errorState, [key]: '' })
    }
    const handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        switch (name) {
            case 'username':
                setNewValues(name, value);
                break;
            case 'password':
                setNewValues(name, value);
                break;
            case 'firstName':
                setNewValues(name, value);
                break;
            case 'lastName':
                setNewValues(name, value);
                break;
            case 'ID':
                setNewValues(name, value);
                break;
            case 'gender':
                setNewValues(name, value);
                break;
            case 'className':
                setNewValues(name, value);
                break;
            default:
                break;
        }
    }
    const validate = () => {
        const errorMessages = {
            username: 'Must Enter Username', password: 'Must Enter Password',
            firstName: 'Must Enter Name', lastName: 'Must Enter Last Name',
            ID: 'Must Enter ID', gender: 'Must Choose Gender', className: 'Must Enter Class Name'
        }
        let newObjErrors = {};
        for (const key of Object.keys(state)) {
            if (!state[key]) newObjErrors = { ...newObjErrors, [key]: errorMessages[key] };
        }
        setErrorState({ ...errorState, ...newObjErrors })
        return !Object.keys(newObjErrors).length ? true : false;
    }


    const handleSubmit = (event) => {
        //if we use preventDefault is ignore the default submit that the js give us.
        event.preventDefault();
        const isValid = validate();
        if (isValid) {
            const name = state.firstName + ' ' + state.lastName;
            server.post(pathname, { ...state, name: name })
                .then((response) => {
                    setState(details)
                    console.log("The User As Been Added...");
                }, (error) => {
                    console.log(error);
                    alert("The Username Is Taken ...");
                });
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
            <h1 className="titleComp">{titleMessage}</h1>
            <div>
                <label>First Name:</label>
                <input placeholder="First Name" name="firstName" type="text" value={state.firstName} onChange={handleChange} />
                <div className='ui error message header' style={{ width: '25vw', fontSize: '1em' }}>
                    {errorState.firstName}
                </div>
            </div>
            <div>
                <label>Last Name:</label>
                <input placeholder="Last Name" name="lastName" type="text" value={state.lastName} onChange={handleChange} />
                <div className='ui error message header' style={{ width: '25vw', fontSize: '1em' }}>
                    {errorState.lastName}
                </div>
            </div>
            <div>
                <label>ID:</label>
                <input placeholder="User ID" name="ID" type="text" value={state.ID} onChange={handleChange} />
                <div className='ui error message header' style={{ width: '25vw', fontSize: '1em' }}>
                    {errorState.ID}
                </div>
            </div>
            <div>
                {classNameJsx ? classNameJsx(handleChange, state.className, errorState.className) : null}
            </div>
            <div>
                <label htmlFor="gender">Gender</label>
                <select name="gender" defaultValue={0} onChange={handleChange}>
                    {genderChoosen()}
                </select>
                <div className='ui error message header' style={{ width: '25vw', fontSize: '1em' }}>
                    {errorState.gender}
                </div>
            </div>
            <div>
                <label>Username:</label>
                <input placeholder="Username" name="username" type="text" value={state.username} onChange={handleChange} />
                <div className='ui error message header' style={{ width: '25vw', fontSize: '1em' }}>
                    {errorState.username}
                </div>
            </div>
            <br />
            <div>
                <label>Password:</label>
                <input placeholder="Password" name='password' type="text" value={state.password} onChange={handleChange} />
                <div className='ui error message header' style={{ width: '25vw', fontSize: '1em' }}>
                    {errorState.password}
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

export default AddNewUser;