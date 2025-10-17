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
import { Ionicons } from '@expo/vector-icons';
import { useFonts, JosefinSans_400Regular, JosefinSans_700Bold } from '@expo-google-fonts/josefin-sans';

const { width, height } = Dimensions.get('window');
const LARANJA = '#FFAB36';
const BRANCO = '#FFFFFF';
const CINZA_CLARO = '#F7F7F7';
const VERMELHO = '#E83F5B';

export default function FormONG2() {
  const navigation = useNavigation();
  const route = useRoute();

  const allFormData = route.params?.allFormData || {};

  const initialFormData = allFormData.ong2 || {
    tipoInstituicao: '',
    tempoAtuacao: '',
    numAnimaisAcolhidos: '',
    especiesAtendidas: '',
    regioesAtuacao: [],
    regiaoOutra: '',
    espacoFisicoVisitacao: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setFormData(initialFormData);
  }, [allFormData.ong2]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage('');
  };

  const toggleRegiaoAtuacao = (regiao) => {
    setFormData((prev) => {
      const currentRegioes = prev.regioesAtuacao || [];
      const isOutraSelected = currentRegioes.includes('Outra');

      if (regiao === 'Outra') {
        return {
          ...prev,
          regioesAtuacao: isOutraSelected
            ? currentRegioes.filter((r) => r !== 'Outra')
            : ['Outra'],
          regiaoOutra: isOutraSelected ? '' : prev.regiaoOutra,
        };
      } else {
        const newRegioes = isOutraSelected
          ? [regiao]
          : currentRegioes.includes(regiao)
          ? currentRegioes.filter((r) => r !== regiao)
          : [...currentRegioes, regiao];

        return {
          ...prev,
          regioesAtuacao: newRegioes.filter((r) => r !== 'Outra'),
          regiaoOutra: isOutraSelected ? '' : prev.regiaoOutra,
        };
      }
    });
    setErrorMessage('');
  };

  const handleNext = () => {
    if (
      !formData.tipoInstituicao.trim() ||
      !formData.tempoAtuacao.trim() ||
      !formData.numAnimaisAcolhidos.trim() ||
      !formData.especiesAtendidas.trim() ||
      formData.regioesAtuacao.length === 0 ||
      (formData.regioesAtuacao.includes('Outra') &&
        !formData.regiaoOutra.trim()) ||
      !formData.espacoFisicoVisitacao.trim()
    ) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const updatedAllFormData = {
      ...allFormData,
      ong2: formData,
    };
    navigation.navigate('FormONG3', { allFormData: updatedAllFormData });
  };

  function Field({ label, required, children, containerStyle }) {
    return (
      <View style={[styles.fieldContainer, containerStyle]}>
        <Text style={[styles.fieldLabel, { fontFamily: 'JosefinSans_700Bold' }]}>
          {label} {required && <Text style={{ color: VERMELHO }}>*</Text>}
        </Text>
        {children}
      </View>
    );
  }

  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <View style={styles.background} />
      <Text style={[styles.header, { fontFamily: 'JosefinSans_700Bold' }]}>
        Informações Sobre a Atuação
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

          <Field label="Tipo de instituição" required>
            <View style={styles.radioGroup}>
              {['ONG', 'Abrigo independente'].map((tipo) => (
                <TouchableOpacity
                  key={tipo}
                  style={styles.radioOption}
                  onPress={() => handleChange('tipoInstituicao', tipo)}
                >
                  <Ionicons
                    name={formData.tipoInstituicao === tipo ? 'radio-button-on' : 'radio-button-off'}
                    size={width * 0.055}
                    color={LARANJA}
                  />
                  <Text style={[styles.radioLabel, { fontFamily: 'JosefinSans_400Regular' }]}>{tipo}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Field>

          <Field label="Tempo de atuação" required>
            <TextInput
              style={[styles.input, { fontFamily: 'JosefinSans_400Regular' }]}
              placeholder="Insira aqui"
              placeholderTextColor="#999"
              value={formData.tempoAtuacao}
              onChangeText={(text) => handleChange('tempoAtuacao', text)}
            />
          </Field>

          <Field label="Número atual de animais acolhidos:" required>
            <TextInput
              style={[styles.input, { fontFamily: 'JosefinSans_400Regular' }]}
              placeholder="Insira aqui"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={formData.numAnimaisAcolhidos}
              onChangeText={(text) => handleChange('numAnimaisAcolhidos', text)}
            />
          </Field>

          <Field label="Espécies atendidas:" required>
            <View style={styles.radioGroup}>
              {['Gatos', 'Cães', 'Ambos'].map((tipo) => (
                <TouchableOpacity
                  key={tipo}
                  style={styles.radioOption}
                  onPress={() => handleChange('especiesAtendidas', tipo)}
                >
                  <Ionicons
                    name={formData.especiesAtendidas === tipo ? 'radio-button-on' : 'radio-button-off'}
                    size={width * 0.055}
                    color={LARANJA}
                  />
                  <Text style={[styles.radioLabel, { fontFamily: 'JosefinSans_400Regular' }]}>{tipo}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Field>

          <Field label="Região de atuação (SP):" required>
            {[
              'Capital (São Paulo)',
              'Região Metropolitana de São Paulo (exceto capital)',
              'Litoral (Baixada Santista, Litoral Norte, etc.)',
              'Interior - Região de Campinas',
              'Interior - Região de Sorocaba',
              'Interior - Região de Ribeirão Preto',
              'Interior - Região de São José do Rio Preto',
              'Interior - Região de Bauru',
              'Interior - Região de Presidente Prudente',
              'Interior - Região de Marília',
              'Interior - Região de São José dos Campos / Vale do Paraíba',
            ].map((regiao) => (
              <TouchableOpacity
                key={regiao}
                style={styles.checkboxContainer}
                onPress={() => toggleRegiaoAtuacao(regiao)}
              >
                <View
                  style={[
                    styles.checkbox,
                    formData.regioesAtuacao.includes(regiao) && styles.checkboxSelected,
                  ]}
                />
                <Text
                  style={[
                    styles.checkboxLabel,
                    { fontFamily: 'JosefinSans_400Regular' },
                    formData.regioesAtuacao.includes(regiao) && {
                      color: LARANJA,
                      fontFamily: 'JosefinSans_700Bold',
                    },
                  ]}
                >
                  {regiao}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => toggleRegiaoAtuacao('Outra')}
            >
              <View
                style={[
                  styles.checkbox,
                  formData.regioesAtuacao.includes('Outra') && styles.checkboxSelected,
                ]}
              />
              <Text
                style={[
                  styles.checkboxLabel,
                  { fontFamily: 'JosefinSans_400Regular' },
                  formData.regioesAtuacao.includes('Outra') && {
                    color: LARANJA,
                    fontFamily: 'JosefinSans_700Bold',
                  },
                ]}
              >
                Outra:
              </Text>
              {formData.regioesAtuacao.includes('Outra') && (
                <TextInput
                  style={[styles.input, styles.otherInput, { fontFamily: 'JosefinSans_400Regular' }]}
                  placeholder="Insira aqui"
                  placeholderTextColor="#999"
                  value={formData.regiaoOutra}
                  onChangeText={(text) => handleChange('regiaoOutra', text)}
                />
              )}
            </TouchableOpacity>
          </Field>

          <Field label="Possui espaço físico para visitação?" required>
            <View style={styles.radioGroup}>
              {['Não', 'Sim'].map((resp) => (
                <TouchableOpacity
                  key={resp}
                  style={styles.radioOption}
                  onPress={() => handleChange('espacoFisicoVisitacao', resp)}
                >
                  <Ionicons
                    name={formData.espacoFisicoVisitacao === resp ? 'radio-button-on' : 'radio-button-off'}
                    size={width * 0.055}
                    color={LARANJA}
                  />
                  <Text style={[styles.radioLabel, { fontFamily: 'JosefinSans_400Regular' }]}>{resp}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Field>

          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Text style={[styles.nextText, { fontFamily: 'JosefinSans_700Bold' }]}>Próximo</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const BORDER_RADIUS = width * 0.075;
const CARD_MARGIN_HORIZONTAL = width * 0;
const CARD_PADDING_HORIZONTAL = width * 0.08;
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
    paddingTop: height * 0.05,
    paddingBottom: height * 0.1,
  },
  header: {
    fontSize: width * 0.06,
    color: BRANCO,
    textAlign: 'center',
    marginBottom: height * 0.05,
    position: 'relative',
    top: '5%',
  },
  fieldContainer: {
    marginBottom: height * 0.018,
  },
  fieldLabel: {
    fontSize: width * 0.0375,
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
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: height * 0.01,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: width * 0.05,
    marginBottom: height * 0.01,
  },
  radioLabel: {
    fontSize: width * 0.035,
    color: '#333',
    marginLeft: width * 0.015,
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
  otherInput: {
    flex: 1,
    marginLeft: width * 0.02,
    height: INPUT_HEIGHT * 0.8,
    borderRadius: width * 0.025,
    fontSize: width * 0.035,
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
  },
  errorMessage: {
    color: VERMELHO,
    textAlign: 'center',
    marginTop: height * 0.01,
    marginBottom: height * 0.02,
    fontSize: width * 0.035,
  },
});
