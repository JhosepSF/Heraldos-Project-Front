import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function ResultadoLimpioScreen() {
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

      <Text style={styles.alert}>⚠️ Sin Coincidencia Exacta</Text>
      <Text style={styles.text}>No se encontró ninguna coincidencia.</Text>

      <View style={styles.okCard}>
        <Text style={styles.okTitle}>✅ Persona Sin Requisitoria</Text>
        <Text style={styles.okText}>Sin antecedentes ni similitudes detectadas.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alert: { fontSize: 20, fontWeight: 'bold', color: '#f4a100', marginBottom: 10 },
  text: { fontSize: 16, textAlign: 'center', marginBottom: 30 },
  okCard: {
    backgroundColor: '#e0f2f1',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  okTitle: { fontSize: 18, color: 'green', fontWeight: 'bold' },
  okText: { fontSize: 14, marginTop: 8 },
});
