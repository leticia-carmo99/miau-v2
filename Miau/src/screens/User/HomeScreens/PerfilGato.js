import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Back from '../assets/FotosInicial/Back.png';
import Prado from '../assets/FotosPerfisAnimais/Prado.png';
import LogoOng from '../assets/FotosPerfisAnimais/LogoOng.png';
import { WebView } from "react-native-webview";
import { db } from '../../../../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { collection, doc, getDoc, setDoc, query, where, getDocs } from 'firebase/firestore';
import { useUser } from "../NavigationUser/UserContext";

import { Asset } from "expo-asset";

import PorteMenorRoxo from '../assets/FotosPerfisAnimais/PorteMenorRoxo.png';
import PorteMenorLaranja from '../assets/FotosPerfisAnimais/PorteMenorLaranja.png';

import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
  JosefinSans_300Light,
} from '@expo-google-fonts/josefin-sans';
import { Nunito_700Bold, Nunito_400Regular } from '@expo-google-fonts/nunito';

import BackgroundCao from '../assets/FotosPerfisAnimais/BackgroundCao.png';

import * as SplashScreen from 'expo-splash-screen';

const { width } = Dimensions.get('window');

const COLORS = {
  primaryPurple: '#9156D1',
  backgroundPurple: '#9156D1',
  cardWhite: '#FFFFFF',
  textDark: '#333333',
  textMedium: '#8A8A8A',
  textLight: '#BDBDBD',
  primaryOrange: '#FFAB36',
  bubbleBackground: '#FFFFFF',
  lightPurple: '#E6E6FA',
};

export default function PerfilGato() {
  const navigation = useNavigation();
  const route = useRoute();
  const [ongData, setOngData] = useState(null);
  const [loadingOng, setLoadingOng] = useState(true);
  

  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
    JosefinSans_300Light,
    Nunito_400Regular,
    Nunito_700Bold,
  });


   const { pet } = route.params || {};
   const { userData } = useUser(); 
  const currentUserId = userData?.uid;

useEffect(() => {
    const fetchOngData = async () => {
      if (!pet || !pet.ownerId) {
        setLoadingOng(false);
        return;
      }
      const ongRef = doc(db, 'ongs', pet.ownerId); 
      try {
        const docSnap = await getDoc(ongRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setOngData({
            id: docSnap.id,
            nome: data.nomeOng,         
            telefone: data.telefoneContato,     // Seu campo de telefone/número
            logo: data.logoInstituicao, 
          });
        } else {
          console.log("ONG não encontrada para o ID:", pet.ownerId);
        }
      } catch (error) {
        console.error("Erro ao buscar dados da ONG:", error);
      } finally {
        setLoadingOng(false);
      }
    };
    fetchOngData();
  }, [pet]);

  if (!fontsLoaded) {
    return null; 
  }


  if (!pet) {
   
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color={Colors.cardWhite} />
                </TouchableOpacity>
            </View>
            <Text style={styles.errorText}>Pet não encontrado!</Text>
        </SafeAreaView>
    );
  }

const startChat = async () => {
    if (!currentUserId || !pet || !ongData) {
        Alert.alert("Erro", "Dados do usuário ou ONG indisponíveis.");
        return;
    }

    const ongId = ongData.id;
    const participants = [currentUserId, ongId].sort();
    const chatIDCheck = `${participants[0]}_${participants[1]}_ongs`;
    setLoading(true); 

    try {
        const chatQuery = query(
            collection(db, "chat"),
            where("participantes", "array-contains", currentUserId),
            where("tipo", "==", "ongs"),
        );
        const chatRefById = doc(db, "chat", chatIDCheck);
        const chatSnap = await getDoc(chatRefById);
        
        let existingChatId = null;

        if (chatSnap.exists()) {
             existingChatId = chatSnap.id;
        } else {
            const querySnapshot = await getDocs(chatQuery);
            if (!querySnapshot.empty) {
                existingChatId = querySnapshot.docs[0].id;
            }
        }
        
        let finalChatId;

        if (existingChatId) {
            finalChatId = existingChatId;
        } else {
            const newChatId = chatIDCheck; 
            
            const newChatData = {
                participantes: [currentUserId, ongId],
                tipo: "ongs",
                nomeOutroLado: ongData.nome || pet.ownerName || 'ONG Desconhecida', 
                fotoOutroLado: ongData.logo || 'URL_DEFAULT_ONG',
                ultima_msg: `Gostaria de saber mais sobre a adoção do(a) ${pet.nome}.`,
                ultima_alz: new Date(),
                naoLidas: 0, 
            };
            await setDoc(doc(db, "chat", newChatId), newChatData);
            await setDoc(doc(db, "chat", newChatId, "msg", new Date().getTime().toString()), {
                text: newChatData.ultima_msg,
                senderId: currentUserId,
                createdAt: newChatData.ultima_alz,
            });
            
            finalChatId = newChatId;
            Alert.alert("Sucesso", `Conversa com ${ongData.nome} iniciada!`);
        }
        navigation.navigate('ChatConversa', {
            chatId: finalChatId,
            data: { 
                nomeOutroLado: ongData.nome || pet.ownerName, 
                fotoOutroLado: ongData.logo 
            }
        });

    } catch (error) {
        console.error("Erro ao iniciar chat:", error);
        Alert.alert("Erro", "Não foi possível iniciar a conversa.");
    } finally {
    }
};

  const petParaExibicao = { ...pet, ong: ongData || { name: 'ONG Indisponível', telefone: '...', logo: null } };

  return (
       <SafeAreaView style={styles.safeArea}>
         <ScrollView contentContainerStyle={styles.scrollContainer}>
           <ImageBackground
             source={require('../assets/FotosPerfisAnimais/BackgroundCao.png')}
             resizeMode="repeat"
             style={styles.backgroundImage}
             imageStyle={{ transform: [{ scale: 2 }] }}>
             
             <View style={styles.header}>
               <TouchableOpacity onPress={() => navigation.goBack()}>
                 <Ionicons name="arrow-back" size={28} color={Colors.cardWhite} />
               </TouchableOpacity>
             </View>
 
             <View style={styles.contentWrapper}>
 
               <View style={styles.imageContainer}>
                 {pet.petImageUri ? (
                   <Image source={typeof pet.petImageUri === 'string' ? { uri: pet.petImageUri } : pet.petImageUri} style={styles.petImage} />
                 ) : (
                   <View style={styles.imagePlaceholder} />
                 )}
               </View>
 
               <View style={styles.mainCard}>
                 <Text style={styles.petName}>{pet.nome}</Text>
                 <Text style={styles.petBreed}>{pet.raca}</Text>
 
                 <View style={styles.infoBubbleRow}>
                   <View style={styles.infoBubble}>
                     <Text style={styles.bubbleTitle}>Idade</Text>
                     <Text style={styles.bubbleContent}>{pet.idade}</Text>
                   </View>
                   <View style={styles.infoBubble}>
                     <Text style={styles.bubbleTitle}>Sexo</Text>
                     <Text style={styles.bubbleContent}>{pet.sexo === 'Macho' ? 'Macho' : 'Fêmea'}</Text>
                   </View>
                   <View style={styles.infoBubble}>
                     <Text style={styles.bubbleTitle}>Cor</Text>
                     <Text style={styles.bubbleContent}>{pet.cor}</Text>
                   </View>
                 </View>
                 
                 <View style={styles.bannerWrapper}>
                   <View style={styles.ongContainer}>
                     <Image
                       source={petParaExibicao.ong.logo ? { uri: petParaExibicao.ong.logo } : require('../assets/FotosPerfisAnimais/LogoOng.png')}
                       style={styles.ongLogo}
                     />
                     <View style={styles.ongBanner}>
                         <Text style={styles.ongName}>{petParaExibicao.ong.nome}</Text>
                         <Text style={styles.ongId}>{petParaExibicao.ong.telefone}</Text>
                     </View>
                   </View>
                 </View>
 
                 <View style={styles.section}>
                   <Text style={styles.sectionTitle}>Porte</Text>
                   <View style={styles.porteContainer}>
                     <DogPorteIcon porte="Pequeno" petPorte={pet.porte} size={1} />
                     <DogPorteIcon porte="Médio" petPorte={pet.porte} size={1.2} />
                     <DogPorteIcon porte="Grande" petPorte={pet.porte} size={1.4} />
                   </View>
                 </View>
 
                 <View style={styles.section}>
                   <Text style={styles.sectionTitle}>Descrição</Text>
                   <Text style={styles.sectionContent}>{pet.descricao}</Text>
                 </View>
 
                 <View style={styles.section}>
                   <Text style={styles.sectionTitle}>Informações gerais</Text>
                   <Text style={styles.sectionContent}>{pet.informacoes}</Text>
                 </View>
 
                 <View style={styles.buttonContainerLeft}>
                   <TouchableOpacity style={styles.vacinaButton}>
                     <Text style={styles.vacinaButtonText}>Carteira de vacinação</Text>
                   </TouchableOpacity>
                 </View>
 
 
           <TouchableOpacity style={styles.adoptButton} onPress={startChat}>
             <Text style={styles.adoptButtonText}>Quero Adotar!</Text>
           </TouchableOpacity>
         
               </View>
             </View>
           </ImageBackground>
         </ScrollView>
       </SafeAreaView>
   );
 }
 
 const styles = StyleSheet.create({
  backgroundImage: {
     flex: 1,
   },
   safeArea: {
     flex: 1,
     backgroundColor: COLORS.backgroundOrange,
   },
   scrollContainer: {
     flexGrow: 1,
     paddingBottom: 80, 
   },
   header: {
     paddingHorizontal: 20,
     paddingTop: 20,
     paddingBottom: 10,
     width: '100%',
   },
   contentWrapper: {
     marginTop: width * 0.30,
     alignItems: 'center',
     paddingBottom: 40,
   },
   mainCard: {
     backgroundColor: COLORS.cardWhite,
     borderRadius: 35,
     width: '100%',
     paddingTop: width * 0.25 + 20,
     paddingBottom: 25,
     paddingHorizontal: 20,
     alignItems: 'center',
   },
   imageContainer: {
     position: 'absolute',
     top: -(width * 0.25),
     zIndex: 1,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 5 },
     shadowOpacity: 0.2,
     shadowRadius: 10,
     elevation: 10,
   },
   imagePlaceholder: {
     width: width * 0.5,
     height: width * 0.5,
     backgroundColor: COLORS.bubbleBackground,
     borderRadius: 25,
   },
   petImage: {
     width: width * 0.5,
     height: width * 0.5,
     borderRadius: 25,
   },
   petName: {
     fontSize: 30,
     color: COLORS.primaryPurple,
     fontFamily: 'JosefinSans_700Bold',
   },
   petBreed: {
     fontSize: 18,
     color: COLORS.textMedium,
     marginBottom: 25,
     fontFamily: 'JosefinSans_400Regular',
   },
   infoBubbleRow: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     width: '100%',
     marginBottom: 25,
   },
   infoBubble: {
     backgroundColor: COLORS.bubbleBackground,
     borderRadius: 15,
     paddingVertical: 10,
     paddingHorizontal: 5,
     alignItems: 'center',
     flex: 1,
     marginHorizontal: 5,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.1,
     shadowRadius: 4,
     elevation: 3,
   },
   bubbleTitle: {
     fontSize: 14,
     color: COLORS.textMedium,
     fontFamily: 'JosefinSans_400Regular',
   },
   bubbleContent: {
     fontSize: 16,
     color: COLORS.primaryPurple,
     fontFamily: 'JosefinSans_700Bold',
   },
   bannerWrapper: {
     width: '100%',
     alignItems: 'flex-end',
     marginBottom: 25,
     marginRight: -20,
   },
   ongContainer: {
     position: 'relative',
     paddingLeft: 45,
     justifyContent: 'center',
   },
   ongBanner: {
     backgroundColor: COLORS.primaryPurple,
     borderRadius: 15,
     paddingVertical: 10,
     paddingLeft: 55,
     paddingRight: 15,
     minHeight: 70,
     justifyContent: 'center',
   },
   ongLogo: {
     width: 90,
     height: 90,
     borderRadius: 40,
     position: 'absolute',
     left: 0,
     zIndex: 1,
   },
   ongName: {
     color: COLORS.cardWhite,
     fontSize: 15,
     fontFamily: 'JosefinSans_700Bold',
   },
   ongId: {
     color: COLORS.cardWhite,
     fontSize: 13,
     fontFamily: 'JosefinSans_400Regular',
   },
   section: {
     width: '100%',
     marginBottom: 20,
   },
   sectionTitle: {
     fontSize: 20,
     color: COLORS.primaryPurple,
     marginBottom: 10,
     fontFamily: 'Nunito_700Bold',
   },
   sectionContent: {
     fontSize: 15,
     color: COLORS.textMedium,
     lineHeight: 22,
     fontFamily: 'JosefinSans_300Light',
   },
   porteContainer: {
     flexDirection: 'row',
     justifyContent: 'center',
     alignItems: 'flex-end',
   },
   buttonContainerLeft: {
     width: '100%',
     alignItems: 'flex-start',
     marginTop: 10,
   },
   vacinaButton: {
     backgroundColor: COLORS.cardWhite,
     borderWidth: 0,
     borderRadius: 20,
     paddingVertical: 8,
     paddingHorizontal: 15,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 1 },
     shadowOpacity: 0.15,
     shadowRadius: 3,
     elevation: 3,
   },
   vacinaButtonText: {
     color: COLORS.primaryPurple,
     fontSize: 14,
     fontFamily: 'Nunito_700Bold',
   },
   editButton: {
     backgroundColor: COLORS.primaryPurple,
     width: '55%',
     marginTop: 30,
     paddingVertical: 8,
     borderRadius: 18,
     alignItems: 'center',
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 4 },
     shadowOpacity: 0.2,
     shadowRadius: 5,
     elevation: 8,
   },
   editButtonText: {
     color: COLORS.cardWhite,
     fontSize: 18,
     fontFamily: 'Nunito_700Bold',
   },
   errorText: {
     color: COLORS.cardWhite,
     textAlign: 'center',
     fontSize: 18,
     marginTop: 50,
     fontFamily: 'Nunito_700Bold',
   },
     vacineButton: {
     marginVertical: width * 0.05,
     borderRadius: width * 0.1,
     shadowColor: COLORS.primaryPurple,
     shadowOffset: { width: 5, height: 5 },
     shadowOpacity: 0.4,
     shadowRadius: 4,
     elevation: 4,
     borderWidth: 2,
     borderColor: COLORS.lightPurple,
     width: '70%',
     backgroundColor: COLORS.white,
   },
   vacineButtonText: {
     padding: width * 0.04,
     fontFamily: 'JosefinSans_400Regular',
     color: COLORS.primaryOrange,
   },
   adoptButton: {
     marginVertical: width * 0.05,
     borderRadius: width * 0.1,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 5 },
     shadowOpacity: 0.4,
     shadowRadius: 4,
     elevation: 4,
     width: '70%',
     alignSelf: 'center',
     backgroundColor: COLORS.primaryOrange,
     alignItems: 'center',
     justifyContent: 'center',
   },
   adoptButtonText: {
     fontFamily: 'JosefinSans_700Bold',
     color: '#fff',
     padding: width * 0.04,
     fontSize: width * 0.08,
   },
 });
 