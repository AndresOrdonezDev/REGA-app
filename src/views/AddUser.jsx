import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Header from "../components/Header";
import { Button, Icon, Input } from '@rneui/themed'

import AddUserModal from "../components/AddUserModal";
import UserListItems from "../components/UserListItem";
import UseUserStorage from "../hooks/UseUserStorage";

export default function AddUser() {
    const { handleGetUser } = UseUserStorage()
    const [showModal, setShowModal] = useState(false)
    const [usersLocal, setUsersLocal] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        getAllUsers();
        
    }, []);

    const handleModalClose = async () => {
        getAllUsers()
        setShowModal(false)
    }

    const getAllUsers = async () => {
        try {
            const getUsers = await handleGetUser()
            setFilteredUsers(getUsers)
            return setUsersLocal(getUsers)
        } catch (error) {
            console.error(error)
        }
    }

    const handleSearch = (text) => {
        if (text === '') {
          setFilteredUsers(usersLocal)
        } else {
          const filtered = usersLocal.filter((user) =>
            `${user.name} ${user.lastName}`.toLowerCase().includes(text.toLowerCase()) ||
            user.idNumber.toLowerCase().includes(text.toLowerCase()) ||
            user.phoneNumber.toLowerCase().includes(text.toLowerCase()) ||
            user.municipality.toLowerCase().includes(text.toLowerCase())
          );
          setFilteredUsers(filtered);
        }
      };

    return (
        <View style={styles.container} >
            <Header />

            <View style={styles.usersContainer}>
                <View style={styles.leftContainer}>
                    <Text style={styles.userLegend} >Listado de usuarios</Text>
                </View>
                <View style={styles.rightContainer}>
                    <Button
                        onPress={() => setShowModal(true)}
                        title=' Nuevo'
                        icon={
                            <Icon name='add-circle-outline' color='#fff' />
                        }
                        radius='lg' color='#00bfa5'

                    />
                </View>
            </View>

            <View style={styles.searchContainer}>
                <View style={{ flex: 5 }}>
                    <Input onChangeText={(text)=> handleSearch(text)} placeholder="Nombre, CC, Dirección" />
                </View>
                <View style={{ flex: .5 }}>
                    <Icon name="search" color='#00986c' />
                </View>
            </View>
            <Text style={styles.userListTitle}>Usuarios Registrados: {usersLocal.length}</Text>
            <ScrollView style={{marginBottom:15}}>

                {filteredUsers?.map((user, index) => (
                    <UserListItems index={index} user={user} key={index} />
                    
                ))}

                {!filteredUsers.length && <Text style={styles.textNoResults}>No hay resultados de búsqueda</Text>}
            </ScrollView>

            <AddUserModal visible={showModal} onClose={handleModalClose} />
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
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    userListTitle: {
        marginBottom: 5,
        padding: 10,
        fontWeight: 'bold',
        fontSize: 15,
        color: '#777'
    },
    textNoResults:{
        textAlign:'center', 
        fontWeight:'bold', 
        marginVertical:50, 
        color:'#888', 
        fontSize:18
    }
})