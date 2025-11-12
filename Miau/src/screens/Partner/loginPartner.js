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
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig"; 

const { width, height } = Dimensions.get('window');
const TOP_HEIGHT = height * 0.3;
const CARD_HEIGHT = height * 0.6;

export default function LoginUser({ navigation }) {
  const [showPass, setShowPass] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

const handleLogin = async () => {
    if (user === '' || pass === '') {
        Alert.alert("Erro", "Por favor, preencha todos os campos.");
        return;
    }

    try {
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, user, pass);
        const loggedInUser = userCredential.user;
        const userId = loggedInUser.uid;
        let foundInCollection = null;
        let docSnap;
        let docRef = doc(db, "empresa", userId); 
        docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            foundInCollection = 'empresa';
        } else {
            docRef = doc(db, "prestador", userId);
            docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                foundInCollection = 'prestador';
            }
        }

        if (foundInCollection === 'empresa') {
            Alert.alert("Sucesso!", "Login de Empresa realizado com sucesso.");
            navigation.navigate('BusinessStack', { screen: 'MainDrawerCNPJ' }); 
            
        } else if (foundInCollection === 'prestador') {
            Alert.alert("Sucesso!", "Login de Prestador de Serviço realizado com sucesso.");
            navigation.navigate('PersonStack', { screen: 'MainDrawerCPF' }); 

        } else {
            await auth.signOut(); 
            Alert.alert(
                "Acesso Negado", 
                "Essa conta não está cadastrada na área de prestadores ou empresas. Por favor, verifique seu cadastro."
            );
        }
    } catch (error) {
        console.error("Erro ao fazer login:", error.code, error.message);
        let errorMessage = "Erro ao fazer login. Verifique seu e-mail e senha.";
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            errorMessage = "E-mail ou senha inválidos.";
        }
        Alert.alert("Erro de Login", errorMessage);
    }
};

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      <View style={styles.topPurple} />


      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail do prestador ou empresa:"
          placeholderTextColor="#AAA"
          value={user}
          onChangeText={setUser}
        />

        <View style={styles.passWrapper}>
          <TextInput
            style={[
              styles.input,
              { flex: 1, marginBottom: 0, paddingRight: 10 },
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
          <Text style={styles.enterText}>Entrar</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.or}>ou</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('CadPartner')}>
          <Text style={styles.footerText}>
            Não tem uma conta? <Text style={styles.footerLink}>Cadastrar</Text>
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
    top: TOP_HEIGHT - height * 0.004,
    alignSelf: 'center',
    width: width * 1,
    height: height * 0.22,
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
    paddingTop: height * 0.075,
    paddingHorizontal: width * 0.1,
    alignItems: 'center',
  },
  title: {
    fontSize: 27,
    fontWeight: '700',
    color: PURPLE,
    marginBottom: height * 0.035,
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
    zIndex: 3
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
