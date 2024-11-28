import api from '../api/axios'

export default {

    // request persons
    getAllPersons(){
        return api.get('/persons')
    },
    getPerson(id){
        return api.get(`/persons/${id}`)
    },
    createPerson(data){
        return api.post('/persons', data)
    },
    updatePerson(id, data){
        return api.put(`/persons/${id}`, data)
    },
    deletePerson(id){
        return api.delete(`/persons/${id}`)
    },

    //request login
    login(data){
        return api.post("/auth", data);
    },
    registerUser(user){
        return api.post('/users', user)
    },

    //request users
    getAllUsers(){
        return api.get('/users')
    },
    updateUser(id, data){
        return api.put(`/users/${id}`, data)
    },
    getAllRoles(){
        return api.get("/roles")
    },

    //request process admin
    sendWhatsApps(data) {
        return api.post("/persons/send-whatsapp", data);
    } 

    

}