import React, { useState, useEffect } from "react";
import { View, Text, Modal, StyleSheet, ScrollView, Alert } from "react-native";
import { Button, Icon, Input, ListItem } from '@rneui/themed'
import UseUserStorage from "../hooks/UseUserStorage";

export default function AddUserModal({ onClose, visible, userEditing }) {

    const { handleSaveUser, handleUpdateUser, handleDeleteUser } = UseUserStorage()
    const [expanded, setExpanded] = useState(false)
    const [selectedMunicipality, setSelectedMunicipality] = useState('')
    const [userData, setUserData] = useState({
        name: '',
        lastName: '',
        idNumber: '',
        phoneNumber: '',
        municipality: '',
        direction: '',
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
        handleChange('municipality', selectedMunicipality)
    }, [selectedMunicipality])

    useEffect(() => {
        setUserData({
            name: userEditing?.name || '',
            lastName: userEditing?.lastName || '',
            idNumber: userEditing?.idNumber || '',
            phoneNumber: userEditing?.phoneNumber || '',
            municipality: userEditing?.municipality || '',
            direction: userEditing?.direction || '',
        })
        setSelectedMunicipality(userEditing?.municipality || '',)
    }, [visible])


    const handleSubmitUser = async (isEdit) => {
        if (Object.values(userData).includes('')) {
            setIsFormEmpty('Todos los campos son obligatorios')
            setTimeout(() => {
                setIsFormEmpty('')
            }, 3000)
            return
        } 
            
        if(isEdit){
            await handleUpdateUser({...userData})
            onClose()
        }else{
            await handleSaveUser({ ...userData })
            onClose()
        }
        
    }

    const getUserToDelete = async(id)=>{
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
                            <Input value={userData.lastName} onChangeText={(text) => handleChange('lastName', text)} placeholder="Apellidos" />
                            <Input value={userData.idNumber} onChangeText={(text) => handleChange('idNumber', text)} placeholder="No. Cédula" />
                            <Input value={userData.phoneNumber} onChangeText={(text) => handleChange('phoneNumber', text)} placeholder="Celular" />

                            <ListItem.Accordion
                                content={
                                    <ListItem.Content>
                                        <ListItem.Title>Municipio</ListItem.Title>
                                        <ListItem.Subtitle>{selectedMunicipality ? selectedMunicipality : 'Elige un municipio'}</ListItem.Subtitle>
                                    </ListItem.Content>
                                }
                                isExpanded={expanded}
                                onPress={() => setExpanded(!expanded)}

                            >
                                <ListItem>
                                    <ListItem.Content>
                                        {municipalities.map(name => (
                                            <ListItem.Title onPress={() => [setSelectedMunicipality(name), setExpanded(false)]} style={styles.nameMunicipality} key={name}>{name}</ListItem.Title>
                                        ))}

                                    </ListItem.Content>
                                </ListItem>
                            </ListItem.Accordion>

                            <Input value={userData.direction} onChangeText={(text) => handleChange('direction', text)} placeholder="Dirección" />
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
                            onPress={()=>getUserToDelete(userEditing?.idNumber)}
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
    nameMunicipality: {

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