
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ImageBackground
        source={require('../../assets/fundo.png')}
        style={styles.background}
        resizeMode="cover"
      >
  
        <View style={styles.card}>
          <Image
            source={require('../../assets/cocker.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.description}>
            Olá, bem-vindo ao aplicativo MiAu!{'\n'}
            Um app dedicado à adoção e ao cuidado de cães e gatos, feito com
            amor para quem ama os animais.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('UserType')}
        >
          <Text style={styles.buttonText}>Avançar</Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#6E4BAF',
  },
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: width * 0.99,
    minHeight: height * 0.50,
    backgroundColor: '#fff',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#3C2B5E',
    paddingHorizontal: width * 0.075,
    paddingVertical: height * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.8,
    height: height * 0.23,
    marginBottom: height * 0.04,
  },
  description: {
    fontSize: width * 0.04,
    color: '#3C2B5E',
    textAlign: 'center',
    lineHeight: width * 0.06,
  },
  button: {
    position: 'absolute',
    bottom: 0,                   
    right: 0,                    
    backgroundColor: '#fff',
    paddingVertical: height * 0.02, 
    paddingHorizontal: width * 0.07,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#3C2B5E',
    fontSize: width * 0.045,
    fontWeight: '600',
  },
});


