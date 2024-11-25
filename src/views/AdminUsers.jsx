import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Header from "../components/Header";
import { Button, Icon, Input } from "@rneui/themed";
import UseUsersStorage from "../hooks/UseUsersStorage";

export default function AdminUsers() {
  const { handleFetchUsersFromApi, handleGetLocalUsers } = UseUsersStorage();
  const [usersLocal, setUsersLocal] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    loadLocalUsers();
    fetchUsersFromApi();
  }, []);

  // Cargar usuarios locales desde AsyncStorage
  const loadLocalUsers = async () => {
    try {
      const localUsers = await handleGetLocalUsers();
      setUsersLocal(localUsers);
      setFilteredUsers(localUsers);
    } catch (error) {
      console.error("Error loading local users:", error);
    }
  };

  // Descargar usuarios desde el servidor
  const fetchUsersFromApi = async () => {
    try {
      const serverUsers = await handleFetchUsersFromApi();
      setUsersLocal(serverUsers);
      setFilteredUsers(serverUsers);
    } catch (error) {
      console.error("Error fetching users from API:", error);
    }
  };

  // Filtrar usuarios por búsqueda
  const handleSearch = (text) => {
    if (text === "") {
      setFilteredUsers(usersLocal);
    } else {
      const filtered = usersLocal.filter((user) =>
        `${user.name} ${user.last_name}`.toLowerCase().includes(text.toLowerCase()) ||
        user.cellphone.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.usersContainer}>
        <View style={styles.leftContainer}>
          <Text style={styles.userLegend}>Listado de usuarios</Text>
        </View>
        <View style={styles.rightContainer}>
          <Button
            onPress={fetchUsersFromApi}
            title="Actualizar"
            icon={<Icon name="refresh" color="#fff" />}
            radius="lg"
            color="#00bfa5"
          />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={{ flex: 5 }}>
          <Input onChangeText={(text) => handleSearch(text)} placeholder="Buscar por nombre o teléfono" />
        </View>
        <View style={{ flex: 0.5 }}>
          <Icon name="search" color="#00986c" />
        </View>
      </View>
      <Text style={styles.userListTitle}>Usuarios Registrados: {usersLocal.length}</Text>
      <ScrollView style={{ marginBottom: 15 }}>
        {filteredUsers.map((user, index) => (
          <View key={index} style={styles.userItem}>
            <Text style={styles.userName}>{`${user.name} ${user.last_name}`}</Text>
            <Text style={styles.userPhone}>{user.cellphone}</Text>
          </View>
        ))}

        {!filteredUsers.length && (
          <Text style={styles.textNoResults}>No hay resultados de búsqueda</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: "#fff",
  },
  usersContainer: {
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
  userLegend: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userListTitle: {
    marginBottom: 5,
    padding: 10,
    fontWeight: "bold",
    fontSize: 15,
    color: "#777",
  },
  userItem: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  userPhone: {
    fontSize: 14,
    color: "#555",
  },
  textNoResults: {
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 50,
    color: "#888",
    fontSize: 18,
  },
});
