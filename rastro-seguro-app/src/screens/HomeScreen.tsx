import { View, Text, Button } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bienvenido a Rastro Seguro</Text>
      <Button title="Escanear QR" onPress={() => {}} />
      <Button title="Registrar Objeto" onPress={() => {}} />
    </View>
  );
}
