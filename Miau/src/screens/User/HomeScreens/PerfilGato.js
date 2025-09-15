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


  const [pdfUri, setPdfUri] = useState(null);

  useEffect(() => {
    const loadPdf = async () => {
      // carrega PDF de assets
      const asset = Asset.fromModule(require("../assets/FotosPerfisAnimais/exemplo-carteira-vacinacao.pdf"));
      await asset.downloadAsync();

      // copia para FileSystem (necessário para WebView abrir)
      const fileUri = FileSystem.documentDirectory + "exemplo.pdf";
      await FileSystem.copyAsync({
        from: asset.localUri,
        to: fileUri,
      });

      setPdfUri(fileUri);
    };

    loadPdf();
  }, []);


  const data = [
    { label: 'Idade', value: '6' },
    { label: 'Sexo', value: 'Macho' },
    { label: 'Cor', value: 'Branco e preto' },
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
  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <SafeAreaView style={styles.container}>
        <Image source={BackgroundCao} style={styles.background} />

        <View style={styles.menuView}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={Back} style={styles.back} />
          </TouchableOpacity>
        </View>

        <View style={styles.dogImageView}>
          <Image source={Prado} style={styles.dogImage} />
        </View>

        <View style={styles.content}>
          <View style={styles.nameView}>
            <Text style={styles.petName}>Prado</Text>
            <Text style={styles.animalType}>Frajola</Text>
          </View>

          <View style={styles.infos}>
            {data.map((item, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.label}>{item.label}</Text>
                <Text
                  style={styles.value}
                  numberOfLines={2}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.1}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.infoOngView}>
            <View
              style={{
                position: 'absolute',
                zIndex: 2,
                alignSelf: 'flex-start',
              }}>
              <Image style={styles.infoOngImage} source={LogoOng} />
            </View>
            <View style={styles.infoOngTextView}>
              <Text style={styles.infoOngText}>
                Associação Patinhas Unidas de Parintins
              </Text>
              <Text style={styles.infoOngText}>(92) 992624521</Text>
            </View>
          </View>

          <View style={styles.contentView}>

            <Text style={styles.subtitleBold}>Descrição</Text>
            <Text style={styles.paragraph}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </Text>

            <Text style={styles.subtitleBold}>Informações gerais</Text>
            <Text style={styles.paragraph}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </Text>

            <TouchableOpacity style={styles.vacineButton}>
              <Text style={styles.vacineButtonText}>Carteira de Vacinação</Text>
            </TouchableOpacity>
          </View>

           {pdfUri ? (
        <WebView source={{ uri: pdfUri }} style={{ flex: 1 }} />
      ) : (
          <TouchableOpacity style={styles.adoptButton} onPress={() => setShowPdf(true)}>
            <Text style={styles.adoptButtonText}>Quero Adotar!</Text>
          </TouchableOpacity>
        )}
        </View>

        <View style={{ marginTop: 900, alignItems: 'flex-end' }}>
          <Image source={BackgroundCao} style={styles.background} />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryOrange,
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
    color: COLORS.primaryOrange,
  },
  animalType: {
    fontSize: width * 0.05,
    fontFamily: 'JosefinSans_400Regular',
    color: COLORS.primaryOrange,
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
    color: COLORS.primaryOrange,
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: 'JosefinSans_400Regular',
    marginTop: 8,
  },
  value: {
    fontSize: width * 0.05,
    color: COLORS.primaryOrange,
    textAlign: 'center',
    fontFamily: 'JosefinSans_700Bold',
    marginBottom: 8,
  },
  infoOngView: {
    alignItems: 'flex-end',
    marginTop: width * 0.1,
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
    backgroundColor: COLORS.primaryOrange,
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
  contentView: {
    padding: 10,
    marginHorizontal: width * 0.05,
  },
  subtitleBold: {
    fontSize: width * 0.07,
    fontFamily: 'Nunito_700Bold',
    color: COLORS.primaryOrange,
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
    color: COLORS.white,
    padding: width * 0.04,
    fontSize: width * 0.08,
  },
});
