import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useCallback } from "react";
import { useToast } from "react-native-toast-notifications";
import NetInfo from "@react-native-community/netinfo";
import ApiService from "../services/ApiService";
const USER_LOCAL_KEY = '@My-persons-local';
const USER_LOCAL_ADMIN_KEY = '@My-persons-admin-local';

export default function UsePersonsStorage() {

    const [totalPersonsLocal, setTotalPersonLocal] = useState([])
    const toast = useToast();

    let persons = []

    const handleSync = useCallback(async () => {
        const { isConnected } = await NetInfo.fetch();
        return isConnected;
    }, []);


    const handleSavePerson = useCallback(async (person) => {
        try {
            const { is_synced } = person
            if (is_synced === '1') {
                await sendDataServer(person)
                await handleSaveRecordLocal(person)
            } else {
                await handleSaveRecordLocal(person)
            }
            await handleGetPersons()
        } catch (error) {
            console.error("Error al guardar el Registro:", error);
            return toast.show("Error al guardar el Registro", { type: "error" });
        }
    }, []);

    const handleGetPersons = async () => {
        try {
            const usersLocal = await AsyncStorage.getItem(USER_LOCAL_KEY);
            if (usersLocal) {
                const usersParsed = JSON.parse(usersLocal);
                persons = usersParsed
                return usersParsed;
            }

            setTotalPersonLocal(persons)
            return [];
        } catch (error) {
            console.error("Error al obtener los registros:", error);
            return [];
        }
    };

    const handleGetPersonsAdmin = async () => {
        try {

            if (await handleSync()) {
                handleGetPersonsAdminsServer()
            }

            const usersLocal = await AsyncStorage.getItem(USER_LOCAL_ADMIN_KEY);
            if (usersLocal) {
                const usersParsed = JSON.parse(usersLocal);
                persons = usersParsed
                return usersParsed;
            }

            setTotalPersonLocal(persons)
            return [];
        } catch (error) {
            console.error("Error al obtener los registros:", error);
            return [];
        }
    };

    const handleGetPersonsAdminsServer = async () => {

        try {
            const { data } = await ApiService.getAllPersons()
            return await AsyncStorage.setItem(USER_LOCAL_ADMIN_KEY, JSON.stringify(data));

        } catch (error) {
            console.error("Error al obtener los registros admin:", error);
            return
        }
    }

    const handleUpdatePerson = async (person, prevSynced) => {
        try {

            const { is_synced, idLocal } = person
            if (is_synced === '1') {
                if (!prevSynced) {
                    await sendDataServer(person)
                } else {
                    await updatePersonServer(idLocal, person)
                }
                await handleUpdateLocal(person)
            } else {
                await handleUpdateLocal(person)
            }
            // await handleGetPersons()
        } catch (error) {
            console.error(error)
            return toast.show("Error al actualizar 😨", { type: "danger" });
        }
    }

    const handleDeleteUser = async (idLocal, userRol) => {

        if (userRol === 'Administrador') {
            await deletePersonAdmin(idLocal)
            await handleGetPersonsAdmin()
        } else {
            await deletePersonRegister(idLocal)
            await handleGetPerson()
        }

    }

    async function sendDataServer(person) {
        const { data } = await ApiService.createPerson(person)
        return data
    }

    async function handleSaveRecordLocal(data) {
        const currentSavedUsers = await AsyncStorage.getItem(USER_LOCAL_KEY);
        const parsedUsers = currentSavedUsers ? JSON.parse(currentSavedUsers) : [];
        const updatedUsers = Array.isArray(parsedUsers) ? [...parsedUsers, data] : [data];
        await AsyncStorage.setItem(USER_LOCAL_KEY, JSON.stringify(updatedUsers));
        return toast.show("Registro Guardado con éxito 👌", {
            type: "success",
            style: { backgroundColor: "#00bfa5" },
        });
    }

    async function updatePersonServer(idLocal, person) {
        const { data } = await ApiService.updatePerson(idLocal, person)
        return data
    }

    async function handleUpdateLocal(data) {

        const currentSavedUsers = await AsyncStorage.getItem(USER_LOCAL_KEY)
        const parsedUsers = JSON.parse(currentSavedUsers)

        const userIndex = parsedUsers.findIndex(user => user.idLocal === data.idLocal)

        if (userIndex === -1) {
            return toast.show('Persona no encontrada', { type: 'error' })
        }
        parsedUsers[userIndex] = {
            ...parsedUsers[userIndex],
            ...data
        }
        await AsyncStorage.setItem(USER_LOCAL_KEY, JSON.stringify(parsedUsers))
        return toast.show('Registro actualizado correctamente 😉', { type: 'success', style: { backgroundColor: "#00bfa5" } })
    }

    async function handleGetPerson(id) {
        try {
            const response = await ApiService.getPerson(id);
            if (response.status === 200) {
                return true;
            }
        } catch (error) {
            return error.response.data.messages.error === 'Persona no encontrada.' ? false : true;
        }
    }

    async function deletePersonAdmin(idLocal) {
        try {
            const currentSavedUsers = await AsyncStorage.getItem(USER_LOCAL_ADMIN_KEY)
            const parsedUsers = JSON.parse(currentSavedUsers)
            const userIndex = parsedUsers.findIndex(user => user.idLocal === idLocal)

            if (userIndex === -1) {
                return toast.show('Persona no encontrada 😨', { type: "danger" })
            }

            // Filter user to delete
            const { data } = await ApiService.deletePerson(idLocal)
            if (data.status === 200) {
                const updatedUsers = parsedUsers.filter(user => user.idLocal !== idLocal)
                await AsyncStorage.setItem(USER_LOCAL_ADMIN_KEY, JSON.stringify(updatedUsers))
                return toast.show('Registro eliminado correctamente 😉', { type: 'success', style: { backgroundColor: "#00bfa5" } })
            } else {
                return toast.show("Error al eliminar 😨", { type: "error" });
            }

        } catch (error) {
            console.error(error)
            return toast.show("Error al eliminar 😨", { type: "error" });
        }
    }

    async function deletePersonRegister(idLocal) {
        try {
            const currentSavedUsers = await AsyncStorage.getItem(USER_LOCAL_KEY)
            const parsedUsers = JSON.parse(currentSavedUsers)
            const userIndex = parsedUsers.findIndex(user => user.idLocal === idLocal)

            if (userIndex === -1) {
                return toast.show('Persona no encontrada 😨', { type: "danger" })
            }
            // Filter user to delete
            try {
                const updatedUsers = parsedUsers.filter(user => user.idLocal !== idLocal)
                await AsyncStorage.setItem(USER_LOCAL_KEY, JSON.stringify(updatedUsers))
                return toast.show('Registro eliminado correctamente 😉', { type: 'success', style: { backgroundColor: "#00bfa5" } })
            } catch (error) {
                return toast.show("Error al eliminar 😨", { type: "error" });
            }
        } catch (error) {
            console.error(error)
            return toast.show("Error al eliminar 😨", { type: "error" });
        }
    }

    // only use to tests
    // const resetApp = async()=>{
    //     await AsyncStorage.setItem(USER_LOCAL_KEY, JSON.stringify([]));
    //     await handleGetPersons()
    // }

    return {
        handleSavePerson,
        handleGetPersons,
        handleUpdatePerson,
        handleUpdateLocal,
        handleDeleteUser,
        handleSync,
        sendDataServer,
        handleGetPersonsAdmin,
        handleGetPerson,
        totalPersonsLocal,
    };
}
