import React, { useState, useEffect } from 'react'; // Adicionado React e Hooks faltantes
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db } from "../../../../firebaseConfig"; 
import { doc, getDoc, getFirestore, setDoc, updateDoc, serverTimestamp, arrayUnion, arrayRemove } from 'firebase/firestore'; 
import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
  JosefinSans_300Light,
} from '@expo-google-fonts/josefin-sans';
import { Nunito_700Bold, Nunito_400Regular } from '@expo-google-fonts/nunito';
import { useUser } from "../NavigationUser/UserContext";
import Back from '../assets/FotosInicial/Back.png';
import CatImage from '../assets/FotosMapa/GatoCaindo.png';
import CardBg from '../assets/FotosMapa/CaixaPerfilLaranja.png';
import InstagramIcon from '../assets/FotosMapa/InstagramLaranja.png';
import FacebookIcon from '../assets/FotosMapa/FacebookLaranja.png';


const { width } = Dimensions.get('window');

const COLORS = {
  primaryOrange: '#FFAB36',
  primaryPurple: '#9156D1',
  white: '#FFFFFF',
  black: '#000000',
  darkGray: '#333333',
  mediumGray: '#666666',
  lightGray: '#999999',
  offWhite: '#f8f8f8',
  yellowStar: '#FFD700',
};

function AvaliacaoEstrelas({ max = 5, onChange }) {
  const [rating, setRating] = useState(0);

  const handlePress = (index) => {
    let newRating = index;
    if (rating === index) {
      newRating = index - 0.5;
    } else if (rating === index - 0.5) {
      newRating = index;
    }

    setRating(newRating);
    if (onChange) onChange(newRating);
  };

  const renderIcon = (starNumber) => {
    if (rating >= starNumber) {
      return "star"; 
    } else if (rating >= starNumber - 0.5) {
      return "star-half-full"; 
    } else {
      return "star-o"; 
    }
  };

  return (
    <View style={{ flexDirection: "row", marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
      {[...Array(max)].map((_, index) => {
        const starNumber = index + 1;
        return (
          <TouchableOpacity key={index} onPress={() => handlePress(starNumber)}>
            <FontAwesome
              name={renderIcon(starNumber)}
              size={width * 0.1} 
              color={COLORS.yellowStar}
              style={{ marginHorizontal: 2 }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const StarRating = ({ rating, maxStars = 5 }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = maxStars - Math.ceil(rating);

  return (
    <View style={{ flexDirection: 'row', marginTop: width * 0.01 }}>
      {[...Array(fullStars)].map((_, index) => (
        <Icon key={`full-${index}`} name="star" size={width * 0.05} color={COLORS.yellowStar} />
      ))}
      {halfStar && <Icon name="star-half" size={width * 0.05} color={COLORS.yellowStar} />}
      {[...Array(emptyStars)].map((_, index) => (
        <Icon key={`empty-${index}`} name="star-o" size={width * 0.05} color={COLORS.yellowStar} />
      ))}
    </View>
  );
};


export default function ServicoDetalhes() {
  const navigation = useNavigation();
  const route = useRoute();
  const { uid } = route.params || {}; 
  const [servicoData, setServicoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0); // Estado para a nota selecionada
  const nota = 4.5; 
  const mockImage = require('../assets/FotosMapa/Nicolas.png'); 
   const { userData, setUserData } = useUser();

  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
    JosefinSans_300Light,
    Nunito_400Regular,
    Nunito_700Bold,
  });
  useEffect(() => {
    if (!uid) {
      console.error("ID do Serviço não fornecido!");
      setIsLoading(false);
      return;
    }

    const fetchServicoDetails = async () => {
try {
  const docRef = doc(db, "prestador", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    setServicoData(data);

    if (data.curtidas && Array.isArray(data.curtidas)) {
      setFavorited(data.curtidas.includes(userData.uid));
    }

  } else {
    Alert.alert("Erro", "Prestador de Serviço não encontrado.");
  }

} catch (error) {
  console.error("Erro ao buscar detalhes do Prestador:", error);
  Alert.alert("Erro", "Não foi possível carregar os dados do Prestador.");
} finally {
  setIsLoading(false);
}
    };

    fetchServicoDetails();
  }, [uid]);


  if (!fontsLoaded) {
    return null;
  }

  if (isLoading || !servicoData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontFamily: 'JosefinSans_400Regular', fontSize: 18, color: COLORS.darkGray }}>Carregando dados do Serviço...</Text>
      </View>
    );
  }
  
  const { 
    nome = 'Serviço Não Informado', 
    email = 'contato@servico.com',
    telefone = '(00) 90000-0000',
    redes = '@perfil', 
    descricao = 'Nenhuma descrição fornecida.', // Este campo pode não existir em 'prestador'
    horarioFuncionamento = 'Não informado', 
    logoPerfil = mockImage
  } = servicoData; 

const handleChatPress = async () => {

  if (!userData) return;

  const chatId = `${userData.uid}_${uid}`; // uid = prestadorId

  const chatRef = doc(db, "chat", chatId);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    const prestadorRef = doc(db, "prestador", uid);
    const prestadorSnap = await getDoc(prestadorRef);
    const prestador = prestadorSnap.data();

await setDoc(chatRef, {
  participantes: [userData.uid, uid], // ← AGORA SIM
  tipo: "prestador",

  nome_usuario: userData.nome || "Usuário",
  nome_prestador: prestador.nome || "Prestador",

  foto_prestador: prestador.logoPerfil?.toString() || null,
  foto_usuario: userData.foto || null,

  ultima_msg: "",
  ultima_alz: serverTimestamp()
});



  } else {
await updateDoc(chatRef, {
  ultima_alz: serverTimestamp()
});

  }

  navigation.navigate("ChatConversa", {
    targetUser: uid,
    targetName: nome
  });
};

  const handleSaveRating = () => {
      if (selectedRating === 0) {
          Alert.alert("Atenção", "Por favor, selecione uma nota antes de salvar.");
          return;
      }
      
      console.log(`Salvando avaliação de ${selectedRating} estrelas para o prestador ${uid}`);
      
      Alert.alert("Sucesso", `Obrigado! Sua nota de ${selectedRating} estrelas foi registrada.`);
  };

  const handleToggleCurtida = async () => {
  try {
    if (!userData?.uid || !uid) return;

    const prestadorRef = doc(db, "prestador", uid);

    if (favorited) {
      await updateDoc(prestadorRef, {
        curtidas: arrayRemove(userData.uid)
      });
    } else {
      await updateDoc(prestadorRef, {
        curtidas: arrayUnion(userData.uid)
      });
    }

    setFavorited(!favorited);

  } catch (error) {
    console.log("Erro ao atualizar curtida:", error);
  }
};


  const logoSource = typeof logoPerfil === 'string' && logoPerfil.startsWith('http') 
        ? { uri: logoPerfil } 
        : logoPerfil; 

  return (
    <ScrollView style={{flex:1, backgroundColor: COLORS.white}}>
      <SafeAreaView style={styles.container}>
        <Image source={logoSource} style={styles.background} />

        <View style={styles.menuView}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image source={Back} style={styles.back} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>

          <View style={styles.head}>
            <View style={styles.headInfos}>
              <Text style={styles.headTitle}>{nome}</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <StarRating rating={nota} />
                <Text style={styles.headRating}>{nota.toFixed(1)}</Text>
              </View>
              <Text style={styles.headDate}>{horarioFuncionamento}</Text>
            </View>
            <TouchableOpacity onPress={handleToggleCurtida}>
              <Ionicons
                name={favorited ? "heart" : "heart-outline"}
                size={width * 0.1}
                color={COLORS.primaryOrange}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.paragraph}>
            {descricao}
          </Text>

          <View style={styles.contactSectionWrapper}>
            <Image
              source={CatImage}
              style={styles.catImage}
            />
            <ImageBackground
              source={CardBg}
              style={styles.contactCardBackground}
              resizeMode="stretch">
              <View style={styles.contactContent}>
                <Text style={styles.contactTitle}>Contato</Text>
                <Text style={styles.contactText}>{email}</Text>
                <Text style={styles.contactText}>{telefone}</Text>
                <Text style={styles.socialTitle}>Redes Sociais</Text>
                
                {redes.instagram && (
                  <View style={styles.socialRow}>
                    <Text style={styles.socialText}>{redes}</Text>
                    <Image source={InstagramIcon} style={styles.socialIconImage} />
                  </View>
                )}
                
                {redes.facebook && (
                  <View style={styles.socialRow}>
                    <Text style={styles.socialText}>{redes}</Text>
                    <Image source={FacebookIcon} style={styles.socialIconImage} />
                  </View>
                )}
                
              </View>
            </ImageBackground>
          </View>

          {/* Botão de Chat com a função implementada */}
          <View>
            <TouchableOpacity style={styles.chatButton} onPress={handleChatPress}>
              <Text style={styles.chatButtonText}>Ir para o chat</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.avaliationTitle}>Avalie este serviço</Text>
          <AvaliacaoEstrelas onChange={setSelectedRating} />
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveRating}>
            <Text style={styles.saveButtonText}>Salvar Avaliação</Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  background: {
    width: '100%',
    height: width * 1,
    zIndex: 0,
    position: 'relative',
  },
  back: {
    height: width * 0.1,
    width: width * 0.1,
    padding: width * 0.1,
    marginRight: width * 0.65,
  },
  menuView: {
    height: width * 0.4,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
  },

  content: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 40,
    flex: 1,
    zIndex: 2,
    position: 'relative',
    width: '100%',
  },
  head: {
    marginHorizontal: '10%',
    flexDirection: 'row',
    justifyContent: 'space-between',
        marginTop: width * 0.08,
  },
  headTitle: {
    fontSize: width * 0.07,
    color: COLORS.primaryOrange,
    fontFamily: 'JosefinSans_700Bold',
  },
  headInfos: {
    flexDirection: 'column',
  },
  headDate: {
     fontSize: width * 0.05,
    color: COLORS.lightGray,
    fontFamily: 'JosefinSans_400Regular',   
  },
  headRating: {
    fontSize: width * 0.04,
    color: COLORS.lightGray,
    marginVertical: width * 0.02,
    fontFamily: 'JosefinSans_400Regular', 
    marginLeft: width * 0.059
  },
  



  // --- Seção de Contato (Modo Visualização) ---
  contactSectionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 20,
  },
  catImage: {
    width: 120,
    height: 260,
    resizeMode: 'contain',
    marginRight: -50,
    zIndex: 1,
    bottom: 10,
  },
  contactCardBackground: {
    width: width * 0.65,
    height: 240,
    justifyContent: 'center',
  },
  contactContent: { paddingLeft: 60, paddingVertical: 15, paddingRight: 10 },
  contactTitle: {
    fontSize: 15,
    color: COLORS.primaryOrange,
    marginBottom: 8,
    fontFamily: 'Nunito_700Bold', // ALTERADO
  },
  contactText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontFamily: 'JosefinSans_300Light', // ALTERADO
  },
  socialTitle: {
    fontSize: 15,
    color: COLORS.primaryOrange,
    marginTop: 12,
    marginBottom: 8,
    fontFamily: 'Nunito_700Bold', // ALTERADO
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  socialText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
    fontFamily: 'JosefinSans_300Light', // ALTERADO
  },
  socialIconImage: { width: 28, height: 28, marginLeft: 10 },


  paragraph: {
    fontSize: width * 0.05,
    color: COLORS.black,
    marginVertical: width * 0.05,
    fontFamily: 'JosefinSans_300Light', 
    flexWrap: 'wrap',
    marginHorizontal: '7%',
    textAlign: 'justify'
  },
  avaliationTitle: {
    fontSize: width * 0.06,
    color: COLORS.darkPurple,
    fontFamily: 'Nunito_700Bold',
    marginHorizontal: '10%',
    marginTop: width * 0.1,
  },
  saveButton: {
    backgroundColor: COLORS.primaryOrange,
    padding: width * 0.02,
    width: width * 0.3,
    borderRadius: width * 0.02,
   alignSelf: 'flex-end', 
       margin: '10%',
       alignItems: 'center'
  },
  saveButtonText: {
    fontSize: width * 0.05,
    color: COLORS.white,
    fontFamily: 'Nunito_700Bold',    
  },
  chatButton: {
    backgroundColor: COLORS.primaryOrange,
    padding: width * 0.02,
    width: width * 0.6,
    borderRadius: width * 0.02,
   alignSelf: 'center', 
       marginTop: '10%',
       alignItems: 'center'
  },
  chatButtonText: {
    fontSize: width * 0.08,
    color: COLORS.white,
    fontFamily: 'Nunito_700Bold',    
  },
});
