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
import { useFonts, JosefinSans_400Regular, JosefinSans_700Bold } from '@expo-google-fonts/josefin-sans';

const { width, height } = Dimensions.get('window');

const ROXO = '#6A57D2'; 
const BRANCO = '#FFFFFF'; 
const CINZA_CLARO = '#F7F7F7'; 
const VERMELHO = '#E83F5B';

const BORDER_RADIUS = width * 0.075; 
const CARD_MARGIN_HORIZONTAL = width * 0; 
const CARD_PADDING_HORIZONTAL = width * 0.08;
const CARD_PADDING_TOP = height * 0.05; 
const UPLOAD_BOX_HEIGHT = height * 0.15;

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

  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
  });

  if (!fontsLoaded) return null;

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
    if (!formData.comprovanteCNPJouEstatuto || !formData.documentoResponsavel) {
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
      <Text style={[styles.fieldLabel, { fontFamily: 'JosefinSans_700Bold' }]}>
        {label} {required && <Text style={{ color: VERMELHO, fontFamily: 'JosefinSans_700Bold' }}>*</Text>}
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
      <Text style={[styles.header, { fontFamily: 'JosefinSans_700Bold' }]}>
        Documentos e Imagens
      </Text>
      <View style={styles.cardContainer}>
        <ScrollView
          contentContainerStyle={styles.cardContent}
          showsVerticalScrollIndicator={false}
        >
          {errorMessage ? (
            <Text style={[styles.errorMessage, { fontFamily: 'JosefinSans_400Regular' }]}>
              {errorMessage}
            </Text>
          ) : null}

          {renderUploadBox('Comprovante de CNPJ ou Estatuto Social', 'comprovanteCNPJouEstatuto', true)}
          {renderUploadBox('Foto da fachada ou espaço físico da instituição', 'fotoFachadaEspaco')}
          {renderUploadBox('Documentos do responsável legal (RG/CPF ou CNH)', 'documentoResponsavel', true)}
          {renderUploadBox('Logo da instituição', 'logoInstituicao')}

          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Text style={[styles.nextText, { fontFamily: 'JosefinSans_700Bold' }]}>Próximo</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

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
    color: BRANCO,
    textAlign: 'center',
    marginBottom: height * 0.05,
    position:'relative',
    top : '6%', 
  },
  fieldContainer: {
    marginBottom: height * 0.025,
  },
  fieldLabel: {
    fontSize: width * 0.04,
    color: '#737373',
    marginBottom: height * 0.01,
  },
  uploadBox: {
    width: '100%',
    height: UPLOAD_BOX_HEIGHT,
    backgroundColor: CINZA_CLARO,
    borderRadius: width * 0.025,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.025,
  },
  nextButton: {
    backgroundColor: BRANCO,
    paddingVertical: height * 0.02,
    borderRadius: BORDER_RADIUS,
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
  },
  errorMessage: {
    color: VERMELHO,
    textAlign: 'center',
    marginTop: height * 0.01,
    marginBottom: height * 0.02,
    fontSize: width * 0.035,
  },
});
