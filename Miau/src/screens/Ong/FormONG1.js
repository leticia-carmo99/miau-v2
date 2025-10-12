import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig"; 

const { width, height } = Dimensions.get('window');
const ROXO = '#6A57D2';
const LARANJA = '#FFAB36';
const CINZA_CLARO = '#F7F7F7';
const BRANCO = '#FFFFFF';
const VERMELHO = '#E83F5B';

export default function FormONG1() {
  const navigation = useNavigation();
 const route = useRoute();

// Dados trazidos da navegação anterior (CadONG.js) ou de edição (allFormData)
const allFormData = route.params?.allFormData || {};
const paramsFromCadONG = route.params; // Dados: nome, cep, email, senha


  const initialFormData = allFormData.ong1 || {
    nomeOng: paramsFromCadONG?.nome || '', 
    emailContato: paramsFromCadONG?.email || '',
    cep: paramsFromCadONG?.cep || '', 
    senha: paramsFromCadONG?.senha || '', 
    cnpjCpf: '',
    nomeResponsavel: '',
    telefoneContato: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    redesSociais: '',
    siteOficial: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errorMessage, setErrorMessage] = useState('');

useEffect(() => {
  const combinedData = {
      ...initialFormData,
      nomeOng: paramsFromCadONG?.nome || initialFormData.nomeOng,
      emailContato: paramsFromCadONG?.email || initialFormData.emailContato,
      senha: paramsFromCadONG?.senha || initialFormData.senha,
      cep: paramsFromCadONG?.cep || initialFormData.cep,
  };
  setFormData(combinedData);
}, [allFormData.ong1, paramsFromCadONG]); 


  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage('');
  };

  const handleNext = () => {
    if (
      !formData.nomeOng.trim() ||
      !formData.cnpjCpf.trim() ||
      !formData.nomeResponsavel.trim() ||
      !formData.emailContato.trim() ||
      !formData.telefoneContato.trim() ||
      !formData.rua.trim() ||
      !formData.numero.trim() ||
      !formData.bairro.trim() ||
      !formData.cidade.trim() ||
      !formData.estado.trim() ||
      !formData.cep.trim()
    ) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const updatedAllFormData = {
      ...allFormData,
      ong1: formData,
    };

    navigation.navigate('FormONG2', { allFormData: updatedAllFormData });
  };

  return (
    <View style={styles.container}>
      <View style={styles.background} />
      <Text style={styles.header}>Informações gerais</Text>
      <View style={styles.cardContainer}>
        <ScrollView
          contentContainerStyle={styles.cardContent}
          showsVerticalScrollIndicator={false}>
          {errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null}

          <Field label="Nome da ONG ou abrigo." required>
            <TextInput
              style={styles.input}
              placeholder="Insira aqui"
              placeholderTextColor="#999"
              value={formData.nomeOng}
              onChangeText={(text) => handleChange('nomeOng', text)}
            />
          </Field>

          <Field label="CNPJ (ou CPF, se for um abrigo informal):" required>
            <TextInput
              style={styles.input}
              placeholder="Insira aqui"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={formData.cnpjCpf}
              onChangeText={(text) => handleChange('cnpjCpf', text)}
            />
          </Field>

          <Field label="Nome do Responsável Legal:" required>
            <TextInput
              style={styles.input}
              placeholder="Insira aqui"
              placeholderTextColor="#999"
              value={formData.nomeResponsavel}
              onChangeText={(text) => handleChange('nomeResponsavel', text)}
            />
          </Field>

          <Field label="E-mail de Contato:" required>
            <TextInput
              style={styles.input}
              placeholder="Insira aqui"
              placeholderTextColor="#999"
              keyboardType="email-address"
              value={formData.emailContato}
              onChangeText={(text) => handleChange('emailContato', text)}
              editable={!paramsFromCadONG?.email}
            />
          </Field>

          <Field label="Telefone/WhatsApp" required>
            <TextInput
              style={styles.input}
              placeholder="Insira aqui"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={formData.telefoneContato}
              onChangeText={(text) => handleChange('telefoneContato', text)}
            />
          </Field>

          <Field label="Endereço Completo" required>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.half]}
                placeholder="Rua"
                placeholderTextColor="#999"
                value={formData.rua}
                onChangeText={(text) => handleChange('rua', text)}
              />
              <TextInput
                style={[
                  styles.input,
                  styles.half,
                  { marginLeft: width * 0.02 },
                ]}
                placeholder="Número"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={formData.numero}
                onChangeText={(text) => handleChange('numero', text)}
              />
            </View>
          </Field>

          <View style={styles.row}>
            <Field label="Bairro" required containerStyle={styles.half}>
              <TextInput
                style={styles.input}
                placeholder="Bairro"
                placeholderTextColor="#999"
                value={formData.bairro}
                onChangeText={(text) => handleChange('bairro', text)}
              />
            </Field>
            <Field label="Cidade" required containerStyle={styles.half}>
              <TextInput
                style={styles.input}
                placeholder="Cidade"
                placeholderTextColor="#999"
                value={formData.cidade}
                onChangeText={(text) => handleChange('cidade', text)}
              />
            </Field>
          </View>

          <View style={styles.row}>
            <Field label="CEP" required containerStyle={styles.half}>
              <TextInput
                style={styles.input}
                placeholder="00000-000"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={formData.cep}
                onChangeText={(text) => handleChange('cep', text)}
                editable={!paramsFromCadONG?.cep} 
              />
            </Field>
            <Field label="Estado" required containerStyle={styles.half}>
              <TextInput
                style={styles.input}
                placeholder="Estado"
                placeholderTextColor="#999"
                value={formData.estado}
                onChangeText={(text) => handleChange('estado', text)}
              />
            </Field>
          </View>

          <Field label="Link para Redes Sociais (Instagram, Facebook etc.)">
            <TextInput
              style={styles.input}
              placeholder="Insira aqui"
              placeholderTextColor="#999"
              value={formData.redesSociais}
              onChangeText={(text) => handleChange('redesSociais', text)}
              keyboardType="url"
              autoCapitalize="none"
            />
          </Field>

          <Field label="Site oficial (se houver)">
            <TextInput
              style={styles.input}
              placeholder="Insira aqui"
              placeholderTextColor="#999"
              value={formData.siteOficial}
              onChangeText={(text) => handleChange('siteOficial', text)}
              keyboardType="url"
              autoCapitalize="none"
            />
          </Field>

          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Text style={styles.nextText}>Próximo</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

function Field({ label, required, children, containerStyle }) {
  return (
    <View style={[styles.fieldContainer, containerStyle]}>
      <Text style={styles.fieldLabel}>
        {label} {required && <Text style={{ color: VERMELHO }}>*</Text>}
      </Text>
      {children}
    </View>
  );
}

const BORDER_RADIUS = width * 0.075;
const CARD_MARGIN = width * 0.0025;
const CARD_PADDING_HORIZONTAL = width * 0.09;
const INPUT_HEIGHT = height * 0.06;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ROXO,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: ROXO,
  },
  cardContainer: {
    flex: 1,
    margin: CARD_MARGIN,
    marginTop: height * 0.1,
    backgroundColor: BRANCO,
    borderRadius: BORDER_RADIUS,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.025 },
    shadowOpacity: 0.2,
    shadowRadius: width * 0.0375,
    overflow: 'hidden',
  },
  cardContent: {
    paddingHorizontal: CARD_PADDING_HORIZONTAL,
    paddingTop: height * 0.05,
    paddingBottom: height * 0.1,
  },
  header: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: BRANCO,
    textAlign: 'center',
    marginBottom: height * 0.05,
    position: 'relative',
    top: '10%',
  },
  fieldContainer: {
    marginBottom: height * 0.018,
  },
  fieldLabel: {
    fontSize: width * 0.0375,
    fontWeight: 'bold',
    color: '#737373',
    marginBottom: height * 0.01,
    marginTop: height * 0.02,
  },
  input: {
    width: '100%',
    height: INPUT_HEIGHT,
    backgroundColor: CINZA_CLARO,
    borderRadius: BORDER_RADIUS,
    paddingHorizontal: width * 0.04,
    fontSize: width * 0.04,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  half: {
    width: '48%',
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
