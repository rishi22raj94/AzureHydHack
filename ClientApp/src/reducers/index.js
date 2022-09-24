import { combineReducers } from "redux";
import { learning } from "./learning";
import { login } from "./login";
import { userDetails } from "./userDetails";
import { directory } from "./directory";


export const reducers = combineReducers({
    learning,
    login,
    userDetails,
    directory
})