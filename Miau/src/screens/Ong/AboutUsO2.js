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

export default function AboutUs2({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/poodle.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.titulo}> Divulgue e acompanhe com facilidade!</Text>
        <Text style={styles.texto}>
         Com o MiAu, você poderá divulgar os bichinhos disponíveis para adoção e ainda acompanhar como eles estão após encontrarem um novo lar.
        </Text>

        <View style={styles.dotsContainer}>
          <View style={styles.dotInativo} />
          <View style={styles.dotAtivo} />
          <View style={styles.dotInativo} />
        </View>
      </View>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate('AboutUsO3')}>
        <Text style={styles.botaoTexto}>Avançar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6A57D2',
    paddingHorizontal: width * 0.08,
    paddingTop: height * 0.05,
    justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    paddingBottom: height * 0.08,
  },
  image: {
    height: height * 0.32,
    marginBottom: height * 0.025,
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
    color: '#8C4A14',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
});
