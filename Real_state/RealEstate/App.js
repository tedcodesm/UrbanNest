import { enableScreens } from 'react-native-screens';
enableScreens();

import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import StackNavigator from "./navigation/StackNavigator";
import "./global.css";
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
      <StackNavigator />
      </SocketProvider>
    </AuthProvider>
  );
}
