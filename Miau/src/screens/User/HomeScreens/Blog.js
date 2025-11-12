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

const popularblogs = [
  {
    id: '1',
    logo: {uri:'https://cdn-icons-png.flaticon.com/256/8161/8161087.png'},
    description: 'Banho ideal: com que frequência?',
  },
  {
    id: '2',
    logo:{uri: 'https://cdn-icons-png.flaticon.com/512/5774/5774971.png'},
    description: 'Como escovar os dentes do pet?',
  },
  {
    id: '3',
    logo: {uri: 'https://cdn-icons-png.flaticon.com/512/2002/2002531.png'},
    description: 'Vacinas obrigatórias e quando dar.',
  },
];

const blogPosts = [
  {
    id: '1',
    type: 'dog',
    imageSource: BlogCao,
    description: 'Seu cachorro come grama?',
    subtitle: 'Pode ser normal, mas fique de olho no excesso!',
    date: '21.06.2023',
  },
  {
    id: '2',
    type: 'dog',
    imageSource: BlogCao,
    description: 'Latido demais?',
    subtitle: 'Pode ser tédio, ansiedade ou só energia acumulada.',
    date: '21.05.2025'
  },
  {
    id: '3',
    type: 'cat',
    imageSource: BlogGato,
    description: 'Gato miando de madrugada?',
    subtitle: 'Entenda os motivos e como resolver.',
    date: '21.06.2023',
  },
];

const blogConduct = [
  {
    id: '1',
    logo: {uri: 'https://cdn-icons-png.flaticon.com/512/6022/6022768.png'},
    description: 'Por que meu gato morde do nada?',
  },
  {
    id: '2',
    logo: {uri: 'https://cdn-icons-png.flaticon.com/512/6664/6664786.png'},
    description: 'Cachorro late demais: o que fazer?',
  },
  {
    id: '3',
    logo: {uri: 'https://cdn-icons-png.flaticon.com/512/3460/3460335.png'},
    description: 'Como apresentar um novo pet?',
  },
];

const blogHealth = [
  {
    id: '1',
    logo: {uri: 'https://cdn-icons-png.flaticon.com/512/8285/8285504.png'},
    description: 'Como saber se o pet está com dor',
  },
  {
    id: '2',
    logo: {uri: 'https://cdn-icons-png.flaticon.com/512/1839/1839845.png'},
    description: 'Vermifugo: quando e por quê?',
  },
  {
    id: '3',
    logo: {uri: 'https://cdn-icons-png.flaticon.com/512/3111/3111559.png'},
    description: 'Xixi fora do lugar: o que pode ser?',
  },
];

const blogFood = [
  {
    id: '1',
    logo: {uri: 'https://cdn-icons-png.flaticon.com/512/2934/2934108.png'},
    description: 'Pode dar comida humana?',
  },
  {
    id: '2',
    logo: {uri: 'https://cdn-icons-png.flaticon.com/512/2234/2234851.png'},
    description: 'Alimentos tóxicos para pets',
  },
  {
    id: '3',
    logo: {uri: 'https://cdn-icons-png.flaticon.com/512/1303/1303584.png'},
    description: 'Ração ou alimentação?',
  },
];

  export default function Blog() {
  const navigation = useNavigation();

    const renderBlogPost = ({ item }) => (
    <TouchableOpacity
      style={styles.blogCard}
      onPress={() => navigation.navigate('BlogDetalhesUser', {post: item})}>
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
          <Text style={styles.blogTitle}>{item.description}</Text>
          <Text style={styles.blogDescription}>{item.subtitle}</Text>
        </View>
        <Text style={styles.blogDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );


  const renderPopularblogs = ({ item }) => (
    <TouchableOpacity
      style={styles.popularblogsCard} key={item.id} 
      onPress={() => navigation.navigate('BlogDetalhesUser', {post: item})}
    >
      <View style={styles.popularblogsImageView}>
        <Image source={item.logo} style={styles.popularblogsImage} />
      </View>
      <View style={styles.popularblogsDescriptionView}>
        <Text style={styles.popularblogsDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>

        <View style={styles.menu}>
          <Menu background ='transparent'/>
          </View>

        <View style={styles.contentSelection}>
        <TouchableOpacity style={styles.selectionButton}>
        <Image source={DogSelection} style={styles.selectionImage} />
        <Text style={styles.selectionText}>Cachorros</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.selectionButton}>
        <Image source={CatSelection} style={styles.selectionImage}/>
        <Text style={styles.selectionText}>Gatos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.selectionButton}>
        <Image source={BothSelection} style={styles.selectionImage}/>
        <Text style={styles.selectionText}>Ambos</Text>
        </TouchableOpacity>
        </View>

        <View style={styles.popularView}>
        <Text style={styles.popularText}>Mais popular</Text>

          <FlatList
            data={popularblogs}
            renderItem={renderPopularblogs}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />
        </View>

        <View style={styles.popularView}>
        <Text style={styles.popularText}> Podem te interessar</Text>
          <FlatList
            data={blogPosts}
            renderItem={renderBlogPost}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.blogListContent}
          />
        </View>

{/* AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA */}
                <View style={styles.popularView}>
        <Text style={styles.popularText}>Saúde e Bem-estar</Text>

          <FlatList
            data={blogHealth}
            renderItem={renderPopularblogs}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />
        </View>

                <View style={styles.popularView}>
        <Text style={styles.popularText}>Alimentação</Text>

          <FlatList
            data={blogFood}
            renderItem={renderPopularblogs}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />
        </View>

                <View style={styles.lastView}>
        <Text style={styles.popularText}>Comportamento</Text>

          <FlatList
            data={blogConduct}
            renderItem={renderPopularblogs}
            keyExtractor={(item) => item.id}
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
  contentSelection: {
    flexDirection: 'row',
    marginTop: width * 0.3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectionButton: {
    marginHorizontal: width * 0.03,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectionImage: {
    height: width * 0.15,
    width: width * 0.15
  },
  selectionText: {
    fontSize: width * 0.045,
    fontFamily: 'JosefinSans_700Bold',
    color: COLORS.mediumGray,
    marginTop: 5
  },
  popularView: {
    marginVertical: width * 0.1,
    marginTop: width * 0.07,
    paddingHorizontal: width * 0.06,
  },
  popularText: {
    fontSize: width * 0.055,
    fontFamily: 'JosefinSans_400Regular',
    color: COLORS.mediumGray, 
        marginBottom: width * 0.04,  
  },
    popularblogsCard: {
    width: width * 0.45,
    height: width * 0.6,
    backgroundColor: COLORS.primaryPurple,
    borderRadius: 10,
    padding: 0,
    marginRight: 15,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: width * 0.02,
  },
  popularblogsImageView: {
    width: '100%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: width * 0.025,
  },
  popularblogsImage: {
    width: '80%',
    height: '85%',
    resizeMode: 'cover',
  },
  popularblogsDescriptionView: {

    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: width * 0.025,
    paddingVertical: width * 0.02,
  },
  popularblogsDescription: {
   fontSize: width * 0.04,
    fontFamily: 'JosefinSans_400Regular',
    color: COLORS.white,  
    textAlign: 'left',
    alignSelf: 'flex-end',
  },
    horizontalListContent: {
    paddingRight: width * 0.045,
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
    height: width * 0.33,
    width: width * 0.85,
    alignSelf: 'center',
    justifyContent: 'center'
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
    fontSize: width * 0.05,
    marginBottom: 7,
    color: COLORS.darkGray,
    fontFamily: 'JosefinSans_700Bold',
  },
  blogDescription: {
    fontSize: width * 0.04,
    color: COLORS.mediumGray,
    fontFamily: 'JosefinSans_400Regular',
  },
  blogDate: {
    fontSize: width * 0.04,
    color: COLORS.lightGray,
    alignSelf: 'flex-end',
    fontFamily: 'JosefinSans_400Regular',
  },
  blogListContent: {
    paddingBottom: width * 0.025,
  },
  lastView: {
    marginVertical: width * 0.1,
    marginTop: width * 0.07,
    paddingHorizontal: width * 0.06, 
    marginBottom: 100 
  }
})
      