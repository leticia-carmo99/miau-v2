import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const LARANJA = '#FFA741';
const MARRON = '#8C4A14';

export default function AboutUs1({ navigation }) {

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/cocker.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.titulo}>Adote e transforme Vidas!!</Text>
        <Text style={styles.texto}>
          Encontre cães e gatos que precisam de um lar. Adotar é um ato de amor — e aqui, fica fácil dar esse passo.
        </Text>

        <View style={styles.dotsContainer}>
          <View style={styles.dotAtivo} />
          <View style={styles.dotInativo} />
          <View style={styles.dotInativo} />
        </View>
      </View>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate('AboutUs2')}>
        <Text style={styles.botaoTexto}>Avançar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LARANJA,
    paddingHorizontal: width * 0.08,
    paddingTop: height * 0.05,
    justifyContent: 'space-between',
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    height: height * 0.32,
    marginBottom: height * 0.025,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    paddingBottom: height * 0.08,
  },
  titulo: {
    fontSize: width * 0.08,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.012,
  },
  texto: {
    fontSize: width * 0.05,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: width * 0.03,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: height * 0.04,
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotAtivo: {
    width: 20,
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  dotInativo: {
    width: 8,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
  botao: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.07,
    borderTopLeftRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  botaoTexto: {
    color: MARRON,
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
});
