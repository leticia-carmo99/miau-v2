import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, Button} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Menu from '../NavigationUser/MenuV1.js';
import * as ImagePicker from "expo-image-picker"; // para trocar foto
import { useUser } from "../NavigationUser/UserContext";

import { collection, getDocs } from 'firebase/firestore';
// Assumindo que você tem o arquivo de configuração do Firebase acessível aqui
import { db } from "../../../../firebaseConfig"; 


import {
  useFonts,
  Nunito_400Regular,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
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

export default function Inicial() {
  const navigation = useNavigation();
  
  // 💡 NOVO ESTADO PARA ARMAZENAR OS BLOGS DO FIREBASE
  const [blogPostsState, setBlogPostsState] = useState([]);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);

  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  });

  const [favoritedPetshopIds, setFavoritedPetshopIds] = useState([]);

  // 💡 NOVO useEffect para buscar os blogs do Firestore
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const blogCollectionRef = collection(db, 'blog');
        const snapshot = await getDocs(blogCollectionRef);
        const fetchedBlogs = snapshot.docs.map(doc => {
          const data = doc.data();
          const isCat = data.tipo && (data.tipo.toLowerCase() === 'cat' || data.tipo.toLowerCase() === 'gato');
          const postType = isCat ? 'cat' : 'dog'; // Mapeia para a string 'cat' ou 'dog' que seu componente usa
          const postImage = isCat ? BlogGato : BlogCao;

          // Mapeando campos do Firestore para a estrutura esperada pelo seu renderBlogPost
          return {
            id: doc.id, // ID do documento
            description: data.titulo || 'Sem título', 
            subtitle: data.subtitulo || 'Sem subtítulo',
            date: data.data || '00.00.0000', 
            type: postType, 
            imageSource: postImage,
            ...data
          };
        });
        setBlogPostsState(fetchedBlogs);
      } catch (error) {
        console.error("Erro ao buscar posts do blog:", error);
      } finally {
        setIsLoadingBlogs(false);
      }
    };

    fetchBlogPosts();
  }, []);


  useEffect(() => {
    // prevenir flicker do splash
    SplashScreen.preventAutoHideAsync().catch(() => {});
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const renderBlogPost = ({ item }) => (
    <TouchableOpacity
      style={styles.blogCard} key={item.id} 
      onPress={() => navigation.navigate('BlogDetalhesUser', {post: item})}
    >
      <View style={[styles.blogImageContainer, { backgroundColor: item.type === 'dog' ? COLORS.primaryOrange : COLORS.primaryPurple }]}>
        <Image source={item.imageSource} style={styles.blogImage} />
      </View>
      <View style={[styles.blogTextContent, { backgroundColor: item.type === 'dog' ? COLORS.lightOrange : COLORS.lightPurple }]}>
        <View>
          <Text style={styles.blogTitle}>{item.description}</Text>
          <Text style={styles.blogDescription}>{item.subtitle}</Text>
        </View>
        <Text style={styles.blogDate}>{item.date}</Text>
      </View>
  </TouchableOpacity>
  );

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
        onPress={() => navigation.navigate('PetshopUser', { petshopId: item.id })}
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
        <TouchableOpacity>
          <Ionicons
            name={"heart-outline"}
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
      onPress={() => navigation.navigate('ServicoUser', { serviceId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.serviceImage} />
      <Text style={styles.serviceName}>{item.name}</Text>
      <Text style={styles.serviceRole}>{item.role}</Text>
      <Text style={styles.serviceLocation}>{item.location}</Text>
      <TouchableOpacity
        style={styles.serviceButton}
        onPress={() => navigation.navigate('ServicoUser', { cuidadorId: item.id })}>
        <Text style={styles.serviceButtonText}>Ver perfil</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
          <View style={styles.menu}>
          <Menu background ='transparent' navigation={navigation}/>
          </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >


        <View style={styles.addPetBanner}>
          <Image
            source={AdicionarPet}
            style={styles.addPetBannerImage}
          />
          <TouchableOpacity
            style={styles.addPetButton}
            onPress={() => navigation.navigate('MeuPet')}
          >
            <Text style={styles.addPetButtonText}>ADICIONE O SEU PET</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.adoptSection}>
          <Image
            source={LaranjaAdocao}
            style={styles.adoptSectionBackground}
          />
          <View style={styles.adoptContentWrapper}>
            <Text style={styles.sectionTitle}>ADOTE UM AMIGO</Text>
            <View style={styles.adoptOptions}>
              <TouchableOpacity
                style={styles.adoptOption}
                onPress={() => navigation.navigate('AdoteUser')}
              >
                <Image
                  source={AdicionarCachorro}
                  style={styles.adoptImage}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.adoptOption}
                onPress={() => navigation.navigate('AdoteUser')}
              >
                <Image
                  source={AdicionarGato}
                  style={styles.adoptImage}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>BLOG</Text>
            <TouchableOpacity onPress={() => navigation.navigate('BlogUser')}>
              <Text style={styles.seeMoreText}>Ver mais</Text>
             </TouchableOpacity>
          </View>
          {/* 💡 ATUALIZADO: Usando o novo estado blogPostsState */}
          {isLoadingBlogs ? (
            <Text style={styles.loadingText}>Carregando blogs...</Text>
          ) : (
            <FlatList
              data={blogPostsState.slice(0, 3)} 
              renderItem={renderBlogPost}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.blogListContent}/>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Veterinários</Text>
            <TouchableOpacity onPress={() => navigation.navigate('VeterinariosListScreen')}>
              <Text style={styles.seeMoreText}>Ver mais</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={establishments}
            renderItem={renderEstablishment}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pet-shops</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MapaPetshopUser')}>
              <Text style={styles.seeMoreText}>Ver mais</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={petshops}
            renderItem={renderPetshop}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.verticalListContent}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Serviços</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MapaServicosUser')}>
              <Text style={styles.seeMoreText}>Ver mais</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={services}
            renderItem={renderService}
            keyExtractor={(item) => item.id + 'service'}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />
        </View>

          <Text style={styles.eventBannerTitle}>EVENTO MAIS PROXIMO!</Text>
       <View style={styles.eventBanner}>   
           <Image
            source={RoxoEvento}
            style={styles.eventBannerBackground}/>
        <TouchableOpacity
          onPress={() => navigation.navigate('EventosUser')}
        >

          <View style={styles.eventCard}>
            <View style={styles.eventDarkArea}>
            <Text style={styles.eventDate}>19 de abril</Text>
            <Text style={styles.eventTitle}>Encontro e doação de cães e gatos</Text>
           </View> 
            <View style={styles.eventLocationContainer}>
              <Text style={styles.eventWeekTime}>Quinta-feira • 09h às 16h</Text>
              <Text style={styles.eventLocation}>Rua Professora Rosália dos Santos, 123 - Bairro Cidade</Text>
            </View>

          </View>
        </TouchableOpacity>
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
  position: 'relative', 
  top: 0, 
  left: 0, 
  right: 0, 
  zIndex: 10,
  marginBottom: 15,
  paddingHorizontal: width * 0.06,
  paddingTop: width * 0.08,
  },
  addPetBanner: {
    width: width * 0.9,
    height: width * 0.45,
    alignSelf: 'center',
    marginTop: width * 0.05,
    borderRadius: 7,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  addPetBannerImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  addPetButton: {
    backgroundColor: COLORS.primaryOrange,
    paddingVertical: width * 0.03,
    paddingHorizontal: width * 0.06,
    borderRadius: width * 0.05,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'absolute',
    bottom: width * 0.134,
  },
  addPetButtonText: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: COLORS.white,
    fontFamily: 'Nunito_700Bold',
  },

  adoptSection: {
    width: width,
    height: width * 0.6,
    marginTop: width * 0.07,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingBottom: width * 0.02
  },
  adoptSectionBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 15,
  },
  adoptContentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: width * 0.04,
    paddingHorizontal: width * 0.045,
  },
  adoptOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: width * 0.09,
    width: '100%',
    alignItems: 'flex-end',
  },
  adoptOption: {
    width: width * 0.3,
    height: width * 0.4,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryOrange,
    position: 'relative',
    alignSelf: 'flex-end',
  },
  adoptImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  section: {
    marginTop: width * 0.07,
    paddingHorizontal: width * 0.06,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: width * 0.04,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: COLORS.blogTextGray,
    fontFamily: 'Nunito_700Bold',
    textAlign: 'left',
  },
  seeMoreText: {
    fontSize: width * 0.037,
    color: COLORS.blogTextGray,
    fontWeight: '600',
    fontFamily: 'Nunito_400Regular',
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
    fontWeight: 'bold',
    color: COLORS.darkGray,
    fontFamily: 'Nunito_700Bold',
  },
  blogDescription: {
    fontSize: width * 0.035,
    color: COLORS.mediumGray,
    fontFamily: 'Nunito_400Regular',
  },
  blogDate: {
    fontSize: width * 0.032,
    color: COLORS.lightGray,
    alignSelf: 'flex-end',
    fontFamily: 'Nunito_400Regular',
  },
  blogListContent: {
    paddingBottom: width * 0.025,
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
  eventBanner: {
    alignSelf: 'center',
    marginBottom: width * 0.1,
    height: width * 0.6,
    width: '100%',
    justifyContent: 'center',
  },
  eventBannerTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: COLORS.primaryPurple,
    textAlign: 'center',
    marginBottom: width * 0.01,
    fontFamily: 'Nunito_700Bold',
    marginTop: width * 0.08,
  },
  eventCard: {
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderTopLeftRadius: 0,
    paddingBottom: width * 0.04,
    width: '65%',
    height: width * 0.34,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'column',
  },
  eventDate: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: width * 0.014,
    marginBottom: width * 0.006,
    fontFamily: 'Nunito_700Bold',
  },
  eventTitle: {
    fontSize: width * 0.03,
    fontWeight: 'semi-bold',
    color: COLORS.white,
    marginBottom: width * 0.025,
    fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
    marginHorizontal: width * 0.020,
  },
  eventLocationContainer: {
    marginLeft: width * 0.03,
    marginBottom: width * 0.03,
  },
  eventWeekTime: {
    fontSize: width * 0.03,
    color: COLORS.blogTextGray,
    marginLeft: width * 0.012,
    fontFamily: 'Nunito_400Regular',
    marginRight: width * 0.04,
  },
  eventLocation: {
    fontSize: width * 0.03,
    color: COLORS.primaryPurple,
    marginLeft: width * 0.012,
    fontFamily: 'Nunito_400Regular',
    marginRight: width * 0.04,
  },
  eventBannerBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  eventDarkArea: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryPurple,
    alignItems: 'center',
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    width: '70%',
    marginBottom: width * 0.015,
    height: '60%',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: width * 0.04,
    color: COLORS.mediumGray,
    paddingVertical: width * 0.05,
  },
});
