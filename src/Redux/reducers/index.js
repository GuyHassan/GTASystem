import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import materialsReducers from './materialsReducers';
// import _ from 'lodash';

const currentUserReducer = (state = {}, action) => {
    switch (action.type) {
        case 'SIGN_IN':
            return { ...state, ...action.payload, isLoggedIn: true }
        case 'SIGN_OUT':
            return { ...state, userID: null, isLoggedIn: false }
        default:
            return state
    }
}
const classes = (state = [], action) => {
    switch (action.type) {
        case 'GET_CLASSES':
            return [...action.payload]
        default:
            return state;
    }
}
const profession = (state = [], action) => {
    switch (action.type) {
        case 'GET_PROFESSIONS':
            return [...action.payload]
        default:
            return state;
    }
}

const students = (state = {}, action) => {
    switch (action.type) {
        case 'GET_STUDENTS':
            return [...action.payload]
        default:
            return state;
    }
}
export default combineReducers({
    form: formReducer,
    whoIsOnline: currentUserReducer,
    materials: materialsReducers,
    classes,
    profession,
    students
});

