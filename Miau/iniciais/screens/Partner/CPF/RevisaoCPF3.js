import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const ROXO = '#6A57D2';
const BRANCO = '#FFFFFF';
const CINZA_CLARO = '#E0E0E0';

export default function RevisaoCPF3() {
  const navigation = useNavigation();
  const route = useRoute();

  const allFormData = route.params?.allFormData || {};
  const formCPF3Data = allFormData.cpf3 || {}; 

  function ImageLine({ label, imageUri }) {
    return (
      <View style={styles.line}>
        <Text style={styles.lineLabel}>{label}</Text>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>Nenhuma imagem selecionada</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
    
      <Text style={styles.mainTitleOutsideCard}>Revisão</Text>
      <View style={styles.card}>
       
        <Text style={styles.subTitle}>Documentos e Mídia</Text>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ImageLine
            label="Logo da empresa ou foto de perfil profissional"
            imageUri={formCPF3Data.logoPerfil}
          />
          <ImageLine
            label="Imagens dos serviços"
            imageUri={formCPF3Data.imagensServico}
          />
          <ImageLine
            label="Documento com foto (RG ou CNH)"
            imageUri={formCPF3Data.documentoFoto}
          />
          <ImageLine
            label="Imagem do local físico de atendimento (se houver)"
            imageUri={formCPF3Data.localAtendimento}
          />
        </ScrollView>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('FormCPF3', { allFormData: allFormData })
            }
            style={styles.buttonOutline}
          >
            <Text style={styles.buttonOutlineText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonSolid}
            onPress={() =>
              navigation.navigate('FormCPF4', { allFormData: allFormData })
            }
          >
            <Text style={styles.buttonSolidText}>Próximo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const BORDER_RADIUS_CARD = width * 0.08;
const CARD_PADDING_HORIZONTAL = width * 0.07;
const CARD_PADDING_VERTICAL = height * 0.03;
const IMAGE_PREVIEW_HEIGHT = height * 0.12;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ROXO,
    paddingTop: height * 0.05,
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
  subTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: ROXO,
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  content: {
    paddingBottom: height * 0.02,
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
    color: '#999',
    fontSize: width * 0.04,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.03,
  },
  buttonOutline: {
    flex: 1,
    marginRight: width * 0.025,
    paddingVertical: height * 0.015,
    borderRadius: width * 0.06,
    backgroundColor: BRANCO,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonOutlineText: {
    color: ROXO,
    fontSize: width * 0.04,
    fontWeight: '600',
  },
  buttonSolid: {
    flex: 1,
    marginLeft: width * 0.025,
    paddingVertical: height * 0.015,
    borderRadius: width * 0.06,
    backgroundColor: ROXO,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonSolidText: {
    color: BRANCO,
    fontSize: width * 0.04,
    fontWeight: '600',
  },
});
