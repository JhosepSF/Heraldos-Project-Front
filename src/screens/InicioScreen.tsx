import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Animated,
} from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function InicioScreen() {
  const [fotoTomada, setFotoTomada] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [cargando, setCargando] = useState(false);
  const rotation = useState(new Animated.Value(0))[0];
  const navigation = useNavigation();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    if (cargando) {
      Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotation.stopAnimation();
      rotation.setValue(0);
    }
  }, [cargando]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const iniciarEscaneo = async () => {
    if (!permission?.granted) {
      await requestPermission();
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const photoUri = result.assets[0].uri;
      setFotoTomada(photoUri);
    }
  };

  const reiniciarCamara = () => {
    setFotoTomada(null);
  };

  const analizarImagen = async () => {
    if (!fotoTomada) return;

    setCargando(true);

    try {
      const formData = new FormData();
      formData.append('imagen', {
        uri: fotoTomada,
        name: 'foto.jpg',
        type: 'image/jpeg',
      });

      const response = await fetch('http://192.168.153.230:8000/api/verificar_foto/', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      console.log('Resultado del backend:', result);

      switch (result.nivel_confianza) {
        case 'match':
          navigation.navigate('ResultadoMatch', { data: result });
          break;
        case 'similar':
          navigation.navigate('ResultadoSimilar', { data: result.resultados });
          break;
        case 'clean':
          navigation.navigate('ResultadoLimpio');
          break;
        default:
          Alert.alert('Error', 'Rostro no identificado.');
      }
    } catch (error) {
      console.error('Error al analizar imagen:', error);
      Alert.alert('Error', 'No se pudo procesar la imagen. Verifica tu conexión o intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {fotoTomada ? (
          <Image source={{ uri: fotoTomada }} style={styles.camera} />
        ) : (
          <TouchableOpacity style={styles.touchArea} onPress={iniciarEscaneo}>
            <Ionicons name="camera-outline" size={64} color="#999" />
            <Text style={styles.title}>Toque para iniciar</Text>
            <Text style={styles.subtitle}>Escaneo facial</Text>
          </TouchableOpacity>
        )}
      </View>

      {fotoTomada && !cargando ? (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.retryButton} onPress={reiniciarCamara}>
            <Ionicons name="refresh" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.retryText}>Tomar de nuevo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.analyzeButton} onPress={analizarImagen}>
            <Ionicons name="search" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.analyzeText}>Analizar imagen</Text>
          </TouchableOpacity>
        </View>
      ) : cargando ? null : (
        <TouchableOpacity style={styles.scanButton} onPress={iniciarEscaneo}>
          <Ionicons name="camera" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.scanButtonText}>Iniciar Escaneo</Text>
        </TouchableOpacity>
      )}

      <Modal visible={cargando} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Animated.View style={{ transform: [{ rotate: spin }], marginBottom: 12 }}>
              <Ionicons name="search" size={52} color="#f44336" />
            </Animated.View>
            <Text style={styles.modalTitle}>Analizando...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7faff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    height: 420,
    backgroundColor: '#161B22',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2c2f3f',
  },
  camera: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  touchArea: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  title: {
    color: '#f0f3f5',
    fontSize: 20,
    marginTop: 12,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#999',
    fontSize: 15,
    marginTop: 4,
  },
  scanButton: {
    flexDirection: 'row',
    backgroundColor: '#e53935',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  retryButton: {
    flexDirection: 'row',
    backgroundColor: '#1e88e5',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
    elevation: 2,
  },
  retryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  analyzeButton: {
    flexDirection: 'row',
    backgroundColor: '#8e24aa',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  analyzeText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1E2233',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: 280,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
