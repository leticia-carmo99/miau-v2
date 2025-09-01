import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const { width, height } = Dimensions.get('window');
const ROXO = '#6A57D2';
const BRANCO = '#FFFFFF';

export default function TypePartner({ navigation }) {
  return (
    <View style={styles.container}>
    <TouchableOpacity
        style={styles.backArrow}
        onPress={() => navigation.navigate('UserType')}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <Image
        source={require('../../assets/poodle.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.titulo}>
        Formulário de Cadastro{'\n'}Parceiro Comercial
      </Text>

      <Text style={styles.subtitulo}>Escolha o tipo de cadastro:</Text>

      <View style={styles.botoesContainer}>
        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('FormCNPJ1')}>
          <Text style={styles.botaoTexto}>Empresa (CNPJ)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('FormCPF1')}>
          <Text style={styles.botaoTexto}>Prestador de Serviços (CPF)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ROXO,
    alignItems: 'center',
    paddingTop: height * 0.23,
    paddingHorizontal: width * 0.08,
  },
  image: {
    width: width * 1,
    height: height * 0.35,
    marginBottom: height * 0.03,
  },
  backArrow: {
    position: 'absolute',
    top: height * 0.09,
    left: width * 0.05,
    zIndex: 10,
  },
  titulo: {
    color: BRANCO,
    fontSize: width * 0.052,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: width * 0.07,
    marginBottom: height * 0.01,
  },
  subtitulo: {
    color: BRANCO,
    fontSize: width * 0.043,
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  botoesContainer: {
    width: '100%',
    gap: height * 0.018,
  },
  botao: {
    backgroundColor: BRANCO,
    paddingVertical: height * 0.016,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  botaoTexto: {
    color: ROXO,
    fontSize: width * 0.042,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
