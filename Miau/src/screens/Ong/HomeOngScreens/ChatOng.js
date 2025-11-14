import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  useWindowDimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { TabView } from 'react-native-tab-view';
import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
} from '@expo-google-fonts/josefin-sans';
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from "../../../../firebaseConfig";
import { useOng } from '../NavigationOng/OngContext';

import AddPosAdocao from '../Modal/AddPosAdocao'; 

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


function useOngChats(ongData) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ongData?.uid) {
      setLoading(false);
      return;
    }

    const chatsRef = collection(db, "chat");

    const q = query(
      chatsRef,
      where("participantes", "array-contains", ongData.uid),
      orderBy("ultima_alz", "desc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetched = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const chatId = docSnap.id;
        const outroId = data.participantes?.find((p) => p !== ongData.uid);

        let outroPerfil = null;

        if (outroId) {
          const colecoes = ["usuarios"];
          for (let col of colecoes) {
            const ref = doc(db, col, outroId);
            const snap = await getDoc(ref);
            if (snap.exists()) {
              outroPerfil = snap.data();
              break;
            }
          }
        }

const nome = data.nomeOutroLado || "Usuário";
const foto = data.fotoOutroLado || null;

let timeString = "...";

try {
  if (data.ultima_alz?.toDate) {
    // Caso seja Timestamp REAL
    timeString = data.ultima_alz.toDate().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (typeof data.ultima_alz === "string") {
    // Caso seja string → converte
    const date = new Date(data.ultima_alz);
    if (!isNaN(date.getTime())) {
      timeString = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }
} catch (e) {
  console.log("erro convertendo ultima_alz:", e);
}


        fetched.push({
          id: chatId,
          chatId,
          name: nome,
          image: foto,
          message: data.ultima_msg || "Sem mensagem",
          time: timeString,
          unread: data.naoLidas || 0,
          aba: data.aba || "para_adotar",
          outroId,
        });
      }

      setChats(fetched);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [ongData?.uid]);

  return { chats, loading };
}





const ConversasScreen = ({
  search,
  setSearch,
  filteredData,
  navigationRef,
  isPosAdocao,
  onAddPress,
}) => {

  if (isPosAdocao && (!filteredData || filteredData.length === 0)) {
    return (
      <View style={styles.tabContentEmpty}>
        <Text style={styles.emptyPosText}>
          Ainda não há conversas de pós-adoção
        </Text>
      </View>
    );
  }

  
  if (isPosAdocao && filteredData && filteredData.length > 0) {
    return (
      <View style={styles.tabContent}>
        <FlatList
          data={filteredData}
          renderItem={({ item, index }) =>
            renderChatItem({ item, index, navigationRef })
          }
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      </View>
    );
  }


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
              renderItem={({ item, index }) =>
                renderChatItem({ item, index, navigationRef })
              }
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />

            <Text style={styles.sectionTitle}>Todas as conversas</Text>
            <FlatList
              data={filteredData.filter((item) => item.section === 'all')}
              renderItem={({ item, index }) =>
                renderChatItem({
                  item,
                  index:
                    filteredData.filter((it) => it.section === 'recent')
                      .length + index,
                  navigationRef,
                })
              }
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </>
        ) : (
          <FlatList
            data={filteredData}
            renderItem={({ item, index }) =>
              renderChatItem({ item, index, navigationRef })
            }
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Text style={styles.emptySearchText}>
                Nenhuma conversa encontrada
              </Text>
            }
          />
        )}

        <View style={styles.endRow}>
          <View style={{ flex: 1 }} />
          <View style={styles.addRow}>
            <Text style={styles.addRowText}>
              adicionar conversa em pós adoção
            </Text>
            <TouchableOpacity
              style={styles.addRowButton}
              activeOpacity={0.8}
              onPress={onAddPress}>
              <Feather name="plus" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default function ChatOng() {
const navigationRef = useNavigation();


const { ongData } = useOng();
    const ongId = ongData?.uid;
const { chats: firebaseChats } = useOngChats(ongData);

    const [conversas, setConversas] = useState([]);

    useEffect(() => {
        if (firebaseChats.length > 0) {
            setConversas(firebaseChats);
        }
    }, [firebaseChats]);

  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);



  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'para_adotar', title: 'Para adotar' },
    { key: 'pos_adocao', title: 'Pós-adoção' },
  ]);

      const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
  });

  if (!fontsLoaded) return null;

const getFilteredByAba = (abaKey) => {
return conversas
  .filter((c) => {
if (abaKey === "para_adotar") return !c.aba || c.aba === "para_adotar";
return c.aba === "pos_adocao";
  })
  .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

    };

const handleAddToPosAdocao = (selecionadas) => {
        const ids = selecionadas.map((s) => s.id);
        setConversas((prev) =>
            prev.map((c) => (ids.includes(c.id) ? { ...c, aba: 'pos_adocao' } : c))
        );
        setModalVisible(false);
        setIndex(1);
    };

    const conversasParaAdotar = conversas.filter(
  (c) => !c.aba || c.aba === "para_adotar"
);

  const ConversasSceneWrapper = ({ isPosAdocao }) => {
    const dataForThisTab = isPosAdocao
      ? getFilteredByAba('pos_adocao')
      : getFilteredByAba('para_adotar');


    
    if (isPosAdocao && dataForThisTab.length === 0) {
      return (
        <View style={styles.tabContentEmpty}>
          <Text style={styles.emptyPosText}>
            Ainda não há conversas de pós-adoção
          </Text>
        </View>
      );
    }

   
    if (isPosAdocao && dataForThisTab.length > 0) {
      return (
        <View style={styles.tabContent}>
          <FlatList
            data={dataForThisTab}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) =>
              renderChatItem({ item, index, navigationRef })
            }
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        </View>
      );
    }

    
    return (
      <ConversasScreen
        search={search}
        setSearch={setSearch}
        filteredData={dataForThisTab}
        navigationRef={navigationRef}
        isPosAdocao={false}
        onAddPress={() => setModalVisible(true)}
      />
    );
  };


const renderChatItem = ({ item, index, navigationRef }) => (
  <TouchableOpacity
    style={styles.chatItem}
    onPress={() => {
        navigation.navigate("ChatConversa", {
        chatId: item.chatId,
        targetUser: item.outroId,
        targetName: item.name,
      })
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

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'para_adotar':
        return <ConversasSceneWrapper isPosAdocao={false} />;
      case 'pos_adocao':
        return <ConversasSceneWrapper isPosAdocao={true} />;
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
              <Feather name="menu" size={width * 0.12} color='#FFFFFF'/>
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
              onPress={() => navigationRef.navigate('PerfilOng')}>
              <Image source={require('../Images/foto-user-branco.png')} style={{ width: width * 0.12, height: width * 0.12, resizeMode: 'contain'}} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: HEADER_SPACER }} />

        {renderTabBar()}

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={() => null}
        />

        <AddPosAdocao
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          conversas={conversasParaAdotar}
          onAdd={handleAddToPosAdocao}
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
    justifyContent: 'space-around',
    backgroundColor: COLORS.primaryPurple,
  },
  tabButton: {
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.025,
    borderRadius: 20,
  },
  tabLabel: {
    color: COLORS.white,
    fontSize: width * 0.045,
    fontFamily: 'JosefinSans_400Regular',
  },
  activeTab: { backgroundColor: COLORS.primaryOrange },
  activeTabLabel: { color: COLORS.white, fontFamily: 'JosefinSans_700Bold' },

  tabContent: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    width: '100%',
  },
  tabContentEmpty: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPosText: {
    fontSize: 16,
    color: COLORS.mediumGray,
    fontFamily: 'JosefinSans_700Bold',
    textAlign: 'center',
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

  endRow: { marginTop: 18 },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  addRowText: {
    color: COLORS.mediumGray,
    fontFamily: 'JosefinSans_700Bold',
    marginRight: 8,
  },
  addRowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryOrange,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
    },
});
