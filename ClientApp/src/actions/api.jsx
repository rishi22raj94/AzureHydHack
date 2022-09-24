import axios from "axios";

const baseUrl = "/users/"

//axios.defaults.headers.common['API-Key'] = '92cae9ab6c9f4bbdadc574a9298b749c'

export default {

    learning(url = baseUrl) {
        return {
            fetchAll: () => axios.get(url + "Index"),
            fetchById: id => axios.get(url + "Details/" + id),
            create: newRecord => axios.post(url + "Create", newRecord),
            update: (id, updateRecord) => axios.put(url + "Edit/" + id, updateRecord),            
            delete: id => axios.delete(url + "DeleteConfirmed/" + id)
        }
    }
}