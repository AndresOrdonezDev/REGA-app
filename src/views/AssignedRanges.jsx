import { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button, Icon, Input } from '@rneui/themed'
//my imports
import Header from "../components/Header";
import { UserContext } from "../context/UserContext";
import UseRangeUser from "../hooks/UseRangeUser";

export default function AssignedRanges() {

    const {syncRangeUserLocal} = UseRangeUser()

    const { user, rangeByUserLocal,getRangeUserLocal } = useContext(UserContext);


    useEffect(() => {
        getRangeUserLocal()
    }, [])

    const handleSyncRangeUser = async ()=>{
        await syncRangeUserLocal(user?.user.id)
        await getRangeUserLocal()
    }

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.usersContainer}>
                <View style={styles.leftContainer}>
                    <Text style={styles.userLegend} >Actualizar rangos </Text>
                </View>
                <View style={styles.rightContainer}>
                    <Button
                        title=' Sincronizar'
                        icon={
                            <Icon name='sync' color='#fff' />
                        }
                        radius='lg' color='#00bfa5'
                        onPress={()=>handleSyncRangeUser()}
                    />
                </View>
            </View>
            <View style={{ paddingHorizontal: 10 }}>
                <Text style={styles.rangeTitle} >Mis Rangos Asignados</Text>
            </View>

            <ScrollView style={{ marginBottom: 15, paddingHorizontal: 10, marginTop:20 }}>

                {rangeByUserLocal?.map((range, index) => (
                    <View style={styles.userListItems} key={index}>
                        <View style={{ flex: 2, flexDirection: 'row', alignItems: "center", }}>
                            <View style={{ width: 20, height: 20, backgroundColor: '#fff', marginRight: 10, borderRadius: 50 }}>
                                <Text style={{ textAlign: 'center' }}>{index + 1}</Text>
                            </View>
                            <View>
                                <Text style={styles.userItemText}>{range.city_name}</Text>
                                <Text style={styles.userItemText}>{range.range_init} - {range.range_end} / próxima: {+range.last}</Text>

                            </View>

                        </View>
                        <View style={{backgroundColor:'#fff',flex:.8, alignItems:'center',borderRadius:50}}>
                            {range.completed === '0' ? (
                                <Text style={{color:'#00bfa5', padding:5}}>Activo</Text>
                            ) : <Text style={{color:'red', padding:5}}>Completado</Text>}
                        </View>
                    </View>
                ))}


            </ScrollView>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        backgroundColor: '#fff'
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
        fontSize: 18
    },

    userListTitle: {
        marginBottom: 5,
        padding: 10,
        fontWeight: 'bold',
        fontSize: 15,
        color: '#777'
    },

    userListHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        padding: 10,
    },
    rangeTitle: {
        textAlign: 'center',
        fontWeight: "bold",
        color: '#333',
        fontSize: 20,
        marginTop: 20,
        borderBottomWidth: 1,
        borderColor: '#00bfa5'
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
        fontWeight: 'bold'
    }

})