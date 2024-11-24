import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ToastProvider } from "react-native-toast-notifications";
import Routes from './src/routes/Routes';
export default function App() {
  return (
    <SafeAreaProvider>
      <ToastProvider
        placement='bottom'
      >
      <SafeAreaView style={{ flex: 1 }}>
        <Routes/>
      </SafeAreaView>
      </ToastProvider>
    </SafeAreaProvider>
  );
}


