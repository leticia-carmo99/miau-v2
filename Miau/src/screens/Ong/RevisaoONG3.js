import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  ScrollView, 
  Image,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; 
import { db } from '../../../firebaseConfig';
import * as FileSystem from 'expo-file-system/legacy';
import { useFonts, JosefinSans_400Regular, JosefinSans_700Bold } from '@expo-google-fonts/josefin-sans';
import emailjs from '@emailjs/react-native'; 

const { width, height } = Dimensions.get('window');

const ROXO = '#6A57D2';
const BRANCO = '#FFFFFF';
const CINZA_CLARO = '#E0E0E0';
const CINZA_TEXTO_PLACEHOLDER = '#999';
const CINZA_TEXTO_LABEL = '#737373';

const EMAILJS_SERVICE_ID = 'service_o63emyi'; 
const EMAILJS_TEMPLATE_ID = 'template_xff62ks'; 
const EMAILJS_USER_ID = 'n_m2HmH5uYcM1URRu';

export default function RevisaoONG3() {
  const navigation = useNavigation();
  const route = useRoute();

  const allFormData = route.params?.allFormData || {};
  const formONG3Data = allFormData.ong3 || {};
  const formONG2Data = allFormData.ong2 || {};
  const formONG1Data = allFormData.ong1 || {};

  const [isLoading, setIsLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
  });

  if (!fontsLoaded) return null;

const imageToBase64 = async (uri) => {
    if (!uri) return null;
    try {
        const base64Data = await FileSystem.readAsStringAsync(uri, {
            encoding: 'base64', 
        });
        return base64Data;
    } catch (error) {
        console.error('Falha na leitura/conversão da imagem para Base64:', error);
        throw new Error('Falha na leitura da imagem.');
    }
};

  const sendApprovalEmail = async (data, userUid) => {
    if (!EMAILJS_USER_ID || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
      console.error("Configurações do EmailJS ausentes. Verifique as constantes.");
      Alert.alert("Erro de E-mail", "Configuração do serviço de e-mail ausente.");
      return;
    }
    
    const linkAprovacao = `https://console.firebase.google.com/u/0/project/miauuu-84f5b/firestore/databases/-default-/data/~2Fongs~2F${userUid}`;

    const templateParamsParaEmailJS = {
        to_email: 'suporteappmiau@gmail.com', 
        nome_usuario: data.nomeOng || data.razaoSocial,
        documento_info: data.cnpjCpf,
        email_usuario: data.emailContato,
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


const handleFinalize = async () => {
    setIsLoading(true);
    const email = formONG1Data?.emailContato;
    const senha = formONG1Data?.senha;
    const cnpjCpf = formONG1Data?.cnpjCpf; 
    if (!email || !senha || !cnpjCpf) {
        Alert.alert("Erro", "Dados essenciais (e-mail, senha ou CNPJ) não encontrados. Retorne e verifique as telas anteriores.");
        setIsLoading(false);
        return;
    }
    let userUid = null;
    let userCredential = null;

    try {
        const auth = getAuth();
        userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        userUid = userCredential.user.uid;
        const comprovanteCNPJouEstatutoBase64 = await imageToBase64(formONG3Data.comprovanteCNPJouEstatuto);
        const fotoFachadaEspacoBase64 = await imageToBase64(formONG3Data.fotoFachadaEspaco);
        const documentoResponsavelBase64 = await imageToBase64(formONG3Data.documentoResponsavel);
        const logoInstituicaoBase64 = await imageToBase64(formONG3Data.logoInstituicao);
        const finalData = {
            ...formONG1Data, 
            ...formONG2Data, 
            ...formONG3Data,
            uid: userUid,
            dataCadastro: new Date().toISOString(),
            ativo: false,
            comprovanteCNPJouEstatuto: comprovanteCNPJouEstatutoBase64,
            fotoFachadaEspaco: fotoFachadaEspacoBase64,
            documentoResponsavel: documentoResponsavelBase64,
            logoInstituicao: logoInstituicaoBase64,
        };
        delete finalData.senha;
        try {
            await setDoc(doc(db, 'ongs', userUid), finalData);
            await sendApprovalEmail(finalData, userUid);
            
        } catch (firestoreError) { 
            console.error("Erro ao salvar no Firestore:", firestoreError);
            if (userCredential && userCredential.user) {
                try {
                    await userCredential.user.delete();
                    console.log("Conta Auth deletada com sucesso após falha no Firestore (ROLLBACK).");
                } catch (deleteError) {
                    console.error("ERRO GRAVE: Falha ao deletar a conta Auth.", deleteError);
                }
            }
            throw new Error(`Falha ao salvar os dados da ONG no Firestore. Erro: ${firestoreError.message}`);
        }
        navigation.navigate('FinalizacaoONG', { documento: userUid });

    } catch (error) {
        console.error("Erro no fluxo principal (Auth/Firestore):", error);
        Alert.alert("Erro de Cadastro", `Ocorreu um erro ao finalizar o seu cadastro: ${error.message || 'Erro desconhecido'}. Tente novamente.`);
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
        <Text style={styles.subTitle}>Documentos e Imagens</Text>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ImageLine label="Comprovante de CNPJ ou Estatuto Social" imageUri={formONG3Data.comprovanteCNPJouEstatuto} />
          <ImageLine label="Foto da fachada ou espaço físico da instituição" imageUri={formONG3Data.fotoFachadaEspaco} />
          <ImageLine label="Documentos do responsável legal (RG/CPF ou CNH)" imageUri={formONG3Data.documentoResponsavel} />
          <ImageLine label="Logo da instituição (opcional)" imageUri={formONG3Data.logoInstituicao} />
        </ScrollView>

        <View style={styles.buttonsRow}>
          <TouchableOpacity onPress={() => navigation.navigate('FormONG3', { allFormData })} style={styles.button}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={[styles.button, styles.nextButton]}
              onPress={handleFinalize}
>
  <Text style={styles.buttonText}>Finalizar</Text>
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
    fontFamily: 'JosefinSans_700Bold',
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
  subTitle: {
    fontSize: width * 0.045,
    fontFamily: 'JosefinSans_700Bold',
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
    fontFamily: 'JosefinSans_700Bold',
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
    fontFamily: 'JosefinSans_400Regular',
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
    fontFamily: 'JosefinSans_700Bold',
  },
  nextButton: {
    marginLeft: width * 0.025,
  },
});
