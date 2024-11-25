import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Icon, Input } from "@rneui/themed";
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
      <Text style={styles.title}>Registrarse</Text>

      <View style={styles.form}>
        <Input
          placeholder="Nombre"
          leftIcon={<Icon name="person" color="#777" />}
          value={form.name}
          onChangeText={(text) => handleChange("name", text)}
          containerStyle={styles.input}
        />
        <Input
          placeholder="Apellido"
          leftIcon={<Icon name="person" color="#777" />}
          value={form.last_name}
          onChangeText={(text) => handleChange("last_name", text)}
          containerStyle={styles.input}
        />
        <Input
          placeholder="Número de Teléfono"
          keyboardType="phone-pad"
          leftIcon={<Icon name="phone" color="#777" />}
          value={form.cellphone}
          onChangeText={(text) => handleChange("cellphone", text)}
          containerStyle={styles.input}
        />
        <Input
          placeholder="Contraseña"
          secureTextEntry
          leftIcon={<Icon name="lock" color="#777" />}
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
          containerStyle={styles.input}
        />

        <Button
          title="Registrarse"
          onPress={handleRegister}
          buttonStyle={styles.registerButton}
          icon={<Icon name="person-add" color="#fff" />}
        />

        <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          buttonStyle={styles.cancelButton}
          icon={<Icon name="close" color="#fff" />}
        />
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
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "#d9534f",
    paddingVertical: 10,
    borderRadius: 5,
  },
});