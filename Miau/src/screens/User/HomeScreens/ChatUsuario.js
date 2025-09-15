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
import { TabView } from 'react-native-tab-view';
import Menu from '../NavigationUser/MenuV1.js';
import { Feather } from '@expo/vector-icons';
import LogoBranca from '../assets/Logos/logobranca.png';

import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
} from '@expo-google-fonts/josefin-sans';
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

// Telas para cada chat (com pesquisa e outras funcionalidades)
const OngsScreen = ({ search, setSearch, filteredData, navigationRef }) => {
  const data = [
    {
      id: '1',
      name: 'Patinhas Unidas',
      message: 'Digitando...',
      time: '11:08',
      unread: 2,
      image:
        'https://dentistaubatuba.com.br/wp-content/uploads/2021/06/o-que-as-pessoas-bonitas-tem-em-comum-2.jpg',
      section: 'recent',
    },
    {
      id: '2',
      name: 'Caeuzinhos',
      message: 'Posso ir buscar às 13h?',
      time: '09:22',
      unread: 2,
      image:
        'https://i.pinimg.com/originals/75/f1/1e/75f11ef93a38c9feed58db2989c00b1e.jpg',
      section: 'recent',
    },
    {
      id: '3',
      name: 'Gatinhos',
      message: 'O pet está bem?',
      time: '08:42',
      unread: 99,
      image:
        'https://randomuser.me/api/portraits/women/3.jpghttps://i.pinimg.com/736x/fd/fc/ef/fdfcefc24e58a4e3ed4dd6099d530353.jpg',
      section: 'recent',
    },
    {
      id: '4',
      name: 'Cachorrinhas',
      message: 'Pode ser sim!',
      time: '07:08',
      unread: 0,
      image:
        'https://brasil.angloamerican.com/~/media/Images/A/Anglo-American-Group-v9/Brazil/landing-signposts/carreiras/camilaPereira.jpg?h=612&iar=0&w=606',
      section: 'all',
    },
    {
      id: '5',
      name: 'Gatos adoção',
      message: 'Pode ser sim!',
      time: '07:08',
      unread: 0,
      image:
        'https://thumbs.dreamstime.com/b/close-up-da-menina-de-liitle-24928523.jpg',
      section: 'all',
    },
    {
      id: '6',
      name: 'Caes e gatos',
      message: 'Pode ser sim!',
      time: '07:08',
      unread: 0,
      image:
        'https://gente.globo.com/wp-content/uploads/2024/10/100257-gente-olhar-em-diversidades-pessoas-com-deficiencias.jpg',
      section: 'all',
    },
  ];

  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.tabContent}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar"
              value={search}
              onChangeText={setSearch}
            />
            <Feather
              name="search"
              size={20}
              color="#999"
              style={styles.searchIcon}
            />
          </View>

      <ScrollView showsVerticalScrollIndicator={false}>
          {search.trim() === '' ? (
            <>
              <Text style={styles.sectionTitle}>Conversas recentes</Text>
              <FlatList
                data={data.filter((item) => item.section === 'recent')}
                renderItem={({ item }) => renderItem({ item, navigationRef })}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />

              <Text style={styles.sectionTitle}>Todas as conversas</Text>
              <FlatList
                data={data.filter((item) => item.section === 'all')}
                renderItem={({ item }) => renderItem({ item, navigationRef })}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            </>
          ) : (
            <FlatList
              data={filteredData}
              renderItem={({ item }) => renderItem({ item, navigationRef })}
              keyExtractor={(item) => item.id}
            />
          )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const ServicosScreen = ({ search, setSearch, filteredData }) => {
  // Adicionar aqui a lógica do ServicosScreen, similar ao OngsScreen
};


const renderItem = ({ item, navigationRef }) => {
  return (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigationRef.navigate('ChatConversa', {
          user: item,
        })
      }>
      <Image source={{ uri: item.image }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
      <View style={styles.infoContainer}>
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>
              {item.unread > 99 ? '99+' : item.unread}
            </Text>
          </View>
        )}
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function ChatUsuario() {
  const navigationRef = useNavigation();

  const [search, setSearch] = useState(''); // Estado para controle da pesquisa

  const data = [
    {
      id: '1',
      name: 'Patinhas Unidas',
      message: 'Digitando...',
      time: '11:08',
      unread: 2,
      image:
        'https://dentistaubatuba.com.br/wp-content/uploads/2021/06/o-que-as-pessoas-bonitas-tem-em-comum-2.jpg',
      section: 'recent',
    },
    {
      id: '2',
      name: 'Caeuzinhos',
      message: 'Posso ir buscar às 13h?',
      time: '09:22',
      unread: 2,
      image:
        'https://i.pinimg.com/originals/75/f1/1e/75f11ef93a38c9feed58db2989c00b1e.jpg',
      section: 'recent',
    },
    {
      id: '3',
      name: 'Gatinhos',
      message: 'O pet está bem?',
      time: '08:42',
      unread: 99,
      image:
        'https://randomuser.me/api/portraits/women/3.jpghttps://i.pinimg.com/736x/fd/fc/ef/fdfcefc24e58a4e3ed4dd6099d530353.jpg',
      section: 'recent',
    },
    {
      id: '4',
      name: 'Cachorrinhas',
      message: 'Pode ser sim!',
      time: '07:08',
      unread: 0,
      image:
        'https://brasil.angloamerican.com/~/media/Images/A/Anglo-American-Group-v9/Brazil/landing-signposts/carreiras/camilaPereira.jpg?h=612&iar=0&w=606',
      section: 'all',
    },
    {
      id: '5',
      name: 'Gatos adoção',
      message: 'Pode ser sim!',
      time: '07:08',
      unread: 0,
      image:
        'https://thumbs.dreamstime.com/b/close-up-da-menina-de-liitle-24928523.jpg',
      section: 'all',
    },
    {
      id: '6',
      name: 'Caes e gatos',
      message: 'Pode ser sim!',
      time: '07:08',
      unread: 0,
      image:
        'https://gente.globo.com/wp-content/uploads/2024/10/100257-gente-olhar-em-diversidades-pessoas-com-deficiencias.jpg',
      section: 'all',
    },
  ];

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'ongs', title: 'Ongs' },
    { key: 'servicos', title: 'Serviços' },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'ongs':
        return (
          <OngsScreen
            search={search}
            setSearch={setSearch}
            filteredData={filteredData}
            navigationRef={navigationRef}
          />
        );
      case 'servicos':
        return (
          <ServicosScreen
            search={search}
            setSearch={setSearch}
            filteredData={filteredData}
            navigationRef={navigationRef}
          />
        );
      default:
        return null;
    }
  };

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {routes.map((route, i) => (
        <TouchableOpacity
          key={route.key}
          style={[styles.tabButton, index === i && styles.activeTab]}
          onPress={() => setIndex(i)}>
          <Text style={[styles.tabLabel, index === i && styles.activeTabLabel]}>
            {route.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
    const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
  });

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
          <View style={styles.menu}>
            <Menu background="colorful" />
            <Image source={LogoBranca} style={styles.logo} />
          </View>

          {renderTabBar()}

          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={() => null}
          />

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: "JosefinSans_400Regular"
  },
  searchIcon: {
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 18,
    marginVertical: 10,
    color: '#888',
    fontFamily: "JosefinSans_700Bold"
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontFamily: "JosefinSans_700Bold"
  },
  message: {
    color: '#777',
    marginTop: width * 0.02,
    fontFamily: "JosefinSans_400Regular"
  },
  infoContainer: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
    fontFamily: "JosefinSans_400Regular"
  },
  unreadBadge: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 5,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: "JosefinSans_700Bold"
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primaryPurple,
  },
  menu: {
    height: width * 0.4,
    width: '100%',
    paddingHorizontal: width * 0.06,
    paddingTop: width * 0.08,
  },
  logo: {
    width: width * 0.15,
    height: width * 0.15,
    alignSelf: 'center',
    paddingHorizontal: width * 0.15,
    position: 'absolute',
  },
  tabBar: {
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabButton: {
    paddingHorizontal: width * 0.1,
    paddingVertical: width * 0.025,
    borderRadius: 10,
  },
  tabLabel: {
    color: COLORS.white,
    fontSize: width * 0.06,
    fontFamily: 'JosefinSans_400Regular',
  },
  activeTab: {
    backgroundColor: '#fbc14c',
  },
  activeTabLabel: {
    color: COLORS.offWhite,
    fontFamily: "JosefinSans_700Bold"
  },
  tabContent: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
    borderRadius: 40,
    padding: 20,
    width: '100%',
  },
});
