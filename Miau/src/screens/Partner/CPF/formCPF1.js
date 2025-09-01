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

const { width, height } = Dimensions.get('window');
const ROXO = '#6A57D2';
const CINZA_CLARO = '#F7F7F7';
const BRANCO = '#FFFFFF';
const VERMELHO = '#E83F5B';

export default function FormCPF1() {
  const navigation = useNavigation();
  const route = useRoute();

  const allFormData = route.params?.allFormData || {};

  const initialFormData = allFormData.cpf1 || {
    nome: '',
    cpf: '',
    servico: '',
    email: '',
    telefone: '',
    endereco: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    redes: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setFormData(initialFormData);
  }, [allFormData.cpf1]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage('');
  };

  const handleNext = () => {
    if (
      !formData.nome.trim() ||
      !formData.cpf.trim() ||
      !formData.servico.trim() ||
      !formData.email.trim() ||
      !formData.telefone.trim() ||
      !formData.endereco.trim()
    ) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const updatedAllFormData = {
      ...allFormData,
      cpf1: formData,
    };

    navigation.navigate('FormCPF2', { allFormData: updatedAllFormData });
  };

  return (
    <View style={styles.container}>
      <View style={styles.background} />

      <Text style={styles.header}>Informações Pessoais</Text>
      <View style={styles.cardContainer}>
        <ScrollView
          contentContainerStyle={styles.cardContent}
          showsVerticalScrollIndicator={false}>
          {errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null}

          <Field label="Nome completo" required>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              placeholderTextColor="#999"
              value={formData.nome}
              onChangeText={(text) => handleChange('nome', text)}
            />
          </Field>

          <Field label="CPF" required>
            <TextInput
              style={styles.input}
              placeholder="000.000.000-00"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={formData.cpf}
              onChangeText={(text) => handleChange('cpf', text)}
            />
          </Field>

          <Field label="Nome do Serviço Prestado" required>
            <TextInput
              style={styles.input}
              placeholder="Ex: Adoção de cães"
              placeholderTextColor="#999"
              value={formData.servico}
              onChangeText={(text) => handleChange('servico', text)}
            />
          </Field>

          <Field label="E-mail de Contato" required>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
            />
          </Field>

          <Field label="Telefone/WhatsApp" required>
            <TextInput
              style={styles.input}
              placeholder="(11) 91234-5678"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={formData.telefone}
              onChangeText={(text) => handleChange('telefone', text)}
            />
          </Field>

          <Field label="Endereço Completo" required>
            <TextInput
              style={styles.input}
              placeholder="Rua, número, complemento"
              placeholderTextColor="#999"
              value={formData.endereco}
              onChangeText={(text) => handleChange('endereco', text)}
            />
          </Field>

          <View style={styles.row}>
            <Field label="Bairro" containerStyle={styles.half}>
              <TextInput
                style={styles.input}
                placeholder="Bairro"
                placeholderTextColor="#999"
                value={formData.bairro}
                onChangeText={(text) => handleChange('bairro', text)}
              />
            </Field>
            <Field label="Cidade" containerStyle={styles.half}>
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
            <Field label="CEP" containerStyle={styles.half}>
              <TextInput
                style={styles.input}
                placeholder="00000-000"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={formData.cep}
                onChangeText={(text) => handleChange('cep', text)}
              />
            </Field>
            <Field label="Estado" containerStyle={styles.half}>
              <TextInput
                style={styles.input}
                placeholder="SP"
                placeholderTextColor="#999"
                value={formData.estado}
                onChangeText={(text) => handleChange('estado', text)}
              />
            </Field>
          </View>

          <Field label="Redes Sociais ou Portfólio online">
            <TextInput
              style={styles.input}
              placeholder="Link ou usuário"
              placeholderTextColor="#999"
              value={formData.redes}
              onChangeText={(text) => handleChange('redes', text)}
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
