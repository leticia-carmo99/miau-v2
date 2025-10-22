import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useFonts, JosefinSans_400Regular, JosefinSans_700Bold } from '@expo-google-fonts/josefin-sans';


const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height * 0.7;

export default function UserTypeScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
  });

  if (!fontsLoaded) {
    return <SafeAreaView style={styles.containerLoading} />; 
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../assets/salsicha.png')}
        style={styles.topImage}
        resizeMode="contain"
      />

      <View style={styles.cardWrapper}>
        <ScrollView contentContainerStyle={styles.cardContent}>
          <Text style={[styles.title, { fontFamily: 'JosefinSans_400Regular' }]}>
            Antes de começarmos,{'\n'}
            <Text style={[styles.bold, { fontFamily: 'JosefinSans_700Bold' }]}>como deseja utilizar o aplicativo?</Text>
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('UsuarioStack', { screen: 'LoginUser' })}>
            <Text style={[styles.buttonText, { fontFamily: 'JosefinSans_700Bold' }]}>Quero adotar um pet (Usuário)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('OngStack', { screen: 'LoginOng' })}>
            <Text style={[styles.buttonText, { fontFamily: 'JosefinSans_700Bold' }]}>
              Sou uma instituição (ONG ou abrigo)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('LoginPartner')}>
            <Text style={[styles.buttonText, { fontFamily: 'JosefinSans_700Bold' }]}>
              Sou parceiro comercial (Empresa ou vendedor)
            </Text>
          </TouchableOpacity>
        
          <View style={styles.barsContainer}>
            <View style={[styles.bar, { width: width * 0.25 }]} />
            <View style={[styles.bar, { width: width * 0.25 }]} />
            <View style={[styles.bar, { width: width * 0.25 }]} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
    containerLoading: {
        flex: 1,
        backgroundColor: '#FFAB36',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFAB36',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    topImage: {
        width: width ,
        height: height * 0.35, 
        marginTop: 45,
    },
    cardWrapper: {
        position: 'absolute',
        bottom: 0,
        width: width,
        height: CARD_HEIGHT,
        backgroundColor: '#fff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    cardContent: {
        paddingHorizontal: 24,
        paddingTop: 35,
        paddingBottom: 40,
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
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 5 },
        shadowOpacity: 0.2, 
        shadowRadius: 4,
        elevation: 4, 
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFAB36',
        fontSize: 15,
        fontWeight: '700', 
    },
    barsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 8,
    },
    bar: {
        height: 2,
        backgroundColor: 'rgba(255, 171, 54, 0.6)',
        borderRadius: 10,
        marginHorizontal: 4,
    },
});