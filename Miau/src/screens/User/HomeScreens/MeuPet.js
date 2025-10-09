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
  useWindowDimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Menu from '../NavigationUser/MenuSozinho';
import PetBackground from '../assets/FotosMeuPet/PetBackground.png';
import FotoPerfilCao from '../assets/FotosMeuPet/FotoPerfilCao.png';
import FotoPerfilBack from '../assets/FotosMeuPet/FotoPerfilBack.png';
import FotoPerfilCaoDeco from '../assets/FotosMeuPet/FotoPerfilCaoDeco.png';
import Back from '../assets/FotosInicial/Back.png';
import BlogCao from '../assets/FotosInicial/BlogCao.png';
import BlogGato from '../assets/FotosInicial/BlogGato.png';
import { useUser } from "../NavigationUser/UserContext";
import { usePet } from "../NavigationUser/PetContext";

import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
} from '@expo-google-fonts/josefin-sans';
import { Nunito_700Bold, Nunito_400Regular } from '@expo-google-fonts/nunito';

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
const blogPosts = [
  {
    id: '1',
    type: 'dog',
    imageSource: BlogCao,
    title: 'Seu cachorro come grama?',
    description: 'Pode ser normal, mas fique de olho no excesso!',
    date: '21.06.2023',
  },
  {
    id: '3',
    type: 'cat',
    imageSource: BlogGato,
    title: 'Gato miando de madrugada?',
    description: 'Entenda os motivos e como resolver.',
    date: '21.06.2023',
  },
];

export default function MeuPet() {
  const navigation = useNavigation();
  const { petData, isLoading } = usePet(); 

const nomePet = petData?.nome || "Pet";
const idadePet = petData?.idade || " ";
const pesoPet = petData?.peso || " ";
const corPet = petData?.cor || " ";
const racaPet = petData?.raca || "Vira-lata";
const sexoPet = petData?.sexo || "Macho"; // valor padrão// valor padrão
const imagePet = petData?.image || FotoPerfilCao;

  const [selected, setSelected] = useState(3); // começa no meio

  const moods = ['😡', '☹️', '😐', '🙂', '😁'];
  const colors = ['#e53935', '#fb8c00', '#fdd835', '#7cb342', '#43a047'];

  const data = [
    { label: 'Idade', value: idadePet },
    { label: 'Sexo', value: sexoPet },
    { label: 'Cor', value: corPet },
    { label: 'Peso', value: pesoPet },
  ];



  const renderBlogPost = ({ item }) => (
    <TouchableOpacity
      style={styles.blogCard}
      onPress={() => navigation.navigate('BlogDetalhesUser', { postId: item.id })}>
      <View
        style={[
          styles.blogImageContainer,
          {
            backgroundColor:
              item.type === 'dog' ? COLORS.primaryOrange : COLORS.primaryPurple,
          },
        ]}>
        <Image source={item.imageSource} style={styles.blogImage} />
      </View>
      <View
        style={[
          styles.blogTextContent,
          {
            backgroundColor:
              item.type === 'dog' ? COLORS.lightOrange : COLORS.lightPurple,
          },
        ]}>
        <View>
          <Text style={styles.blogTitle}>{item.title}</Text>
          <Text style={styles.blogDescription}>{item.description}</Text>
        </View>
        <Text style={styles.blogDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  if (isLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <Text>Carregando dados do pet...</Text>
                </View>
            </SafeAreaView>
        );
    }

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <SafeAreaView style={styles.container}>
        <View>
          <Image source={PetBackground} style={styles.petbackground} />

          <View style={styles.menuView}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={Back} style={styles.back} />
            </TouchableOpacity>
            <Menu background="colorful" />
          </View>

          <View style={{ alignItems: 'center' }}>
            <View style={styles.pictureView}>
              <Image source={FotoPerfilBack} style={styles.profilePicBack} />
              <Image source={imagePet} style={styles.profilePic} />
            </View>
            <Image
              source={FotoPerfilCaoDeco}
              style={styles.profileDecoration}
            />
          </View>
        </View>

        <View style={styles.nameView}>
          <Text style={styles.petName}>{nomePet}</Text>
          <Text style={styles.animalType}>{racaPet}</Text>
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

        <View style={styles.vacineView}>
          <Text style={styles.vacineTitle}>Carteira de Vacinação</Text>
          <TouchableOpacity style={styles.carteiraPdfButton}>
            <Text style={styles.carteiraPdfTitle}>carteirinhaluna.pdf </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.feelingView}>
          <Text style={styles.vacineTitle}>Como {nomePet} está hoje?</Text>
          <View style={styles.moods}>
            {/* Ícones de humor */}
            <View style={styles.row}>
              {moods.map((mood, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelected(index)}>
                  <View
                    style={[
                      styles.moodCircle,
                      selected === index && { borderColor: colors[index] },
                    ]}>
                    <Text
                      style={{
                        fontSize: 26,
                        color: selected === index ? colors[index] : '#bbb',
                      }}>
                      {mood}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => navigation.navigate('EditarMeuPetUser')}>
          <Text style={styles.editProfileText}>EDITAR PERFIL</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>BLOG</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('BlogListScreen')}>
              <Text style={styles.seeMoreText}>Ver mais</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={blogPosts}
            renderItem={renderBlogPost}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.blogListContent}
          />
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
  back: {
    height: width * 0.1,
    width: width * 0.1,
    padding: width * 0.1,
    marginRight: width * 0.6,
  },
  menuView: {
    height: width * 0.4,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
  },
  petbackground: {
    width: '100%',
    height: width * 0.8,
    position: 'absolute',
  },
  scroll: {
    flex: 1,
  },
  profilePic: {
    height: width * 0.55,
    width: width * 0.55,
    borderRadius: 80,
  },
  profilePicBack: {
    height: width * 0.56,
    width: width * 0.56,
    position: 'absolute',
  },
  profileDecoration: {
    height: width * 0.5,
    width: width * 0.7,
    position: 'absolute',
    marginRight: width * 0.06,
    marginTop: width * 0.1,
  },
  pictureView: {
    alignItems: 'center',
    marginTop: width * 0.25,
    position: 'absolute',
  },
  nameView: {
    marginTop: width * 0.85,
    alignItems: 'center',
  },
  petName: {
    fontSize: width * 0.07,
    fontFamily: 'JosefinSans_700Bold',
    color: COLORS.blogTextGray,
  },
  animalType: {
    fontSize: width * 0.05,
    fontFamily: 'JosefinSans_400Regular',
    color: COLORS.blogTextGray,
  },
  infos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap', // quebra linha se não couber
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    width: '22%', // 4 cards lado a lado
    aspectRatio: 1, // deixa quadradinho
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    margin: 4,
  },
  label: {
    fontSize: width * 0.045,
    color: COLORS.blogTextGray,
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: 'JosefinSans_400Regular',
    marginTop: 8,
  },
  value: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: COLORS.blogTextGray,
    textAlign: 'center',
    fontFamily: 'JosefinSans_700Bold',
  },
  vacineView: {
    marginTop: 20,
    marginLeft: '8%',
  },
  vacineTitle: {
    fontSize: width * 0.045,
    color: COLORS.blogTextGray,
    fontFamily: 'JosefinSans_400Regular',
  },
  carteiraPdfButton: {
    backgroundColor: COLORS.primaryOrange,
    paddingVertical: width * 0.03,
    paddingHorizontal: width * 0.06,
    borderRadius: width * 0.05,
    borderWidth: 1.5,
    borderColor: '#8a5408',
    width: width * 0.65,
    marginVertical: 5,
    justifyContent: 'center',
  },
  carteiraPdfTitle: {
    fontSize: width * 0.045,
    color: COLORS.white,
    fontFamily: 'JosefinSans_400Regular',
  },
  feelingView: {
    marginTop: 20,
    marginLeft: '8%',
  },
  moods: {
    alignItems: 'center',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  moodCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  editProfileButton: {
    alignSelf: 'flex-end',
    padding: width * 0.05,
    backgroundColor: COLORS.primaryPurple,
    width: width * 0.6,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  editProfileText: {
    alignSelf: 'center',
    fontSize: width * 0.06,
    color: COLORS.white,
    fontFamily: 'JosefinSans_700Bold',
  },
  section: {
    marginTop: width * 0.07,
    paddingHorizontal: width * 0.06,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: width * 0.04,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    color: COLORS.blogTextGray,
    fontFamily: 'Nunito_700Bold',
    textAlign: 'left',
  },
  seeMoreText: {
    fontSize: width * 0.037,
    color: COLORS.blogTextGray,
    fontWeight: '600',
    fontFamily: 'JosefinSans_400Regular',
  },

  blogCard: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: width * 0.02,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    height: width * 0.25,
    width: width * 0.85,
    alignSelf: 'center',
  },
  blogImageContainer: {
    width: width * 0.2,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blogImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  blogTextContent: {
    flex: 1,
    paddingVertical: width * 0.025,
    paddingHorizontal: width * 0.04,
    justifyContent: 'space-between',
  },
  blogTitle: {
    fontSize: width * 0.04,
    marginBottom: 5,
    color: COLORS.darkGray,
    fontFamily: 'JosefinSans_700Bold',
  },
  blogDescription: {
    fontSize: width * 0.035,
    color: COLORS.mediumGray,
    fontFamily: 'JosefinSans_400Regular',
  },
  blogDate: {
    fontSize: width * 0.032,
    color: COLORS.lightGray,
    alignSelf: 'flex-end',
    fontFamily: 'JosefinSans_400Regular',
  },
  blogListContent: {
    paddingBottom: width * 0.025,
  },
});
