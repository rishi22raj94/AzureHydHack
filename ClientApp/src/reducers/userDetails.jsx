import { ACTION_TYPES } from "../actions/userDetails";
const initialState = {
    list: [],
    deletedUser: []
}

export const userDetails = (state = initialState, action) => {

    switch (action.type) {
        case ACTION_TYPES.FETCH_BY_ID:
            return {
                ...state,
                list: [...action.payload]
            }        

        case ACTION_TYPES.UPDATE:
            return {
                ...state,
                /*list: state.list.map(x => x.id === action.payload.id ? action.payload : x)*/
                list: [action.payload]
            }     

        case ACTION_TYPES.DELETE_USER:
            return {
                ...state,                
                deletedUser: [action.payload]
            }     

        default:
            return initialState
    }
}