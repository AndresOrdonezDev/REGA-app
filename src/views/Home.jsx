import { useEffect, useState, useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useNavigation } from '@react-navigation/native'
import { Button, Icon } from '@rneui/themed'
// my functions
import UsePersonsStorage from "../hooks/UsePersonsStorage";
import { UserContext } from "../context/UserContext";
//components
import Header from "../components/Header";
import ProgressChart from "../components/ProgressChart";
import BarHorizontalChart from "../components/BarHorizontalChart";

export default function Home() {
    const { user } = useContext(UserContext);
    const { navigate } = useNavigation()
    const { handleGetPersons, handleGetPersonsAdmin } = UsePersonsStorage()
    const [totalAssigned, setTotalAssigned] = useState(0)
    const [totalRecords, setTotalRecords] = useState(0)
    const [cityData, setCityData] = useState({ cities: [], counts: [] });

    const handleAddUser = () => {
        navigate('usersList')
    }


    useEffect(() => {
        validateRolUser()
    }, [user]);


    const validateRolUser = async () => {

        if (user.user.role_name === 'Registrador') {
            setTotalAssigned(+user.user.range )
            const total = await handleGetPersons()
            getAllCities(total)
            return setTotalRecords(total.length)
        }else{
            setTotalAssigned(+user.user.range )
            const total = await handleGetPersonsAdmin()
            getAllCities(total)
            return setTotalRecords(total.length)
        }
    }

    const getAllCities = (data)=>{
        const cityCount = data.reduce((acc, person) => {
            const city = person.city || "Desconocida"; // Manejar casos sin ciudad
            acc[city] = (acc[city] || 0) + 1;
            return acc;
        }, {});

        const cities = Object.keys(cityCount);
        const counts = Object.values(cityCount);
        setCityData({ cities, counts });
    }

    return (
        <View style={styles.container}>
            <Header totalPersons={totalRecords} />
            <View style={styles.usersContainer}>
                <View style={styles.leftContainer}>
                    <Text style={styles.userLegend} >Usuarios </Text>
                </View>
                <View style={styles.rightContainer}>
                    <Button
                        icon={
                            <Icon name='arrow-forward' color='#fff' />
                        }
                        radius='lg' color='#00bfa5'
                        onPress={handleAddUser}
                    />
                </View>
            </View>
            <View>
                <ProgressChart assignedRecords={totalAssigned} totalUserLocal={totalRecords} />
                <BarHorizontalChart data={cityData} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        backgroundColor: '#fff',
        flex: 1
    },
    usersContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
        paddingHorizontal: 10
    },
    leftContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    rightContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    userLegend: {
        fontSize: 20
    }

})
