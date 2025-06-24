import { View, Text, Button } from 'react-native';
import AppNavigator from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigate = useNavigation<any>();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Requisitoriados XD</Text>
      <Button title="Escanear QR" onPress={() => navigate.navigate('Scanner')} />
      <Button title="Registrar Objeto" onPress={() => navigate.navigate('Register')} />
    </View>
  );
}
