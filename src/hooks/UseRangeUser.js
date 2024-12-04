import ApiService from "../services/ApiService"
import { useToast } from "react-native-toast-notifications";
export default function UseRangeUser(){

    const toast = useToast();

    const saveRangeUser = async (rangeData,rangeSelected,updateAdmin)=>{
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

    return{

        saveRangeUser
    }
}