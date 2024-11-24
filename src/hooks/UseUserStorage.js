import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { useToast } from "react-native-toast-notifications";
const USER_LOCAL_KEY = '@My-users-local';

export default function UseUserStorage() {
    
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
            return  toast.show("Usuario Guardado exitosamente", { type: "success" });
        } catch (error) {
            console.error('Error al guardar el usuario:', error);
            return toast.show("Error al guardar el usuario", { type: "error" });
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
            console.error('Error al obtener los usuarios:', error);
            return [];
        }
    };

    return {
        handleSaveUser,
        handleGetUser,
        totalUserLocal
    };
}
