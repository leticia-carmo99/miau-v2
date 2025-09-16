import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";

const { width, height } = Dimensions.get('window');
const LARANJA = '#FFAB36';
const TOP_HEIGHT = height * 0.001;

export default function CadUser() {
  const navigation = useNavigation();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirma, setMostrarConfirma] = useState(false);

    const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('comum'); // Estado para o tipo de usuário

  const handleCadastro = async () => {
    // 1. Validação simples para senhas
    if (senha !== confirmarSenha) {
      Alert.alert("Ops!", "As senhas não coincidem. Por favor, verifique.");
      return;
    }
    
    // Você pode adicionar mais validações aqui (ex: email válido, senha forte)

    try {
      // 2. Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // 3. Salva os dados no Firestore, incluindo o tipo de usuário
      // O ID do documento é o mesmo ID do usuário do Firebase Auth (user.uid)
      const userDocRef = doc(db, "usuarios", user.uid);
      
      await setDoc(userDocRef, {
        nome: nome,
        email: email,
        cpf: cpf,
        // Você pode adicionar outros campos aqui
        tipo_usuario: tipoUsuario,
      });

      Alert.alert("Sucesso!", "Seu cadastro foi realizado com sucesso!");
      
      // Navega para a tela principal (o UserContext já vai ter os dados)
          navigation.navigate('AboutUs3', {
        nome,
        cpf,
        email,
        senha,
    });

    } catch (error) {
      // Lidar com erros do Firebase
      let errorMessage = "Erro no cadastro. Tente novamente mais tarde.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está em uso!';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'A senha é muito fraca. Tente uma senha com pelo menos 6 caracteres.';
      }
      Alert.alert("Ops!", errorMessage);
    }
  };

  const irParaQuemSomos = () => {
    navigation.navigate('AboutUs1');
  };

  return (
  <View style={styles.container}>
    <View style={styles.topo} />

    <View style={styles.card}>
      <Image
        source={require('../../assets/gatoLaranja.png')}
        style={styles.gato}
        resizeMode="contain"
      />

      <TouchableOpacity
        style={styles.voltar}
        onPress={() => navigation.goBack('loginUser')}
      >
        <Icon name="arrow-back" size={28} color={LARANJA} />
      </TouchableOpacity>

      <Text style={styles.titulo}>Cadastro</Text>

      {/* Inputs devem vir depois da imagem para renderizar acima */}
      <TextInput
        style={styles.input}
        placeholder="Usuário:"
        placeholderTextColor="#999"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF:"
        keyboardType="numeric"
        placeholderTextColor="#999"
        value={cpf}
        onChangeText={setCpf}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail:"
        keyboardType="email-address"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.senhaContainer}>
        <TextInput
          style={styles.senhaInput}
          placeholder="Senha:"
          placeholderTextColor={LARANJA}
          secureTextEntry={!mostrarSenha}
          value={senha}
          onChangeText={setSenha}
        />
        <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
          <Icon
            name={mostrarSenha ? 'eye-off' : 'eye'}
            size={22}
            color={LARANJA}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.senhaContainer}>
        <TextInput
          style={styles.senhaInput}
          placeholder="Confirmar Senha:"
          placeholderTextColor={LARANJA}
          secureTextEntry={!mostrarConfirma} 
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />
        <TouchableOpacity
          onPress={() => setMostrarConfirma(!mostrarConfirma)}
        >
          <Icon
            name={mostrarConfirma ? 'eye-off' : 'eye'}
            size={22}
            color={LARANJA}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.botao} onPress={handleCadastro}>
        <Text style={styles.botaoTexto}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LARANJA,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  topo: {
    position: 'absolute',
    top: 0,
    height: height * 0.35,
    width: '100%',
    backgroundColor: LARANJA,
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    borderTopLeftRadius: width * 0.15,
    borderTopRightRadius: width * 0.1,
    paddingHorizontal: width * 0.08,
    paddingTop: height * 0.04,
    paddingBottom: height * 0.05,
    alignItems: 'center',
    shadowColor: '#000',
    elevation: 10,
    position: 'absolute',
    bottom: 0,
    height: height * 0.75,
  },
  voltar: {
    position: 'absolute',
    top: height * 0.025,
    left: width * 0.05,
    zIndex: 10,
  },
  gato: {
    position: 'absolute',
    top: TOP_HEIGHT - height * 0.178,
    alignSelf: 'center',
    width: width * 0.8,
    height: height * 0.5,
  },
  titulo: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: LARANJA,
    marginBottom: height * 0.02,
  },
  input: {
    width: '100%',
    height: height * 0.07,
    backgroundColor: '#F7F7F7',
    borderRadius: 30,
    paddingHorizontal: 20,
    marginBottom: height * 0.02,
    fontSize: 16,
    color: '#333',
    zIndex: 3,
  },
  senhaContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: LARANJA,
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.02,
    backgroundColor: '#fff',
    height: height * 0.07,
  },
 senhaInput: {
  flex: 1,
  fontSize: width * 0.035,
  color: '#333', // Mude para uma cor escura, como preto ou cinza escuro
},
  botao: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: height * 0.03,
    alignItems: 'center',
    marginTop: height * 0.01,
    shadowColor: '#AAA',
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4.65,
    elevation: 9,
  },
  botaoTexto: {
    color: LARANJA,
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
});
