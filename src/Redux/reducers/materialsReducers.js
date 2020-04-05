import _ from 'lodash';
export default (state = {}, action) => {
    switch (action.type) {
        case 'GET_MATERIALS':
            return { ...state, ..._.mapKeys(action.payload, 'id') };
        case 'CREATE_MATERIAL':
            return { ...state, [action.payload.id]: action.payload };
        case 'DELETE_MATERIAL':
            return _.omit(state, action.payload);
        default:
            return state;
    }

}