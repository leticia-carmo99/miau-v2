import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const LARANJA = '#FFAB36';
const BRANCO = '#FFFFFF';

export default function RevisaoCNPJ2() {
  const navigation = useNavigation();
  const route = useRoute();

  const allFormData = route.params?.allFormData || {};
  const formCNPJ2Data = allFormData.cnpj2 || {};

  function InfoLine({ label, value }) {
    const displayValue = Array.isArray(value) && value.length > 0
      ? value.join(', ')
      : value || '...';

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

        <Text style={styles.subTitle}>Informações Comerciais</Text>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <InfoLine label="Tipo da empresa" value={formCNPJ2Data.tipoEmpresa} />
          <InfoLine label="Tipo de produto ou serviço oferecido" value={formCNPJ2Data.tipoServico} />
          <InfoLine label="Região de atuação (SP)" value={formCNPJ2Data.regioes} />
          <InfoLine label="Possui loja física, loja online ou atende a domicílio?" value={formCNPJ2Data.localAtendimento} />
        </ScrollView>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate('FormCNPJ2', { allFormData: allFormData })}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.nextButton]}
            onPress={() => navigation.navigate('RevisaoCNPJ3', { allFormData: allFormData })}
          >
            <Text style={styles.buttonText}>Próximo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const BORDER_RADIUS_CARD = width * 0.08;
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
    borderTopLeftRadius: BORDER_RADIUS_CARD,
    borderTopRightRadius: BORDER_RADIUS_CARD,
    paddingHorizontal: CARD_PADDING_HORIZONTAL,
    paddingVertical: CARD_PADDING_VERTICAL,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.005 },
    shadowOpacity: 0.2,
    shadowRadius: width * 0.03,
    elevation: 5,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: LARANJA, 
    textAlign: 'center',
    marginBottom: height * 0.01,
  },
  subTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
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
    fontWeight: '600',
    color: '#333',
  },
  lineValue: {
    fontSize: width * 0.04,
    color: '#737373',
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
    borderRadius: width * 0.06,
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
    fontWeight: '600',
  },
  nextButton: {
    marginLeft: width * 0.025,
  },
});