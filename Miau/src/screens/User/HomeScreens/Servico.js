import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
    Modal,
    ImageBackground,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Back from '../assets/FotosInicial/Back.png';
import Nicolas from '../assets/FotosMapa/Nicolas.png';
import LogoOng from '../assets/FotosPerfisAnimais/LogoOng.png';
import { WebView } from "react-native-webview";
import { FontAwesome } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';

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

const data =
  {
  id: 1,
  image: require('../assets/FotosMapa/Nicolas.png'),
  nome: 'Nicolas Cunha'
}

export default function EditarMeuPet() {
  const navigation = useNavigation();

// AVALIACAO CLICAVEL

function AvaliacaoEstrelas({ max = 5, onChange }) {
  const [rating, setRating] = useState(0);

  const handlePress = (index) => {
    let newRating = index;

    // se clicar na mesma estrela -> alterna entre cheia ↔ meia
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
      return "star"; // cheia
    } else if (rating >= starNumber - 0.5) {
      return "star-half-full"; // meia
    } else {
      return "star-o"; // vazia
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
              size={width * 0.15}
              color="#FFD700"
              style={{ marginHorizontal: 2 }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// AVALIAÇAO GERAL NO HEADER

const StarRating = ({ rating, maxStars = 5 }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = maxStars - Math.ceil(rating);

  return (
    <View style={{ flexDirection: 'row', marginTop: width * 0.01 }}>
      {[...Array(fullStars)].map((_, index) => (
        <Icon key={`full-${index}`} name="star" size={width * 0.05} color="#FFD700" />
      ))}
      {halfStar && <Icon name="star-half" size={width * 0.05} color="#FFD700" />}
      {[...Array(emptyStars)].map((_, index) => (
        <Icon key={`empty-${index}`} name="star-o" size={width * 0.05} color="#FFD700" />
      ))}
    </View>
  );
};

const nota = 4.5;


 const [favorited, setFavorited] = useState(false)

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
  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <SafeAreaView style={styles.container}>
        <Image source={data.image} style={styles.background} />

        <View style={styles.menuView}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={Back} style={styles.back} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>

      <View style={styles.head}>
      <View style={styles.headInfos}>

      <Text style={styles.headTitle}>{data.nome}</Text>
      <View style={{flexDirection: 'row'}}>
<StarRating rating={nota} />
            <Text style={styles.headRating}>4,5</Text></View>

      <Text style={styles.headDate}> Seg a Dom | 08 às 22h</Text>
      </View>
        <TouchableOpacity onPress={() => setFavorited(!favorited)}>
          <Ionicons
            name={favorited ? "heart" : "heart-outline"}
            size={width * 0.1}
            color={COLORS.primaryOrange}
          />
        </TouchableOpacity>
      </View>


    <Text style={styles.paragraph}>
Aqui na nossa petshop, você encontra tudo para o bem-estar do seu pet: alimentação de qualidade, acessórios, cuidados especiais e muito carinho! Trabalhamos com dedicação para oferecer um atendimento confiável e um ambiente acolhedor para você e seu melhor amigo. Também apoiamos a adoção responsável, porque acreditamos que todo pet merece um lar cheio de amor.
    </Text>


            <View style={styles.contactSectionWrapper}>
              <Image
                source={require('../assets/FotosMapa/GatoCaindo.png')}
                style={styles.catImage}
              />
              <ImageBackground
                source={require('../assets/FotosMapa/CaixaPerfilLaranja.png')}
                style={styles.contactCardBackground}
                resizeMode="stretch">
                <View style={styles.contactContent}>
                  <Text style={styles.contactTitle}>Contato</Text>
                  <Text style={styles.contactText}>petszcontato@gmail.com</Text>
                  <Text style={styles.contactText}>+55 11 99262-4521</Text>
                  <Text style={styles.socialTitle}>Redes Sociais</Text>
                  <View style={styles.socialRow}>
                    <Text style={styles.socialText}>@petx.official</Text>
                    <Image
                      source={require('../assets/FotosMapa/InstagramLaranja.png')}
                      style={styles.socialIconImage}
                    />
                  </View>
                  <View style={styles.socialRow}>
                    <Text style={styles.socialText}>@oficialpetz</Text>
                    <Image
                      source={require('../assets/FotosMapa/FacebookLaranja.png')}
                      style={styles.socialIconImage}
                    />
                  </View>
                </View>
              </ImageBackground>
            </View>

<View>
      <TouchableOpacity style={styles.chatButton} onPress={() => navigation.navigate('ChatConversa', {data})}>
      <Text style={styles.chatButtonText}>Ir para o chat</Text>
      </TouchableOpacity>
</View>


<Text style={styles.avaliationTitle}>Avalie esta loja</Text>

      <AvaliacaoEstrelas onChange={(nota) => console.log("Nota escolhida:", nota)} />

      <TouchableOpacity style={styles.saveButton}>
      <Text style={styles.saveButtonText}>Salvar</Text>
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
    zIndex: 1,
    position: 'absolute',
    marginTop: width * 0.8,
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
