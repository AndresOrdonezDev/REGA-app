import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Icon, Input,Image } from "@rneui/themed";
import { useToast } from "react-native-toast-notifications";
import ApiService from "../services/ApiService";

export default function Register({ navigation }) {
  const toast = useToast();
  const [form, setForm] = useState({
    name: "",
    last_name: "",
    cellphone: "",
    password: "",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };
  

  const handleRegister = async () => {
    try {
      const response = await ApiService.registerUser(form);
      if (response.status === 201) {
        toast.show("Registro exitoso. Ahora puede iniciar sesión.", { type: "success" });
        navigation.navigate("Login");
      } else {
        throw new Error("Error al registrarse");
      }
    } catch (error) {
      console.error("Error al registrarse:", error);
      toast.show("Error al registrarse. Inténtelo de nuevo.", { type: "danger" });
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.loginContainer, { alignItems: 'center' }]}>
        <Image
          source={require('../../assets/logos/rega.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Registrar cuenta</Text>
      </View>

      <View style={styles.form}>
        <Input
          placeholder="Nombre"
          leftIcon={<Icon name="person-outline" color="#00bfa5" />}
          value={form.name}
          onChangeText={(text) => handleChange("name", text)}
          containerStyle={styles.input}
        />
        <Input
          placeholder="Apellido"
          leftIcon={<Icon name="person-outline" color="#00bfa5" />}
          value={form.last_name}
          onChangeText={(text) => handleChange("last_name", text)}
          containerStyle={styles.input}
        />
        <Input
          placeholder="Número de Teléfono"
          keyboardType="phone-pad"
          leftIcon={<Icon name="phone" color="#00bfa5" />}
          value={form.cellphone}
          onChangeText={(text) => handleChange("cellphone", text)}
          containerStyle={styles.input}
        />
        <Input
          placeholder="Contraseña"
          secureTextEntry
          leftIcon={<Icon name="lock-outline" color="#00bfa5" />}
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
          containerStyle={styles.input}
        />

        <Button
          title="Registrarse"
          onPress={handleRegister}
          radius='10'
          color='#00bfa5'
        />

        <Text onPress={() => navigation.goBack()} style={styles.textLogin}>¿Ya tienes una cuenta? <Text style={{color:'#00bfa5'}}>Iniciar sSesión</Text></Text>
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
  registerButton: {
    backgroundColor: "#00bfa5",
  },
  textLogin:{
    fontWeight:'bold',
    color:'#333',
    marginTop:18,
    textAlign:'right',
    fontSize:15
  },
  logo: {
    width: 120, // Ajusta el tamaño del logo según lo necesites
    height: 120,
    marginBottom: 10, // Espacio entre el logo y el nombre de la app
  }
  
});