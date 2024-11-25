import React, { useCallback, useContext, useState, useEffect } from "react";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Button, Icon } from "@rneui/themed";
import { UserContext } from "../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UsePersonsStorage from "../hooks/UsePersonsStorage";

export default function Header() {

  const { goBack, navigate } = useNavigation();
  const { name } = useRoute();
  const { user, setUser } = useContext(UserContext); // Obtener usuario del contexto
  const [menuVisible, setMenuVisible] = useState(false);
  const { handleGetUser, handleSync, pendingRecords } = UsePersonsStorage()
  const [totalPending, setTotalPending] = useState([])

  useEffect(() => {
    const pending = pendingRecords.filter(user => user.is_synced === '0')
    setTotalPending(pending)
  }, [pendingRecords])

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await handleGetUser();
        await handleSync();
      };
      fetchData().catch(null);
    }, [handleGetUser, handleSync])
  );
  useEffect(() => {
    const fetchUser = async () => {
      if (!user || !user.user) {
        const storedUser = await AsyncStorage.getItem("@Auth-user");
        if (storedUser) {
          setUser(JSON.parse(storedUser)); // Establecer usuario en el contexto
        }
      }
    };
    fetchUser();
  }, [user, setUser]);

  const toggleMenu = () => setMenuVisible((prev) => !prev);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("@Auth-user"); // Eliminar usuario autenticado
      setUser(null); // Limpiar usuario en el contexto
      navigate("Login"); // Redirigir a la pantalla de inicio de sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handlePendingRecords = () => {
    navigate("pendingRecords")
  }

  const navigateToAdminUsers = () => {
    setMenuVisible(false); // Cerrar el menú
    navigate("Panel"); // Redirigir al Panel de Administración
  };

  return (
    <View style={styles.container}>
      {/* Muestra el botón de retroceso solo si no estás en 'Home' */}
      {name !== "Home" && (
        <View style={styles.arrowContainer}>
          <Button
            onPress={() => goBack()}
            icon={<Icon name="arrow-back" color="#333333" />}
            color="transparent"
          />
        </View>
      )}

      <View style={styles.leftContainer}>
        <Text style={styles.name}>
          {user?.user?.name && user?.user?.last_name
            ? `${user.user.name} ${user.user.last_name}`
            : "Usuario"}
        </Text>
        <Text style={styles.text}>{user?.user?.role_name || "Rol no asignado"}</Text>



      </View>

      <View style={styles.rightContainer}>

        <TouchableOpacity
          style={styles.syncButton}
          activeOpacity={0.7}
          onPress={() => handlePendingRecords()}
        >
          <Icon name="sync" size={24} color="#00bfa5" />
          {totalPending.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalPending.length}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleMenu}>
          <Image
            style={styles.image}
            source={{
              uri: user?.user?.uri || "https://cdn-icons-png.flaticon.com/512/6596/6596121.png",
            }}
          />
        </TouchableOpacity>
        {menuVisible && (
          <View style={styles.card}>
            <TouchableOpacity onPress={navigateToAdminUsers} style={styles.menuItem}>
              <Text style={styles.menuText}>Admin</Text>
              <Button
                color='transparent'
                icon={<Icon name="supervisor-account" color="#fff" />}

              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.menuLogout}>
              <Text style={styles.menuText}>salir</Text>
              <Button
                color='transparent'
                
                icon={<Icon name="logout" color="#fff" />}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  leftContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333333",
  },
  text: {
    fontSize: 12,
    color: "#808080",
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  arrowContainer: {
    marginRight: 10,
  },
  card: {
    position: "absolute",
    top: 50,
    right: 0,
    width: 150,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 5,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1000,
  },
  adminButton: {
    backgroundColor: "#007BFF",
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: "#d9534f",
  },
  syncButton: {
    position: 'absolute',
    right: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    marginLeft: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  menuItem:{
    flex: 1, 
    alignContent: 'center', 
    alignItems: 'center', 
    justifyContent: "center", 
    flexDirection: 'row', 
    backgroundColor: '#00bfa5', 
    borderRadius: 15
  },
  menuLogout:{
    flex: 1, 
    alignContent: 'center', 
    alignItems: 'center', 
    justifyContent: "center", 
    flexDirection: 'row', 
    backgroundColor: '#00bfa5', 
    borderRadius: 15,
    marginTop: 15
  },
  menuText:{
    flex: 1, 
    paddingLeft: 15, 
    color: '#fff'
  }
});