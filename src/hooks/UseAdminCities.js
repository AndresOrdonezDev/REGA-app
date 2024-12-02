import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiService from "../services/ApiService"
import NetInfo from "@react-native-community/netinfo";
import { useToast } from "react-native-toast-notifications";
import { useCallback } from "react";
const CITY_LOCAL_KEY = '@my-cities'

export default function UseAdminRangeCities() {
    const toast = useToast();

    const handleSync = useCallback(async () => {
        const { isConnected } = await NetInfo.fetch();
        return isConnected;
    }, []);

    const getRangesCitiesLocal = async () => {
        try {
            const { data } = await ApiService.getAllRangeCity()

            await AsyncStorage.setItem(CITY_LOCAL_KEY, JSON.stringify(data))
            const rangeCitiesLocal = await AsyncStorage.getItem(CITY_LOCAL_KEY)
            const citiesParsed = rangeCitiesLocal ? JSON.parse(rangeCitiesLocal) : []
            return citiesParsed ? citiesParsed : data
        } catch (error) {
            return toast.show("Error al descargar los datos 😨", { type: "danger" });
        }
    }

    const handleSaveRangeCity = useCallback(async (dataRangeCity) => {
        try {
            if (await handleSync()) {
                await ApiService.createNewRangeCity(dataRangeCity)
                await saveRangesCitiesLocal(dataRangeCity)
                toast.show('Rango asignado correctamente 😉', { type: 'success', style: { backgroundColor: "#00bfa5" } })
            } else {
                return toast.show("Sin conexión a internet 📡", { type: "danger" });
            }
        } catch (error) {
           
            console.log(error.response.data.message);
            return toast.show("Error al guardar el rango 😨", { type: "danger" });
        }
    }, []);

    const saveRangesCitiesLocal = async (dataRangeCity) => {
        const currentSavedCities = await AsyncStorage.getItem(CITY_LOCAL_KEY)
        const parsedCities = currentSavedCities ? JSON.parse(currentSavedCities) : []
        const updateCities = Array.isArray(parsedCities) ? [...parsedCities, dataRangeCity] : [data]
        await AsyncStorage.setItem(CITY_LOCAL_KEY, JSON.stringify(updateCities))
        return
    }

    const inactiveRangeCity = async (prevDataCty) => {
        const { id, range_end } = prevDataCty

        try {
            await ApiService.updateRageCity(id, prevDataCty)
            const currentSavedCities = await AsyncStorage.getItem(CITY_LOCAL_KEY)
            const parsedCities = currentSavedCities ? JSON.parse(currentSavedCities) : []
            const prevCity = parsedCities.filter(city => +city.range_end !== range_end)       
            const newData = [...prevCity, prevDataCty]
            await AsyncStorage.setItem(CITY_LOCAL_KEY, JSON.stringify(newData))
        } catch (error) {
            console.log(error.response.data.message);

        }

    }


    return {
        handleSync,
        handleSaveRangeCity,
        getRangesCitiesLocal,
        inactiveRangeCity
    }
}