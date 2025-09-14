import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Button,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Menu from '../NavigationBusiness/Menu.js';

import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
  JosefinSans_300Light,
} from '@expo-google-fonts/josefin-sans';
import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';

import SobreFundoLaranja from '../Imagens/SobreFundoLaranja.png';
import SobreFundoRoxo from '../Imagens/SobreFundoRoxo.png';

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

export default function Sobre() {
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.menu}>
          <Menu background="colorful" />
        </View>
        <Image source={SobreFundoLaranja} style={styles.background1} />

        <View style={styles.aboutView}>
          <Text style={styles.aboutTitle}>Sobre o app</Text>

          <Text style={styles.aboutSubtitle}>Missão</Text>
          <Text style={styles.aboutParagraph}>
            Promover a adoção responsável de cães e gatos, facilitando a conexão entre animais resgatados e lares amorosos, além de fornecer recursos e orientações para o cuidado adequado dos pets.
          </Text>
        </View>

        <View style={styles.visionView}>
          <Text style={styles.visionSubtitle}>Visão</Text>
          <Text style={styles.visionParagraph}>
Ser reconhecido como uma plataforma de referência na promoção do bem-estar animal, contribuindo para a redução do abandono e incentivando a guarda responsável de animais de estimação.
          </Text>
        </View>

        <View style={styles.valuesView}>
          <Text style={styles.aboutSubtitle}>Valores</Text>
          <Text style={styles.aboutParagraph}>
            • Empatia: Compreender e atender às necessidades dos animais e seus futuros tutores.{'\n'}• Responsabilidade: Incentivar práticas de
            cuidado consciente e comprometido com os pets.{'\n'}• Transparência:
            Manter clareza nas informações sobre os animais disponíveis para
            adoção e nos processos envolvidos.{'\n'}• Colaboração: Trabalhar em
            conjunto com abrigos, ONGs e voluntários para ampliar o alcance das
            adoções.{'\n'}• Educação: Oferecer conteúdos que orientem sobre a
            posse responsável e cuidados com os animais.
          </Text>
        </View>

        <Image source={SobreFundoRoxo} style={styles.background2} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  scroll: {
    flex: 1,
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
  background1: {
    width: '100%',
    height: width * 1.1,
    zIndex: 0,
    position: 'relative',
  },
  aboutView: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    marginTop: 100,
    marginLeft: width * 0.05,
  },
  aboutTitle: {
    fontSize: width * 0.08,
    fontFamily: 'JosefinSans_700Bold',
    color: COLORS.white,
    alignSelf: 'flex-end',
    marginRight: width * 0.1,
  },
  aboutSubtitle: {
    fontSize: width * 0.06,
    fontFamily: 'JosefinSans_700Bold',
    color: COLORS.white,
    marginBottom: 6,
    marginTop: width * 0.1,
  },
  aboutParagraph: {
    flexWrap: 'wrap',
    fontSize: width * 0.045,
    fontFamily: 'JosefinSans_300Light',
    color: COLORS.white,
    letterSpacing: 1,
    lineHeight: 18,
    marginTop: width * 0.03,
    marginRight: width * 0.05,
  },
  visionView: {
    alignItems: 'flex-end',
    marginRight: width * 0.05,
  },
  visionSubtitle: {
    fontSize: width * 0.06,
    fontFamily: 'JosefinSans_700Bold',
    color: COLORS.primaryOrange,
    marginBottom: 6,
    marginRight: width * 0.1,
    marginTop: width * 0.1,
  },
  visionParagraph: {
    flexWrap: 'wrap',
    fontSize: width * 0.045,
    fontFamily: 'JosefinSans_300Light',
    color: COLORS.mediumGray,
    letterSpacing: 1,
    lineHeight: 18,
    marginTop: width * 0.03,
    marginLeft: width * 0.05,
    textAlign: 'right',
  },
  background2: {
    width: '100%',
    height: 550,
    zIndex: 0,
    position: 'relative',
  },
  valuesView: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    marginTop: 650,
    marginLeft: width * 0.05,
  },
});
