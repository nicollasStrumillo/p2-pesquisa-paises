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
  const [modoCapital, setModoCapital] = useState(false);

  const pesquisarPais = () => {
    const termo = nomePais.trim();

    if (!termo) {
      setResultados([]);
      setMensagem('Digite o nome de um país.');
      return;
    }

    setMensagem('');
    setModoCapital(false);

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

  const pesquisarPorCapital = () => {
    const termo = nomePais.trim();

    if (!termo) {
      setResultados([]);
      setMensagem('Digite o nome de uma capital.');
      return;
    }

    setMensagem('');
    setModoCapital(true);

    restCountriesClient
      .get(`/capital/${encodeURIComponent(termo)}`)
      .then((response) => {
        setResultados(response.data);
      })
      .catch(() => {
        setResultados([]);
        setMensagem('Nenhum país encontrado para essa capital.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pesquisa de Países</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome de um país ou sua capital"
        value={nomePais}
        onChangeText={setNomePais}
      />
      <View style={styles.buttonRow}>
        <Pressable style={[styles.button, styles.buttonMetade]} onPress={pesquisarPais}>
          <Text style={styles.buttonText}>Pesquisar por nome</Text>
        </Pressable>
        <Pressable style={[styles.buttonCapital, styles.buttonMetade]} onPress={pesquisarPorCapital}>
          <Text style={styles.buttonCapitalText}>Pesquisar por capital</Text>
        </Pressable>
      </View>

      {mensagem && <Text style={styles.message}>{mensagem}</Text>}

      <FlatList
        style={styles.list}
        data={resultados}
        keyExtractor={(item) => item.name.common}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {modoCapital ? (
              <View>
                <Text style={styles.cardText}>{item.name.official}</Text>
                <Image
                  source={{ uri: item.flags?.png }}
                  style={styles.foto}
                />
              </View>
            ) : (
              <View>
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
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242323',
    paddingTop: 74,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  title: {
    fontSize: 27,
    fontWeight: '700',
    color: '#fcfcfc',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
    color: '#1f1f1f',
  },
  button: {
    marginTop: 12,
    width: '100%',
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonCapital: {
    marginTop: 12,
    width: '100%',
    backgroundColor: '#1080c2',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontWeight: '600',
  },
  buttonCapitalText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  message: {
    marginTop: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  list: {
    width: '100%',
    marginTop: 20,
  },
  buttonRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 12,
  },
  buttonMetade: {
    width: '49%',
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
