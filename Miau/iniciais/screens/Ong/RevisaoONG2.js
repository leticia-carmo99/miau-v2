import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const LARANJA = '#FFAB36';
const BRANCO = '#FFFFFF';
const CINZA_TEXTO = '#A0A0A0';

export default function RevisaoONG2() {
  const navigation = useNavigation();
  const route = useRoute();

  const allFormData = route.params?.allFormData || {};
  const formONG2Data = allFormData.ong2 || {};

  function InfoLine({ label, value }) {
    const displayValue = Array.isArray(value) && value.length > 0
      ? value.join(', ')
      : value;

    if (displayValue === null || displayValue === undefined || (typeof displayValue === 'string' && displayValue.trim() === '')) {
      return null;
    }

    return (
      <View style={styles.line}>
        <Text style={styles.lineLabel}>{label}</Text>
        <Text style={styles.lineValue}>{displayValue}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitleOutsideCard}>Revisão</Text>
      
      <View style={styles.card}>
        <Text style={styles.subTitle}>Informações Sobre a Atuação</Text>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <InfoLine label="Tipo de instituição:" value={formONG2Data.tipoInstituicao} />
          <InfoLine label="Tempo de atuação:" value={formONG2Data.tempoAtuacao} />
          <InfoLine label="Número atual de animais acolhidos:" value={formONG2Data.numAnimaisAcolhidos} />
          <InfoLine label="Espécies atendidas:" value={formONG2Data.especiesAtendidas} />
          <InfoLine label="Região de atuação (SP):" value={formONG2Data.regioesAtuacao} />
          {formONG2Data.regioesAtuacao && formONG2Data.regioesAtuacao.includes('Outra') && (
            <InfoLine label="Outra Região Especificada:" value={formONG2Data.regiaoOutra} />
          )}
          <InfoLine label="Possui espaço físico para visitação?" value={formONG2Data.espacoFisicoVisitacao} />
        </ScrollView>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate('FormONG2', { allFormData: allFormData })}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.nextButton]}
            onPress={() => navigation.navigate('RevisaoONG3', { allFormData: allFormData })}
          >
            <Text style={styles.buttonText}>Próximo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const BORDER_RADIUS_CARD = width * 0.075;
const CARD_MARGIN_HORIZONTAL = width * 0; 
const CARD_PADDING_HORIZONTAL = width * 0.08;
const CARD_PADDING_VERTICAL = height * 0.03;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LARANJA,
    paddingTop: height * 0.1,
  },
  mainTitleOutsideCard: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: BRANCO,
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  card: {
    flex: 1,
    backgroundColor: BRANCO,
    borderRadius: BORDER_RADIUS_CARD, 
    marginHorizontal: CARD_MARGIN_HORIZONTAL, 
    marginTop: height * 0.05,
    paddingHorizontal: CARD_PADDING_HORIZONTAL,
    paddingVertical: CARD_PADDING_VERTICAL,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.005 },
    shadowOpacity: 0.2,
    shadowRadius: width * 0.03,
    elevation: 5,
  },
  subTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: LARANJA,
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  content: {
    paddingBottom: height * 0.03,
  },
  line: {
    marginBottom: height * 0.015,
  },
  lineLabel: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: '#333',
  },
  lineValue: {
    fontSize: width * 0.04,
    color: CINZA_TEXTO,
    marginTop: height * 0.003,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.03,
  },
  button: {
    flex: 1,
    paddingVertical: height * 0.02,
    borderRadius: BORDER_RADIUS_CARD,
    backgroundColor: BRANCO,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: LARANJA,
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  nextButton: {
    marginLeft: width * 0.025,
  },
});
