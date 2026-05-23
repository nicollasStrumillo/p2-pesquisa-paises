import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import restCountriesClient from './utils/restCountriesClient';

export default function App() {
  useEffect(() => {
    restCountriesClient
      .get('/all?fields=name')
      .then((response) => {
        console.log('Resposta da API:', response.data);
      })
      .catch((error) => {
        console.log('Erro na API:', error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Testando a API no console</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
