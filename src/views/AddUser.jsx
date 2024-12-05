import { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Modal } from "react-native";
import Header from "../components/Header";
import { Button, Icon, Input } from '@rneui/themed'
import { useToast } from "react-native-toast-notifications";
import { UserContext } from "../context/UserContext";
import AddUserModal from "../components/AddUserModal";
import UserListItems from "../components/UserListItem";
import UsePersonsStorage from "../hooks/UsePersonsStorage";
import ApiService from "../services/ApiService";

export default function AddUser() {
    const { user, rangeByUserLocal } = useContext(UserContext);
    const { handleGetPersons, handleGetPersonsAdmin } = UsePersonsStorage()
    const [showModal, setShowModal] = useState(false)
    const [usersLocal, setUsersLocal] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [userEditing, setUserEditing] = useState(null)
    const [showSendMessageModal, setShowSendMessageModal] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const toast = useToast();

    useEffect(() => {
        validateRolUser();     
    }, []);


    const handleModalClose = async () => {
        validateRolUser()
        setUserEditing(null)
        setShowModal(false)
    }


    const validateRolUser = async () => {

        if (user.user.role_name === 'Registrador') {
            try {
                const getUsers = await handleGetPersons()
                setFilteredUsers(getUsers)
                return setUsersLocal(getUsers)
            } catch (error) {
                console.error(error)
            }
        } else {
            try {
                const getUsers = await handleGetPersonsAdmin()
                setFilteredUsers(getUsers)
                return setUsersLocal(getUsers)
            } catch (error) {
                console.error(error)
            }
        }
    }

    const handleSearch = (text) => {
        
        if (text === '') {
            setFilteredUsers(usersLocal)
        } else {
            const filtered = usersLocal.filter((user) =>
                `${user.name} ${user.last_name}`.toLowerCase().includes(text.toLowerCase()) ||
                user.document_number.toLowerCase().includes(text.toLowerCase()) ||
                `${user.number_assigned}`.toLowerCase().includes(text.toLowerCase()) ||
                user.cellphone.toLowerCase().includes(text.toLowerCase()) ||
                user.city.toLowerCase().includes(text.toLowerCase()) ||
                user.locality.toLowerCase().includes(text.toLowerCase())  
            )
            setFilteredUsers(filtered);
        }
    };

    
    const handleGetIdUser = (id) => {
        const userEditSelected = usersLocal.filter(user => user.document_number === id ? user : null)[0]
        setUserEditing(userEditSelected)
        setShowModal(true)
    }

    const handleOpenSendMessageModal = () => {
        setShowSendMessageModal(true);
    }

    const handleCloseSendMessageModal = () => {
        setShowSendMessageModal(false);
        setMessageText('');
    }

    const handleSendMessages = async () => {
        const cellphones = filteredUsers.map(user => user.cellphone);
        console.log('cellphones ', cellphones, messageText)
        setIsSending(true);
        try {
            const response = await ApiService.sendWhatsApps({ cellphones: cellphones, message: messageText });
            console.log("response ", response)
            setIsSending(false);
            setShowSendMessageModal(false);
            setMessageText('');
            toast.show('Mensaje enviado exitosamente 😉', { type: 'success', style: { backgroundColor: "#00bfa5" } })
        } catch (error) {
            console.error(error);
            setIsSending(false);
            toast.show("No se pudo enviar los mensajes 😨", { type: "danger" });
        }
    }

    return (
        <View style={styles.container} >
            <Header totalPersons={usersLocal.length} />

            <View style={styles.usersContainer}>
                <View style={styles.leftContainer}>
                    <Text style={styles.userLegend} >Listado de usuarios </Text>
                </View>
                {user?.user?.role_name === 'Registrador' && <View style={styles.rightContainer}>
                    <Button
                        onPress={() => setShowModal(true)}
                        title=' Nuevo'
                        icon={
                            <Icon name='add-circle-outline' color='#fff' />
                        }
                        radius='lg' color='#00bfa5'
                    />
                </View>}

            </View>

            <View style={styles.searchContainer}>
                <View style={{ flex: 5 }}>
                    <Input onChangeText={(text) => handleSearch(text)} placeholder="Nombre, CC, Dirección" />
                </View>
                <View style={{ flex: .5 }}>
                    <Icon name="search" color='#00986c' />
                </View>
            </View>
            <View style={styles.userListHeader}>
                <Text style={styles.userListTitle}>Usuarios Registrados: {usersLocal.length}</Text>
                {user?.user?.role_name !== 'Registrador'&& <Button
                    onPress={handleOpenSendMessageModal}
                    icon={<Icon name='send' color='#fff' />}
                    radius='lg'
                    color='#00bfa5'
                />}

            </View>
            <ScrollView style={{ marginBottom: 15, paddingHorizontal:10 }}>

                {filteredUsers?.map((user, index) => (
                    <UserListItems index={index} user={user} key={index} getIdUser={handleGetIdUser} />

                ))}

                {!filteredUsers.length && <Text style={styles.textNoResults}>{usersLocal.length ? 'No hay resultados de búsqueda' : 'No hay usuarios registrados'}</Text>}
            </ScrollView>

            <AddUserModal visible={showModal} onClose={handleModalClose} userEditing={userEditing} totalRecords={usersLocal.length} rangeByUser={rangeByUserLocal}/>
            {/* Modal para enviar mensajes */}
            <Modal
                visible={showSendMessageModal}
                transparent={true}
                animationType='slide'
                onRequestClose={handleCloseSendMessageModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Enviar Mensajes</Text>
                        <Input
                            placeholder='Escriba su mensaje'
                            value={messageText}
                            onChangeText={setMessageText}
                            multiline={true}
                        />
                        <View style={styles.modalButtons}>
                            <Button
                                title='Cancelar'
                                onPress={handleCloseSendMessageModal}
                                buttonStyle={{ backgroundColor: '#888' }}
                            />
                            <Button
                                title='Enviar'
                                onPress={handleSendMessages}
                                disabled={!messageText.trim() || isSending}
                                loading={isSending}
                                buttonStyle={{ backgroundColor: '#00bfa5' }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
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
    textNoResults: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginVertical: 50,
        color: '#888',
        fontSize: 18
    },
    userListHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        padding: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
})