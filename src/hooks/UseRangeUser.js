import ApiService from "../services/ApiService"
import { useToast } from "react-native-toast-notifications";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_LOCAL_RANGES = '@My-ranges'

export default function UseRangeUser() {

    const toast = useToast();

    //test network
    const isOnline = async () => {
        const { isConnected } = await NetInfo.fetch();
        return isConnected;
    }

    //function to admin and coordinators
    const saveRangeUser = async (rangeData, rangeSelected, updateAdmin) => {
        console.log('range selected', rangeData)
        try {
            await ApiService.createNewRangeUser(rangeData)
            updateAdmin && await ApiService.updateRageCity(rangeSelected.id, rangeSelected)
            !updateAdmin && await ApiService.updateRangeUser(rangeSelected.id, rangeSelected)

            return toast.show('Rango asignado correctamente 😉', { type: 'success', style: { backgroundColor: "#00bfa5" } })
        } catch (error) {
            console.log(error.response.data.messages);
            return toast.show("Error al asignar el rango 😨", { type: "danger" });
        }

    }

    //add ranges to local
    async function getRangeUserLocal() {
        try {
            const rangesLocal = await AsyncStorage.getItem(USER_LOCAL_RANGES);
            if (rangesLocal) {
                const usersParsed = JSON.parse(rangesLocal);
                return usersParsed;
            }
            return [];
        } catch (error) {
            console.error("Error al obtener los rangos locales:", error);
            return [];
        }
    }

    const setRangeUserLocal = async (existRageLocals, userId) => {

        if (!isOnline()) {
            return toast.show("No hay conexión 📡", { type: "danger" });
        }

        let dataLocal = await getRangeUserLocal()

        try {
            validate = dataLocal.length ? true : false
            if (validate === existRageLocals) {
                const { data } = await ApiService.getAllRangeUsers()
                const dataUser = data.filter(range => range.user_id === userId)
                if (!dataUser.length) {
                    return toast.show("No tienes rangos asignados 😨", { type: "danger" });
                }
                await AsyncStorage.setItem(USER_LOCAL_RANGES, JSON.stringify(dataUser));
                return toast.show('Rangos disponibles, bienvenido 😉', { type: 'success', style: { backgroundColor: "#00bfa5" } })
            } else {
                console.log('si hay datos previos');
            }


        } catch (error) {
            console.log(error);

        }
    }

    const updateRanges = async (rangeUpdate) => {
        const isOnlineNow = await isOnline()
        if (isOnlineNow) {
            try {
                await ApiService.updateRangeUser(rangeUpdate.id, rangeUpdate)
            } catch (error) {
                console.log(error)
            }
        }
    }

    const updateRangesLocals = async (rangeUpdate) => {
        const currentSavedRanges = await AsyncStorage.getItem(USER_LOCAL_RANGES)
        const parsedRanges = JSON.parse(currentSavedRanges)

        const rangesIndex = parsedRanges.findIndex(range => +range.id === +rangeUpdate.id)
        if (rangesIndex === -1) {
            return toast.show('Rango no encontrado 😨', { type: 'danger' })
        }
        parsedRanges[rangesIndex] = {
            ...parsedRanges[rangesIndex],
            ...rangeUpdate
        }
        await AsyncStorage.setItem(USER_LOCAL_RANGES, JSON.stringify(parsedRanges))
        await updateRanges(rangeUpdate)
        return
    }

    const syncRangeUserLocal = async (id) => {
        const isOnlineNow = await isOnline()
        if (isOnlineNow) {
            try {
                //pedir el id del usuario
                console.log('user id sync  ', id)
                //traer los rangos del server
                const { data } = await ApiService.getAllRangeUsers()

                //filtrar los rangos del usuario por id
                const rangeUserServer = data.filter(range => range.user_id === id)
                console.log('range user sync server', rangeUserServer)

                //traer los rangos de local
                const rangeUserLocal = await getRangeUserLocal()
                console.log('range user local', rangeUserLocal)

                // Obtener IDs de los rangos locales
                const localRangeIds = rangeUserLocal.map(range => range.id);
                console.log('id ranges locals', localRangeIds)

                // Filtrar rangos nuevos desde el servidor
                const newRanges = rangeUserServer.filter(range => !localRangeIds.includes(range.id));
                console.log('New ranges to add:', newRanges);

                if (!newRanges.length) {
                    return toast.show('No hay rangos por descargar 👌', { type: 'warning' })
                } else {
                    // Combinar los rangos locales con los nuevos
                    const updatedRanges = [...rangeUserLocal, ...newRanges];

                    // Guardar los datos actualizados en el almacenamiento local
                    await AsyncStorage.setItem(USER_LOCAL_RANGES, JSON.stringify(updatedRanges));
                    return toast.show('Sincronización exitosa ✅', { type: 'success', style: { backgroundColor: "#00bfa5" } })
                }

            } catch (error) {
                return toast.show('Error al sincronizar 😨', { type: 'danger' })
                console.log(error)
            }
        } else {
            return toast.show('Sin conexión 📡', { type: 'danger' })
        }
    }

    const syncRangeUserServer = async()=>{
        //traer los rangos de local
        const rangeUserLocal = await getRangeUserLocal()
        console.log('range user local', rangeUserLocal)
        // Obtener IDs de los rangos locales
        await rangeUserLocal.map(range => {
            syncServer(range.id, range)
        });
    }

    async function syncServer(id, data){
        await ApiService.updateRangeUser(id, data)
    }

    return {
        setRangeUserLocal,
        saveRangeUser,
        updateRangesLocals,
        syncRangeUserLocal,
        syncRangeUserServer
    }
}