import { useState } from 'react';
import { FlatList, Image, Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import restCountriesClient from './utils/restCountriesClient';

interface Resposta {
  name: {
    common: string;
    official: string;
  };
  translations?: {
    rus?: {
      common?: string;
    };
  };
  maps?: {
    openStreetMaps?: string;
  };
  flags?: {
    png?: string;
  };
}

export default function App() {
  const [nomePais, setNomePais] = useState('');
  const [resultados, setResultados] = useState<Resposta[]>([]);
  const [mensagem, setMensagem] = useState('');

  const pesquisarPais = () => {
    const termo = nomePais.trim();

    if (!termo) {
      setResultados([]);
      setMensagem('Digite o nome de um país.');
      return;
    }

    setMensagem('');

    restCountriesClient
      .get(`/name/${encodeURIComponent(termo)}`)
      .then((response) => {
        setResultados(response.data);
      })
      .catch(() => {
        setResultados([]);
        setMensagem('Nenhum país encontrado.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pesquisa de Países</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome de um país"
        value={nomePais}
        onChangeText={setNomePais}
      />
      <Pressable style={styles.button} onPress={pesquisarPais}>
        <Text style={styles.buttonText}>Pesquisar país</Text>
      </Pressable>

      {mensagem && <Text style={styles.message}>{mensagem}</Text>}

      <FlatList
        style={styles.list}
        data={resultados}
        keyExtractor={(item) => item.name.common}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name.common}</Text>
            <Text style={styles.cardText}>Nome oficial: {item.name.official}</Text>
            <Text style={styles.cardText}>
              Nome em russo: {item.translations?.rus?.common || 'Não disponível'}
            </Text>
            <Text
              style={styles.link}
              onPress={() => {
                if (item.maps?.openStreetMaps) {
                  Linking.openURL(item.maps.openStreetMaps);
                }
              }}
            >
              OpenStreetMap: {item.maps?.openStreetMaps ?? 'Não disponível'}
            </Text>
            <Image
              source={{ uri: item.flags?.png }}
              style={styles.foto}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f4',
    paddingTop: 72,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f1f1f',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#bdbdbd',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
    color: '#1f1f1f',
  },
  button: {
    marginTop: 12,
    width: '100%',
    backgroundColor: '#2f2f2f',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  message: {
    marginTop: 16,
    color: '#5a5a5a',
    textAlign: 'center',
  },
  list: {
    width: '100%',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f1f1f',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  link: {
    fontSize: 14,
    color: '#1b5e99',
    textDecorationLine: 'underline',
  },
  foto: {
    width: 120,
    height: 80,
    marginTop: 10,
    borderRadius: 6,
  },
});
