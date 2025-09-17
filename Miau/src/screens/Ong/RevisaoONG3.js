import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { doc, setDoc } from 'firebase/firestore'; // Importação do Firestore
import { db } from '../../../firebaseConfig'; // Certifique-se que 'db' foi exportado
import * as FileSystem from 'expo-file-system';

const { width, height } = Dimensions.get('window');

const ROXO = '#6A57D2';
const BRANCO = '#FFFFFF';
const CINZA_CLARO = '#E0E0E0';
const CINZA_TEXTO_PLACEHOLDER = '#999';
const CINZA_TEXTO_LABEL = '#737373';

export default function RevisaoONG3() {
  const navigation = useNavigation();
  const route = useRoute();

const allFormData = route.params?.allFormData || {};
  const formONG3Data = allFormData.ong3 || {};

  const [isLoading, setIsLoading] = useState(false);

  // Função para ler o arquivo da URI e convertê-lo para Base64
  const imageToBase64 = async (uri) => {
    if (!uri) return null;
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Erro ao converter imagem para Base64:', error);
      throw new Error('Falha na leitura da imagem.');
    }
  };

  // Função principal para finalizar o cadastro e salvar os dados
  const handleFinalize = async () => {
    setIsLoading(true);

    try {
      // 1. Validar CNPJ/CPF da primeira tela
      const cnpjCpf = allFormData.ong1?.cnpjCpf;
      if (!cnpjCpf) {
        throw new Error('CNPJ/CPF não encontrado nos dados do formulário.');
      }
      const docId = cnpjCpf.replace(/[^0-9]/g, '');

      // 2. Converter cada imagem para Base64
      const comprovanteCNPJouEstatutoBase64 = await imageToBase64(
        formONG3Data.comprovanteCNPJouEstatuto
      );
      const fotoFachadaEspacoBase64 = await imageToBase64(
        formONG3Data.fotoFachadaEspaco
      );
      const documentoResponsavelBase64 = await imageToBase64(
        formONG3Data.documentoResponsavel
      );
      const logoInstituicaoBase64 = await imageToBase64(
        formONG3Data.logoInstituicao
      );

      // 3. Juntar todos os dados do formulário
      const finalData = {
        ...allFormData.ong1,
        ...allFormData.ong2,
        ...formONG3Data,
        comprovanteCNPJouEstatuto: comprovanteCNPJouEstatutoBase64,
        fotoFachadaEspaco: fotoFachadaEspacoBase64,
        documentoResponsavel: documentoResponsavelBase64,
        logoInstituicao: logoInstituicaoBase64,
        dataCadastro: new Date().toISOString(),
      };

      // 4. Salvar os dados completos no Firestore
      await setDoc(doc(db, 'ongs', docId), finalData);
      
      // 5. Navegar para a tela de finalização
      navigation.navigate('FinalizacaoONG', { allFormData: finalData });

    } catch (error) {
      console.error('Erro ao finalizar o cadastro:', error);
      Alert.alert('Erro', `Não foi possível finalizar o cadastro: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  function ImageLine({ label, imageUri }) {
    return (
      <View style={styles.line}>
        <Text style={styles.lineLabel}>{label}</Text>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>
              Nenhuma imagem selecionada
            </Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitleOutsideCard}>Revisão</Text> 
      
      <View style={styles.card}>
        <Text style={styles.subTitle}>Documentos e Imagens</Text>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <ImageLine
            label="Comprovante de CNPJ ou Estatuto Social"
            imageUri={formONG3Data.comprovanteCNPJouEstatuto}
          />
          <ImageLine
            label="Foto da fachada ou espaço físico da instituição"
            imageUri={formONG3Data.fotoFachadaEspaco}
          />
          <ImageLine
            label="Documentos do responsável legal (RG/CPF ou CNH)"
            imageUri={formONG3Data.documentoResponsavel}
          />
          <ImageLine
            label="Logo da instituição (opcional)"
            imageUri={formONG3Data.logoInstituicao}
          />
        </ScrollView>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('FormONG3', { allFormData: allFormData })
            }
            style={styles.button}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.nextButton]}
            onPress={handleFinalize}
            disabled={isLoading}>
            <Text style={styles.buttonText}>
              {isLoading ? 'Finalizando...' : 'Finalizar'}
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
}

const BORDER_RADIUS_CARD = width * 0.08;
const CARD_PADDING_HORIZONTAL = width * 0.08;
const IMAGE_PREVIEW_HEIGHT = height * 0.12;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ROXO,
    paddingTop: height * 0.1,
  },
  mainTitleOutsideCard: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: BRANCO,
    textAlign: 'center',
    marginBottom: height * 0.015,
  },
  card: {
    backgroundColor: BRANCO,
    borderRadius: BORDER_RADIUS_CARD,
    paddingHorizontal: CARD_PADDING_HORIZONTAL,
    paddingVertical: height * 0.02, 
    marginTop: height * 0.05,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.005 },
    shadowOpacity: 0.2,
    shadowRadius: width * 0.03,
    elevation: 5,
  },
  title: { 
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: ROXO, 
    textAlign: 'center',
    marginBottom: height * 0.01,
  },
  subTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: ROXO, 
    marginBottom: height * 0.015, 
    textAlign: 'center',
  },
  content: {
    flexGrow: 1, 
    paddingBottom: height * 0.01, 
  },
  line: {
    marginBottom: height * 0.015, 
  },
  lineLabel: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: CINZA_TEXTO_LABEL, 
    marginBottom: height * 0.005, 
  },
  imagePreview: {
    width: '100%',
    height: IMAGE_PREVIEW_HEIGHT,
    borderRadius: 10,
    backgroundColor: CINZA_CLARO,
  },
  imagePlaceholder: {
    width: '100%',
    height: IMAGE_PREVIEW_HEIGHT,
    borderRadius: 10,
    backgroundColor: CINZA_CLARO,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: CINZA_TEXTO_PLACEHOLDER, 
    fontSize: width * 0.04,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.015, 
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
    color: ROXO,
    fontSize: width * 0.04,
    fontWeight: '600',
  },
  nextButton: {
    marginLeft: width * 0.025,
  },
});
