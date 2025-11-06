import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { doc, setDoc } from 'firebase/firestore';
import { db } from "../../../../firebaseConfig";

const { width, height } = Dimensions.get('window');
const ROXO = '#6A57D2';
const BRANCO = '#FFFFFF';
const CINZA_CLARO = '#F7F7F7';
const VERMELHO = '#E83F5B';

export default function FormCNPJ3() {
  const navigation = useNavigation();
  const route = useRoute();

  const allFormData = route.params?.allFormData || {};

   const initialUploads = allFormData.cnpj3 || {
    logoEmpresa: null,
    comprovanteCNPJ: null,
    localFisico: null,
  };

  const [uploads, setUploads] = useState(initialFormData);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setUploads(initialUploads);
  }, [allFormData.cnpj3]);
  const pickImage = async (key) => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      setErrorMessage(
        'Permissão negada. Você precisa permitir acesso à galeria.'
      );
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.2,
    });
    if (!result.canceled) {
      setUploads((prev) => ({ ...prev, [key]: result.assets[0].uri }));
      setErrorMessage('');
    }
  };

  const handleUploadOption = (key) => {
    setErrorMessage('');
    pickImage(key);
  };

  const handleNext = async () => {
    const userId = allFormData.userId; 
    if (!userId) {
      setErrorMessage('Erro de autenticação. Usuário não identificado.');
      return;
    }
    if (!uploads.logoEmpresa || !uploads.comprovanteCNPJ) {
      setErrorMessage(
        'Por favor, envie os documentos obrigatórios (Logo/Foto de Perfil e Comprovante).'
      );
      return;
    }
    const updatedAllFormData = {
      ...allFormData,
      cnpj3: uploads,
    };
    try {
      const docRef = doc(db, 'empresa_draft', userId);
      await setDoc(docRef, updatedAllFormData, { merge: true }); 
      navigation.navigate('FormCNPJ4', { allFormData: updatedAllFormData, userId: userId });

    } catch (error) {
      console.error("Erro ao salvar rascunho (CNPJ3):", error);
      setErrorMessage('Falha ao salvar dados. Tente novamente.');
    }
  };

  const renderUploadBox = (label, key, obrigatorio = false) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>
        {label} {obrigatorio && <Text style={{ color: VERMELHO }}>*</Text>}
      </Text>
      <TouchableOpacity style={styles.uploadBox} onPress={() => handleUploadOption(key)}>
        {uploads[key] ? (
          <Image
            source={{ uri: uploads[key] }}
            style={{ width: '100%', height: '100%', borderRadius: width * 0.025 }}
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="cloud-upload-outline" size={width * 0.08} color={ROXO} />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Documentos e Mídia</Text>
        <View style={styles.card}>
          <Text style={styles.title}>Documentos e Mídia</Text>

          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

          {renderUploadBox('Logo da empresa', 'logoEmpresa', true)}
          {renderUploadBox('Comprovante de CNPJ', 'comprovanteCNPJ', true)}
          {renderUploadBox('Imagem do local físico de atendimento (se houver)', 'localFisico')}

          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Text style={styles.nextText}>Próximo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const BORDER_RADIUS_CARD = width * 0.075;
const CARD_PADDING_VERTICAL = height * 0.03;
const CARD_PADDING_HORIZONTAL = width * 0.05;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ROXO,
  },
  scrollContent: {
    paddingBottom: height * 0.05,
    paddingTop: height * 0.1,
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: BRANCO,
    borderRadius: BORDER_RADIUS_CARD,
    paddingVertical: CARD_PADDING_VERTICAL,
    paddingHorizontal: CARD_PADDING_HORIZONTAL,
    marginHorizontal: width * 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.005 },
    shadowOpacity: 0.2,
    shadowRadius: width * 0.03,
    elevation: 5,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: BRANCO,
    textAlign: 'center',
    marginBottom: height * 0.01,
    position: 'relative',
    top: '0%',
  },
  label: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#737373',
    marginBottom: height * 0.01,
    marginTop: height * 0.02,
  },
  uploadBox: {
    width: '100%',
    height: height * 0.12,
    borderRadius: width * 0.03,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: CINZA_CLARO,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fieldContainer: {
    marginBottom: height * 0.02,
  },
  nextButton: {
    backgroundColor: BRANCO,
    paddingVertical: height * 0.02,
    borderRadius: width * 0.075,
    alignItems: 'center',
    marginTop: height * 0.04,
    marginBottom: height * 0.02,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  nextText: {
    color: ROXO,
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  errorMessage: {
    color: VERMELHO,
    textAlign: 'center',
    marginTop: height * 0.01,
    marginBottom: height * 0.02,
    fontSize: width * 0.035,
  },
});
