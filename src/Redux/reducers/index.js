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
const learnings = (state = [], action) => {
    // console.log(state, action)
    switch (action.type) {
        case 'GET_CLASSES':
            return [...action.payload]
        case 'GET_PROFESSIONS':
            return [...action.payload]
        default:
            return state;
    }
}
const students = (state = {}, action) => {
    switch (action.type) {
        case 'GET_STUDENTS':
            return { ...state, ...action.payload }
        default:
            return state;
    }
}
export default combineReducers({
    form: formReducer,
    materials: materialsReducers,
    whoIsOnline: currentUserReducer,
    learningProperties: learnings,
    students
});

