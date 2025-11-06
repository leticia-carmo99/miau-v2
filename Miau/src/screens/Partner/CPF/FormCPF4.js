import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { doc, setDoc } from 'firebase/firestore';
import { db } from "../../../../firebaseConfig";

const { width, height } = Dimensions.get('window');
const LARANJA = '#FFAB36';
const BRANCO = '#FFFFFF';
const VERMELHO = '#E83F5B';

export default function FormCPF4() {
  const navigation = useNavigation();
  const route = useRoute();

  const allFormData = route.params?.allFormData || {};

  const initialFormData = allFormData.cpf4 || {
    termsChecked: false,
    usageChecked: false,
  };

  const [termsChecked, setTermsChecked] = useState(
    initialFormData.termsChecked
  );
  const [usageChecked, setUsageChecked] = useState(
    initialFormData.usageChecked
  );
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setTermsChecked(initialFormData.termsChecked);
    setUsageChecked(initialFormData.usageChecked);
  }, [allFormData.cpf4]);

  const handleReview = () => {
    const updatedAllFormData = {
      ...allFormData,
      cpf4: {
        termsChecked,
        usageChecked,
      },
    };
    navigation.navigate('RevisaoCPF1', { allFormData: updatedAllFormData });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Termos & Autorização</Text>
        <View style={styles.card}>
          {errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => {
              setTermsChecked((prev) => !prev);
              setErrorMessage('');
            }}>
            <Ionicons
              name={termsChecked ? 'checkbox' : 'square-outline'}
              size={width * 0.06}
              color={LARANJA}
            />
            <Text style={styles.checkboxText}>
              Li e concordo com os{' '}
              <Text
                style={styles.link}
                onPress={() =>
                  Linking.openURL('https://seudominio.com/termos')
                }>
                Termos de Uso
              </Text>{' '}
              do aplicativo MIAU.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setUsageChecked((prev) => !prev)}>
            <Ionicons
              name={usageChecked ? 'checkbox' : 'square-outline'}
              size={width * 0.06}
              color={LARANJA}
            />
            <Text style={styles.checkboxText}>
              Autorizo o uso de informações e imagens fornecidas para divulgação
              no aplicativo.
            </Text>
          </TouchableOpacity>

          <View style={styles.buttonsRow}>
            <TouchableOpacity onPress={handleReview} style={styles.button}>
              <Text style={styles.buttonText}>Rever Dados</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const CARD_RADIUS = width * 0.075;
const CARD_PADDING_HORIZONTAL = width * 0.08;
const CARD_PADDING_VERTICAL = height * 0.05;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LARANJA,
  },
  scrollContent: {
    paddingTop: height * 0.15,
    paddingBottom: height * 0.05,
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: BRANCO,
    textAlign: 'center',
    marginBottom: height * 0.05,
  },
  card: {
    backgroundColor: BRANCO,
    borderRadius: CARD_RADIUS,
    marginHorizontal: width * 0,
    paddingHorizontal: CARD_PADDING_HORIZONTAL,
    paddingVertical: CARD_PADDING_VERTICAL,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.005 },
    shadowOpacity: 0.2,
    shadowRadius: width * 0.03,
    elevation: 5,
  },
  errorMessage: {
    color: VERMELHO,
    textAlign: 'center',
    marginBottom: height * 0.02,
    fontSize: width * 0.035,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: height * 0.025,
    width: '100%',
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
  buttonsRow: {
    marginTop: height * 0.04,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    backgroundColor: BRANCO,
    paddingVertical: height * 0.02,
    borderRadius: CARD_RADIUS,
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
    marginBottom: 0,
  },
});
