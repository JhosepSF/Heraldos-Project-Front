import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ScannerScreen from '../screens/ScannerScreen';
import RegisterObjectScreen from '../screens/RegisterObjectScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Registrar Objeto" component={RegisterObjectScreen} />
      <Stack.Screen name="Escanear QR" component={ScannerScreen} />
    </Stack.Navigator>
  );
}
