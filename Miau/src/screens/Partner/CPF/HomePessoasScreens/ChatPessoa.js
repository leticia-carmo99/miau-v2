import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
} from '@expo-google-fonts/josefin-sans';

const { width } = Dimensions.get('window');

const HEADER_HEIGHT = 92;
const HEADER_SPACER = HEADER_HEIGHT + 8;

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
};

const conversationsData = [

  {
    id: '1',
    name: 'Juliana',
    message: 'Digitando...',
    time: '11:08',
    unread: 2,
    image: 'https://placehold.co/50x50/9156D1/FFFFFF?text=FS',
    section: 'recent',
  },
  {
    id: '2',
    name: 'Tainá',
    message: 'Posso ir buscar as 15h??',
    time: '10:55',
    unread: 1,
    image: 'https://placehold.co/50x50/FFAB36/FFFFFF?text=CA',
    section: 'recent',
  },
  {
    id: '3',
    name: 'Karina',
    message: 'O pet está bem?',
    time: '09:42',
    unread: 5,
    image: 'https://placehold.co/50x50/333333/FFFFFF?text=JP',
    section: 'recent',
  },
  {
    id: '4',
    name: 'Marcos Rocha',
    message: 'Pode ser sim!',
    time: 'Ontem',
    unread: 0,
    image: 'https://placehold.co/50x50/666666/FFFFFF?text=MR',
    section: 'all',
  },
];

const renderChatItem = ({ item, navigationRef }) => (
  <TouchableOpacity
    style={styles.chatItem}
    onPress={() => {
      navigationRef.navigate('ChatConversa', { user: item });
    }}>
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

const ListaConversas = ({
  search,
  setSearch,
  filteredData,
  navigationRef,
}) => {
  return (
    <View style={styles.tabContent}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar conversas"
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}>
        {search.trim() === '' ? (
          <>
            <Text style={styles.sectionTitle}>Conversas recentes</Text>
            <FlatList
              data={filteredData.filter((item) => item.section === 'recent')}
              renderItem={({ item }) =>
                renderChatItem({ item, navigationRef })
              }
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />

            <Text style={styles.sectionTitle}>Todas as conversas</Text>
            <FlatList
              data={filteredData.filter((item) => item.section === 'all')}
              renderItem={({ item }) =>
                renderChatItem({ item, navigationRef })
              }
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </>
        ) : (
          <FlatList
            data={filteredData}
            renderItem={({ item }) =>
              renderChatItem({ item, navigationRef })
            }
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Text style={styles.emptySearchText}>
                Nenhuma conversa encontrada
              </Text>
            }
          />
        )}
      </ScrollView>
    </View>
  );
};

export default function ChatPessoa() {
  const navigationRef = useNavigation();
  const [search, setSearch] = useState('');

  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
  });
  if (!fontsLoaded) return null;

  const filteredData = conversationsData.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        {/* Header fixo */}
        <View style={styles.fixedHeaderContainer}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() =>
                navigationRef.dispatch(DrawerActions.openDrawer())
              }>
              <Ionicons name="menu" size={30} color="white" />
            </TouchableOpacity>

            <View style={styles.logoWrapper}>
              <Image
                source={require('../Images/miAuPretoBranco.png')}
                style={styles.headerLogo}
                resizeMode="contain"
              />
            </View>

            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigationRef.navigate('PerfilPessoa')}>
              <Ionicons name="person-circle" size={40} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: HEADER_SPACER }} />

  
        <View style={styles.tabBar}>
          <View style={[styles.tabButton, styles.activeTab]}>
            <Text style={[styles.tabLabel, styles.activeTabLabel]}>
              Clientes
            </Text>
          </View>
        </View>

     
        <ListaConversas
          search={search}
          setSearch={setSearch}
          filteredData={filteredData}
          navigationRef={navigationRef}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.primaryPurple },

  fixedHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    zIndex: 20,
    justifyContent: 'center',
    paddingTop: 35,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: { padding: 8 },
  profileButton: { padding: 3 },
  logoWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerLogo: { width: 220, height: 72 },

  tabBar: {
    paddingBottom: 10,
    paddingTop: 6,
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'center', 
    backgroundColor: COLORS.primaryPurple,
  },
  tabButton: {
    paddingHorizontal: width * 0.08, 
    paddingVertical: width * 0.025,
    borderRadius: 20,
  },
  tabLabel: {
    color: COLORS.white,
    fontSize: width * 0.045,
    fontFamily: 'JosefinSans_400Regular',
  },
  activeTab: { 
    backgroundColor: COLORS.primaryOrange 
  },
  activeTabLabel: { 
    color: COLORS.white, 
    fontFamily: 'JosefinSans_700Bold' 
  },

  // Conteúdo
  tabContent: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    width: '100%',
  },

 
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'JosefinSans_400Regular',
  },
  searchIcon: { marginLeft: 10 },

  sectionTitle: {
    fontSize: 18,
    marginVertical: 10,
    color: '#888',
    fontFamily: 'JosefinSans_700Bold',
    paddingLeft: 5,
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
    backgroundColor: COLORS.lightPurple,
  },
  name: {
    fontSize: 16,
    fontFamily: 'JosefinSans_700Bold',
    color: COLORS.darkGray,
  },
  message: {
    color: COLORS.mediumGray,
    marginTop: 4,
    fontFamily: 'JosefinSans_400Regular',
  },
  infoContainer: { alignItems: 'flex-end' },
  time: {
    fontSize: 12,
    color: COLORS.mediumGray,
    marginTop: 4,
    fontFamily: 'JosefinSans_400Regular',
  },
  unreadBadge: {
    backgroundColor: '#E04242',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 5,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'JosefinSans_700Bold',
  },

  emptySearchText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: COLORS.mediumGray,
    fontFamily: 'JosefinSans_400Regular',
  },
});