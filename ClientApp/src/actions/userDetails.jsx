import api from "./userDetailsApi";

export const ACTION_TYPES = {   
    UPDATE: 'UPDATE',    
    FETCH_BY_ID: 'FETCH_BY_ID',
    DELETE_USER: 'DELETE_USER'
}

export const fetchById = (id, onSuccess) => dispatch => {
    api.userDetails().fetchById(id)
        .then(response => {
            dispatch({
                type: ACTION_TYPES.FETCH_ALL,
                payload: response.data
            })
            onSuccess()
        })
        .catch(err => console.log(err))
}

export const update = (data, onSuccess) => dispatch => {
    api.userDetails().update(data)
        .then(res => {
            dispatch({
                type: ACTION_TYPES.UPDATE,
                payload: res.data
            })
            onSuccess()
        })
        .catch(err => console.log(err))
}

export const deleteUser = (data) => dispatch => {
    api.userDetails().deleteUser(data)
        .then(res => {
            dispatch({
                type: ACTION_TYPES.DELETE_USER,
                payload: res.data
            })            
        })
        .catch(err => console.log(err))
}