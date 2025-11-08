import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { TextInput } from 'react-native-gesture-handler';
import { doc, setDoc } from 'firebase/firestore';
import { db } from "../../../../firebaseConfig";

const { width, height } = Dimensions.get('window');
const LARANJA = '#FFAB36'; 
const BRANCO = '#FFFFFF';
const CINZA_CLARO = '#F7F7F7';
const VERMELHO = '#E83F5B';

export default function FormCNPJ4() {
  const navigation = useNavigation();
  const route = useRoute();

  const allFormData = route.params?.allFormData || {};

  const initialFormData = allFormData.cnpj4 || {
    termsChecked: false,
    usageChecked: false,
    policyFile: null,
    policyLink: '',
  };

  const [formData, setFormData] = useState(initialFormData); 
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setFormData(initialFormData);
  }, [allFormData.cnpj4]); 

  const pickFile = async () => { 
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      setErrorMessage("Permissão negada. Você precisa permitir acesso à galeria para selecionar arquivos.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 0.2,
    });

    if (!result.canceled) {
      setFormData(prev => ({ ...prev, policyFile: result.assets[0].uri })); 
      setErrorMessage('');
    }
  };

  const handleChange = (field, value) => { 
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage('');
  };


  const handleReview = () => {
    const updatedAllFormData = {
      ...allFormData,
      cnpj4: formData,
    };
    navigation.navigate('RevisaoCNPJ1', { allFormData: updatedAllFormData });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Adicionado o header fora do card para consistência */}
        <Text style={styles.header}>Termos & Autorização</Text> 
        <View style={styles.card}>
          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

          <Text style={styles.label}>
            Política de Troca/Devolução (se aplicável) - link ou upload (opcional)
          </Text>

          <View style={styles.uploadLinkContainer}>
            <View style={styles.fieldWrapper}>
              <Text style={styles.subLabel}>Arquivo</Text>
              <TouchableOpacity style={styles.uploadBox} onPress={pickFile}> {/* Chamada direta para pickFile */}
                {formData.policyFile ? ( 
                  formData.policyFile.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                    <Image
                      source={{ uri: formData.policyFile }}
                      style={{ width: '100%', height: '100%', borderRadius: width * 0.025 }} 
                      resizeMode="cover"
                    />
                  ) : (
                    <Ionicons name="document-text-outline" size={width * 0.08} color={LARANJA} />
                  )
                ) : (
                  <Ionicons name="cloud-upload-outline" size={width * 0.08} color={LARANJA} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.fieldWrapper}>
              <Text style={styles.subLabel}>Link</Text>
              <TextInput
                style={styles.input}
                placeholder="Insira aqui"
                placeholderTextColor="#999"
                value={formData.policyLink}
                onChangeText={(text) => handleChange('policyLink', text)}
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => {
              setFormData(prev => ({ ...prev, termsChecked: !prev.termsChecked })); // Atualiza termsChecked em formData
              setErrorMessage('');
            }}
          >
            <Ionicons
              name={formData.termsChecked ? 'checkbox' : 'square-outline'} // Usa formData.termsChecked
              size={width * 0.06}
              color={LARANJA}
            />
            <Text style={styles.checkboxText}>
              Li e concordo com os{' '}
              <Text
                style={styles.link}
                onPress={() => Linking.openURL('https://seudominio.com/termos')}
              >
                Termos de Uso
              </Text>{' '}
              do aplicativo MIAU.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setFormData(prev => ({ ...prev, usageChecked: !prev.usageChecked }))}
          >
            <Ionicons
              name={formData.usageChecked ? 'checkbox' : 'square-outline'}
              size={width * 0.06}
              color={LARANJA}
            />
            <Text style={styles.checkboxText}>
              Autorizo o uso de informações e imagens fornecidas para divulgação no aplicativo.
            </Text>
          </TouchableOpacity>

          <View style={styles.buttonsRow}>
            <TouchableOpacity onPress={handleReview} style={styles.button}>
              <Text style={styles.buttonText}>Rever respostas</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const CARD_RADIUS = width * 0.075; // Convertido para porcentagem
const CARD_PADDING_HORIZONTAL = width * 0.08;
const CARD_PADDING_VERTICAL = height * 0.03;
const INPUT_HEIGHT = height * 0.06; // Altura do input
const UPLOAD_BOX_HEIGHT = height * 0.12; // Altura da caixa de upload

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LARANJA,
  },
  scrollContent: {
    paddingTop: height * 0.1, // Ajustado para dar espaço ao header
    paddingBottom: height * 0.05,
    flexGrow: 1,
    justifyContent: 'center', // Centraliza o conteúdo verticalmente
  },
  header: { // Adicionado estilo para o header fora do card
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: BRANCO,
    textAlign: 'center',
    marginBottom: height * 0.03, // Espaço entre o header e o card
  },
  card: {
    backgroundColor: BRANCO,
    borderRadius: CARD_RADIUS,
    marginHorizontal: width * 0.05, // Adicionado margem para os lados (5% de cada lado)
    paddingHorizontal: CARD_PADDING_HORIZONTAL,
    paddingVertical: CARD_PADDING_VERTICAL,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.005 },
    shadowOpacity: 0.2,
    shadowRadius: width * 0.03,
    elevation: 5,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: LARANJA,
    marginBottom: height * 0.03,
    alignSelf: 'center',
  },
  label: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#737373',
    marginBottom: height * 0.01,
    marginTop: height * 0.02,
  },
  subLabel: {
    fontSize: width * 0.035,
    color: '#737373',
    marginBottom: height * 0.005,
  },
  uploadLinkContainer: {
    flexDirection: 'column',
    marginBottom: height * 0.02,
  },
  fieldWrapper: {
    marginBottom: height * 0.015, // Reduzido o espaço entre os campos de upload/link
  },
  uploadBox: {
    width: '100%',
    height: UPLOAD_BOX_HEIGHT, // Altura em porcentagem
    borderRadius: width * 0.03, // Convertido para porcentagem (aprox 12px)
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: CINZA_CLARO,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  input: {
    width: '100%',
    height: INPUT_HEIGHT, // Altura em porcentagem
    backgroundColor: CINZA_CLARO,
    borderRadius: width * 0.03, // Convertido para porcentagem (aprox 12px)
    paddingHorizontal: width * 0.04,
    fontSize: width * 0.04,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: height * 0.02, // Espaçamento harmonioso
    width: '100%',
    paddingRight: width * 0.02,
  },
  checkboxText: {
    flex: 1,
    marginLeft: width * 0.025,
    fontSize: width * 0.038,
    color: '#333',
    lineHeight: width * 0.05,
  },
  link: {
    textDecorationLine: 'underline',
    color: LARANJA,
  },
  errorMessage: {
    color: VERMELHO,
    textAlign: 'center',
    marginBottom: height * 0.02,
    fontSize: width * 0.035,
  },
  buttonsRow: {
    marginTop: height * 0.03, // Espaçamento harmonioso
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    backgroundColor: BRANCO,
    paddingVertical: height * 0.02,
    borderRadius: width * 0.075, // Convertido para porcentagem (aprox 30px)
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.005 }, // Convertido para porcentagem
    shadowOpacity: 0.3,
    shadowRadius: width * 0.01, // Convertido para porcentagem
    borderWidth: 0,
    width: '80%',
    marginBottom: height * 0.015, // Espaçamento harmonioso
  },
  buttonText: {
    color: LARANJA,
    fontSize: width * 0.045,
    fontWeight: '600',
  },
  sendButton: {
    width: '100%',
    marginBottom: 0,
  },
});
