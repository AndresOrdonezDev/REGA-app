import React, { useState, useEffect, useContext } from "react";
import { View, Text, Modal, StyleSheet, ScrollView, ActivityIndicator, Switch } from "react-native";
import { Button, Icon, Input, ListItem } from '@rneui/themed'
//my functions
import UseAdminRangeCities from "../hooks/UseAdminCities";

export default function SetRangeCityModal({ onClose, visible, rangeCitiesLocal }) {
    const { handleSaveRangeCity, inactiveRangeCity } = UseAdminRangeCities()
    const [expanded, setExpanded] = useState(false)
    const [expandedFrom, setExpandedFrom] = useState(false)
    const [selectedCity, setSelectedCity] = useState('')
    const [selectedRageEndCityFrom, setSelectedRangeEndCityFrom] = useState({range_end:'', city_name:''})
    const [isLoading, setIsLoading] = useState(false)
    const [messageAlert, setMessageAlert] = useState('')
    const [lastRage, setLast] = useState(0)
    const [citiesNoRanges, setCitiesNoRanges] = useState([])
    const [isAdditional, setIsAdditional] = useState(false)
    const [cityRangeData, setCityRangeData] = useState({
        city_name: '',
        range_end: 0,
    })

    const handleChange = (name, text) => {
        setCityRangeData({
            ...cityRangeData,
            [name]: name === 'city_name' ? text : Number(text)
        })
    }

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

    useEffect(() => {
        handleChange('city_name', selectedCity)
    }, [selectedCity])

    const handleSubmitRageCity = async () => {
        if (isAdditional) {
            if (!selectedRageEndCityFrom.city_name || !selectedCity) {
                setMessageAlert('Elija el municipio de origen y destino')
                setTimeout(() => {
                    setMessageAlert('')
                }, 3000)
                return
            }

            
            const prevRangeCity = rangeCitiesLocal.filter(city => city.range_end === `${selectedRageEndCityFrom.range_end}`)[0]
            const { range_end, is_active, last } = prevRangeCity
            await inactiveRangeCity({ ...prevRangeCity, is_active: '0', })
            await handleSaveRangeCity({ city_name: selectedCity, range_init: prevRangeCity.last, range_end, is_active, last })
            onClose()
            return
        }
        if (cityRangeData.city_name === '' || cityRangeData.range_end === 0) {
            setMessageAlert('Elija el municipio y el rango final')
            setTimeout(() => {
                setMessageAlert('')
            }, 3000)
            return
        }
        if (cityRangeData.range_end <= (lastRage + 1)) {
            setMessageAlert(`Elija un rango mayor a ${lastRage + 1}`)
            setTimeout(() => {
                setMessageAlert('')
            }, 3000)
            return
        }

        await handleSaveRangeCity({ ...cityRangeData, last: +lastRage + 1, range_init: +lastRage + 1, is_active: 1 })
        onClose()
    }

    useEffect(() => {
        setCityRangeData({
            city_name: '',
            range_end: 0,
        })
        setSelectedCity('')
        updateValuesToNewRegister()
        setExpandedFrom(false)
        setExpanded(false)
        setIsAdditional(false)
        setSelectedRangeEndCityFrom({range_end:'', city_name:''})
    }, [visible])


    const updateValuesToNewRegister = () => {
        const highestRangeEnd = rangeCitiesLocal.reduce((max, city) =>
            Math.max(max, city.range_end), 0);

        const filterCitiesNoRanges = municipalities.filter(name =>
            !rangeCitiesLocal.some(city => city.city_name === name && city.is_active !== "0")
        );
        setCitiesNoRanges(filterCitiesNoRanges ? filterCitiesNoRanges : municipalities)
        setLast(highestRangeEnd ? highestRangeEnd : 0);
    }

    const handleSwitchChange = (value) => {
        setIsAdditional(value);
        setSelectedCity('')
    };

    return (
        <Modal visible={visible} transparent animationType="fade" >
            <View style={styles.container} >
                <View style={styles.content}>
                    <View style={styles.closeContainer}>
                        <Text style={{ flex: 1, fontSize: 15 }}>Rango por municipio </Text>
                        <Button onPressOut={() => onClose()} icon={<Icon name="close" />} color='transparent' />
                    </View>
                    <ScrollView>
                        <View>
                            {!isAdditional && <View>
                                <ListItem.Accordion
                                    content={
                                        <ListItem.Content>
                                            <ListItem.Title>Municipio </ListItem.Title>
                                            <ListItem.Subtitle>{selectedCity ? selectedCity : 'Elige un municipio'}</ListItem.Subtitle>
                                        </ListItem.Content>
                                    }
                                    isExpanded={expanded}
                                    onPress={() => setExpanded(!expanded)}

                                >
                                    <ListItem>
                                        <ListItem.Content>
                                            {citiesNoRanges.map(name => (
                                                <ListItem.Title onPress={() => [setSelectedCity(name), setExpanded(false)]} style={styles.nameCity} key={name}><Text style={{ fontWeight: 'bold', color: '#00bfa5' }}>{name}</Text></ListItem.Title>
                                            ))}

                                        </ListItem.Content>
                                    </ListItem>
                                </ListItem.Accordion>
                                <Input
                                    style={styles.noOpacityDisabled}
                                    value={String(`Rango inicial: ${+lastRage + 1}`)}
                                    disabled={true}
                                    placeholder="Rango inicial"
                                />
                                <Input
                                    keyboardType="numeric"
                                    value={cityRangeData.range_end}
                                    onChangeText={(text) => handleChange('range_end', text)}
                                    placeholder="Rango final"
                                />


                            </View>}

                            {isAdditional && <View>
                                <Text>Asignar rangos de otro municipio</Text>
                                <View>
                                    <ListItem.Accordion
                                        content={
                                            <ListItem.Content>
                                                <ListItem.Title>Municipio </ListItem.Title>
                                                <ListItem.Subtitle>{selectedRageEndCityFrom.city_name ? selectedRageEndCityFrom.city_name : 'Municipio Origen'}</ListItem.Subtitle>
                                            </ListItem.Content>
                                        }
                                        isExpanded={expandedFrom}
                                        onPress={() => setExpandedFrom(!expandedFrom)}

                                    >
                                        <ListItem>
                                            <ListItem.Content>
                                                {rangeCitiesLocal.map((city, index) => (
                                                    <View key={index}>
                                                        {city.is_active === '1' && selectedCity !== city.city_name && <ListItem.Title onPress={() => [setSelectedRangeEndCityFrom({range_end:city.range_end, city_name:city.city_name} ), setExpandedFrom(false)]} style={styles.nameCity} >
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                                                                <Text style={{ color: '#00bfa5', textAlign: 'left', flex: 1, fontWeight: 'bold' }}>{city.city_name}: </Text>
                                                                <Text style={styles.textCityName}>{city.range_init} - {city.range_end}</Text>
                                                            </View>
                                                        </ListItem.Title>}
                                                    </View>

                                                ))}

                                            </ListItem.Content>
                                        </ListItem>
                                    </ListItem.Accordion>
                                </View>

                                <View>

                                    <ListItem.Accordion
                                        content={
                                            <ListItem.Content>
                                                <ListItem.Title>Municipio </ListItem.Title>
                                                <ListItem.Subtitle>{selectedCity ? selectedCity : 'Municipio Destino'}</ListItem.Subtitle>
                                            </ListItem.Content>
                                        }
                                        isExpanded={expanded}
                                        onPress={() => setExpanded(!expanded)}

                                    >
                                        <ListItem>
                                            <ListItem.Content>
                                                {municipalities.map(name => (
                                                    <View key={name}>
                                                        {name !== selectedRageEndCityFrom.city_name && <ListItem.Title onPress={() => [setSelectedCity(name), setExpanded(false)]} style={styles.nameCity} >
                                                            <Text style={{ color: '#00bfa5', fontWeight: 'bold' }}>{name}</Text>
                                                        </ListItem.Title>}
                                                    </View>
                                                ))}

                                            </ListItem.Content>
                                        </ListItem>
                                    </ListItem.Accordion>
                                </View>


                            </View>}


                            {rangeCitiesLocal.length !== 0  && <View style={{ justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ flex: 1, textAlign: 'right', fontSize: 15, marginRight: 15, color: '#333' }}>Es adicional: </Text>
                                <Switch
                                    value={isAdditional}
                                    onValueChange={handleSwitchChange}
                                    thumbColor={isAdditional ? '#00bfa5' : '#f4f4f4'}
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
                            onPress={() => handleSubmitRageCity()}
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