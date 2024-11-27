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


export default function Home() {
    const { user } = useContext(UserContext);
    const { navigate } = useNavigation()
    const { handleGetPersons, handleGetPersonsAdmin } = UsePersonsStorage()
    const [totalAssigned, setTotalAssigned] = useState(0)
    const [totalRecords, setTotalRecords] = useState(0)

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
            return setTotalRecords(total.length)
        }else{
            const total = await handleGetPersonsAdmin()
            return setTotalRecords(total.length)
        }
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
