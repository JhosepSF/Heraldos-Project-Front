import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
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

interface PersonData {
  nombre: string;
  alias: string;
  dni: string;
  age: number;
  lastSeen: string;
  location: string;
  charges: string[];
  riskLevel: 'ALTO' | 'MEDIO' | 'BAJO';
  warrant: string;
  contact: string;
  imagen_coincidente: string;
  nivel_confianza: 'match';
  similitud: number;
}

type MatchRoute = RouteProp<{ params: { data: PersonData } }, 'params'>;

export default function ResultadoMatchScreen() {
  const route = useRoute<MatchRoute>();
  const data = route.params.data;
  const navigation = useNavigation();

  const volverInicio = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Inicio' }],
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={volverInicio}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>🚨 Requisitoriado Detectado</Text>

      <View style={styles.card}>
        <Image
          source={{ uri: `${BASE_URL}${data.imagen_coincidente}` }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.infoBox}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>{data.nombre} ({data.alias})</Text>

          <Text style={styles.label}>DNI:</Text>
          <Text style={styles.value}>{data.dni}</Text>

          <Text style={styles.label}>Edad:</Text>
          <Text style={styles.value}>{data.age} años</Text>

          <Text style={styles.label}>Última ubicación conocida:</Text>
          <Text style={styles.value}>{data.location} - {new Date(data.lastSeen).toLocaleDateString()}</Text>

          <Text style={styles.label}>Orden de Arresto:</Text>
          <Text style={styles.value}>{data.warrant}</Text>

          <Text style={styles.label}>Nivel de Riesgo:</Text>
          <Text style={[styles.value, styles[`riesgo_${data.riskLevel}`]]}>
            {data.riskLevel}
          </Text>

          <Text style={styles.label}>Cargos:</Text>
          <Text style={styles.value}>{data.charges.join(', ')}</Text>

          <Text style={styles.label}>Contacto:</Text>
          <Text style={styles.value}>{data.contact}</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            enviarMensajeWhatsapp(
              '51976570573',
              `Persona Requisitoriado Encontrado:\n\nNombre: ${data.nombre}\nDNI: ${data.dni}`
            )
          }
        >
          <Text style={styles.buttonText}>Confirmar Requisitoriado</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7faff',
    flexGrow: 1,
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backText: {
    marginLeft: 6,
    color: '#333',
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f44336',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoBox: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  value: {
    color: '#222',
    fontSize: 15,
  },
  riesgo_ALTO: {
    color: 'red',
    fontWeight: 'bold',
  },
  riesgo_MEDIO: {
    color: '#f4a100',
    fontWeight: 'bold',
  },
  riesgo_BAJO: {
    color: 'green',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#1e88e5',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
