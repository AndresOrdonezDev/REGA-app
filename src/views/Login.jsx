import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button, Icon, Input } from "@rneui/themed";
import { useToast } from "react-native-toast-notifications";
import UseAuthStorage from "../hooks/UseAuthStorage";
import { useNavigation } from '@react-navigation/native'
export default function Login() {
  const { navigate } = useNavigation()

  const { handleLogin, handleGetAuthenticatedUser, isLoading } = UseAuthStorage();
  const toast = useToast();

  const [cellphone, setCellphone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Intentar recuperar el usuario autenticado al montar la vista
    const checkAuthenticatedUser = async () => {
      const user = await handleGetAuthenticatedUser();
      if (user) {
        toast.show("Sesión restaurada", { type: "success" });
        navigate("Home")
        // Redirigir si hay sesión persistente
      }
    };

    checkAuthenticatedUser();
  }, []);

  const handleSubmit = async () => {
    const user = await handleLogin(cellphone, password);
    if (user) {
      navigate("Home")
      // Redirigir al inicio si es exitoso
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <View style={styles.container}>
      <View style={[styles.loginContainer, { alignItems: 'center' }]}>
        <Image
          source={require('../../assets/logos/rega.png')}
          style={styles.logo}
        />
        <Text style={styles.appName}>REGA</Text>
        <Text style={styles.title}>Iniciar Sesión</Text>
      </View>

      <View style={styles.form}>
        <Input
          placeholder="Número de Teléfono"
          keyboardType="phone-pad"
          leftIcon={<Icon name="phone" color="#00bfa5" />}
          value={cellphone}
          onChangeText={(text) => setCellphone(text)}
          containerStyle={styles.input}
        />

        <Input
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
          leftIcon={<Icon name="lock-outline" color="#00bfa5" />}
          rightIcon={
            <Icon
              name={showPassword ? "eye-off" : "eye"}
              type="material-community"
              color="#00bfa5"
              onPress={togglePasswordVisibility}
            />
          }
          value={password}
          onChangeText={(text) => setPassword(text)}
          containerStyle={styles.input}
        />


        <Button
          title={isLoading ? "Cargando..." : "Iniciar Sesión"}
          onPress={handleSubmit}
          disabled={isLoading}
          buttonStyle={styles.loginButton}

        />

        <Text onPress={() => navigate("Register")} style={styles.textRegister} >Registrarme en <Text style={{ color: '#00bfa5' }}>REGA</Text></Text>
        <Text onPress={() => navigate("ResetPassword")} style={styles.textRegister} >Recuperar <Text style={{ color: '#00bfa5' }}>contraseña</Text></Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    opacity: .82

  },
  form: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: "#00bfa5",
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    borderRadius: 5,
  },
  loginContainer: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    marginBottom: 20, // Espacio entre el contenedor y el formulario
  },
  logo: {
    width: 120, // Ajusta el tamaño del logo según lo necesites
    height: 120,
    marginBottom: 10, // Espacio entre el logo y el nombre de la app
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  textRegister: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'right'
  }
});