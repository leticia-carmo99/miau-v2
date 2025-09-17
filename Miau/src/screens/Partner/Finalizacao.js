import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig'; // Verifique o caminho

const { width, height } = Dimensions.get('window');
const LARANJA = '#FFAB36';
const MARRON = '#8C4A14';

export default function Finalizacao() {
  const navigation = useNavigation();
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  const [perfilAtivo, setPerfilAtivo] = useState(false);
  const { tipoCadastro, documento } = route.params;

  // Função para verificar o status do perfil no Firebase
  const verificarStatusPerfil = async () => {
    try {
      const docRef = doc(db, 'prestador', documento);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().ativo) {
        setPerfilAtivo(true);
      } else {
        setPerfilAtivo(false);
      }
    } catch (error) {
      console.error("Erro ao verificar o status do perfil:", error);
      Alert.alert("Erro", "Não foi possível verificar o status do seu perfil.");
      setPerfilAtivo(false);
    }
  };

  useEffect(() => {
    // A tela finalizacao será exibida primeiro e irá verificar o status
    // Quando você estiver pronto para a aprovação, chame verificarStatusPerfil
  }, []);

  const handlePress = () => {
      if (tipoCadastro === 'CPF') {
        navigation.navigate('PersonStack', { screen: 'MainDrawerCPF' });
      } else if (tipoCadastro === 'CNPJ') {
        navigation.navigate('BusinessStack', { screen: 'MainDrawerCNPJ' });
      }
  };

  const handleConfirm = () => {
    setModalVisible(true);
  };

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
        <Text style={styles.titulo}>Dados enviados com sucesso!</Text>
        <Text style={styles.texto}>
          Recebemos suas informações e agora vamos analisá-las com carinho. {'\n\n'}
          Assim que forem confirmadas, você poderá começar a utilizar o app MiAu
          para vender seus produtos e serviços. {'\n\n'}
          Muito obrigado por fazer parte dessa causa!
        </Text>
      </View>

      <TouchableOpacity
        style={styles.botao}
        onPress={handleConfirm}
      >
        <Text style={styles.botaoTexto}>Avançar</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Seus dados ainda não foram confirmados</Text>
            <Text style={styles.modalText}>
              Estamos analisando as informações da sua empresa ou pessoais. {'\n\n'}
              Por favor, aguarde — em breve entraremos em contato!
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonCancelar} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonTextCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonOk} onPress={handlePress}>
                <Text style={styles.modalButtonTextOk}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: height * 0,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    paddingBottom: height * 0.08,
  },
  titulo: {
    fontSize: width * 0.07,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.012,
  },
  texto: {
    fontSize: width * 0.045,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: width * 0.03,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: width * 0.08,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: LARANJA,
    marginBottom: height * 0.015,
    textAlign: 'center',
  },
  modalText: {
    fontSize: width * 0.04,
    color: '#737373',
    textAlign: 'center',
    marginBottom: height * 0.025,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButtonCancelar: {
    backgroundColor: '#ccc',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.06,
    borderRadius: 10,
  },
  modalButtonOk: {
    backgroundColor: LARANJA,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.08,
    borderRadius: 10,
  },
  modalButtonTextCancelar: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalButtonTextOk: {
    color: '#fff',
    fontWeight: 'bold',
  },
});