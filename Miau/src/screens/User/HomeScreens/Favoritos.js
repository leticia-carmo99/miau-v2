  import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, Button} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Menu from '../NavigationUser/MenuV1.js';

import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
  JosefinSans_300Light,
} from '@expo-google-fonts/josefin-sans';
import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';

import PerfilUser from '../HomeScreens/PerfilUser';

import AdicionarPet from '../assets/FotosInicial/AdicionarPet.png';
import AdicionarCachorro from '../assets/FotosInicial/AdicionarCachorro.png';
import AdicionarGato from '../assets/FotosInicial/AdicionarGato.png';
import UserIcon from '../assets/FotosInicial/foto-user-roxo.png';
import LaranjaAdocao from '../assets/FotosInicial/LaranjaAdocao.png';
import BlogCao from '../assets/FotosInicial/BlogCao.png';
import BlogGato from '../assets/FotosInicial/BlogGato.png';
import RoxoEvento from '../assets/FotosInicial/RoxoEvento.png';

import PetzLogo from '../assets/FotosInicial/petz.png';
import CobasiLogo from '../assets/FotosInicial/cobasi.png';
import PetlandLogo from '../assets/FotosInicial/petland.png';

import DogSelection from '../assets/FotosSobreEBlog/DogSelection.png';
import CatSelection from '../assets/FotosSobreEBlog/CatSelection.png';
import BothSelection from '../assets/FotosSobreEBlog/BothSelection.png';

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

const establishments = [
  {
    id: '1',
    name: 'Petz',
    logo: PetzLogo,
    rating: 4.5,
    distance: '0.4 km',
    description: 'Produtos para cachorros, gatos e diversos outros pets.',
  },
  {
    id: '2',
    name: 'Cobasi',
    logo: CobasiLogo,
    rating: 4.8,
    distance: '0.6 km',
    description: 'Tudo para seu pet, de ração a brinquedos.',
  },
  {
    id: '3',
    name: 'Petland',
    logo: PetlandLogo,
    rating: 4.2,
    distance: '0.8 km',
    description: 'Serviços de banho e tosa, e produtos variados.',
  },
];

const petshops = [
  {
    id: 'p1',
    name: 'Petz',
    logo: require('../assets/FotosInicial/PetzRedondo.png'),
    rating: 4.9,
    distance: '0.4 km',
    category: 'Pet shop',
    favoriteId: 'fav_p1',
  },
  {
    id: 'p2',
    name: 'Pet Point',
    logo: require('../assets/FotosInicial/PetPoint.png'),
    rating: 3.9,
    distance: '0.4 km',
    category: 'Pet shop',
    favoriteId: 'fav_p2',
  },
  {
    id: 'p3',
    name: 'Pet-shop',
    logo: require('../assets/FotosInicial/PetShop.png'),
    rating: 4.2,
    distance: '0.8 km',
    category: 'Pet shop',
    favoriteId: 'fav_p3',
  },
];

const services = [
  {
    id: '1',
    name: 'Nome do Cuidador',
    image: 'https://placehold.co/80x80/FFA07A/FFFFFF?text=Cuidador',
    role: 'Cuidador - SP',
    location: 'Capital - SP',
  },
  {
    id: '2',
    name: 'Nome do Cuidador',
    image: 'https://placehold.co/80x80/98FB98/FFFFFF?text=Cuidador',
    role: 'Cuidador - SP',
    location: 'Capital - SP',
  },
  {
    id: '3',
    name: 'Nome do Cuidador',
    image: 'https://placehold.co/80x80/ADD8E6/FFFFFF?text=Cuidador',
    role: 'Cuidador - SP',
    location: 'Capital - SP',
  },
];

  export default function Favoritos() {
  const navigation = useNavigation();

const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
    JosefinSans_300Light,
    Nunito_400Regular,
    Nunito_700Bold,
  });

  useEffect(() => {
    SplashScreen.preventAutoHideAsync().catch(() => {});
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

const [favoritos, setFavoritos] = useState([]);
const [favoritedPetshopIds, setFavoritedPetshopIds] = useState([])


  const renderEstablishment = ({ item }) => (
    <TouchableOpacity
      style={styles.establishmentCard}
      onPress={() => navigation.navigate('VeterinarioDetalhes', { establishmentId: item.id })}
    >
      <View style={styles.establishmentLogoContainer}>
        <Image source={item.logo} style={styles.establishmentLogo} />
      </View>
      <View style={styles.establishmentInfo}>
        <Text style={styles.establishmentName}>{item.name}</Text>
        <View style={styles.establishmentRatingDistance}>
          <Ionicons name="star" size={width * 0.035} color={COLORS.yellowStar} />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.distanceText}> • {item.distance}</Text>
        </View>
        <Text style={styles.establishmentDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderPetshop = ({ item }) => {
    const isFavorited = favoritedPetshopIds.includes(item.favoriteId);
    return (
      <TouchableOpacity
        style={styles.petshopCard}
        onPress={() => navigation.navigate('PetshopDetalhes', { petshopId: item.id })}
      >
        <View style={styles.petshopLogoWrapper}>
          <Image source={item.logo} style={styles.petshopLogo} />
        </View>
        <View style={styles.petshopDetails}>
          <Text style={styles.petshopName}>{item.name}</Text>
          <View style={styles.petshopRatingCategoryDistance}>
            <Ionicons name="star" size={width * 0.035} color={COLORS.yellowStar} />
            <Text style={styles.petshopRatingText}>{item.rating}</Text>
            <Text style={styles.petshopCategoryText}> • {item.category}</Text>
            <Text style={styles.petshopDistanceText}> • {item.distance}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(item.favoriteId)}>
          <Ionicons
            name={isFavorited ? "heart" : "heart-outline"}
            size={width * 0.06}
            color={COLORS.primaryOrange}
            style={styles.petshopHeartIcon}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  

  const renderService = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => navigation.navigate('ServicoDetalhes', { serviceId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.serviceImage} />
      <Text style={styles.serviceName}>{item.name}</Text>
      <Text style={styles.serviceRole}>{item.role}</Text>
      <Text style={styles.serviceLocation}>{item.location}</Text>
      <TouchableOpacity
        style={styles.serviceButton}
        onPress={() => navigation.navigate('PerfilCuidador', { cuidadorId: item.id })}>
        <Text style={styles.serviceButtonText}>Ver perfil</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>

        <View style={styles.menu}>
          <Menu background ='transparent'/>
          </View>


<View style={styles.contentContainer}>
<Text style={styles.favoriteTitle}>Favoritos</Text>

<Text style={styles.subtitle}>Veterinários</Text>
          <FlatList
            data={establishments}
            renderItem={renderEstablishment}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />


<Text style={styles.subtitle}>Pet-shops</Text>
<View style={styles.petshopContainer}>
      {favoritos.length === 0 ? (
        <Text
          style={{
            fontSize: width * 0.045,
            textAlign: "center",
            marginTop: width * 0.2,
            color: "gray",
          }}
        >
          Nenhum item favoritado
        </Text>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                padding: width * 0.04,
                borderBottomWidth: 1,
                borderColor: "#ddd",
              }}
            >
              <Text style={{ fontSize: width * 0.045 }}>{item.name}</Text>
            </View>
          )}
        />
      )}
          </View>

<Text style={styles.subtitle}>Serviços</Text>
          <FlatList
            data={services}
            renderItem={renderService}
            keyExtractor={(item) => item.id + 'service'}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />

</View>


          </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  scrollView: {
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
  favoriteTitle: {
    fontSize: width * 0.08,
    fontFamily: 'JosefinSans_700Bold',
    color: COLORS.primaryPurple,
  },
  contentContainer: {
    marginVertical: width * 0.3,
    marginLeft: width * 0.1,
  },
  subtitle: {
    fontSize: width * 0.055,
    fontFamily: 'Nunito_700Bold',
    color: COLORS.mediumGray, 
    marginTop: width * 0.1, 
  },
   horizontalListContent: {
    paddingRight: width * 0.045,
  },
  establishmentCard: {
    width: width * 0.45,
    height: width * 0.6,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 0,
    marginRight: 15,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'flex-start',
    overflow: 'hidden',
    marginBottom: width * 0.02,
  },
  establishmentLogoContainer: {
    width: '100%',
    height: '55%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: width * 0.025,
  },
  establishmentLogo: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  establishmentInfo: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: width * 0.025,
    paddingVertical: width * 0.02,
  },
  establishmentName: {
    fontSize: width * 0.037,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    fontFamily: 'Nunito_700Bold',
    marginBottom: width * 0.005,
  },
  establishmentRatingDistance: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: width * 0.012,
  },
  ratingText: {
    fontSize: width * 0.032,
    color: COLORS.yellowStar,
    marginLeft: width * 0.008,
    fontFamily: 'Nunito_400Regular',
  },
  distanceText: {
    fontSize: width * 0.032,
    color: COLORS.mediumGray,
    fontFamily: 'Nunito_400Regular',
  },
  establishmentDescription: {
    fontSize: width * 0.029,
    color: COLORS.lightGray,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'left',
  },
  verticalListContent: {
    paddingBottom: width * 0.025,
  },
  petshopContainer:{
    marginRight: width * 0.1,
  },
  petshopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingVertical: width * 0.03,
    paddingHorizontal: width * 0.04,
    marginBottom: width * 0.025,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  petshopLogoWrapper: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.15) / 2,
    backgroundColor: COLORS.offWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.03,
    overflow: 'hidden',
  },
  petshopLogo: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  petshopDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  petshopName: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    fontFamily: 'Nunito_700Bold',
    marginBottom: width * 0.005,
  },
  petshopRatingCategoryDistance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petshopRatingText: {
    fontSize: width * 0.035,
    color: COLORS.mediumGray,
    marginLeft: width * 0.008,
    fontFamily: 'Nunito_400Regular',
  },
  petshopCategoryText: {
    fontSize: width * 0.035,
    color: COLORS.mediumGray,
    fontFamily: 'Nunito_400Regular',
  },
  petshopDistanceText: {
    fontSize: width * 0.035,
    color: COLORS.mediumGray,
    fontFamily: 'Nunito_400Regular',
  },
  petshopHeartIcon: {
    marginLeft: width * 0.03,
  },

  serviceCard: {
    width: width * 0.4,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: width * 0.04,
    marginRight: 15,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: width * 0.02,
  },
  serviceImage: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: (width * 0.2) / 2,
    marginBottom: width * 0.025,
  },
  serviceName: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: width * 0.012,
    fontFamily: 'Nunito_700Bold',
  },
  serviceRole: {
    fontSize: width * 0.035,
    color: COLORS.mediumGray,
    textAlign: 'center',
    fontFamily: 'Nunito_400Regular',
  },
  serviceLocation: {
    fontSize: width * 0.032,
    color: COLORS.lightGray,
    textAlign: 'center',
    marginBottom: width * 0.025,
    fontFamily: 'Nunito_400Regular',
  },
  serviceButton: {
    backgroundColor: COLORS.primaryPurple,
    paddingVertical: width * 0.02,
    paddingHorizontal: width * 0.04,
    borderRadius: width * 0.05,
  },
  serviceButtonText: {
    color: COLORS.white,
    fontSize: width * 0.037,
    fontWeight: 'bold',
    fontFamily: 'Nunito_700Bold',
  },
})