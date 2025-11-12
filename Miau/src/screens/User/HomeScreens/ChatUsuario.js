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
  ActivityIndicator, // Adicionado para indicar carregamento
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TabView } from 'react-native-tab-view';
import Menu from '../NavigationUser/MenuV1.js';
import { Feather } from '@expo/vector-icons';
import LogoBranca from '../assets/Logos/logobranca.png';
import { collection, where, onSnapshot, orderBy, query, getDocs, addDoc, doc, getDoc } from 'firebase/firestore'; // Adicionado doc e getDoc
import { db } from "../../../../firebaseConfig";
import { useUser } from "../NavigationUser/UserContext";

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

function useChats(uid, tipo) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = async (outroLadoId, chatTipo) => {
    let profileData = null;
    let targetCollection = null;
    let profileDocSnap = null;
    
    // Para 'prestador', checa prestador e empresa. Para 'ongs', checa só ongs.
    const collectionsToCheck = 
        chatTipo === 'ongs' ? ['ongs'] : 
        chatTipo === 'prestador' ? ['prestador', 'empresa'] : 
        [];
    
    for (const collectionName of collectionsToCheck) {
        try {
            targetCollection = collectionName;
            profileDocSnap = await getDoc(doc(db, targetCollection, outroLadoId));
            
            if (profileDocSnap.exists()) {
                profileData = profileDocSnap.data();
                break;
            }
        } catch (error) {
            // Se o getDoc falhar por permissão, logamos isso
            if (error.code === 'permission-denied') {
                console.error(
                    `ERRO DE PERMISSÃO AO LER PERFIL EM: ${targetCollection}/${outroLadoId}`
                );
                throw new Error(`Permissão negada em ${targetCollection}/${outroLadoId}`);
            }
            console.error(
                `Erro inesperado ao buscar ${targetCollection}/${outroLadoId}:`, error
            );
        }
    }
    
    if (profileData) {
      // ✅ CORREÇÃO DO NOME: Incluindo 'nomeOng' e removendo 'razaoSocial' se não usa
      const nome = profileData.nome || profileData.nomeOng || profileData.nomeFantasia || "Usuário Não Nomeado";
      const profileImageField = profileData.logoPerfil || profileData.foto || profileData.logo;
      const foto = profileImageField || 'https://placehold.co/150x150/FFAB36/FFFFFF?text=PET+CARE';
      
      return {
        outroLadoId,
        nomeOutroLado: nome,
        fotoOutroLado: foto,
        targetCollection: targetCollection,
      };
    }

    return {
      outroLadoId,
      nomeOutroLado: "Perfil Não Encontrado",
      fotoOutroLado: 'https://placehold.co/150x150/FF0000/FFFFFF?text=X',
      targetCollection: null,
    };
  };



  useEffect(() => {
    // 1. LOG INICIAL
    console.log(`[DEBUG CHAT] Tentando buscar chats. UID: ${uid}, Tipo: ${tipo}`); // <-- ALTERAÇÃO AQUI

    if (!uid) {
        setLoading(true);
        return;
    }

    const q = query(
      collection(db, "chat"),
      where("participantes", "array-contains", uid),
      where("tipo", "==", tipo), 
      orderBy("ultima_alz", "desc")
    );
    
    const fetchDataAndListen = () => {
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            setLoading(true);
            
            // 2. LOG DE RESULTADOS DA QUERY PRINCIPAL
            console.log(`[DEBUG CHAT] Query principal (chat) retornou: ${snapshot.size} documento(s) para o tipo: ${tipo}.`); // <-- ALTERAÇÃO AQUI
            
            if (snapshot.empty) {
                // Se a lista de chats estiver vazia, desliga o loading imediatamente
                setChats([]);
                setLoading(false);
                console.log(`[DEBUG CHAT] Lista de chats vazia para o tipo '${tipo}'.`);
                return;
            }

            const chatsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            
            const enrichedChats = await Promise.all(
                chatsData.map(async (chat) => {
                    const outroLadoId = chat.participantes.find(p => p !== uid);
                    
                    if (!outroLadoId) return null;
                    
                    try {
                        const profile = await fetchProfileData(outroLadoId, tipo);
                        
                        // 3. LOG DE ENRIQUECIMENTO BEM SUCEDIDO
                        console.log(`[DEBUG CHAT] Perfil de ${profile.nomeOutroLado} carregado da coleção: ${profile.targetCollection}.`); // <-- ALTERAÇÃO AQUI
                        
                        return {
                            ...chat,
                            ...profile
                        };
                        
                    } catch (error) {
                        console.error(`Falha ao processar chat ${chat.id}:`, error.message);
                        return {
                            ...chat,
                            outroLadoId: outroLadoId,
                            nomeOutroLado: "Erro de Regra (Permissão)",
                            fotoOutroLado: 'https://placehold.co/150x150/FF0000/FFFFFF?text=X',
                        };
                    }
                })
            );
            
            setChats(enrichedChats.filter(chat => chat !== null));
            setLoading(false); // Desativa o loading no final do processamento
        }, (error) => {
             console.error(`ERRO DE PERMISSÃO NA QUERY PRINCIPAL (collection: chat, tipo: ${tipo}):`, error.message);
             setLoading(false);
        });

        return unsubscribe;
    };
    
    return fetchDataAndListen();

  }, [uid, tipo]);

  return { chats, loading };
}


// ==========================================================
// 🎨 RENDER ITEM (MANTIDO E AJUSTADO PARA USAR AS NOVAS PROPS)
// ==========================================================
const renderItemFirebase = ({ item, navigationRef }) => {
    // Agora o 'item' já contém 'nomeOutroLado' e 'fotoOutroLado' enriquecidos
    const { 
        id, 
        nomeOutroLado, 
        fotoOutroLado, 
        ultima_msg, 
        ultima_alz, 
        naoLidas,
        outroLadoId // Novo campo para navegação
    } = item;
    
    // Lógica de formatação de hora
    let hora = "Não disponível";
    if (ultima_alz && ultima_alz.toDate) {
        hora = ultima_alz.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (typeof ultima_alz === 'string') {
        try {
            hora = new Date(ultima_alz).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            hora = "Data inválida";
        }
    }

    const nome = nomeOutroLado || "Conversa Desconhecida"; 
    // Usamos a URL de imagem fornecida, garantindo que seja um objeto {uri: ...}
    const avatarSource = { uri: fotoOutroLado || 'https://placehold.co/150x150/FFAB36/FFFFFF?text=PET' }; 
    const ultimaMensagem = ultima_msg || "Nenhuma mensagem..."; 
    const unread = naoLidas || 0;
    
  return (
    <TouchableOpacity
      style={styles.chatItem}
      // Passa o chatId e o targetUser (ID do outro lado)
      onPress={() =>
        navigationRef.navigate('ChatConversa', {
          chatId: id,
          targetUser: outroLadoId, // Adiciona o ID do outro lado para o ChatConversa
          targetName: nome,
        })
      }>
      <Image source={avatarSource} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{nome}</Text>
        <Text style={styles.message}>{ultimaMensagem}</Text>
      </View>
      <View style={styles.infoContainer}>
        {unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>
              {unread > 99 ? '99+' : unread}
            </Text>
          </View>
        )}
        <Text style={styles.time}>{hora}</Text>
      </View>
    </TouchableOpacity>
  );
};

// ==========================================================
// 🤝 TELAS DE TABS (AJUSTADAS PARA USAR O NOVO HOOK)
// ==========================================================

const OngsScreen = ({ search, setSearch, navigationRef }) => {
  const { userData } = useUser();
  const { chats, loading } = useChats(userData?.uid, "ongs");

  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  
  const filteredChats = chats.filter((item) =>
    item.nomeOutroLado?.toLowerCase().includes(search.toLowerCase())
  );
  
  if (loading) {
    return (
      <View style={[styles.tabContent, { justifyContent: 'center', alignItems: 'center', height: 200 }]}>
        <ActivityIndicator size="large" color={COLORS.primaryPurple} />
        <Text style={{ fontFamily: 'JosefinSans_400Regular', marginTop: 10 }}>Carregando conversas...</Text>
      </View>
    );
  }


  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.tabContent}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar"
              placeholderTextColor="#999"
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
            <Text style={styles.sectionTitle}>Conversas (ONGs)</Text>
            <FlatList
              data={search.trim() === '' ? chats : filteredChats}
              renderItem={({ item }) => renderItemFirebase({ item, navigationRef })}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              ListEmptyComponent={() => (
                <Text style={styles.emptyText}>Nenhuma conversa encontrada.</Text>
              )}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const ServicosScreen = ({ search, setSearch, navigationRef }) => { 
  const { userData } = useUser();
  // Usa o novo hook useChats
  const { chats, loading } = useChats(userData?.uid, "prestador");
  
  const filteredChats = chats.filter((item) =>
    item.nomeOutroLado?.toLowerCase().includes(search.toLowerCase())
  );
  
  if (loading) {
    return (
      <View style={[styles.tabContent, { justifyContent: 'center', alignItems: 'center', height: 200 }]}>
        <ActivityIndicator size="large" color={COLORS.primaryOrange} />
        <Text style={{ fontFamily: 'JosefinSans_400Regular', marginTop: 10 }}>Carregando conversas...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.tabContent}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar"
          placeholderTextColor="#999"
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

      <Text style={styles.sectionTitle}>Conversas (Serviços)</Text>
      <FlatList
        data={search.trim() === '' ? chats : filteredChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderItemFirebase({ item, navigationRef })}
        scrollEnabled={false}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>Nenhuma conversa encontrada.</Text>
        )}
      />
    </ScrollView>
  )
};


export default function ChatUsuario() {
  const navigationRef = useNavigation();
  const [search, setSearch] = useState(''); 
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'ongs', title: 'Ongs' },
    { key: 'prestador', title: 'Serviços' },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'ongs':
        return (
          <OngsScreen
            search={search}
            setSearch={setSearch}
            navigationRef={navigationRef}
          />
        );
      case 'prestador':
        return (
          <ServicosScreen
            search={search}
            setSearch={setSearch}
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
