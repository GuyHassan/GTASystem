import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import userReducers from './userReducers';
import materialsReducers from './materialsReducers';

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

export default combineReducers({
    form: formReducer,
    listOfUsers: userReducers,
    materials: materialsReducers,
    whoIsOnline: currentUserReducer
});

