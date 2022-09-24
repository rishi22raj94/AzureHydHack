import api from "./Loginapi";

export const ACTION_TYPES = {
    POST: 'POST',
    RESETPASSWORD: 'RESETPASSWORD',
    GMAIL: 'GMAIL'
}

export const post = (data) => dispatch => {
    
    api.login().post(data)
        .then(res => {
            dispatch({
                type: ACTION_TYPES.POST,
                payload: res.data
            })            
        })
        .catch(err => console.log(err))
}

export const resetPassword = (data) => dispatch => {
    api.login().resetPassword(data)
        .then(response => {
            dispatch({
                type: ACTION_TYPES.RESETPASSWORD,
                payload: response.data
            })
        })
        .catch(err => console.log(err))
}

export const gmail = (data) => dispatch => {
    api.login().gmail(data)
        .then(response => {
            dispatch({
                type: ACTION_TYPES.GMAIL,
                payload: response.data
            })
        })
        .catch(err => console.log(err))
}