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
const LARANJA = '#FFAB36';
const MARRON = '#8C4A14';

export default function AboutUs3P ({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/gatopreto3.png')}
        style={styles.cat}
        resizeMode="contain"
      />

      <View style={styles.content}>
        <Text style={styles.titulo}>Cadastro da Instituição</Text>
        <Text style={styles.texto}>
          Primeiro, pediremos que você preencha um formulário com os dados da
          sua empresa. Assim que for aprovado, você poderá utilizar o app como
          nosso parceiro comercial!
        </Text>
        <View style={styles.dotsContainer}>
          <View style={styles.dotInativo} />
          <View style={styles.dotInativo} />
          <View style={styles.dotAtivo} />
        </View>
      </View>

      <TouchableOpacity
        onPress={()=> navigation.navigate('TypePartner')}
        style={styles.botao}>
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
    width: width * 0.6,
    height: height * 0.69,
  },
  content: {
    flex: 1,
    marginTop: height * 0.55,
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
  backgroundColor: '#fff',
  paddingVertical: height * 0.02,
  paddingHorizontal: width * 0.08,
  borderTopLeftRadius: 20,
  shadowColor: '#000',
  shadowOffset: { width: -2, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
  alignSelf: 'flex-end',   
  marginBottom:0,       
  marginRight: 0          
},

  botaoTexto: {
    color: MARRON,
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
});
