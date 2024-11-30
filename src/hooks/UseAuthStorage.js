
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useCallback } from "react";
import { useToast } from "react-native-toast-notifications";
import ApiService from "../services/ApiService";
import NetInfo from "@react-native-community/netinfo";

const AUTH_LOCAL_KEY = "@Auth-user"; // Clave para almacenar datos de autenticación

export default function UseAuthStorage() {
  const toast = useToast();
  const [authenticatedUser, setAuthenticatedUser] = useState(null); // Usuario autenticado
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  const handleSync = useCallback(async () => {
    const { isConnected } = await NetInfo.fetch();
    return isConnected;
}, []);

  // Iniciar sesión
  const handleLogin = async (cellphone, password) => {
    try {
      setIsLoading(true);

      // Validar credenciales en el servidor
      const response = await ApiService.login({ cellphone, password });

      if (response.status === 200) {
        const user = response.data;

        // Guardar usuario autenticado en AsyncStorage
        await AsyncStorage.setItem(AUTH_LOCAL_KEY, JSON.stringify(user));

        setAuthenticatedUser(user); // Actualizar usuario en el estado
        toast.show("Bienvenido 🎉", { type: "success",style: { backgroundColor: "#00bfa5" } });

        return user;
      } else {
        throw new Error("Credenciales inválidas");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      toast.show("Credenciales inválidas o error del servidor", { type: "danger" });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener usuario autenticado de AsyncStorage (para modo offline)
  const handleGetAuthenticatedUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(AUTH_LOCAL_KEY);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setAuthenticatedUser(parsedUser); // Establecer el usuario en el estado
        return parsedUser;
      }
      return null;
    } catch (error) {
      console.error("Error al obtener el usuario autenticado:", error);
      return null;
    }
  };

  // Cerrar sesión
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_LOCAL_KEY); // Eliminar datos de AsyncStorage
      setAuthenticatedUser(null); // Limpiar estado
      toast.show("Sesión cerrada exitosamente", { type: "success" });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.show("Error al cerrar sesión", { type: "danger" });
    }
  };

  //delete auth backend
  const handleDeleteAuth = async()=>{
      if(await handleSync()){
        return await ApiService.resetAuth()
      }
      return 
  }

  return {
    handleLogin, // Para iniciar sesión
    handleGetAuthenticatedUser, // Para obtener usuario autenticado
    handleLogout, // Para cerrar sesión
    handleDeleteAuth,
    authenticatedUser, // Usuario actualmente autenticado
    isLoading, // Estado de carga
  };
}