import api from '../api/axios'

export default {

    // request persons
    getAllPersons(){
        return api.get('/persons')
    },
    createPerson(data){
        return api.post('/persons', data)
    },
    updatePerson(id, data){
        return api.put(`/persons/${id}`, data)
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
    sendWhatsApps(cellphones, message) {
        return api.post("/persons/send-whatsapp", {
            cellphones: cellphones,
            message: message   
        });
    } 

    

}