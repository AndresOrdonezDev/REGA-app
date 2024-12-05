import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiService from '../services/ApiService'

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const USER_LOCAL_RANGES = '@My-ranges'
  const [user, setUser] = useState(null);
  const [rangeCitiesMain, setRangeCitiesMain] = useState([])
  const [rangeByUser, setRangeByUser] = useState([])
  const [rangeByUserLocal, setRangeByUserLocal] = useState([])

  useEffect(() => {
    
    fetchUser();
    getAllRangeCities()
    getAllRangeByUser()
    getRangeUserLocal()
  }, []);

  const testSetItem = async()=>{
    await AsyncStorage.setItem(USER_LOCAL_RANGES, JSON.stringify([]));
  }

  const fetchUser = async () => {
    const storedUser = await AsyncStorage.getItem("@Auth-user");
    if (storedUser) {
      return setUser(JSON.parse(storedUser)); // Cargar usuario del almacenamiento
    } else {
      return setUser(JSON.parse([]))
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("@Auth-user"); // Eliminar usuario del almacenamiento
    setUser(null); // Limpiar usuario del estado
  };

  const getAllRangeCities = async () => {
    try {
      const { data } = await ApiService.getAllRangeCity()
      setRangeCitiesMain(data)

    } catch (error) {
      console.log('error al obtener los rangos de ciudades');

      return
    }
  }

  const getAllRangeByUser = async () => {
    try {
      const { data } = await ApiService.getAllRangeUsers()
      setRangeByUser(data)
      return data
    } catch (error) {
      console.log('error al obtener los rangos de usuarios');

      return
    }
  }

  async function getRangeUserLocal() {
    try {
      const rangesLocal = await AsyncStorage.getItem(USER_LOCAL_RANGES);
      if (rangesLocal) {
        const usersParsed = JSON.parse(rangesLocal);
        setRangeByUserLocal(usersParsed)
        return usersParsed;
      }
      return [];
    } catch (error) {
      console.error("Error al obtener los rangos locales:", error);
      return [];
    }
  }

  return (
    <UserContext.Provider
      value={{
        setUser,
        logout,
        fetchUser,
        getAllRangeCities,
        getAllRangeByUser,
        getRangeUserLocal,
        user,
        rangeCitiesMain,
        rangeByUser,
        rangeByUserLocal
      }}>
      {children}
    </UserContext.Provider>
  );
};