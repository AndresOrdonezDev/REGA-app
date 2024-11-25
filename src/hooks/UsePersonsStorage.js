import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useCallback, useEffect } from "react";
import { useToast } from "react-native-toast-notifications";
import NetInfo from "@react-native-community/netinfo";
import ApiService from "../services/ApiService";
const USER_LOCAL_KEY = '@My-persons-local';

export default function UsePersonsStorage() {
    const [totalUserLocal, setTotalUserLocal] = useState(0)
    const [pendingRecords, setPendingRecords ] = useState([])
    const [totalPending, setTotalPending] = useState(0)

    useEffect(()=>{
        const pending = pendingRecords.filter(user => user.is_synced === '0')
        setTotalPending(pending.length)    
    },[pendingRecords] )

    const handleSync = useCallback(async () => {
        const { isConnected } = await NetInfo.fetch();
        return isConnected;
    }, []);

    const toast = useToast();

    const handleSaveUser = useCallback(async (data) => {
        try {
            const currentSavedUsers = await AsyncStorage.getItem(USER_LOCAL_KEY);
            const parsedUsers = currentSavedUsers ? JSON.parse(currentSavedUsers) : [];
            const updatedUsers = Array.isArray(parsedUsers) ? [...parsedUsers, data] : [data];
            await AsyncStorage.setItem(USER_LOCAL_KEY, JSON.stringify(updatedUsers));
            return toast.show("Registro Guardado con éxito 👌", {
                type: "success",
                style: { backgroundColor: "#00bfa5" },
            });
        } catch (error) {
            console.error("Error al guardar el Registro:", error);
            return toast.show("Error al guardar el Registro", { type: "error" });
        }
    }, []);

    const handleGetUser = useCallback(async () => {
        try {
            const usersLocal = await AsyncStorage.getItem(USER_LOCAL_KEY);
            if (usersLocal) {
                const usersParsed = JSON.parse(usersLocal);
                setTotalUserLocal(usersParsed.length);
                setPendingRecords(usersParsed);
                return usersParsed;
            }
            return [];
        } catch (error) {
            console.error("Error al obtener los registros:", error);
            return [];
        }
    }, []);

    const handleUpdateUser = async (data) => {
        try {
            const currentSavedUsers = await AsyncStorage.getItem(USER_LOCAL_KEY)
            const parsedUsers = JSON.parse(currentSavedUsers)

            const userIndex = parsedUsers.findIndex(user => user.document_number === data.document_number)

            if (userIndex === -1) {
                return toast.show('Persona no encontrada', { type: 'error' })
            }

            parsedUsers[userIndex] = {
                ...parsedUsers[userIndex],
                ...data
            }

            await AsyncStorage.setItem(USER_LOCAL_KEY, JSON.stringify(parsedUsers))
            return toast.show('Registro actualizado correctamente 😉', { type: 'success', style: { backgroundColor: "#00bfa5" } })

        } catch (error) {
            console.error(error)
            return toast.show("Error al actualizar", { type: "error" });
        }
    }

    const handleDeleteUser = async (document_number) => {
        try {
            console.log('documet_number', document_number )
            const currentSavedUsers = await AsyncStorage.getItem(USER_LOCAL_KEY)
            const parsedUsers = JSON.parse(currentSavedUsers)
            const userIndex = parsedUsers.findIndex(user => user.document_number === document_number)

            if (userIndex === -1) {
                return toast.show('Persona no encontrada', { type: 'error' })
            }

            // Filter user to delete
            const updatedUsers = parsedUsers.filter(user => user.document_number !== document_number)

            await AsyncStorage.setItem(USER_LOCAL_KEY, JSON.stringify(updatedUsers))
            return toast.show('Registro eliminado correctamente', { type: 'success', style: { backgroundColor: "#00bfa5" }  })
        } catch (error) {
            console.error(error)
            return toast.show("Error al eliminar", { type: "error" });
        }
    }

    const sendDataServer = async(data)=>{
        await ApiService.createPerson(data)
    }

    // only use to tests
    // const resetApp = async()=>{
    //     await AsyncStorage.setItem(USER_LOCAL_KEY, JSON.stringify([]));
    //     await handleGetUser()
    // }

    return {
        handleSaveUser,
        handleGetUser,
        handleUpdateUser,
        handleDeleteUser,
        handleSync,
        sendDataServer,
        totalUserLocal,
        pendingRecords,
        totalPending
    };
}
