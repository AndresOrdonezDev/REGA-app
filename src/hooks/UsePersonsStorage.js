import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { useToast } from "react-native-toast-notifications";
import NetInfo from "@react-native-community/netinfo";

const USER_LOCAL_KEY = '@My-users-local';

export default function UsePersonsStorage() {

    const handleSync = async () => {
        const {isConnected} = await NetInfo.fetch();
        if (isConnected) {
            //await handleSyncServerToLocal(); // Primero descargar datos del servidor
            //await handleSyncLocalToServer(); // Luego sincronizar datos locales al servidor
            toast.show("conexión a internet", { type: "success" });
        } else {
            toast.show("Sin conexión a internet. Sincronización no disponible.", { type: "warning" });
        }
    };

    const toast = useToast();

    const [totalUserLocal, setTotalUserLocal] = useState(0)

    const handleSaveUser = async (data) => {

        try {
            const currentSavedUsers = await AsyncStorage.getItem(USER_LOCAL_KEY);

            let updatedUsers = [];
            if (currentSavedUsers) {
                const parsedUsers = JSON.parse(currentSavedUsers);
                updatedUsers = Array.isArray(parsedUsers) ? parsedUsers : [];
            }

            updatedUsers.push(data);

            await AsyncStorage.setItem(USER_LOCAL_KEY, JSON.stringify(updatedUsers));
            return toast.show("Registro Guardado exitosamente", { type: "success", style: { backgroundColor: "#00bfa5" }  });
        } catch (error) {
            console.error('Error al guardar el Registro:', error);
            return toast.show("Error al guardar el Registro", { type: "error" });
        }
    };

    const handleGetUser = async () => {
        try {
            const usersLocal = await AsyncStorage.getItem(USER_LOCAL_KEY);
            if (usersLocal) {
                const usersParsed = JSON.parse(usersLocal);
                setTotalUserLocal(usersParsed.length)
                return usersParsed;
            }
            //validation to list user empty
            return [];
        } catch (error) {
            console.error('Error al obtener los registros:', error);
            return [];
        }
    };

    const handleUpdateUser = async (data) => {
        try {
            const currentSavedUsers = await AsyncStorage.getItem(USER_LOCAL_KEY)
            const parsedUsers = JSON.parse(currentSavedUsers)

            const userIndex = parsedUsers.findIndex(user => user.idNumber === data.idNumber)

            if (userIndex === -1) {
                return toast.show('Persona no encontrada', { type: 'error' })
            }

            parsedUsers[userIndex] = {
                ...parsedUsers[userIndex],
                ...data
            }

            await AsyncStorage.setItem(USER_LOCAL_KEY, JSON.stringify(parsedUsers))
            return toast.show('Registro actualizado correctamente', { type: 'success', style: { backgroundColor: "#00bfa5" } })

        } catch (error) {
            console.error(error)
            return toast.show("Error al actualizar", { type: "error" });
        }
    }

    const handleDeleteUser = async (idNumber) => {
        try {
            const currentSavedUsers = await AsyncStorage.getItem(USER_LOCAL_KEY)
            const parsedUsers = JSON.parse(currentSavedUsers)
            const userIndex = parsedUsers.findIndex(user => user.idNumber === idNumber)

            if (userIndex === -1) {
                return toast.show('Persona no encontrada', { type: 'error' })
            }

            // Filter user to delete
            const updatedUsers = parsedUsers.filter(user => user.idNumber !== idNumber)

            await AsyncStorage.setItem(USER_LOCAL_KEY, JSON.stringify(updatedUsers))
            return toast.show('Registro eliminado correctamente', { type: 'success', style: { backgroundColor: "#00bfa5" }  })
        } catch (error) {
            console.error(error)
            return toast.show("Error al eliminar", { type: "error" });
        }
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
        totalUserLocal
    };
}
