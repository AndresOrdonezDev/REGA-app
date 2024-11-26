import { View, StyleSheet, Text } from "react-native";
import { useNavigation } from '@react-navigation/native'
import { Button, Icon } from '@rneui/themed'
import UsePersonsStorage from "../hooks/UsePersonsStorage";
import { useEffect, useState } from "react";

//components
import Header from "../components/Header";
import ProgressChart from "../components/ProgressChart";

export default function Home() {

    const { navigate } = useNavigation()
    const { handleGetPersons} = UsePersonsStorage()
    const [totalRecords, setTotalRecords] = useState(0)

    const assignedRecords = 100

    const handleAddUser = () => {
        navigate('usersList')
    }


    useEffect(() => {
        getTotalRecords() 
             
    },[]);

    const getTotalRecords = async () => {
        const total = await handleGetPersons()                
        setTotalRecords(total.length)
    }
    
    return (
        <View style={styles.container}>
            <Header totalPersons={totalRecords}/>
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
                <ProgressChart assignedRecords={assignedRecords} totalUserLocal={totalRecords} />
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
        paddingHorizontal:10
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
