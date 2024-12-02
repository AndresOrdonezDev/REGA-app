import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";
import { Button, Icon, Input } from "@rneui/themed";
import UseUsersStorage from "../hooks/UseUsersStorage";
import UseRolesStorage from "../hooks/UseRolesStorage";
import { useToast } from "react-native-toast-notifications";
//my functions
import { UserContext } from "../context/UserContext";

import SetRangeUserModal from "../components/SetRangeUserModal";

export default function AdminUsers() {
  const { user } = useContext(UserContext);
  const { handleFetchUsersFromApi, handleGetLocalUsers } = UseUsersStorage();
  const { handleFetchRolesFromApi, handleGetLocalRoles } = UseRolesStorage();
  const [showModal, setShowModal] = useState(true);
  const [usersLocal, setUsersLocal] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roles, setRoles] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const toast = useToast();

  useEffect(() => {
    loadLocalUsers();
    fetchUsersFromApi();
    fetchRoles();
  }, []);

  const loadLocalUsers = async () => {
    try {
      const localUsers = await handleGetLocalUsers();
      setUsersLocal(localUsers);
      setFilteredUsers(localUsers);
    } catch (error) {
      toast.show(`Error cargando usuarios locales: ${error}`, {
        type: "danger",
      });
    }
  };

  const fetchUsersFromApi = async () => {
    try {
      const serverUsers = await handleFetchUsersFromApi();
      setUsersLocal(serverUsers);
      setFilteredUsers(serverUsers);
    } catch (error) {
      toast.show(`Error fetching users from API: ${error}`, { type: "danger" });
    }
  };

  const fetchRoles = async () => {
    try {
      const localRoles = await handleGetLocalRoles();
      if (localRoles.length > 0) {
        setRoles(localRoles); // Usar roles locales
      } else {
        const rolesData = await handleFetchRolesFromApi();
        setRoles(rolesData); // Usar roles desde la API si no hay datos locales
      }
    } catch (error) {
      toast.show(`Error obteniendo los roles: ${error}`, { type: "danger" });
    }
  };

  const handleSearch = (text) => {
    if (text === "") {
      setFilteredUsers(usersLocal);
    } else {
      const filtered = usersLocal.filter(
        (user) =>
          `${user.name} ${user.last_name}`
            .toLowerCase()
            .includes(text.toLowerCase()) ||
          user.cellphone.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleModalClose = async () => {
    //obtener todos los usuarios
    setSelectedUser(null);
    setShowModal(false);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.usersContainer}>
        <View style={styles.leftContainer}>
          <Text style={styles.userLegend}>Asignar Rangos</Text>
        </View>
        <View style={styles.rightContainer}>
          <Button
            onPress={fetchUsersFromApi}
            title=" Ver asignados"
            icon={<Icon name="eye-outline" color="#fff" type="ionicon" />}
            radius="lg"
            color="#00bfa5"
          />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={{ flex: 5 }}>
          <Input
            onChangeText={(text) => handleSearch(text)}
            placeholder="Buscar por nombre o teléfono"
          />
        </View>
        <View style={{ flex: 0.5 }}>
          <Icon name="search" color="#00986c" />
        </View>
      </View>

      <Text style={styles.userListTitle}>
        Usuarios Registrados: {usersLocal.length} 
      </Text>
      <ScrollView style={{ marginBottom: 15, paddingHorizontal: 10 }}>
        {filteredUsers.map((userList, index) => (
          <View key={userList.id}>
            {userList.name !== user.user.name && (
              <View style={styles.userListItems} key={index}>
                <View
                  style={{
                    flex: 2,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: "#fff",
                      marginRight: 10,
                      borderRadius: 50,
                    }}
                  >
                    <Text style={{ textAlign: "center" }}>{index + 1}</Text>
                  </View>
                  <View>
                    <Text style={styles.userItemText}>
                      {userList.name} {userList.last_name}
                    </Text>
                    <Text style={styles.userItemText}>
                      {userList.cellphone}
                    </Text>
                  </View>
                </View>

                {user.role_name === "Administrador" &&
                  user.role_name === "Registrador" && (
                    <Button
                      onPress={() => handleSelectUser(userList)}
                      icon={<Icon name="keyboard-arrow-right" />}
                      radius="lg"
                      color="#fff"
                    />
                  )}
              </View>
            )}
          </View>
        ))}

        {!filteredUsers.length && (
          <Text style={styles.textNoResults}>
            No hay resultados de búsqueda
          </Text>
        )}
      </ScrollView>

      {roles && selectedUser && (
        <SetRangeUserModal
          visible={showModal}
          onClose={handleModalClose}
          roles={roles}
          selectedUser={selectedUser}
        />
      )}
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
    paddingHorizontal: 10,
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
  selectedUser: {
    borderColor: "#00bfa5",
    borderWidth: 2,
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
  roleContainer: {
    marginVertical: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    position: "relative", // Necesario para posicionar elementos absolutos dentro del contenedor
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  picker: {
    marginBottom: 10,
  },
  input: {
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#00bfa5",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  userToggle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#00bfa5",
  },
  userState: {
    fontSize: 14,
    color: "#777",
    marginRight: 10,
  },
  //styles each user
  userListItems: {
    padding: 10,
    backgroundColor: "#b2dfdb",
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  userItemText: {
    color: "#333333",
    fontWeight: "bold",
  },
});
