import React, { useState, useEffect } from "react";
import { View, Text, Modal, StyleSheet, ScrollView, Alert } from "react-native";
import { Button, Icon, Input, ListItem } from '@rneui/themed'
import UsePersonsStorage from "../hooks/UsePersonsStorage";

export default function AddUserModal({ onClose, visible, userEditing }) {

    const { handleSaveUser, handleUpdateUser, handleDeleteUser, handleSync } = UsePersonsStorage()
    const [expanded, setExpanded] = useState(false)
    const [selectedCity, setselectedCity] = useState('')

    const [userData, setUserData] = useState({

        document_number: '',
        name: "",
        last_name: "",
        cellphone: "",
        locality: "",
        ubication: "1.256359, -74.523696",
        department: "PUTUMAYO",
        city: "",
        number_assigned: "25",
        user_register_id: "1",//convertir dato a entero en backend
    })
    const [isFormEmpty, setIsFormEmpty] = useState('')
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
            ubication: '1.256359, -74.523696',
            department: "PUTUMAYO",
            city: userEditing?.city || '',
            number_assigned: userEditing?.city || '25',
            user_register_id: userEditing?.user_register_id || '1',//convertir dato a entero en backend
        })
        setselectedCity(userEditing?.city || '',)
    }, [visible])


    const handleSubmitUser = async (isEdit) => {

        if (Object.values(userData).includes('')) {
            setIsFormEmpty(`Todos los campos son obligatorios`)
            setTimeout(() => {
                setIsFormEmpty('')
            }, 3000)
            return
        }

        const isOnline = await handleSync()
        const is_synced = isOnline ? '1' : '0'

        if (isEdit) {
            await handleUpdateUser({ ...userData, is_synced })
            onClose()
        } else {
            await handleSaveUser({ ...userData, is_synced })
            onClose()
        }

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
                    onPress: async () => [await handleDeleteUser(id), onClose()]
                }
            ]
        );

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
                                            <ListItem.Title onPress={() => [setselectedCity(name), setExpanded(false)]} style={styles.nameCity} key={name}>{name}</ListItem.Title>
                                        ))}

                                    </ListItem.Content>
                                </ListItem>
                            </ListItem.Accordion>

                            <Input value={userData.locality} onChangeText={(text) => handleChange('locality', text)} placeholder="Dirección" />
                        </View>

                    </ScrollView>

                    <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end', paddingVertical: 10, flexDirection: 'row', gap: 10 }}>
                        {!userEditing && <Button
                            title='Guardar'
                            color='#00bfa5'
                            radius='lg'
                            onPress={() => handleSubmitUser(false)}
                        />}
                        {userEditing && <Button
                            title='Editar'
                            color='#fe5f2f'
                            radius='lg'
                            onPress={() => handleSubmitUser(true)}
                        />}
                        {userEditing && <Button
                            title='Eliminar'
                            color='#f84455'
                            radius='lg'
                            onPress={() => getUserToDelete(userEditing?.document_number)}
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