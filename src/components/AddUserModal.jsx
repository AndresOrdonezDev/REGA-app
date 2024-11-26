import React, { useState, useEffect, useContext } from "react";
import { View, Text, Modal, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { Button, Icon, Input, ListItem } from '@rneui/themed'
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location'
//my functions
import UsePersonsStorage from "../hooks/UsePersonsStorage";
import { UserContext } from "../context/UserContext";

export default function AddUserModal({ onClose, visible, userEditing, totalRecords }) {
    const { user } = useContext(UserContext);
    const { handleSavePerson, handleUpdatePerson, handleDeleteUser, handleSync, handleGetPersons, handleGetPerson } = UsePersonsStorage()
    const [expanded, setExpanded] = useState(false)
    const [selectedCity, setSelectCity] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isFormEmpty, setIsFormEmpty] = useState('')
    const [isPersonDeleted, setIsPersonDeleted] = useState(false)
    const [userData, setUserData] = useState({

        document_number: '',
        name: "",
        last_name: "",
        cellphone: "",
        locality: "",
        department: "PUTUMAYO",
        city: "",
        number_assigned: "",
    })

    const municipalities = [
        "MOCOA",
        "COLON",
        "ORITO",
        "PUERTO ASIS",
        "PUERTO CAICEDO",
        "PUERTO GUZMAN",
        "LEGUIZAMO",
        "SIBUNDOY",
        "SAN FRANCISCO",
        "SAN MIGUEL",
        "SANTIAGO",
        "VALLE DEL GUAMUEZ",
        "VILLAGARZON"
    ];

    const handleChange = (name, text) => {
        setUserData({
            ...userData,
            [name]: text
        })
    }

    useEffect(() => {
        handleChange('city', selectedCity)
    }, [selectedCity])

    useEffect(() => {
        setUserData({
            document_number: userEditing?.document_number || '',
            name: userEditing?.name || '',
            last_name: userEditing?.last_name || '',
            cellphone: userEditing?.cellphone || '',
            locality: userEditing?.locality || '',
            department: "PUTUMAYO",
            city: userEditing?.city || '',
            number_assigned: userEditing?.city || '',

        })
        setSelectCity(userEditing?.city || '',)
        logLocation()
        
        setIsPersonDeleted(false)
        validateToDeletePerson()
    }, [visible])

    

    const handleSubmitUser = async (isEdit) => {

        if (Object.values(userData).includes('')) {
            setIsFormEmpty(`Todos los campos son obligatorios`)
            setTimeout(() => {
                setIsFormEmpty('')
            }, 3000)
            return
        }

        const user_register_id = user.user.id
        const isOnline = await handleSync()
        const is_synced = isOnline ? '1' : '0'

        if (isEdit) {
            setIsLoading(true)
            const prevSynced = userEditing.is_synced === '0' ? false : true
            const idLocal = userEditing.idLocal
            await handleUpdatePerson({ ...userData, is_synced, idLocal }, prevSynced)
            setIsLoading(false)
            onClose()
        } else {

            if (await isExistPerson(userData.document_number)) {
                setIsFormEmpty('Persona ya registrada')
                setTimeout(() => {
                    setIsFormEmpty('')
                }, 3000)

                return
            }

            if (+user.user.range <= +totalRecords) {

                setIsFormEmpty('Ya registraste todos los asignados')
                setTimeout(() => {
                    setIsFormEmpty('')
                }, 3000)

                return
            }
            setIsLoading(true)
            const ubication = await logLocation()
            
            const idLocal = generateUniqueId()
            await handleSavePerson({ ...userData, is_synced, user_register_id, idLocal, ubication })
            setIsLoading(false)
            onClose()
        }

    }

    const isExistPerson = async (document_number) => {
        const total = await handleGetPersons()
        const existPerson = total.some(person => person.document_number === document_number);
        return existPerson
    }

    const getUserToDelete = async (id) => {
        Alert.alert(
            "Confirmar eliminación",
            "¿Deseas eliminar este usuario?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => [await handleDeleteUser(id, user?.user?.role_name), onClose()]
                }
            ]
        );

    }

    function generateUniqueId(maxLength = 20) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 10);
        const uniqueId = `${timestamp}${random}`;
        return uniqueId.substring(0, maxLength);
    }

    async function validateToDeletePerson() {
        if (userEditing) {
            const prevSynced = userEditing.is_synced === '0' ? false : true
            if (prevSynced) {
                const isOnline = await handleSync()
                if (isOnline) {
                    const isPersonOnServer = await handleGetPerson(userEditing?.idLocal)
                    setIsPersonDeleted(!isPersonOnServer)
                    return

                }
            }
        }
    }

    async function fetchLocation(){
        try {
            const { status } = await requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso de denegado');
                return;
            }
            const location = await getCurrentPositionAsync({});
            const { latitude, longitude } =  location.coords;
            return `${latitude}, ${longitude}`;

        } catch (error) {
            console.error('Error obteniendo ubicación:', error);
            Alert.alert('Error', 'No se pudo obtener la ubicación.');
        } 
    };
    async function logLocation() {
        const coords = await fetchLocation();
        return coords
    }


    return (
        <Modal visible={visible} onRequestClose={onClose} transparent animationType="fade" >
            <View style={styles.container} >
                <View style={styles.content}>
                    <View style={styles.closeContainer}>
                        <Text style={{ flex: 1, fontSize: 15 }}>{userEditing ? 'Editar usuario' : 'Crear Nuevo Usuario'} </Text>
                        <Button onPress={() => onClose()} icon={<Icon name="close" />} color='transparent' />
                    </View>
                    <ScrollView>
                        <View>
                            <Input value={userData.name} onChangeText={(text) => handleChange('name', text)} placeholder="Nombres" />
                            <Input value={userData.last_name} onChangeText={(text) => handleChange('last_name', text)} placeholder="Apellidos" />
                            <Input value={userData.document_number} onChangeText={(text) => handleChange('document_number', text)} placeholder="No. Cédula" />
                            <Input value={userData.cellphone} onChangeText={(text) => handleChange('cellphone', text)} placeholder="Celular" />

                            <ListItem.Accordion
                                content={
                                    <ListItem.Content>
                                        <ListItem.Title>Municipio</ListItem.Title>
                                        <ListItem.Subtitle>{selectedCity ? selectedCity : 'Elige un municipio'}</ListItem.Subtitle>
                                    </ListItem.Content>
                                }
                                isExpanded={expanded}
                                onPress={() => setExpanded(!expanded)}

                            >
                                <ListItem>
                                    <ListItem.Content>
                                        {municipalities.map(name => (
                                            <ListItem.Title onPress={() => [setSelectCity(name), setExpanded(false)]} style={styles.nameCity} key={name}>{name}</ListItem.Title>
                                        ))}

                                    </ListItem.Content>
                                </ListItem>
                            </ListItem.Accordion>

                            <Input value={userData.locality} onChangeText={(text) => handleChange('locality', text)} placeholder="Dirección" />
                            <Input value={userData.number_assigned} onChangeText={(text) => handleChange('number_assigned', text)} placeholder="Número Boleta" />
                        </View>

                    </ScrollView>

                    <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end', paddingVertical: 10, flexDirection: 'row', gap: 10 }}>
                        {isLoading && <ActivityIndicator color={userEditing?.idLocal ? '#fe5f2f' : '#00bfa5'} size="large" />}
                        {!userEditing && <Button
                            title='Guardar'
                            color='#00bfa5'
                            radius='lg'
                            onPress={() => handleSubmitUser(false)}
                            disabled={isLoading}
                        />}
                        {userEditing && <Button
                            title='Editar'
                            color='#fe5f2f'
                            radius='lg'
                            onPress={() => handleSubmitUser(true)}
                            disabled={isLoading}
                        />}
                        {userEditing && user?.user?.role_name === 'Administrador' && <Button
                            title='Eliminar'
                            color='#f84455'
                            radius='lg'
                            onPress={() => getUserToDelete(userEditing?.idLocal)}
                        />}
                        {isPersonDeleted && user?.user?.role_name === 'Registrador' && <Button
                            title='Eliminar'
                            color='#f84455'
                            radius='lg'
                            onPress={() => getUserToDelete(userEditing?.idLocal)}
                        />}



                    </View>
                    {isFormEmpty && <Text style={styles.alertText}>{isFormEmpty}</Text>}

                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',


    },
    content: {
        backgroundColor: '#fff',
        width: '90%',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        maxHeight: '70%'
    },
    closeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    nameCity: {

        color: '#00bfa5',
        marginVertical: 3,
    },
    alertText: {
        color: 'red',
        textAlign: 'center',
        borderStartWidth: 2,
        borderRightColor: 'red',
        fontSize: 15
    }

})