import api from '../api/axios'

export default {

    getAllPersons(){
        return api.get('/persons')
    },
    createPerson(data){
        return api.post('/persons', data)
    },

    login(data){
        return api.post("/auth", data);
    }

    

}