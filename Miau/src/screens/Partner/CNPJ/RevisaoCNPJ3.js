import React, { useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, setDoc } from 'firebase/firestore';
import { db, storage } from '../../../../firebaseConfig';
import emailjs from '@emailjs/react-native'; 

const { width, height } = Dimensions.get('window');
const ROXO = '#6A57D2';
const BRANCO = '#FFFFFF';
const CINZA_CLARO = '#E0E0E0';

const EMAILJS_SERVICE_ID = 'service_cb172kq'; 
const EMAILJS_TEMPLATE_ID = 'template_98oxco7'; 
const EMAILJS_USER_ID = '7Z2Yvbl4xyV5_wuBM';

export default function RevisaoCNPJ3() {
  const navigation = useNavigation();
  const route = useRoute();
  const allFormData = route.params?.allFormData || {};
  const formCNPJ1Data = allFormData.cnpj1 || {};
  const formCNPJ2Data = allFormData.cnpj2 || {};
  const formCNPJ3Data = allFormData.cnpj3 || {};
  const formCNPJ4Data = allFormData.cnpj4 || {};


  function ImageLine({ label, imageUri }) {
    return (
      <View style={styles.line}>
        <Text style={styles.lineLabel}>{label}</Text>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
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

      const sendApprovalEmail = async (data, userId) => {
    if (!EMAILJS_USER_ID || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
      console.error("Configurações do EmailJS ausentes. Verifique as constantes.");
      Alert.alert("Erro de E-mail", "Configuração do serviço de e-mail ausente.");
      return;
    }
      
  const linkAprovacao = `https://console.firebase.google.com/u/0/project/miauuu-84f5b/firestore/databases/-default-/data/~2Fempresa~2F${userId}`;
  
      const templateParamsParaEmailJS = {
          to_email: 'suporteappmiau@gmail.com', 
          nome_usuario: data.nome,
          documento_info: `${data.cpfCnpj} (${data.documentType})`,
          nome_responsavel: data.nomeResponsavel || 'N/A',
          email_usuario: data.email,
          telefone: data.telefone,
          tipo_empresa: data.tipo_empresa || 'N/A',
          link_de_aprovacao: linkAprovacao, 
          instrucao_admin: `Acesse o link abaixo para revisar e aprovar manualmente no Firebase.`,
      };
  
    try {
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParamsParaEmailJS,
            { 
                publicKey: EMAILJS_USER_ID
            }
        );
        if (response.status === 200) {
            console.log("E-mail de aprovação enviado com sucesso.", response);
        } else {
            console.error("Falha ao enviar e-mail de aprovação. Status:", response.status, response.text);
            Alert.alert("Erro de E-mail", `Falha ao enviar notificação. Status: ${response.status}`);
        }
    } catch (error) {
        console.error("Erro na requisição EmailJS (SDK React Native):", error);
        Alert.alert("Erro de E-mail", `Não foi possível enviar o e-mail de notificação. Detalhe: ${error.message || error.text || 'Erro desconhecido'}`);
    }
  };
  
  const handleFinalizarCadastro = async () => {
      const userId = allFormData.userId;
  
      if (!userId) {
        Alert.alert("Erro", "Erro de autenticação. Usuário não identificado.");
        return;
      }
  
      try {
        const finalData = {
          ...allFormData.cnpj1,
          ...allFormData.cnpj2,
          ...allFormData.cnpj3,
          ...allFormData.cnpj4, 
          documentType: 'empresa', 
          dataCadastro: new Date().toISOString(),
          ativo: false,
          sobre: "",
          tipoCadastro: 'CNPJ'
        };
        const docRef = doc(db, 'empresa', userId);
        await setDoc(docRef, finalData);
        await sendApprovalEmail(finalData, userId); 
        Alert.alert("Sucesso!", "Seu cadastro foi finalizado e enviado para análise.");
        navigation.navigate('Finalizacao', { tipoCadastro: 'CNPJ', documento: userId });
      } catch (e) {
        console.error("Erro ao finalizar o cadastro:", e);
        Alert.alert("Erro", "Ocorreu um erro ao finalizar o seu cadastro. Tente novamente.");
      }
    };

  return (
    <View style={styles.container}>

      <Text style={styles.mainTitleOutsideCard}>Revisão</Text> 
      
      <View style={styles.card}>
     
        <Text style={styles.subTitle}>Documentos e Mídia</Text>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <ImageLine
            label="Logo da empresa"
            imageUri={formCNPJ3Data.logoPerfil}
          />
          <ImageLine
            label="Comprovante de CNPJ"
            imageUri={formCNPJ3Data.comprovanteCNPJ}
          />
          <ImageLine
            label="Imagem do local físico de atendimento (se houver)"
            imageUri={formCNPJ3Data.localFisico}
          />
        </ScrollView>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('FormCNPJ3', { allFormData: allFormData })
            }
            style={styles.button}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.nextButton]}
            onPress={handleFinalizarCadastro}>
            <Text style={styles.buttonText}>Próximo</Text>
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
    paddingTop: height * 0.00,
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
    marginHorizontal: 0, 
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
    color: '#737373',
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
    color: '#999',
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
