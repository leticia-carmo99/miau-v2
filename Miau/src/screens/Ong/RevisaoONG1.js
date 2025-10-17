import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFonts, JosefinSans_400Regular, JosefinSans_700Bold } from '@expo-google-fonts/josefin-sans';

const { width, height } = Dimensions.get('window');

const ROXO_FUNDO = '#6A57D2';
const ROXO_DESTAQUE = '#6A57D2';
const BRANCO = '#FFFFFF';
const CINZA_TEXTO = '#A0A0A0';

export default function RevisaoONG1() {
  const navigation = useNavigation();
  const route = useRoute();

  const allFormData = route.params?.allFormData || {};
  const formONG1Data = allFormData.ong1 || {};

  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
  });

  if (!fontsLoaded) return null;

  function InfoLine({ label, value }) {
    return (
      <View style={styles.line}>
        <Text style={styles.lineLabel}>{label}</Text>
        <Text style={styles.lineValue}>{value || 'Não preenchido'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitleOutsideCard}>Revisão</Text>
      
      <View style={styles.card}>
        <Text style={styles.subTitle}>Informações gerais</Text>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <InfoLine label="Nome da ONG ou abrigo:" value={formONG1Data.nomeOng} />
          <InfoLine label="CNPJ (ou CPF, se for um abrigo informal):" value={formONG1Data.cnpjCpf} />
          <InfoLine label="Nome do Responsável Legal:" value={formONG1Data.nomeResponsavel} />
          <InfoLine label="E-mail de Contato:" value={formONG1Data.emailContato} />
          <InfoLine label="Telefone/WhatsApp:" value={formONG1Data.telefoneContato} />
          
          <View style={styles.line}>
            <Text style={styles.lineLabel}>Endereço Completo:</Text>
            <Text style={styles.lineValue}>
              {`${formONG1Data.rua || ''}, ${formONG1Data.numero || ''}`}
            </Text>
            <Text style={styles.lineValue}>
              {`${formONG1Data.bairro || ''} - ${formONG1Data.cidade || ''} - ${formONG1Data.estado || ''}`}
            </Text>
            <Text style={styles.lineValue}>
              {`${formONG1Data.cep || ''}`}
            </Text>
          </View>

          <InfoLine label="Link para Redes Sociais (Instagram, Facebook etc.):" value={formONG1Data.redesSociais} />
          <InfoLine label="Site oficial (se houver):" value={formONG1Data.siteOficial} />
        </ScrollView>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate('FormONG1', { allFormData })}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.nextButton]}
            onPress={() => navigation.navigate('RevisaoONG2', { allFormData })}
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
    backgroundColor: ROXO_FUNDO,
    paddingTop: height * 0.1,
  },
  mainTitleOutsideCard: {
    fontSize: width * 0.07,
    fontFamily: 'JosefinSans_700Bold',
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
    marginBottom: height * 0.05,
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
    fontFamily: 'JosefinSans_700Bold',
    color: ROXO_DESTAQUE,
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
    fontFamily: 'JosefinSans_700Bold',
    color: '#333',
  },
  lineValue: {
    fontSize: width * 0.04,
    fontFamily: 'JosefinSans_400Regular',
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
    color: ROXO_DESTAQUE,
    fontSize: width * 0.04,
    fontFamily: 'JosefinSans_700Bold',
  },
  nextButton: {
    marginLeft: width * 0.025,
  },
});
