import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const LARANJA = '#FFA741';
const MARRON = '#8C4A14';

export default function AboutUs3({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/gatopreto3.png')}
        style={styles.cat}
        resizeMode="contain"
      />

      <View style={styles.content}>
        <Text style={styles.titulo}>Aproveite o App</Text>
        <Text style={styles.texto}>
          Tudo feito para facilitar sua rotina e trazer mais amor, cuidado e conexão entre você e seu pet. Explore, cuide e adote com a gente!
        </Text>
        <View style={styles.dotsContainer}>
          <View style={styles.dotInativo} />
          <View style={styles.dotInativo} />
          <View style={styles.dotAtivo} />
        </View>
      </View>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.botaoTexto}>Avançar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LARANJA,
    position: 'relative',
  },
  cat: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.60,
    height: height * 0.6,
  },
  content: {
    flex: 1,
    marginTop: height * 0.5,
    alignItems: 'center',
    paddingHorizontal: width * 0.1,
    zIndex: 1,
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
    marginBottom: height * 0.03,
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
    paddingHorizontal: width * 0.08,
    borderTopLeftRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  botaoTexto: {
    color: MARRON,
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
});