import { View, StyleSheet, Text } from "react-native";
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Button, Icon } from '@rneui/themed'
import UseUserStorage from "../hooks/UseUserStorage";
//components
import Header from "../components/Header";
import ProgressChart from "../components/ProgressChart";

export default function Home() {
    const { navigate } = useNavigation()
    const {totalUserLocal, handleGetUser, handleSync } = UseUserStorage()
    
    const assignedRecords = 10

    const handleAddUser = () => {
        navigate('Nuevo Usuario')
    }

    useFocusEffect(()=>{
        handleGetUser().catch(null)
        handleSync().catch(null)
    })

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.usersContainer}>
                <View style={styles.leftContainer}>
                    <Text style={styles.userLegend} >Usuarios</Text>
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
                <ProgressChart assignedRecords={assignedRecords} totalUserLocal={totalUserLocal}/>
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
        marginVertical: 24
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
