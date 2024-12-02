import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from "react-native";
import Header from "../components/Header";
import { Picker } from '@react-native-picker/picker';
import { Button, Icon, Input } from "@rneui/themed";
import UseUsersStorage from "../hooks/UseUsersStorage";
import UseRolesStorage from "../hooks/UseRolesStorage";
import ApiService from "../services/ApiService";
import { useToast } from "react-native-toast-notifications";


export default function AdminUsers() {
  const { handleFetchUsersFromApi, handleGetLocalUsers } = UseUsersStorage();
  const { handleFetchRolesFromApi, handleGetLocalRoles } = UseRolesStorage();
  const [usersLocal, setUsersLocal] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [rangeValue, setRangeValue] = useState("");

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
      toast.show(`Error cargando usuarios locales: ${error}`, { type: "danger" });
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
      const filtered = usersLocal.filter((user) =>
        `${user.name} ${user.last_name}`.toLowerCase().includes(text.toLowerCase()) ||
        user.cellphone.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleSave = async () => {
    if (!selectedUser || !selectedRole) {
      toast.show("Debe seleccionar un usuario y un rol.", { type: "danger" });
      return;
    }
  
    const updatedUser = {
      ...selectedUser,
      role_id: selectedRole,
    };
  
    if (rangeValue) {
      updatedUser.range = rangeValue;
    }
  
    try {
      // Llamar al API con el usuario actualizado
      const response = await ApiService.updateUser(updatedUser.id, updatedUser);
  
      if (response.status === 200) {
        toast.show("Usuario actualizado exitosamente.", { type: "success", style: { backgroundColor: "#00bfa5" }  });
        // Refrescar la lista de usuarios
        fetchUsersFromApi();
  
        // Limpiar inputs después de guardar
        setSelectedRole(null);
        setRangeValue(""); // Limpiar el rango
      } else {
        toast.show("Error al actualizar el usuario.", { type: "danger" });
      }
    } catch (error) {
      toast.show("Error al actualizar el usuario. Verifique que todos los campos requeridos estén completos.", { type: "danger" });
    }
  }; 
  
  const handleToggleUserState = async (user) => {
    const updatedUser = {
      ...user,
      state: user.state === "1" ? "0" : "1", // Cambiar estado
    };
  
    try {
      const response = await ApiService.updateUser(updatedUser.id, updatedUser);
  
      if (response.status === 200) {
        toast.show("Estado del usuario actualizado exitosamente.", { type: "success", style: { backgroundColor: "#00bfa5" }  });
        fetchUsersFromApi(); // Refrescar la lista de usuarios
      } else {
        toast.show("Error al actualizar el estado del usuario.", { type: "danger" });
      }
    } catch (error) {
      toast.show("Error al actualizar el estado del usuario.", { type: "danger" });
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
            <View
            key={index}
            style={[styles.userItem, selectedUser?.id === user.id ? styles.selectedUser : null]}
            onTouchEnd={() => setSelectedUser(user)}
            >
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{`${user.name} ${user.last_name}`}</Text>
                <Text style={styles.userPhone}>{user.cellphone}</Text>
                <Text style={styles.userPhone}>
                {"Cant. boletas: " + (user.range ? user.range : "0")}
                </Text>
            </View>
            <View style={styles.userToggle}>
                <Text style={styles.userState}>
                {user.state === "1" ? "Activo" : "Inactivo"}
                </Text>
                <Switch
                    value={user.state === "1"}
                    onValueChange={() => handleToggleUserState(user)}
                    thumbColor={user.state === "1" ? "#00bfa5" : "#f4f3f4"} // Color del círculo
                    trackColor={{ false: "#d3d3d3", true: "#a3f3e1" }} // Color del fondo del toggle
                />
            </View>
            </View>
        ))}

        {!filteredUsers.length && (
            <Text style={styles.textNoResults}>No hay resultados de búsqueda</Text>
        )}
      </ScrollView>

      {selectedUser && (
        <View style={styles.roleContainer}>
            <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => {
                setSelectedUser(null); // Limpiar usuario seleccionado
                setSelectedRole(""); // Limpiar rol seleccionado
                setRangeValue(""); // Limpiar rango
            }}
            >
            <Icon name="close" size={20} color="#d9534f" />
            </TouchableOpacity>
            <Text style={styles.roleTitle}>
            Actualizar Rol para: {selectedUser.name} {selectedUser.last_name}
            </Text>

            <Picker
            selectedValue={selectedRole}
            onValueChange={(value) => {
                setSelectedRole(value);
                if (value !== "2") setRangeValue(""); // Limpiar rango si no es rol 2
            }}
            style={styles.picker}
            >
            <Picker.Item label="Seleccione un rol" value="" />
            {roles.map((role) => (
                <Picker.Item key={role.id} label={role.name_role} value={role.id.toString()} />
            ))}
            </Picker>

            {selectedRole === "2" && (
            <>
                <Text>Cantidad de boletas</Text>
                <Input
                placeholder="Ingrese el rango"
                keyboardType="numeric"
                value={rangeValue}
                onChangeText={(text) => setRangeValue(text)}
                containerStyle={styles.input}
                />
            </>
            )}

            <View style={styles.buttonContainer}>
            <Button
                title="Guardar"
                onPress={handleSave}
                buttonStyle={styles.saveButton}
                icon={<Icon name="save" color="#fff" />}
            />
            </View>
        </View>
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
    color: "#00bfa5"
  },
  userState: {
    fontSize: 14,
    color: "#777",
    marginRight: 10,
  },
});