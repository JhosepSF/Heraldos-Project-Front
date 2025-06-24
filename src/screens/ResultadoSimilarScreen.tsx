import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  Linking,
  Alert,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const BASE_URL = 'http://192.168.153.230:8000';

const enviarMensajeWhatsapp = (numero: string, mensaje: string) => {
  const url = `whatsapp://send?phone=${numero}&text=${encodeURIComponent(mensaje)}`;
  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'WhatsApp no está instalado en este dispositivo');
      }
    })
    .catch((err) => console.error('Error al abrir WhatsApp', err));
};

interface SimilarPerson {
  dni: string;
  nombre: string;
  alias: string;
  imagen_coincidente: string;
  similitud: number;
  location: string;
  charges: string[];
  riskLevel: 'ALTO' | 'MEDIO' | 'BAJO';
  warrant: string;
  lastSeen: string;
  contact: string;
}

type SimilarRoute = RouteProp<{ params: { data: SimilarPerson[] } }, 'params'>;

export default function ResultadoSimilarScreen() {
  const route = useRoute<SimilarRoute>();
  const similares = route.params?.data || [];
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);
  const navigation = useNavigation();

  const volverInicio = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Inicio' }],
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={volverInicio}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>⚠️ Posibles Similitudes</Text>

      <FlatList
        data={similares}
        keyExtractor={(item) => item.dni}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => setImagenSeleccionada(`${BASE_URL}${item.imagen_coincidente}`)}>
              <Image
                source={{ uri: `${BASE_URL}${item.imagen_coincidente}` }}
                style={styles.image}
              />
            </TouchableOpacity>
            <Text style={styles.name}>{item.nombre} ({item.alias})</Text>
            <Text>Última vez visto: {new Date(item.lastSeen).toLocaleDateString()}</Text>
            <Text>Ubicación: {item.location}</Text>
            <Text>Orden: {item.warrant}</Text>
            <Text>Contacto: {item.contact}</Text>
            <Text>Cargos: {item.charges.join(', ')}</Text>
            <Text style={styles[`riesgo_${item.riskLevel}`]}>
              Riesgo: {item.riskLevel}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                enviarMensajeWhatsapp(
                  '51976570573',
                  `Persona Requisitoriado Encontrado:\n\nNombre: ${item.nombre}\nDNI: ${item.dni}`
                )
              }
            >
              <Text style={styles.buttonText}>Confirmar Similitud</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={!!imagenSeleccionada} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <Pressable style={styles.modalBackground} onPress={() => setImagenSeleccionada(null)} />
          <Image
            source={{ uri: imagenSeleccionada || '' }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#f9f9f9' },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backText: {
    marginLeft: 6,
    color: '#333',
    fontSize: 16,
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  card: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
  name: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  button: {
    backgroundColor: '#d32f2f',
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
  },
  buttonText: { color: '#fff', textAlign: 'center' },
  riesgo_ALTO: { color: 'red', fontWeight: 'bold' },
  riesgo_MEDIO: { color: '#f4a100', fontWeight: 'bold' },
  riesgo_BAJO: { color: 'green', fontWeight: 'bold' },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  fullImage: {
    width: '90%',
    height: '80%',
    borderRadius: 10,
  },
});
