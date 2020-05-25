// import _ from 'lodash';
export default (state = {}, action) => {
    switch (action.type) {
        case 'GET_MATERIALS':
            return { ...action.payload };
        default:
            return state;
    }
}