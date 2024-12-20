import React, { useContext, useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Button, Icon } from "@rneui/themed";
import { UserContext } from "../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UsePersonsStorage from "../hooks/UsePersonsStorage";
import UseAuthStorage from "../hooks/UseAuthStorage";
import { exportToExcel } from "../helpers/ExportToExcel";
import { useToast } from "react-native-toast-notifications";

export default function Header({ totalPersons }) {
  const { handleGetPersons, handleGetPersonsAdmin } = UsePersonsStorage()
  const { handleDeleteAuth } = UseAuthStorage()
  const { navigate } = useNavigation();
  const { name } = useRoute();
  const { user, setUser, } = useContext(UserContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const [totalPending, setTotalPending] = useState(0)

  const toast = useToast()

  useEffect(() => {
    getTotalRecords()
  }, [totalPersons]);

  const getTotalRecords = async () => {
    const total = await handleGetPersons()
    const totalSynced = total.filter(person => person.is_synced === '0').length
    setTotalPending(totalSynced)
  }


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


  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("@Auth-user"); // Eliminar usuario autenticado
      setUser(null); // Limpiar usuario en el contexto
      await handleDeleteAuth()
      navigate("Login"); // Redirigir a la pantalla de inicio de sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handlePendingRecords = () => {
    navigate("pendingRecords")
  }

  const handleHome = () => {
    navigate("Home")
  }

  const navigateToAdminUsers = () => {
    setMenuVisible(false); // Cerrar el menú
    navigate("Panel"); // Redirigir al Panel de Administración
  };

  const navigateToView = (view) => {
    navigate(view)
  }

  const handleExportData = async () => {
    try {

      if (user.user.role_name === 'Registrador') {
        const persons = await handleGetPersons()
        persons.length && await exportToExcel(persons, "PersonsData.xlsx");
        return toast.show('Archivo exportado correctamente 👌', { type: 'success', style: { backgroundColor: "#00bfa5" } })
      } else {
        const persons = await handleGetPersonsAdmin()
        persons.length && await exportToExcel(persons, "PersonsData.xlsx");
        return toast.show('Archivo exportado correctamente 👌', { type: 'success', style: { backgroundColor: "#00bfa5" } })
      }


    } catch (error) {
      toast.show("No se pudo exportar el archivo 😨", { type: "danger" });

      console.error("Error al exportar los datos:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Muestra el botón de retroceso solo si no estás en 'Home' */}
      {name !== "Home" && (
        <View style={styles.arrowContainer}>
          <Button
            onPress={() => handleHome()}
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
        {user?.user?.role_name === 'Registrador' && <TouchableOpacity
          style={styles.syncButton}
          activeOpacity={0.7}
          onPress={() => handlePendingRecords()}
        >
          <Icon name="sync" size={24} color="#00bfa5" />
          {totalPending > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalPending}</Text>
            </View>
          )}
        </TouchableOpacity>}


        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <Image
            style={styles.image}
            source={{
              uri: user?.user?.uri || "https://cdn-icons-png.flaticon.com/512/6596/6596121.png",
            }}
          />
        </TouchableOpacity>
        {menuVisible && (
          <View style={styles.card}>

            {user?.user?.role_name !== 'Registrador' && <TouchableOpacity onPress={navigateToAdminUsers} style={styles.menuItem}>
              <Text style={styles.menuText}>Usuarios</Text>
              <Button
                color='transparent'
                icon={<Icon name="supervisor-account" color="#fff" />}
                onPress={navigateToAdminUsers}
              />
            </TouchableOpacity>}
            {user?.user?.role_name === 'Administrador' && <TouchableOpacity onPress={() => navigateToView('adminRageCities')} style={styles.menuLogout}>
              <Text style={styles.menuText}>Municipios</Text>
              <Button
                color="transparent"
                icon={<Icon name="home-outline" color="#fff" type="ionicon" />}
                onPress={() => navigateToView('adminRageCities')}
              />
            </TouchableOpacity>}
            {user?.user?.role_name !== 'Coordinador' && <TouchableOpacity onPress={handleExportData} style={styles.menuLogout}>
              <Text style={styles.menuText}>Exportar</Text>
              <Button
                color="transparent"
                icon={<Icon name="cloud-download-outline" color="#fff" type="ionicon" />}
                onPress={handleExportData}
              />
            </TouchableOpacity>
            }
            {user?.user?.role_name !== 'Administrador' &&  <TouchableOpacity onPress={() => navigateToView('assignedRanges')} style={styles.menuLogout}>
              <Text style={styles.menuText}>Rangos</Text>
              <Button
                color="transparent"
                icon={<Icon name="layers" color="#fff" type="ionicon" />}
                onPress={() => navigateToView('assignedRanges')}
              />
            </TouchableOpacity>
            }
            

            <TouchableOpacity onPress={handleLogout} style={styles.menuLogout}>
              <Text style={styles.menuText}>Salir</Text>
              <Button
                color='transparent'
                icon={<Icon name="logout" color="#fff" />}
                onPress={handleLogout}
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
  menuItem: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: "center",
    flexDirection: 'row',
    backgroundColor: '#00bfa5',
    borderRadius: 15
  },
  menuLogout: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: "center",
    flexDirection: 'row',
    backgroundColor: '#00bfa5',
    borderRadius: 15,
    marginTop: 10
  },
  menuText: {
    flex: 1,
    paddingLeft: 15,
    color: '#fff'
  }
});