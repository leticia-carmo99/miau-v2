import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  ScrollView, 
  Image,
  Alert // ✅ Importação de Alert adicionada
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // ✅ Adicionar importação de Auth
import { doc, setDoc } from 'firebase/firestore'; 
import { db } from '../../../firebaseConfig';
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

  // ✅ Função para ler o arquivo da URI e convertê-lo para Base64 (corrigida)
  const imageToBase64 = async (uri) => {
    if (!uri) return null;
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result.split(',')[1]);
        };
        reader.onerror = (error) => {
          console.error("Erro no FileReader:", error);
          reject(new Error('Falha ao ler a imagem como Base64.'));
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Erro ao converter imagem para Base64:', error);
      throw new Error('Falha na leitura da imagem.');
    }
  };

 const handleFinalize = async () => {
    setIsLoading(true);

    // VAMOS BUSCAR O EMAIL E A SENHA (ASSUMINDO QUE ESTÃO NO allFormData.ong1)
    const email = allFormData.ong1?.emailContato;
    const senha = allFormData.ong1?.senha; // ⚠️ A senha deve ser passada em algum momento
    const cnpjCpf = allFormData.ong1?.cnpjCpf; 

    if (!email || !senha || !cnpjCpf) {
        Alert.alert("Erro", "Dados essenciais (e-mail, senha ou CNPJ) não encontrados. Retorne e verifique as telas anteriores.");
        setIsLoading(false);
        return;
    }
    let userUid = null;
    let userCredential = null; // <-- NOVIDADE: Criar variável para a credencial de Auth

    try {
        // 1. PASSO CRÍTICO: CRIAR O USUÁRIO NO FIREBASE AUTHENTICATION
        const auth = getAuth();
        userCredential = await createUserWithEmailAndPassword(auth, email, senha); // <-- ATUALIZADO: Salva a credencial
        userUid = userCredential.user.uid; // O UID é o ID único do usuário no Auth
        // 2. CONVERTER IMAGENS E MONTAR OS DADOS
        
        // Seus passos de conversão de imagem...
        const comprovanteCNPJouEstatutoBase64 = await imageToBase64(formONG3Data.comprovanteCNPJouEstatuto);
        const fotoFachadaEspacoBase64 = await imageToBase64(formONG3Data.fotoFachadaEspaco);
        const documentoResponsavelBase64 = await imageToBase64(formONG3Data.documentoResponsavel);
        const logoInstituicaoBase64 = await imageToBase64(formONG3Data.logoInstituicao);

        const finalData = {
            // ... Inclua todos os dados que estavam nas telas anteriores
            ...allFormData.ong1,
            ...allFormData.ong2,
            ...formONG3Data,
            
            // Campos importantes que devem ser mantidos/adicionados
            uid: userUid, // Adiciona o UID gerado
            dataCadastro: new Date().toISOString(),
            tipoInstituicao: 'ONG', // Garante o tipo para futuras verificações

            // Substitui as URIs das imagens pelo Base64
            comprovanteCNPJouEstatuto: comprovanteCNPJouEstatutoBase64,
            fotoFachadaEspaco: fotoFachadaEspacoBase64,
            documentoResponsavel: documentoResponsavelBase64,
            logoInstituicao: logoInstituicaoBase64,
          
        };

        delete finalData.senha;
        
        // 3. SALVAR NO FIRESTORE USANDO O UID COMO ID DO DOCUMENTO
        // Adicionamos um try/catch específico para este passo
        try {
          await setDoc(doc(db, 'ongs', userUid), finalData);
        } catch (firestoreError) {
          console.error('ERRO CRÍTICO AO SALVAR NO FIRESTORE:', firestoreError);
          // Se o Firestore falhar, é crucial DELETAR o usuário criado no Auth
          if (userCredential && userCredential.user) {
            await userCredential.user.delete();
          }
          // Lançamos um novo erro para o bloco catch externo capturar e alertar o usuário
          throw new Error(`Falha de Permissão no Firestore. Verifique suas REGRAS DE SEGURANÇA ou conexão. Erro: ${firestoreError.message}`);
        }
        
        // Se o seu app tem análise, mantenha essa mensagem.
        Alert.alert("Sucesso!", "Seu cadastro foi enviado para análise e será ativado em breve. Você pode logar agora.");
        
        // Se o erro foi no Auth, limpa o Auth para que o usuário não fique 'parcialmente' cadastrado.
        if (userUid) {
            // Implementar uma função de exclusão de usuário se o cadastro do Firestore falhar
            // Para simplificar, vamos manter apenas o tratamento de erro.
        }
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