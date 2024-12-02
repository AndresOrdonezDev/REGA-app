import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Header from "../components/Header";
import { Button, Icon, Input } from "@rneui/themed";
//hooks
import UseAdminRangeCities from "../hooks/UseAdminCities";
//components
import SetRangeCityModal from "../components/SetRangeCityModal"

export default function AdminRangeUser() {

  const { getRangesCitiesLocal, totalCitiesLocal } = UseAdminRangeCities()
  const [showModal, setShowModal] = useState(false)
  const [rangeCitiesLocal, setRangeCitiesLocal] = useState([])
  const [filteredCities, setFilteredCities] = useState([]);


  useEffect(() => {
    handleGetAllRangesCities()
  }, [])

  
  const handleModalClose = async () => {
    handleGetAllRangesCities()
    setShowModal(false)
  }


  const handleGetAllRangesCities = async () => {
    const getAllCities = await getRangesCitiesLocal()
    setRangeCitiesLocal(getAllCities)
    
    setFilteredCities(getAllCities)
  }

  const handleSearch = (text) => {
    if (text === '') {
      setFilteredCities(rangeCitiesLocal)
    } else {
      const filtered = rangeCitiesLocal.filter((city) =>
        city.city_name.toLowerCase().includes(text.toLowerCase())||
        `${city.range_end}`.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  };


  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.cityContainer}>
        <View style={styles.leftContainer}>
          <Text style={styles.cityLegend}>Listado de usuarios</Text>
        </View>
        <View style={styles.rightContainer}>
          <Button
            onPress={() => setShowModal(true)}
            title="Asignar rango"
            icon={<Icon name="numbers" color="#fff" />}
            radius="lg"
            color="#00bfa5"
          />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={{ flex: 5 }}>
          <Input onChangeText={(text) => handleSearch(text)} placeholder="Buscar municipio" />
        </View>
        <View style={{ flex: 0.5 }}>
          <Icon name="search" color="#00986c" />
        </View>
      </View>

      <Text style={styles.cityListTitle}>Rangos Registrados: {rangeCitiesLocal?.length}</Text>
      <ScrollView style={{ marginBottom: 15, paddingHorizontal: 10 }}>
        {filteredCities?.map((city, index) => (
          <View style={styles.cityListItems} key={index}>
            <View style={{ flex: 2, flexDirection: 'row', alignItems: "center", }}>
              <View style={{ width: 20, height: 20, backgroundColor: '#fff', marginRight: 10, borderRadius: 50 }}>
                <Text style={{ textAlign: 'center' }}>{index + 1}</Text>
              </View>
              <View>
                <Text style={styles.cityItemText}>{city.city_name} {!+city.is_active && <Text style={{color:'red', fontWeight:'bold'}}>Inactivo</Text> } </Text>
                <Text style={styles.cityItemText}>Rango inicial: {city.range_init} - Rango Final: {city.range_end}</Text>
              </View>
            </View>
            
          </View>

        ))}

      </ScrollView>

      <SetRangeCityModal visible={showModal} onClose={handleModalClose} rangeCitiesLocal={rangeCitiesLocal}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: "#fff",
  },
  cityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  leftContainer: {
    flex: 1,
    justifyContent: "center",
  },
  rightContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  cityLegend: {
    fontSize: 20,
    paddingHorizontal:10
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cityListTitle: {
    marginBottom: 5,
    padding: 10,
    fontWeight: "bold",
    fontSize: 15,
    color: "#777",
  },
  cityName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  
  textNoResults: {
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 50,
    color: "#888",
    fontSize: 18,
  },
  cityListItems: {
    padding: 10,
    backgroundColor: '#b2dfdb',
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sText: {
    color: '#333333',
    fontWeight: 'bold'
  }
});