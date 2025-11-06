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
import { doc, setDoc } from 'firebase/firestore';
import { db } from "../../../../firebaseConfig";

const { width, height } = Dimensions.get('window');
const LARANJA = '#FFAB36';
const BRANCO = '#FFFFFF';
const CINZA_CLARO = '#F7F7F7';
const VERMELHO = '#E83F5B';

export default function FormCNPJ2() {
  const navigation = useNavigation();
  const route = useRoute();

  const allFormData = route.params?.allFormData || {};

  const initialFormData = allFormData.cpf2 || {
    tipoEmpresa: '',
    tipoServico: '',
    regioes: [],
    localAtendimento: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setFormData(initialFormData);
  }, [allFormData.cnpj2]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage('');
  };

  const toggleRegiao = (regiao) => {
    setFormData((prev) => {
      const jaSelecionado = prev.regioes.includes(regiao);
      const newRegioes = jaSelecionado
        ? prev.regioes.filter((r) => r !== regiao)
        : [...prev.regioes, regiao];
      return { ...prev, regioes: newRegioes };
    });
    setErrorMessage('');
  };

  const handleNext = async () => {
    const { tipoServico, tipoEmpresa, regioes, localAtendimento } = formData;
    if (
      !tipoServico.trim() ||
      !tipoEmpresa ||
      regioes.length === 0 ||
      !localAtendimento.trim()
    ) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    const userId = allFormData.userId; 
    const updatedAllFormData = {
      ...allFormData, 
      cnpj2: formData, 
    };
    try {
        if (!userId) {
            console.error("ID do usuário não encontrado para salvar rascunho.");
            setErrorMessage('Erro de autenticação. Tente voltar e avançar.');
            return;
        }
        const docRef = doc(db, 'empresa_draft', userId);
        await setDoc(docRef, updatedAllFormData, { merge: true });
        navigation.navigate('FormCNPJ3', { allFormData: updatedAllFormData });   
    } catch (error) {
        console.error("Erro ao salvar rascunho (CNPJ2):", error);
        setErrorMessage('Falha ao salvar rascunho. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.background} />
      <Text style={styles.header}>Informações Comerciais</Text>
      <View style={styles.cardContainer}>
        <ScrollView
          contentContainerStyle={styles.cardContent}
          showsVerticalScrollIndicator={false}>
          {errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null}

          <Field label="Tipo da empresa" required>
            {['Petshop', 'Veterinário'].map((tipo) => (
              <TouchableOpacity
                key={tipo}
                style={styles.checkboxContainer}
                onPress={() => handleChange('tipoEmpresa', tipo)}>
                <View
                  style={[
                    styles.checkbox,
                    formData.tipoEmpresa === tipo && styles.checkboxSelected,
                  ]}
                />
                <Text
                  style={[
                    styles.checkboxLabel,
                    formData.tipoEmpresa === tipo && {
                      color: LARANJA,
                      fontWeight: 'bold',
                    },
                  ]}>
                  {tipo}
                </Text>
              </TouchableOpacity>
            ))}
          </Field>

          <Field label="Tipo de produto ou serviço oferecido" required>
            <TextInput
              style={styles.input}
              placeholder="Ex: banho, acessórios, ração, tosa..."
              placeholderTextColor="#999"
              value={formData.tipoServico}
              onChangeText={(text) => handleChange('tipoServico', text)}
            />
          </Field>

          <Field label="Região de atuação (SP)" required>
            {[
              'Capital (São Paulo)',
              'Região Metropolitana de São Paulo',
              'Litoral (Baixada Santista, Litoral Norte etc.)',
              'Interior - Região de Campinas',
              'Interior - Região de Sorocaba',
              'Interior - Região de Ribeirão Preto',
              'Interior - Região de São José do Rio Preto',
              'Interior - Região de Bauru',
              'Interior - Região de Marília',
              'Interior - Região de São José dos Campos / Vale do Paraíba',
              'Interior - Outras',
            ].map((regiao) => (
              <TouchableOpacity
                key={regiao}
                style={styles.checkboxContainer}
                onPress={() => toggleRegiao(regiao)}>
                <View
                  style={[
                    styles.checkbox,
                    formData.regioes.includes(regiao) &&
                      styles.checkboxSelected,
                  ]}
                />
                <Text
                  style={[
                    styles.checkboxLabel,
                    formData.regioes.includes(regiao) && {
                      color: LARANJA,
                      fontWeight: 'bold',
                    },
                  ]}>
                  {regiao}
                </Text>
              </TouchableOpacity>
            ))}
          </Field>

          <Field
            label="Possui loja física, loja online ou atende a domicílio?"
            required>
            <TextInput
              style={styles.input}
              placeholder="Insira aqui"
              placeholderTextColor="#999"
              value={formData.localAtendimento}
              onChangeText={(text) => handleChange('localAtendimento', text)}
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

function Field({ label, required, children }) {
  return (
    <View style={styles.fieldContainer}>
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
    backgroundColor: LARANJA,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: LARANJA,
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
    top: '8%',
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.012,
  },
  checkbox: {
    width: width * 0.05,
    height: width * 0.05,
    borderRadius: width * 0.0125,
    borderWidth: width * 0.005,
    borderColor: LARANJA,
    marginRight: width * 0.025,
  },
  checkboxSelected: {
    backgroundColor: LARANJA,
  },
  checkboxLabel: {
    fontSize: width * 0.035,
    color: '#333',
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
    color: LARANJA,
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
