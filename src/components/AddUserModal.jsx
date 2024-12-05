import React, { useState, useEffect, useContext } from "react";
import { View, Text, Modal, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { Button, Icon, Input, ListItem } from '@rneui/themed'
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location'
//my functions
import UsePersonsStorage from "../hooks/UsePersonsStorage";
import UseRangeUser from "../hooks/UseRangeUser";
import { UserContext } from "../context/UserContext";

export default function AddUserModal({ onClose, visible, userEditing, rangeByUser }) {
    const { user,getRangeUserLocal } = useContext(UserContext);
    const { handleSavePerson, handleUpdatePerson, handleDeleteUser, handleSync, handleGetPersons, handleGetPerson } = UsePersonsStorage()
    const { updateRangesLocals } = UseRangeUser()
    const [expanded, setExpanded] = useState(false)

    const [selectedRage, setSelectedRage] = useState(null)

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
    })


    const handleChange = (name, text) => {

        setUserData({
            ...userData,
            [name]: text
        })
    }

    useEffect(() => {
        setUserData({
            document_number: userEditing?.document_number || '',
            name: userEditing?.name || '',
            last_name: userEditing?.last_name || '',
            cellphone: userEditing?.cellphone || '',
            locality: userEditing?.locality || '',
            department: "PUTUMAYO",
        })

        
        logLocation()
        setIsPersonDeleted(false)
        validateToDeletePerson()
        setSelectedRage(null)
        setExpanded(false)
        getRangeUserLocal()
        setIsLoading(false)
    }, [visible])

    const handleSubmitUser = async (isEdit) => {

        if (!selectedRage && !isEdit) {
            setIsFormEmpty('Elije un rango de numeración')
            setTimeout(() => {
                setIsFormEmpty('')
            }, 3000)
            return
        }

        if (Object.values(userData).includes('')) {
            setIsFormEmpty(`Todos los campos son obligatorios`)
            setTimeout(() => {
                setIsFormEmpty('')
            }, 3000)
            return
        }
        
        if(userData.cellphone.length < 10 || +userData.cellphone[0] !== 3 || userData.cellphone.length > 10){
            setIsFormEmpty('Celular incorrecto')
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

           
            setIsLoading(true)
            const validateLocation = await logLocation()
            const ubication = validateLocation ? validateLocation : "0.000000, -0.000000"

            const completed = +selectedRage.last === +selectedRage.range_end ? '1' : '0'
            const last = +selectedRage.last === +selectedRage.range_end ? +selectedRage.last : +selectedRage.last+1

            const idLocal = generateUniqueId()
            const data = { ...userData, is_synced, user_register_id, idLocal, ubication,number_assigned:+selectedRage.last, city:selectedRage.city_name   }
            const rangeUpdate = {...selectedRage, completed, last}

            await handleSavePerson(data)
            await updateRangesLocals(rangeUpdate)
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

    async function fetchLocation() {
        try {
            const { status } = await requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso de denegado');
                return;
            }
            const location = await getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
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
                            {!userEditing && <ListItem.Accordion
                                content={
                                    <ListItem.Content>
                                        <ListItem.Title>Rangos de numeración</ListItem.Title>
                                        <ListItem.Subtitle>{selectedRage ? `${selectedRage.city_name} ${selectedRage.range_init} - ${selectedRage.range_end}` : 'Elige un rango'}</ListItem.Subtitle>
                                    </ListItem.Content>
                                }
                                isExpanded={expanded}
                                onPress={() => setExpanded(!expanded)}

                            >
                                <ListItem>
                                    <ListItem.Content>
                                        {rangeByUser?.filter(range => range.user_id === user?.user.id && range.completed !== '1').map(range => (
                                            <ListItem.Title
                                                onPress={() => [setSelectedRage(range),
                                                setExpanded(false)]}
                                                style={styles.nameCity} key={range.id}
                                            >{range.city_name} {range.range_init} - {range.range_end}
                                            </ListItem.Title>
                                        ))}

                                    </ListItem.Content>
                                </ListItem>
                            </ListItem.Accordion>}

                            {selectedRage && <View>
                                <Input value={userData.name} onChangeText={(text) => handleChange('name', text)} placeholder="Nombres" />
                                <Input value={userData.last_name} onChangeText={(text) => handleChange('last_name', text)} placeholder="Apellidos" />
                                <Input keyboardType="numeric" value={userData.document_number} onChangeText={(text) => handleChange('document_number', text)} placeholder="No. Cédula" />
                                <Input keyboardType="numeric" value={userData.cellphone} onChangeText={(text) => handleChange('cellphone', text)} placeholder="Celular" />
                                <Input value={userData.locality} onChangeText={(text) => handleChange('locality', text)} placeholder="Dirección, vereda .." />
                            </View>}
                            {userEditing && <View>
                                <Input value={userData.name} onChangeText={(text) => handleChange('name', text)} placeholder="Nombres" />
                                <Input value={userData.last_name} onChangeText={(text) => handleChange('last_name', text)} placeholder="Apellidos" />
                                <Input keyboardType="numeric" value={userData.document_number} onChangeText={(text) => handleChange('document_number', text)} placeholder="No. Cédula" />
                                <Input keyboardType="numeric" value={userData.cellphone} onChangeText={(text) => handleChange('cellphone', text)} placeholder="Celular" />
                                <Input value={userData.locality} onChangeText={(text) => handleChange('locality', text)} placeholder="Dirección, vereda .." />

                            </View>}


                        </View>

                    </ScrollView>

                    <View style={styles.footerModal}>
                        <View>
                            {selectedRage && <Text>Boleta: <Text style={styles.currentTicket}>{selectedRage.last}</Text></Text>}
                            {userEditing && <Text>Boleta: <Text style={styles.currentTicket}>{userEditing.number_assigned}</Text></Text>}
                        </View>
                        <View style={{flexDirection:'row', gap:10}}>
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
    },
    footerModal: {
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        flexDirection: 'row',
        gap: 10
    },
    currentTicket: {
        color: '#00bfa5',
        fontWeight: 'bold',
        fontSize: 20
    }

})