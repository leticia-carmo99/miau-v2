import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
} from '@expo-google-fonts/josefin-sans';
import { Nunito_700Bold } from '@expo-google-fonts/nunito';

const { width, height } = Dimensions.get('window');
const LARANJA = '#FFAB36';
const TOP_HEIGHT = height * 0.001;

export default function CadOng() {
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
    Nunito_700Bold,
  });

 

  const [nome, setNome] = useState('');
  const [cep, setCep] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirma, setMostrarConfirma] = useState(false);

  const irParaProximaTela = () => {
    if (!nome || !cep || !email || !senha || !confirmaSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    if (senha !== confirmaSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    navigation.navigate('FormONG1', {
      nome,
      cep,
      email,
      senha,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topo} />

      <View style={styles.card}>
        <Image
          source={require('../../assets/gatoLaranja.png')}
          style={styles.gato}
          resizeMode="contain"
        />

        <TouchableOpacity
          style={styles.voltar}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color={LARANJA} />
        </TouchableOpacity>

        <Text style={[styles.titulo, { fontFamily: 'JosefinSans_700Bold' }]}>
          Cadastro
        </Text>

        <TextInput
          style={[styles.input, { fontFamily: 'JosefinSans_400Regular' }]}
          placeholder="Nome da ONG/Abrigo"
          placeholderTextColor="#999"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={[styles.input, { fontFamily: 'JosefinSans_400Regular' }]}
          placeholder="CEP:"
          keyboardType="numeric"
          placeholderTextColor="#999"
          value={cep}
          onChangeText={setCep}
        />
        <TextInput
          style={[styles.input, { fontFamily: 'JosefinSans_400Regular' }]}
          placeholder="E-mail:"
          keyboardType="email-address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.senhaContainer}>
          <TextInput
            style={[styles.senhaInput, { fontFamily: 'JosefinSans_400Regular' }]}
            placeholder="Senha:"
            placeholderTextColor={LARANJA}
            secureTextEntry={!mostrarSenha}
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
            <Icon
              name={mostrarSenha ? 'eye-off' : 'eye'}
              size={22}
              color={LARANJA}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.senhaContainer}>
          <TextInput
            style={[styles.senhaInput, { fontFamily: 'JosefinSans_400Regular' }]}
            placeholder="Confirmar Senha:"
            placeholderTextColor={LARANJA}
            secureTextEntry={!mostrarConfirma}
            value={confirmaSenha}
            onChangeText={setConfirmaSenha}
          />
          <TouchableOpacity onPress={() => setMostrarConfirma(!mostrarConfirma)}>
            <Icon
              name={mostrarConfirma ? 'eye-off' : 'eye'}
              size={22}
              color={LARANJA}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.botao} onPress={irParaProximaTela}>
          <Text style={[styles.botaoTexto, { fontFamily: 'Nunito_700Bold' }]}>
            Próximo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LARANJA,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  topo: {
    position: 'absolute',
    top: 0,
    height: height * 0.35,
    width: '100%',
    backgroundColor: LARANJA,
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    borderTopLeftRadius: width * 0.15,
    borderTopRightRadius: width * 0.1,
    paddingHorizontal: width * 0.08,
    paddingTop: height * 0.04,
    paddingBottom: height * 0.05,
    alignItems: 'center',
    shadowColor: '#000',
    elevation: 10,
    position: 'absolute',
    bottom: 0,
    height: height * 0.75,
  },
  voltar: {
    position: 'absolute',
    top: height * 0.025,
    left: width * 0.05,
    zIndex: 10,
  },
  gato: {
    position: 'absolute',
    top: TOP_HEIGHT - height * 0.178,
    alignSelf: 'center',
    width: width * 0.8,
    height: height * 0.5,
    zIndex: 2,
  },
  titulo: {
    fontSize: width * 0.06,
    color: LARANJA,
    marginBottom: height * 0.05,
  },
  input: {
    width: '100%',
    height: height * 0.07,
    backgroundColor: '#F7F7F7',
    borderRadius: 30,
    paddingHorizontal: 20,
    marginBottom: height * 0.02,
    fontSize: 16,
    color: '#333',
    zIndex: 3,
  },
  senhaContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: LARANJA,
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.02,
    backgroundColor: '#fff',
    height: height * 0.07,
  },
  senhaInput: {
    flex: 1,
    fontSize: width * 0.035,
    color: 'rgba(255, 171, 54, 0.6)',
  },
  botao: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: height * 0.03,
    alignItems: 'center',
    marginTop: height * 0.01,
    shadowColor: '#AAA',
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4.65,
    elevation: 9,
  },
  botaoTexto: {
    color: LARANJA,
    fontSize: width * 0.04,
  },
});
