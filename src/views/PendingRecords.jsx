import { View, Text, StyleSheet } from "react-native"
import UsePersonsStorage from "../hooks/UsePersonsStorage"
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react"
import { Button, Icon } from '@rneui/themed'
import Header from "../components/Header";
import { useToast } from "react-native-toast-notifications";

export default function PendingRecords() {
    const toast = useToast();
    const { navigate } = useNavigation()

    const { handleGetPersons, handleSync, sendDataServer, handleUpdateLocal } = UsePersonsStorage()
    const [totalPending, setTotalPending] = useState([])

    useEffect(() => {
        getTotalRecords()
    }, []);


    const getTotalRecords = async () => {
        const total = await handleGetPersons()
        const totalSynced = total.filter(person => person.is_synced === '0')
        setTotalPending(totalSynced)
    }

    const handleSyncData = async () => {
        const isConnected = await handleSync()

        if (isConnected) {

            if (totalPending.length) {

                for (const person of totalPending) {
                    await updateRecords(person);
                }
                navigate('usersList')
                return toast.show("Actualización Exitosa 🚀", { type: "success", style: { backgroundColor: "#00bfa5" } });
            }

            return toast.show("Todo esta sincronizado ✅", { type: "warning" });
        } else {
            return toast.show("No hay conexión 📡", { type: "danger" });
        }
    }

    const updateRecords = async (person) => {
        try {
           
            const { data } = await sendDataServer({ ...person, is_synced: '1' })
            if (data.id) {
                await handleUpdateLocal({ ...person, is_synced: '1' })
            } else {
                await handleUpdateLocal({ ...person, is_synced: '0' })
            }

        } catch (error) {
            console.error(error)
        }
    }

    return (

        <View style={styles.pendingContainer}>
            <Header totalPersons={totalPending.length} />
            <View style={styles.pendingHeading}>
                <View style={styles.leftContainer}>
                    <Text style={styles.userLegend} >Sincronizar Registros</Text>
                </View>
                <View style={styles.rightContainer}>
                    <Button
                        icon={
                            <Icon name='sync' color='#fff' />
                        }
                        radius='lg' color='#00bfa5'
                        onPress={() => handleSyncData()}
                    />
                </View>
            </View>
            <View style={styles.pendingCard}>
                {totalPending.map((user, index) => (
                    <View style={styles.userListItems} key={user.document_number}>
                        <View style={{ flex: 2, flexDirection: 'row', alignItems: "center", }}>
                            <View style={{ width: 20, height: 20, backgroundColor: '#fff', marginRight: 10, borderRadius: 50 }} >
                                <Text style={{ textAlign: 'center' }}>{index + 1}</Text>
                            </View>
                            <View>
                                <Text style={styles.userItemText}>{user.name} {user.last_name}</Text>
                                <Text style={styles.userItemText}>{user.cellphone}</Text>
                                <Text style={styles.userItemText}>{user.locality} - {user.city}</Text>
                            </View>
                        </View>

                    </View>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    pendingContainer: {
        backgroundColor: '#fff',
        flex: 1
    },
    pendingHeading: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
        paddingHorizontal: 20
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
    },
    pendingCard: {
        paddingHorizontal: 20
    },
    userListItems: {
        padding: 10,
        backgroundColor: '#b2dfdb',
        marginVertical: 8,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    userItemText: {
        color: '#333333',
        fontWeight: 'bold',
        marginVertical: 1
    }
})