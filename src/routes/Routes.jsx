import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UseAuthStorage from "../hooks/UseAuthStorage";

const Stack = createNativeStackNavigator();

import Login from "../views/Login";
import Register from "../views/Register"; // Importar la pantalla de registro
import ResetPassword from "../views/ResetPassword";
import Home from "../views/Home";
import AddUser from "../views/AddUser";
import AdminUsers from "../views/AdminUsers";
import PendingRecords from "../views/PendingRecords";
import AdminRangeCities from "../views/AdminRangeCities";

export default function Routes() {
  const { handleGetAuthenticatedUser } = UseAuthStorage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const user = await handleGetAuthenticatedUser();
        setIsAuthenticated(!!user); // Validar si existe un usuario autenticado
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuthentication();
  }, []);

  if (loading) {
    return null; // Mostrar un estado de carga o spinner si es necesario
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? "Home" : "Login"}>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="usersList" component={AddUser} options={{ headerShown: false }} />
        <Stack.Screen name="Panel" component={AdminUsers} options={{ headerShown: false }} />
        <Stack.Screen name="pendingRecords" component={PendingRecords} options={{ headerShown: false }} />
        <Stack.Screen name="adminRageCities" component={AdminRangeCities} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}