import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Icon, Input, Image } from "@rneui/themed";
import { useToast } from "react-native-toast-notifications";
import ApiService from "../services/ApiService";

export default function ResetPassword({ navigation }) {
  const toast = useToast();
  const [form, setForm] = useState({
    cellphone: "",
    password: "",
    token: "",
  });
  const [step, setStep] = useState(1); // Controla el paso del formulario: 1 (celular), 2 (restablecer)

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleRequestResetPassword = async () => {
    try {
        console.log('cellphone ', form.cellphone)
      const response = await ApiService.requestResetPassword({ cellphone: form.cellphone });
      if (response.status === 200) {
        toast.show('Solicitud enviada. Verifica tu teléfono. 😉', { type: 'success', style: { backgroundColor: "#00bfa5" } })
        setStep(2); // Cambia al segundo paso
      } else {
        toast.show("Error en la solicitud 😨", { type: "danger" });
        throw new Error("Error al solicitar restablecimiento de contraseña.");
      }
    } catch (error) {
      toast.show("Error en la solicitud 😨", { type: "danger" });
      console.error("Error al solicitar restablecimiento:", error);
      toast.show("Error al solicitar restablecimiento. Inténtelo de nuevo.", { type: "danger" });
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await ApiService.resetPassword({
        cellphone: form.cellphone,
        password: form.password,
        token: form.token,
      });
      if (response.status === 200) {
        toast.show('Contraseña restablecida con éxito. 😉', { type: 'success', style: { backgroundColor: "#00bfa5" } })
        navigation.navigate("Login"); // Redirige al login
      } else {
        toast.show("Error en la solicitud 😨", { type: "danger" });
        throw new Error("Error al restablecer la contraseña.");
      }
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
     
      toast.show("Verifica tus datos 🌚", { type: "danger" });
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.loginContainer, { alignItems: "center" }]}>
        <Image
          source={require("../../assets/logos/rega.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Restablecer Contraseña</Text>
      </View>

      <View style={styles.form}>
        {/* Paso 1: Solicitar Restablecimiento */}
        {step === 1 && (
          <>
            <Input
              placeholder="Número de Teléfono"
              keyboardType="phone-pad"
              leftIcon={<Icon name="phone" color="#00bfa5" />}
              value={form.cellphone}
              onChangeText={(text) => handleChange("cellphone", text)}
              containerStyle={styles.input}
            />
            <Button
              title="Solicitar Restablecimiento"
              onPress={handleRequestResetPassword}
              radius="10"
              color="#00bfa5"
              disabled={!form.cellphone} // Deshabilita el botón si el campo está vacío
            />
          </>
        )}

        {/* Paso 2: Ingresar Token y Nueva Contraseña */}
        {step === 2 && (
          <>
            <Input
              placeholder="Código (Token)"
              leftIcon={<Icon name="vpn-key" color="#00bfa5" />}
              value={form.token}
              onChangeText={(text) => handleChange("token", text)}
              containerStyle={styles.input}
            />
            <Input
              placeholder="Nueva Contraseña"
              secureTextEntry
              leftIcon={<Icon name="lock-outline" color="#00bfa5" />}
              value={form.password}
              onChangeText={(text) => handleChange("password", text)}
              containerStyle={styles.input}
            />
            <Button
              title="Guardar"
              onPress={handleResetPassword}
              radius="10"
              color="#00bfa5"
              disabled={!form.password || !form.token} // Deshabilita si faltan datos
            />
          </>
        )}

        <Text onPress={() => navigation.goBack()} style={styles.textLogin}>
          ¿Recordaste tu contraseña?{" "}
          <Text style={{ color: "#00bfa5" }}>Iniciar Sesión</Text>
        </Text>
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
  textLogin: {
    fontWeight: "bold",
    color: "#333",
    marginTop: 18,
    textAlign: "right",
    fontSize: 15,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
});