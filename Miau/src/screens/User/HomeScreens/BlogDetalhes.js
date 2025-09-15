import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Dimensions,
  StyleSheet,
  Animated,
  PanResponder,
  Alert,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  SafeAreaView
    
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import Menu from '../NavigationUser/MenuSozinho';
import Back from '../assets/FotosInicial/Back.png';

// You can import supported modules from npm
import { Card } from 'react-native-paper';
import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
    JosefinSans_300Light,
} from '@expo-google-fonts/josefin-sans';
import {
  Nunito_400Regular,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
const { width, height } = Dimensions.get('window');
const SNAP_POINTS = [height * 0.25, height * 0.65]; // fechado e aberto

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
  darkPurple: '#3C2B5E',
};

export default function BlogDetalhes() {
  const navigation = useNavigation();

  const route = useRoute();
  const { post } = route.params || {};

  // valores com fallback
  const title = post?.title || post?.description || 'Lorem Ipsum is simply dummy text';
  const author = post?.author || 'John Smith';
  const date = post?.date || '10 Jan, 2020';
  const content =
    post?.content ||
    `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. \n \n It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;
  const headerImage =
    post?.header || 'https://cdn.awsli.com.br/998/998959/produto/189681099/s706-fu3d8l6e0g.jpg';  
  const subtitle = post?.subtitle ||'Lorem Ipsum is simply dummy text';


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
          <View style={styles.menuView}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name='chevron-left' size={width * 0.15} color='#9156D1' style={styles.back} />
          </TouchableOpacity>
          <Menu style={styles.menu}/>
        </View>

      <View style={styles.headerView}>
                  <Text style={styles.blogTitle}>{title}</Text>
                  <Text style={styles.blogSubtitle}>{subtitle}</Text>
        <Image source={headerImage} style={styles.headerImage}/>
        </View>

                <View style={styles.blogContainer}>

          <View style={styles.authorRow}>
            <Image
              source={{ uri: 'https://cdn.awsli.com.br/998/998959/produto/189681099/s706-fu3d8l6e0g.jpg' }}
              style={styles.authorAvatar}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.authorName}>{author}</Text>
              <Text style={styles.date}>{date}</Text>
            </View>
            <View style={{alignItems: 'flex-end', width: '60%', flexDirection: 'row'}}>
            <Feather name="clock" size={width * 0.05} color="#737373" style={{margin: 1.5, marginRight: 5, marginLeft: 120}}/>
            <Text style={styles.date}>5 min</Text>
            </View>
          </View>

          <Text style={styles.blogContent}>{content}</Text>
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
    width: width * 0.1,
    padding: width * 0.05,
    marginRight: width * 0.7,
  },
  menuView: {
    height: width * 0.4,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 2
  },
  headerView: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
    marginTop: width * 0.3,
  },
  headerImage: {
    height: width * 0.65,
    width: '95%',
    borderRadius: width * 0.07
  },
  blogContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  blogTitle: {
    fontFamily: 'JosefinSans_700Bold',
    fontSize: 27,
    color: COLORS.darkPurple,
    marginBottom: 15,
    marginHorizontal: width * 0.04,
  },
    blogSubtitle: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 19,
    color: COLORS.primaryPurple,
    marginBottom: 15,
    marginHorizontal: width * 0.03,
    flexWrap: 'wrap'
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorName: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: COLORS.black,
  },
  date: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: COLORS.blogTextGray,
  },
  blogContent: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.blogTextGray,
    textAlign: 'justify',
  },


  });