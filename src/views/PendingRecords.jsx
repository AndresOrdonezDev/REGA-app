import { View, Text, StyleSheet } from "react-native"
import UsePersonsStorage from "../hooks/UsePersonsStorage"
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState, useEffect } from "react"
import { Button, Icon } from '@rneui/themed'
import Header from "../components/Header";
export default function PendingRecords() {
    const { handleGetUser, handleSync, pendingRecords } = UsePersonsStorage()
    const [totalPending, setTotalPending] = useState([])

    useEffect(() => {
        const pending = pendingRecords.filter(user => user.is_synced === '0')
        setTotalPending(pending)
    }, [pendingRecords])

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                await handleGetUser();
                await handleSync();
            };
            fetchData().catch(null);
        }, [handleGetUser, handleSync])
    );

    
    return (

        <View style={styles.pendingContainer}>
            <Header />
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

                    />
                </View>
            </View>
            <View style={styles.pendingCard}>
                {totalPending.map((user,index) => (
                    <View style={styles.userListItems} key={user.document_number}>
                        <View style={{ flex: 2, flexDirection: 'row', alignItems: "center", }}>
                            <View style={{ width: 20, height: 20, backgroundColor: '#fff', marginRight: 10, borderRadius: 50 }}>
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
    pendingCard:{
        paddingHorizontal:20
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
        marginVertical:1
    }
})