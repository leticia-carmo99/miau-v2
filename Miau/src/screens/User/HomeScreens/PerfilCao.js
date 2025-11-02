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
import Amora from '../assets/FotosPerfisAnimais/Amora.png';
import LogoOng from '../assets/FotosPerfisAnimais/LogoOng.png';
import { WebView } from "react-native-webview";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';

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
  primaryOrange: '#FFAB36',
  primaryPurple: '#9156D1',
  lightPurple: '#E6E6FA',
  lightOrange: '#FFDAB9',
  white: '#FFFFFF',
  black: '#000000',
  darkGray: '#333333',
  mediumGray: '#666666',
  lightGray: '#999999',
  offWhite: '#f8f8f8',
  yellowStar: '#FFD700',
  redHeart: '#FF6347',
  blogTextGray: '#737373',
};

export default function EditarMeuPet() {
  const navigation = useNavigation();
  const route = useRoute();

  const [ongData, setOngData] = useState(null);
  const [loadingOng, setLoadingOng] = useState(true);
  
  const data = [
    { label: 'Idade', value: '3' },
    { label: 'Sexo', value: 'Fêmea' },
    { label: 'Cor', value: 'Branco e bege' },
  ];

  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
    JosefinSans_300Light,
    Nunito_400Regular,
    Nunito_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

    const { pet } = route.params || {};
  
  useEffect(() => {
      const fetchOngData = async () => {
        if (!pet || !pet.ongid) { // CORREÇÃO 1: Usar pet.ongid
          setLoadingOng(false);
          return;
        }
  
        // CORREÇÃO 2: Usar pet.ongid para referenciar o documento
        const ongRef = doc(db, 'ongs', pet.ongid); 
        try {
          const docSnap = await getDoc(ongRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setOngData({
              id: docSnap.id,
              name: data.nomeOng,         
              telefone: data.telefoneContato,     // Seu campo de telefone/número
              logo: data.logoInstituicao, 
            });
          } else {
            console.log("ONG não encontrada para o ID:", pet.ongid);
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

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <SafeAreaView style={styles.container}>
        <Image source={BackgroundCao} style={styles.background} />

        <View style={styles.menuView}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={Back} style={styles.back} />
          </TouchableOpacity>
        </View>

              <View style={styles.imageContainer}>
                {pet.petImageUri ? (
                  <Image source={typeof pet.petImageUri === 'string' ? { uri: pet.petImageUri } : pet.petImageUri} style={styles.petImage} />
                ) : (
                  <View style={styles.imagePlaceholder} />
                )}
              </View>

              <View style={styles.mainCard}>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petBreed}>{pet.raca}</Text>

                <View style={styles.infoBubbleRow}>
                  <View style={styles.infoBubble}>
                    <Text style={styles.bubbleTitle}>Idade</Text>
                    <Text style={styles.bubbleContent}>{pet.age}</Text>
                  </View>
                  <View style={styles.infoBubble}>
                    <Text style={styles.bubbleTitle}>Sexo</Text>
                    <Text style={styles.bubbleContent}>{pet.gender === 'Male' ? 'Macho' : 'Fêmea'}</Text>
                  </View>
                  <View style={styles.infoBubble}>
                    <Text style={styles.bubbleTitle}>Cor</Text>
                    <Text style={styles.bubbleContent}>{pet.cor}</Text>
                  </View>
                </View>
                
                <View style={styles.bannerWrapper}>
                  <View style={styles.ongContainer}>
                    <Image
                      source={pet.ong.logo ? { uri: pet.ong.logo } : require('../assets/FotosPerfisAnimais/LogoOng.png')}
                      style={styles.ongLogo}
                    />
                    <View style={styles.ongBanner}>
                        <Text style={styles.ongName}>{pet.ong.name}</Text>
                        <Text style={styles.ongId}>{pet.ong.telefone}</Text>
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
                  <Text style={styles.sectionContent}>{pet.infoGerais}</Text>
                </View>

                <View style={styles.buttonContainerLeft}>
                  <TouchableOpacity style={styles.vacinaButton}>
                    <Text style={styles.vacinaButtonText}>Carteira de vacinação</Text>
                  </TouchableOpacity>
                </View>


          <TouchableOpacity style={styles.adoptButton} >
            <Text style={styles.adoptButtonText}>Quero Adotar!</Text>
          </TouchableOpacity>
        
        </View>

        <View style={{ marginTop: 1000, alignItems: 'flex-end' }}>
          <Image source={BackgroundCao} style={styles.background} />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryPurple,
  },
  background: {
    width: '100%',
    height: 400,
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
  dogImage: {
    height: width * 0.7,
    width: width * 0.8,
  },
  dogImageView: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: width * 0.3,
    zIndex: 2,
  },
  content: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 40,
    flex: 1,
    zIndex: 1,
    position: 'absolute',
    marginTop: width * 0.8,
    width: '100%',
  },
  nameView: {
    marginTop: width * 0.23,
    alignItems: 'center',
  },
  petName: {
    fontSize: width * 0.07,
    fontFamily: 'JosefinSans_700Bold',
    color: COLORS.primaryPurple,
  },
  animalType: {
    fontSize: width * 0.05,
    fontFamily: 'JosefinSans_400Regular',
    color: COLORS.primaryPurple,
  },
  infos: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    width: '23%', // 4 cards lado a lado
    aspectRatio: 1, // deixa quadradinho
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: COLORS.primaryPurple,
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    margin: 1,
    justifyContent: 'center',
    borderColor: COLORS.lightPurple,
    borderWidth: 2,
  },
  label: {
    fontSize: width * 0.045,
    color: COLORS.primaryPurple,
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: 'JosefinSans_400Regular',
    marginTop: 8,
  },
  value: {
    fontSize: width * 0.05,
    color: COLORS.primaryPurple,
    textAlign: 'center',
    fontFamily: 'JosefinSans_700Bold',
    marginBottom: 8,
  },
  infoOngView: {
    alignItems: 'flex-end',
    marginVertical: width * 0.1,
    paddingVertical: width * 0.05,
    width: '100%',
    height: width * 0.3,
    justifyContent: 'center',
  },
  infoOngText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: width * 0.035,
    color: COLORS.white,
    marginVertical: width * 0.01,
    flexWrap: 'wrap',
    paddingLeft: 40,
  },
  infoOngTextView: {
    backgroundColor: COLORS.primaryPurple,
    alignSelf: 'flex-end',
    paddingVertical: width * 0.04,
    width: '68%',
  },
  infoOngImage: {
    height: width * 0.15,
    width: width * 0.15,
    padding: width * 0.15,
    alignSelf: 'flex-start',
    marginLeft: '20%',
    borderRadius: 20,
  },
  subtitle: {
    fontSize: width * 0.05,
    fontFamily: 'JosefinSans_400Regular',
    color: COLORS.primaryPurple,
  },
  contentView: {
    padding: 10,
    marginHorizontal: width * 0.05,
  },
  pmenorr: {
    height: width * 0.2,
    width: width * 0.2,
  },
  pmediol: {
    height: width * 0.27,
    width: width * 0.27,
  },
  pmaiorr: {
    height: width * 0.3,
    width: width * 0.4,
  },
  subtitleBold: {
    fontSize: width * 0.07,
    fontFamily: 'Nunito_700Bold',
    color: COLORS.primaryPurple,
    marginTop: width * 0.1,
  },
  paragraph: {
    flexWrap: 'wrap',
    fontSize: width * 0.04,
    fontFamily: 'JosefinSans_300Light',
    color: COLORS.darkGray,
    letterSpacing: 1,
    lineHeight: 18,
    marginTop: width * 0.03,
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
    color: COLORS.primaryPurple,
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
    backgroundColor: COLORS.primaryPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adoptButtonText: {
    fontFamily: 'JosefinSans_700Bold',
    color: COLORS.white,
    padding: width * 0.04,
    fontSize: width * 0.08,
  },
    pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
    ongContainer: {
    position: 'relative',
    paddingLeft: 45,
    justifyContent: 'center',
  },
});
