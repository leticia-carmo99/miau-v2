import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function UserTypeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/salsicha.png')}
        style={styles.topImage}
        resizeMode="contain"
      />

      <View style={styles.card}>
        <Text style={styles.title}>
          Antes de começarmos,{'\n'}
          <Text style={styles.bold}>como deseja utilizar o aplicativo?</Text>
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('LoginUser')}>
          <Text style={styles.buttonText}>Quero adotar um pet (Usuário)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('LoginOng')}>
          <Text style={styles.buttonText}>
            Sou uma instituição (ONG ou abrigo)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('LoginPartner')}>
          <Text style={styles.buttonText}>
            Sou parceiro comercial (Empresa ou vendedor)
          </Text>

          {/* Barrinhas laranja decorativas */}
        </TouchableOpacity>
        <View style={styles.barsContainer}>
          <View style={[styles.bar, { width: width * 0.25 }]} />
          <View style={[styles.bar, { width: width * 0.25 }]} />
          <View style={[styles.bar, { width: width * 0.25 }]} />
          
        </View>
      </View>
    </View>
  );
}

const CARD_HEIGHT = height * 0.6;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFAB36',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  topImage: {
    width: width,
    height: height * 0.4,
    marginTop: 28,
  },
  card: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: CARD_HEIGHT,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 35,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    color: '#FFAB36',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 26,
  },
  bold: {
    fontWeight: '700',
  },
  button: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 24,
    marginVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFAB36',
    fontSize: 15,
    fontWeight: '600',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24, // espaço acima das barrinhas
    marginBottom: 8, // espaço abaixo, se precisar
  },
  bar: {
    height: 2,
    backgroundColor: 'rgba(255, 171, 54, 0.6)',
    borderRadius: 10,
    marginHorizontal: 4, // distância entre as barrinhas
  },
});
