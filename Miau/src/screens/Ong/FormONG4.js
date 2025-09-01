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
  TextInput,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

const LARANJA = '#FFAB36';
const BRANCO = '#FFFFFF';
const CINZA_CLARO = '#F7F7F7';
const VERMELHO = '#E83F5B';

export default function FormONG4() {
  const navigation = useNavigation();
  const route = useRoute();

  const allFormData = route.params?.allFormData || {};

  const initialFormData = allFormData.ong4 || {
    policyFile: null,
    policyLink: '',
    termsChecked: false,
    usageAuthorization: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setFormData(initialFormData);
  }, [allFormData.ong4]);

  const pickFile = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      setErrorMessage("Permissão negada. Você precisa permitir acesso à galeria para selecionar arquivos.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setFormData((prev) => ({ ...prev, policyFile: result.assets[0].uri }));
      setErrorMessage('');
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage('');
  };

  const handleNext = () => {
    if (!formData.termsChecked) {
      setErrorMessage('Você deve concordar com os Termos de Uso para continuar.');
      return;
    }

    const updatedAllFormData = {
      ...allFormData,
      ong4: formData,
    };

    navigation.navigate('FinalizacaoONG', { allFormData: updatedAllFormData });
  };

  const handleReview = () => {
    const updatedAllFormData = {
      ...allFormData,
      ong4: formData,
    };

    navigation.navigate('RevisaoONG1', { allFormData: updatedAllFormData });
  };

  return (
    <View style={styles.container}>
      <View style={styles.background} />
      <Text style={styles.header}>Termos e Autorização</Text>
      <View style={styles.cardContainer}>
        <ScrollView
          contentContainerStyle={styles.cardContent}
          showsVerticalScrollIndicator={false}
        >
          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

          <View style={styles.policySection}>
            <Text style={styles.label}>Política de Adoção do ONG (opcional)</Text>
            <View style={styles.uploadLinkContainer}>
              <View style={styles.fieldWrapper}>
                <Text style={styles.subLabel}>Arquivo</Text>
                <TouchableOpacity style={styles.uploadBox} onPress={pickFile}>
                  {formData.policyFile ? (
                    formData.policyFile.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                      <Image
                        source={{ uri: formData.policyFile }}
                        style={styles.imagePreview}
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
          </View>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => {
              handleChange('termsChecked', !formData.termsChecked);
              setErrorMessage('');
            }}
          >
            <Ionicons
              name={formData.termsChecked ? 'checkbox-outline' : 'square-outline'}
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
              do aplicativo MiAu.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => handleChange('usageAuthorization', !formData.usageAuthorization)}
          >
            <Ionicons
              name={formData.usageAuthorization ? 'checkbox-outline' : 'square-outline'}
              size={width * 0.06}
              color={LARANJA}
            />
            <Text style={styles.checkboxText}>
              Autorizo o aplicativo MiAu a exibir informações, fotos e dados fornecidos pela minha instituição no app, respeitando a finalidade de promover a adoção de animais.
            </Text>
          </TouchableOpacity>

          <View style={styles.buttonsRow}>
            <TouchableOpacity onPress={handleReview} style={styles.button}>
              <Text style={styles.buttonText}>Rever respostas</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleNext} style={[styles.button, styles.sendButton]}>
              <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const BORDER_RADIUS = width * 0.075;
const CARD_MARGIN_HORIZONTAL = width * 0; 
const CARD_PADDING_HORIZONTAL = width * 0.08;
const CARD_PADDING_TOP = height * 0.05;
const UPLOAD_BOX_HEIGHT = height * 0.12;
const INPUT_HEIGHT = height * 0.06;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LARANJA,
    paddingTop: height * 0.05,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: LARANJA,
  },
  cardContainer: {
    flex: 1,
    marginHorizontal: CARD_MARGIN_HORIZONTAL,
    marginTop: height * 0.05,
    marginBottom: height * 0.05,
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
  policySection: {
    marginBottom: height * 0.03,
  },
  label: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: LARANJA,
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  subLabel: {
    fontSize: width * 0.035,
    color: '#737373',
    marginBottom: height * 0.005,
  },
  uploadLinkContainer: {
    flexDirection: 'column',
  },
  fieldWrapper: {
    marginBottom: height * 0.02,
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
  input: {
    width: '100%',
    height: INPUT_HEIGHT,
    backgroundColor: CINZA_CLARO,
    borderRadius: width * 0.025,
    paddingHorizontal: width * 0.04,
    fontSize: width * 0.04,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: height * 0.025,
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
    marginTop: height * 0.01,
    marginBottom: height * 0.02,
    fontSize: width * 0.035,
  },
  buttonsRow: {
    marginTop: height * 0.04,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    backgroundColor: BRANCO,
    paddingVertical: height * 0.02,
    borderRadius: BORDER_RADIUS,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 0,
    width: '80%',
    marginBottom: height * 0.015,
  },
  buttonText: {
    color: LARANJA,
    fontSize: width * 0.045,
    fontWeight: '600',
  },
  sendButton: {
    width: '100%',
  },
});
