import { BarCodeScanner } from 'expo-barcode-scanner';
import { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) return <Text>Solicitando permiso...</Text>;
  if (hasPermission === false) return <Text>Permiso denegado</Text>;

  return (
    <BarCodeScanner
      onBarCodeScanned={({ data }) => alert(`Código escaneado: ${data}`)}
      style={{ flex: 1 }}
    />
  );
}
