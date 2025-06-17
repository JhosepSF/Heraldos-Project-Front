import { View, Text, TextInput, Button, Image } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';
import QRDisplay from '../components/QRDisplay';

export default function RegisterObjectScreen() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const registrarObjeto = async () => {
    try {
      const response = await api.post('/objetos', {
        nombre,
        descripcion,
        foto, // Idealmente deberías subirla a un servicio tipo Cloudinary y guardar solo la URL
      });

      // Generar QR con el ID recibido
      const qrResponse = await api.post('/generarQR', {
        objetoId: response.data.objetoId,
      });

      setQrCode(qrResponse.data.qrCode);
    } catch (error) {
      console.error(error);
      alert('Error al registrar el objeto.');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Nombre del Objeto:</Text>
      <TextInput
        placeholder="Ej. Laptop Lenovo"
        value={nombre}
        onChangeText={setNombre}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <Text>Descripción:</Text>
      <TextInput
        placeholder="Ej. Color gris, pegatina azul"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <Button title="Seleccionar Foto" onPress={pickImage} />
      {foto && <Image source={{ uri: foto }} style={{ width: 150, height: 150, marginVertical: 10 }} />}

      <Button title="Registrar Objeto" onPress={registrarObjeto} />

      {qrCode && (
        <>
          <Text style={{ marginTop: 20, textAlign: 'center' }}>QR generado:</Text>
          <QRDisplay value={qrCode} />
        </>
      )}
    </View>
  );
}
