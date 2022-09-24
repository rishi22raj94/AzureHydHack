import axios from "axios";

const baseUrl = "/signin/"

export default {

    login(url = baseUrl) {
        return {            
            post: newRecord => axios.post(url + "Login", newRecord),
            resetPassword: resetPasswordRecord => axios.post(url + "ForgotPassword", resetPasswordRecord),
            gmail: userObj => axios.post(url + "ExternalLogin", userObj)
        }
    }
}