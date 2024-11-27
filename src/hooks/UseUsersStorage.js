import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "react-native-toast-notifications";
import ApiService from "../services/ApiService";

const PERSON_LOCAL_KEY = "@My-users-local";

export default function UseUsersStorage() {
  const toast = useToast();

  // Descargar usuarios desde el servidor y guardar en AsyncStorage
  const handleFetchUsersFromApi = async () => {
    try {
      const response = await ApiService.getAllUsers();
      if (response.data) {
        const serverUsers = response.data.map((user) => ({
          ...user,
          synced: true,
        }));

        await AsyncStorage.setItem(PERSON_LOCAL_KEY, JSON.stringify(serverUsers));
        return serverUsers;
      }
      return [];
    } catch (error) {
      toast.show("Error al obtener los usuarios desde el servidor", { type: "danger" });
      return [];
    }
  };

  // Obtener usuarios desde AsyncStorage
  const handleGetLocalUsers = async () => {
    try {
      const users = await AsyncStorage.getItem(PERSON_LOCAL_KEY);
      return users ? JSON.parse(users) : [];
      
    } catch (error) {
      toast.show("Error al cargar usuarios locales", { type: "danger" });
      return [];
    }
  };

  return {
    handleFetchUsersFromApi,
    handleGetLocalUsers,
  };
}
