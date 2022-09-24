import axios from "axios";

const baseUrl = "/users/"

//axios.defaults.headers.common['API-Key'] = '92cae9ab6c9f4bbdadc574a9298b749c'

export default {

    userDetails(url = baseUrl) {
        return {            
            fetchById: id => axios.get(url + "Details/" + id),            
            update: updateRecord => axios.put(url + "Edit", updateRecord),
            deleteUser: deleteRecordId => axios.delete(url + "DeleteUser?deleteRecordId=" + deleteRecordId)
        }
    }
}