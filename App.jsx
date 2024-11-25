import React, { useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ToastProvider } from "react-native-toast-notifications";
import Routes from './src/routes/Routes';
import UsePersonsStorage from './src/hooks/UsePersonsStorage';
import { UserProvider } from "./src/context/UserContext";

export default function App() {
  const { handleSync, handleGetLocalPersons } = UsePersonsStorage();

  useEffect(() => {
    handleSync(); // Sincroniza datos automáticamente al montar
  }, []);
  
  return (
    <SafeAreaProvider>
      <ToastProvider
        placement='bottom'
      >
        <UserProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <Routes />
          </SafeAreaView>
        </UserProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
}


