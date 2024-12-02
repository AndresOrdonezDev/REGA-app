import React, { useState, useEffect, useContext } from "react";
import { View, Text, Modal, StyleSheet, ScrollView, ActivityIndicator, Switch } from "react-native";
import { Button, Icon, Input, ListItem } from '@rneui/themed'
//my functions


export default function SetRangeUserModal({ onClose, visible, roles, selectedUser }) {
    const [expanded, setExpanded] = useState(false)
    const [selectedCity, setSelectedUser] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [messageAlert, setMessageAlert] = useState('')
    const [rolSelected, setRolSelected] = useState('')
    const [lastRage, setLast] = useState(0)
    const [userRangeData, setUserRangeData] = useState({
        name: '',
        range_end: 0,
    })

    const handleChange = (name, text) => {
        setUserRangeData({
            ...userRangeData,
            [name]: name === 'name' ? text : Number(text)
        })
    }




    const handleSubmitRangeUser = async () => {

        if (userRangeData.name === '' || userRangeData.range_end === 0) {
            setMessageAlert('Elija un usuario y el rango final')
            setTimeout(() => {
                setMessageAlert('')
            }, 3000)
            return
        }
        if (userRangeData.range_end <= (lastRage + 1)) {
            setMessageAlert(`Elija un rango mayor a ${lastRage + 1}`)
            setTimeout(() => {
                setMessageAlert('')
            }, 3000)
            return
        }
        onClose()
    }

    useEffect(() => {
        setUserRangeData({
            name: '',
            range_end: 0,
        })
        setSelectedUser('')
        // updateValuesToNewRegister()
        setExpanded(false)


        console.log('data roles modal', selectedUser)
    }, [visible])


    // const updateValuesToNewRegister = () => {
    //     const highestRangeEnd = rangeAllUsers.reduce((max, city) =>
    //         Math.max(max, city.range_end), 0);

    //     setLast(highestRangeEnd);
    // }
    return (
        <Modal visible={visible} transparent animationType="fade" >
            <View style={styles.container} >
                <View style={styles.content}>
                    <View style={styles.closeContainer}>
                        <Text style={{ flex: 1, fontSize: 15 }}>Rango por usuario </Text>
                        <Button onPressOut={() => onClose()} icon={<Icon name="close" />} color='transparent' />
                    </View>
                    <ScrollView>
                        <View>
                            <Input
                                style={styles.noOpacityDisabled}
                                value={`${selectedUser.name} ${selectedUser.last_name} `}
                                disabled={true}
                                placeholder="Rango inicial"
                            />

                            <ListItem.Accordion
                                content={
                                    <ListItem.Content>
                                        <ListItem.Title>Rol Usuario </ListItem.Title>
                                        <ListItem.Subtitle>{rolSelected ? rolSelected : 'Elige un rol'}</ListItem.Subtitle>
                                    </ListItem.Content>
                                }
                                isExpanded={expanded}
                                onPress={() => setExpanded(!expanded)}

                            >
                                <ListItem>
                                    <ListItem.Content>
                                        {roles?.map(rol => (
                                            <ListItem.Title onPress={() => [setRolSelected(rol?.name_role), setExpanded(false)]} style={styles.nameCity} key={rol.id}><Text style={{ fontWeight: 'bold', color: '#00bfa5' }}>{rol?.name_role}</Text></ListItem.Title>
                                        ))}

                                    </ListItem.Content>
                                </ListItem>
                            </ListItem.Accordion>
                            {rolSelected && <View>
                                <Input
                                    style={styles.noOpacityDisabled}
                                    value={String(`Rango inicial: ${+lastRage + 1}`)}
                                    disabled={true}
                                    placeholder="Rango inicial"
                                />

                                <Input
                                    keyboardType="numeric"
                                    value={userRangeData.range_end}
                                    onChangeText={(text) => handleChange('range_end', text)}
                                    placeholder="Rango final"
                                />
                            </View>}
                        </View>

                    </ScrollView>

                    <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end', paddingVertical: 10, flexDirection: 'row', gap: 10 }}>
                        {isLoading && <ActivityIndicator color='#00bfa5' size="large" />}
                        <Button
                            title='Guardar'
                            color='#00bfa5'
                            radius='lg'
                            onPress={() => handleSubmitRangeUser()}
                            disabled={isLoading}
                        />

                    </View>
                    {messageAlert && <Text style={styles.alertText}>{messageAlert}</Text>}

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
        marginVertical: 3
    },
    alertText: {
        color: 'red',
        textAlign: 'center',
        borderStartWidth: 2,
        borderRightColor: 'red',
        fontSize: 15
    },
    noOpacityDisabled: {
        opacity: 1,
        color: '#000'
    },
    textCityName: {
        color: '#333',
        textAlign: 'right',
        fontWeight: 'bold'
    }

})