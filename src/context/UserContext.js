import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiService from '../services/ApiService'

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [rangeCitiesMain, setRangeCitiesMain] = useState([])

  useEffect(() => {
    fetchUser();
    getAllRangeCities()
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

  const getAllRangeCities = async()=>{
    const {data} = await ApiService.getAllRangeCity()
    setRangeCitiesMain(data)
  }

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        setUser, 
        logout, 
        fetchUser,
        rangeCitiesMain
      }}>
      {children}
    </UserContext.Provider>
  );
};