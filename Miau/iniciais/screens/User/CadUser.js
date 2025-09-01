import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const LARANJA = '#FFAB36';
const TOP_HEIGHT = height * 0.001;

export default function CadUser() {
  const navigation = useNavigation();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirma, setMostrarConfirma] = useState(false);

  const irParaQuemSomos = () => {
    navigation.navigate('AboutUs1');
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
          onPress={() => navigation.goBack('loginUser')}>
          <Icon name="arrow-back" size={28} color={LARANJA} />
        </TouchableOpacity>

        <Text style={styles.titulo}>Cadastro</Text>

        <TextInput
          style={styles.input}
          placeholder="Usuário:"
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="CPF:"
          keyboardType="numeric"
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail:"
          keyboardType="email-address"
          placeholderTextColor="#999"
        />

        <View style={styles.senhaContainer}>
          <TextInput
            style={styles.senhaInput}
            placeholder="Senha:"
            placeholderTextColor={LARANJA}
            secureTextEntry={!mostrarSenha}
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
            style={styles.senhaInput}
            placeholder="Confirmar Senha:"
            placeholderTextColor={LARANJA}
            secureTextEntry={!mostrarConfirma}
          />
          <TouchableOpacity
            onPress={() => setMostrarConfirma(!mostrarConfirma)}>
            <Icon
              name={mostrarConfirma ? 'eye-off' : 'eye'}
              size={22}
              color={LARANJA}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.botao} onPress={irParaQuemSomos}>
          <Text style={styles.botaoTexto}>Cadastrar</Text>
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
    fontWeight: 'bold',
    color: LARANJA,
    marginBottom: height * 0.02,
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
    fontWeight: 'bold',
  },
});
