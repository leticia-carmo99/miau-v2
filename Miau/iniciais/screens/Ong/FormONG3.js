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

const { width, height } = Dimensions.get('window');


const ROXO = '#6A57D2'; 
const BRANCO = '#FFFFFF'; 
const CINZA_CLARO = '#F7F7F7'; 
const VERMELHO = '#E83F5B';

export default function FormONG3() {
  const navigation = useNavigation();
  const route = useRoute();


  const allFormData = route.params?.allFormData || {};


  const initialFormData = allFormData.ong3 || {
    comprovanteCNPJouEstatuto: null, 
    fotoFachadaEspaco: null, 
    documentoResponsavel: null, 
    logoInstituicao: null, 
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errorMessage, setErrorMessage] = useState(''); 

  useEffect(() => {
   
    setFormData(initialFormData);
  }, [allFormData.ong3]); 

  const pickImage = async (key) => {
    
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      setErrorMessage("Permissão negada. Você precisa permitir acesso à galeria para selecionar imagens.");
      return;
    }

   
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsEditing: true, 
      quality: 0.7, 
    });

    if (!result.canceled) {
      
      setFormData((prev) => ({ ...prev, [key]: result.assets[0].uri }));
      setErrorMessage('');
    }
  };

  const handleNext = () => {
    if (
      !formData.comprovanteCNPJouEstatuto ||
      !formData.documentoResponsavel
    ) {
      setErrorMessage('Por favor, envie o Comprovante de CNPJ/Estatuto e o Documento do Responsável.');
      return;
    }

 
    const updatedAllFormData = {
      ...allFormData,
      ong3: formData,
    };


    navigation.navigate('FormONG4', { allFormData: updatedAllFormData });
  };

  
  const renderUploadBox = (label, key, required = false) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>
        {label} {required && <Text style={{ color: VERMELHO }}>*</Text>}
      </Text>
      <TouchableOpacity style={styles.uploadBox} onPress={() => pickImage(key)}>
        {formData[key] ? (
         
          <Image
            source={{ uri: formData[key] }}
            style={styles.imagePreview}
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
      <View style={styles.background} />
      <Text style={styles.header}>Documentos e Imagens</Text>
      <View style={styles.cardContainer}>
        <ScrollView
          contentContainerStyle={styles.cardContent}
          showsVerticalScrollIndicator={false}
        >
          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

          {renderUploadBox('Comprovante de CNPJ ou Estatuto Social', 'comprovanteCNPJouEstatuto', true)}
          {renderUploadBox('Foto da fachada ou espaço físico da instituição', 'fotoFachadaEspaco')}
          {renderUploadBox('Documentos do responsável legal (RG/CPF ou CNH)', 'documentoResponsavel', true)}
          {renderUploadBox('Logo da instituição', 'logoInstituicao')}

          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Text style={styles.nextText}>Próximo</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}


const BORDER_RADIUS = width * 0.075; 
const CARD_MARGIN_HORIZONTAL = width * 0; 
const CARD_PADDING_HORIZONTAL = width * 0.08;
const CARD_PADDING_TOP = height * 0.05; 
const UPLOAD_BOX_HEIGHT = height * 0.15;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ROXO, 
    paddingTop: height * 0.05, 
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: ROXO,
  },
  cardContainer: {
    flex: 1, 
    marginHorizontal: CARD_MARGIN_HORIZONTAL, 
    marginTop: height * 0.05, 
    backgroundColor: BRANCO, 
    borderRadius: BORDER_RADIUS, 
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.005 }, 
    shadowOpacity: 0.2,
    shadowRadius: width * 0.03, 
    overflow: 'hidden',
  },
  cardContent: {
    paddingHorizontal: CARD_PADDING_HORIZONTAL,
    paddingTop: CARD_PADDING_TOP,
    paddingBottom: height * 0.1,
  },
  header: {
    fontSize: width * 0.07, 
    fontWeight: 'bold',
    color: BRANCO, 
    textAlign: 'center',
    marginBottom: height * 0.05,
    position:'relative', 
    top : '6%', 
  },
  fieldContainer: {
    marginBottom: height * 0.025, // Espaçamento entre os campos de upload
  },
  fieldLabel: {
    fontSize: width * 0.04, // Tamanho da fonte do rótulo
    fontWeight: 'bold',
    color: '#737373',
    marginBottom: height * 0.01, // Espaço entre o rótulo e o box de upload
  },
  uploadBox: {
    width: '100%',
    height: UPLOAD_BOX_HEIGHT,
    backgroundColor: CINZA_CLARO, // Fundo cinza claro para o box de upload
    borderRadius: width * 0.025, // Borda arredondada do box de upload
    borderWidth: 1,
    borderColor: '#ddd', // Cor da borda
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Garante que a imagem não vaze
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.025,
  },
  nextButton: {
    backgroundColor: BRANCO, // Botão branco
    paddingVertical: height * 0.02,
    borderRadius: BORDER_RADIUS, // Borda arredondada do botão
    alignItems: 'center',
    marginTop: height * 0.04, // Espaço antes do botão
    marginBottom: height * 0.02, // Espaço depois do botão
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  nextText: {
    color: ROXO, // Texto do botão na cor ROXO
    fontSize: width * 0.045, // Tamanho da fonte do texto do botão
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
