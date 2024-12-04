import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "react-native-toast-notifications";
import ApiService from "../services/ApiService";

const ROLES_LOCAL_KEY = "@My-roles-local";

export default function UseRolesStorage() {
  const toast = useToast();

  // Obtener roles desde el API
  const handleFetchRolesFromApi = async () => {
    try {
      const response = await ApiService.getAllRoles(); // Llamar al endpoint
      if (response.status === 200 && response.data) {
        const roles = response.data;
        console.log('roles from api', roles)
        // Guardar roles en AsyncStorage
        await AsyncStorage.setItem(ROLES_LOCAL_KEY, JSON.stringify(roles));

        return roles;
      } else {
        throw new Error("Error al obtener roles desde el servidor");
      }
    } catch (error) {
      toast.show("Error al obtener roles desde el servidor", { type: "error" });
      console.error("Error fetching roles:", error);
      return [];
    }
  };

  // Obtener roles desde AsyncStorage
  const handleGetLocalRoles = async () => {
    try {
      const localRoles = await AsyncStorage.getItem(ROLES_LOCAL_KEY);
      return localRoles ? JSON.parse(localRoles) : [];
    } catch (error) {
      toast.show("Error al cargar roles locales", { type: "error" });
      console.error("Error loading local roles:", error);
      return [];
    }
  };

  return {
    handleFetchRolesFromApi,
    handleGetLocalRoles,
  };
}