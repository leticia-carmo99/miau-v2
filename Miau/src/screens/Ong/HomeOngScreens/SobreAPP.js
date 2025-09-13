import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
  JosefinSans_300Light,
} from '@expo-google-fonts/josefin-sans';
import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';

import SobreFundoLaranja from '../Images/SobreFundoLaranja.png';
import SobreFundoRoxo from '../Images/SobreFundoRoxo.png';

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

export default function AboutScreen() {
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
    JosefinSans_300Light,
    Nunito_400Regular,
    Nunito_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.offWhite }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* O menu continua absoluto para ficar fixo no topo */}
        <View style={styles.menu}>
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <Feather name="menu" size={width * 0.12} color='#FFFFFF'/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('PerfilOng')} style={styles.profileButton}>
            <Image source={require('../Images/foto-user-branco.png')} style={{ width: width * 0.12, height: width * 0.12, resizeMode: 'contain',}} />
          </TouchableOpacity>
        </View>

        {/* Seção 1: Fundo laranja com conteúdo */}
        <View style={[styles.sectionContainer, { height: width * 1.1 }]}>
          <Image source={SobreFundoLaranja} style={styles.background1} />
          <View style={styles.aboutView}>
            <Text style={styles.aboutTitle}>Sobre o app</Text>
            <Text style={styles.aboutSubtitle}>Missão</Text>
            <Text style={styles.aboutParagraph}>
              Promover a adoção responsável de cães e gatos, facilitando a conexão entre animais resgatados e lares amorosos, além de fornecer recursos e orientações para o cuidado adequado dos pets.
            </Text>
          </View>
        </View>
        
        {/* Seção 2: Visão (sem fundo, no fluxo normal) */}
        <View style={styles.visionView}>
          <Text style={styles.visionSubtitle}>Visão</Text>
          <Text style={styles.visionParagraph}>
            Ser reconhecido como uma plataforma de referência na promoção do bem-estar animal, contribuindo para a redução do abandono e incentivando a guarda responsável de animais de estimação.
          </Text>
        </View>
        
        {/* Seção 3: Fundo roxo com conteúdo */}
        <View style={[styles.sectionContainer, { height: width * 1.4 }]}>
            <Image source={SobreFundoRoxo} style={styles.background2} />
            <View style={styles.valuesView}>
                <Text style={styles.aboutSubtitle}>Valores</Text>
                <Text style={styles.aboutParagraph}>
                • Empatia: Compreender e atender às necessidades dos animais e seus futuros tutores.{'\n'}
                • Responsabilidade: Incentivar práticas de cuidado consciente e comprometido com os pets.{'\n'}
                • Transparência: Manter clareza nas informações sobre os animais disponíveis para adoção e nos processos envolvidos.{'\n'}
                • Colaboração: Trabalhar em conjunto com abrigos, ONGs e voluntários para ampliar o alcance das adoções.{'\n'}
                • Educação: Oferecer conteúdos que orientem sobre a posse responsável e cuidados com os animais.
                </Text>
            </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: width * 0.06,
    paddingTop: width * 0.1,
    flexDirection: 'row',
    // ALTERADO: Ajustado para space-between para alinhar os ícones nas extremidades
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionContainer: {
    position: 'relative', 
    justifyContent: 'center',
  },
  background1: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  aboutView: {
    width: '100%',
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: width * 0.05,
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
    paddingVertical: 40,
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
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  valuesView: {
    width: '100%',
    paddingTop: 50,
    paddingBottom: 50,
    paddingLeft: width * 0.05,
  },
  menuButton: {
    padding: 6,
  },
  profileButton: {
    padding: 6,
    // REMOVIDO: marginLeft não é mais necessário com space-between
  },
});

