import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
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
    materials: materialsReducers,
    whoIsOnline: currentUserReducer
});

