import { ACTION_TYPES } from "../actions/Login";
const initialState = {
    login: [],
    auth: false,
    id: '',
    userDetails: '',
    resetPassword: [],
    gmailLogin: []
}


export const login = (state = initialState, action) => {

    switch (action.type) {
        case ACTION_TYPES.POST:
            return {
                ...state,
                auth: action.payload.login_successful,
                id: action.payload.id,
                userDetails: JSON.stringify(action.payload.userDetails),
                imageSrc: action.payload.imageSrc,
                login: [action.payload]
            }

        case ACTION_TYPES.RESETPASSWORD:
            return {
                ...state,
                resetPassword: [action.payload]
            }

        case ACTION_TYPES.GMAIL:
            return {
                ...state,                
                auth: action.payload.login_successful,
                id: action.payload.id,
                userDetails: JSON.stringify(action.payload.userDetails),
                imageSrc: action.payload.imageSrc,
                gmailLogin: [action.payload]
            }
       
        default:
            return state
    }
}