import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRoute } from '@react-navigation/native';
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
import { useContext } from "react";
import { BusinessContext } from "../NavigationBusiness/BusinessContext";

import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
  JosefinSans_300Light,
} from '@expo-google-fonts/josefin-sans';
import { Nunito_700Bold, Nunito_400Regular } from '@expo-google-fonts/nunito';

import Background from '../Imagens/Background.png';
import FundoLaranja from '../Imagens/HomeFundoLaranja.png';
import Menu from '../NavigationBusiness/Menu';
import DogCat from '../Imagens/DogCat.png';
import LogoPatinhasUnidas from '../Imagens/LogoPatinhasUnidas.png';
import Subtract from '../Imagens/Subtract.png';

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

export default function Home() {
  const navigation = useNavigation();
  const { businessData } = useContext(BusinessContext); 
 const name = businessData?.nome || "Empresa";
const pic = businessData?.logoPerfil || '../../../User/assets/incognita.jpg';
  const description = businessData?.sobre || "Produtos para cachorros, gatos e diversos outros pets.";


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
              <View style={styles.menu}>
          <Menu background="colorful" />
        </View>

      <Image source={FundoLaranja} style={styles.orangeBackground}/>
      <View style={styles.welcomeView}>
        <Text style={styles.welcomeTitle}>Bem-Vindo,</Text>
        <Text style={styles.welcomePerson}>{name}</Text>
      </View>

      <Text style={styles.title1} >Edite o perfil da sua empresa</Text>
      <View style={styles.content}>
      <TouchableOpacity onPress={()=>navigation.navigate('Perfil')}>     
       <View style={styles.card}>
        <Image source={pic} style={styles.logo} />
        <View style={{ flex: 1 }}>
          <Text style={styles.nameBusiness}>{name}</Text>
          <Text style={styles.description}>
  {(description?.toString() || "")
    .split(' ')
    .slice(0, 20)
    .join(' ')
  }
  { (description?.toString().split(' ').length > 20) ? '...' : '' }
          </Text>
          <Image source={DogCat} style={styles.animalOption} />
        </View>
      </View>
      </TouchableOpacity>

      {/* Card Premium */}
      <View style={styles.cardPremium}>
        <Text style={styles.cardTitle}>Tenha o plano</Text>
        <Text style={styles.cardPremiumText}>Premium</Text>
        <Text style={styles.cardSubtext}>Fique em destaque em todas as pesquisas!</Text>
        <Text style={styles.priceLabel}>Por apenas:</Text>
        <View style={styles.priceBox}>
          <Text style={styles.price}>R$79,90</Text>
          <Text style={styles.month}> / por mês</Text>
        </View>
      </View>
      </View>

      <View style={{ width: '100%', height: 260}}>
      <Image source={Background} style={styles.background3} />
      <Image source={Subtract} style={styles.background2} />
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
  orangeBackground:{
    width: '100%',
    height: width * 0.6,
    zIndex: 0,
    position: 'relative',
  },
    menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    marginBottom: 15,
    paddingHorizontal: width * 0.06,
    paddingTop: width * 0.08,
  },
    welcomeTitle: {
    fontSize: width * 0.08,
    fontFamily: 'JosefinSans_400Regular',
    color: COLORS.white,
    alignSelf: 'flex-end',
    marginRight: width * 0.15,
  },
  welcomeView: {
   position: 'absolute',
    zIndex: 1,
    width: '100%',
    marginTop: 100,
    marginLeft: width * 0.05,
  },
  welcomePerson: {
     fontSize: width * 0.09,
    fontFamily: 'JosefinSans_700Bold',
    color: COLORS.white,
    alignSelf: 'flex-end',
    marginRight: width * 0.15,   
  },
  title1: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: width * 0.06,
    color: COLORS.mediumGray,
    marginHorizontal: width * 0.1,
    flexWrap: 'wrap',
    marginTop: width * 0.06
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
   card: {
    width: width * 0.9,
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    marginRight: 10,
    resizeMode: "contain",
    borderRadius: width * 0.05,
  },
  nameBusiness: {
    fontFamily: "JosefinSans_700Bold",
    fontSize: 18,
    marginVertical: width * 0.02,
    color: COLORS.mediumGray,
  },
  description: {
    fontFamily: "JosefinSans_400Regular",
    fontSize: 13,
    color: "#444",
  },
  animalOption: {
    height: 35,
    marginLeft: 10,
    width: 55,
    alignSelf: 'flex-end' 
  },
  cardPremium: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 3 },
    shadowRadius: 6,
    elevation: 3,
    alignItems: "center",
  },
  cardTitle: {
    fontFamily: "JosefinSans_400Regular",
    fontSize: 20,
    color: "#555",
  },
  cardPremiumText: {
    fontFamily: "JosefinSans_700Bold",
    fontSize: 26,
    color: "#8e44ad",
    marginVertical: 5,
  },
  cardSubtext: {
    fontFamily: "JosefinSans_400Regular",
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 15,
  },
  priceLabel: {
    fontFamily: "JosefinSans_400Regular",
    fontSize: 14,
    marginBottom: 8,
  },
  priceBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8e44ad",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  price: {
    fontFamily: "JosefinSans_700Bold",
    fontSize: 20,
    color: "#fff",
  },
  month: {
    fontFamily: "JosefinSans_400Regular",
    fontSize: 14,
    color: "#fff",
    marginLeft: 5,
  },
    background2: {
    height: '100%',
    width: '100%',
    zIndex: 0,
    position: 'relative',
  },
  background3: {
    height: '100%',
    width: '100%',
    zIndex: 1,
    position: 'absolute',
    alignSelf: 'flex-start',
  }
});