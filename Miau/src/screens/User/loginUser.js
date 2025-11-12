import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,

} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebaseConfig"; // Importe apenas o que precisa
import { useUser } from "./NavigationUser/UserContext";

import { useFonts, JosefinSans_400Regular, JosefinSans_700Bold } from '@expo-google-fonts/josefin-sans';


const { width, height } = Dimensions.get('window');
const TOP_HEIGHT = height * 0.3;
const CARD_HEIGHT = height * 0.6;

export default function LoginUser({ navigation }) {
  const { userData, setUserData } = useUser();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
  });


  if (!fontsLoaded) {
    return <SafeAreaView style={styles.safe} />;
  }


  const handleLogin = async () => {
    if (email === '' || pass === '') {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      
      navigation.navigate('MainDrawerUser')

    } catch (error) {

      console.error("Erro no login:", error.message);
      let errorMessage = "Erro no login. Tente novamente.";
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'O email informado é inválido.';
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        errorMessage = 'E-mail ou senha inválidos.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta.';
      }

      Alert.alert("Ops!", errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      <View style={styles.topPurple} />

      <View style={styles.card}>

        <Text style={[styles.title, { fontFamily: 'JosefinSans_700Bold' }]}>Login</Text>

        <TextInput
          style={[styles.input, { fontFamily: 'JosefinSans_400Regular' }]}
          placeholder="Email:"
          placeholderTextColor="#AAA"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <View style={styles.passWrapper}>
          <TextInput
            style={[
              styles.input,
              { 
                flex: 1, 
                marginBottom: 0, 
                paddingRight: 10,
                fontFamily: 'JosefinSans_400Regular' // 💡 FONTE APLICADA (Regular)
              },
            ]}
            placeholder="Senha:"
            placeholderTextColor="#AAA"
            secureTextEntry={!showPass}
            value={pass}
            onChangeText={setPass}
          />

          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowPass((v) => !v)}>
            <Ionicons
              name={showPass ? 'eye' : 'eye-off'}
              size={20}
              color="#6E4BAF"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.enterBtn} onPress={handleLogin}>
          {/* 💡 FONTE APLICADA (Bold) */}
          <Text style={[styles.enterText, { fontFamily: 'JosefinSans_700Bold' }]}>Entrar</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          {/* 💡 FONTE APLICADA (Regular) */}
          <Text style={[styles.or, { fontFamily: 'JosefinSans_400Regular' }]}>ou</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('CadUser')}>
          {/* 💡 FONTE APLICADA (Regular) */}
          <Text style={[styles.footerText, { fontFamily: 'JosefinSans_400Regular' }]}>
            Não tem uma conta? 
            {/* 💡 FONTE APLICADA (Bold) */}
            <Text style={[styles.footerLink, { fontFamily: 'JosefinSans_700Bold' }]}>Cadastrar</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const PURPLE = '#6A57D2';
const WHITE = '#FFF';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: PURPLE,
  },
  back: {
    position: 'absolute',
    top: height * 0.05,
    left: width * 0.04,
    zIndex: 10,
  },
  topPurple: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: TOP_HEIGHT,
    backgroundColor: PURPLE,
    borderBottomLeftRadius: 1000,
    borderBottomRightRadius: 1000,
  },
  catImage: {
    position: 'absolute',
    alignSelf: 'center',
    width: width * 0.9,
    height: height * 0.22,

    top: height * 0.4 - (height * 0.035 / 1), 
    zIndex: 2,
  },
  card: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: CARD_HEIGHT,
    backgroundColor: WHITE,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingTop: height * 0.05,
    paddingHorizontal: width * 0.1,
    alignItems: 'center',
  },
  title: {
    fontSize: 27,
    color: PURPLE,
    marginBottom: height * 0.03,
  },
  input: {
    width: '100%',
    height: height * 0.06,
    backgroundColor: '#F7F7F7',
    borderRadius: 30,
    paddingHorizontal: 20,
    marginBottom: height * 0.018,
    fontSize: 16,
    color: '#333',
  },
  passWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: height * 0.025,
    backgroundColor: '#F7F7F7',
    borderRadius: 30,
    paddingHorizontal: 20,
  },

  eyeBtn: {
    marginLeft: 10,
  },

  enterBtn: {
    width: '100%',
    backgroundColor: WHITE,
    borderRadius: 20,
    paddingVertical: height * 0.025,
    alignItems: 'center',
    marginBottom: height * 0.035,
    shadowColor: '#AAA',
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4.65,
    elevation: 9,
  },
  enterText: {
    color: PURPLE,
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: height * 0.035,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: PURPLE,
  },
  or: {
    marginHorizontal: 12,
    color: '#6E4BAF',
    fontSize: 14,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  footerLink: {
    color: PURPLE,
    fontWeight: '600',
  },
});