import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import CustomHeader from '../components/CustomHeader';
import Footer from '../components/Footer';

import InicioScreen from '../screens/InicioScreen';
import ResultadoMatchScreen from '../screens/ResultadoMatchScreen';
import ResultadoSimilarScreen from '../screens/ResultadoSimilarScreen';
import ResultadoLimpioScreen from '../screens/ResultadoLimpioScreen';

const Stack = createNativeStackNavigator();

function AppLayout({ children, navigation }: any) {
  return (
    <View style={styles.appContainer}>
      <CustomHeader navigation={navigation} title="RequiFind" subtitle="Identificación facial" />
      <View style={styles.content}>{children}</View>
      <Footer />
    </View>
  );
}

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Inicio">
          {(props) => <AppLayout {...props}><InicioScreen {...props} /></AppLayout>}
        </Stack.Screen>
        <Stack.Screen name="ResultadoMatch">
          {(props) => <AppLayout {...props}><ResultadoMatchScreen {...props} /></AppLayout>}
        </Stack.Screen>
        <Stack.Screen name="ResultadoSimilar">
          {(props) => <AppLayout {...props}><ResultadoSimilarScreen {...props} /></AppLayout>}
        </Stack.Screen>
        <Stack.Screen name="ResultadoLimpio">
          {(props) => <AppLayout {...props}><ResultadoLimpioScreen {...props} /></AppLayout>}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default AppNavigator;
