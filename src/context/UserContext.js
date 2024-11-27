import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const storedUser = await AsyncStorage.getItem("@Auth-user");
    if (storedUser) {
      return setUser(JSON.parse(storedUser)); // Cargar usuario del almacenamiento
    }else{
      return setUser(JSON.parse([]))
    }
    
  };
  const logout = async () => {
    await AsyncStorage.removeItem("@Auth-user"); // Eliminar usuario del almacenamiento
    setUser(null); // Limpiar usuario del estado
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};