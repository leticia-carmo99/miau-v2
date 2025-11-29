import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  Modal
} from 'react-native';
import { useNavigation, DrawerActions, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Menu from '../NavigationUser/MenuV1';
import { db } from "../../../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

const { width } = Dimensions.get('window');

const Colors = {
  primaryOrange: '#FFAB36',
  primaryPurple: '#9156D1',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  mediumGray: '#A0A0A0',
};

const AnimalCard = ({ item, index, onPress }) => {
  const cardColor =
    index % 4 === 0 || index % 4 === 3
      ? Colors.primaryPurple
      : Colors.primaryOrange;

  const petImageSource = typeof item.petImageUri === 'string' && item.petImageUri.startsWith('http') 
      ? { uri: item.petImageUri } 
      : item.petImageUri; 

  return (
    <TouchableOpacity
      style={[
        styles.animalCard,
        { backgroundColor: cardColor, marginTop: index % 2 !== 0 ? 40 : 0 },
      ]}
       onPress={() => onPress(item)}
      activeOpacity={0.8}>
      
      {petImageSource ? (
        <Image source={petImageSource} style={styles.animalImage} />
      ) : (
        <View style={styles.animalImagePlaceholder} />
      )}
      
      <View style={styles.animalInfo}>
        <View>
          <Text style={styles.animalName}>{item.nome}</Text>
          <Text style={styles.animalSubText}>{item.raca}</Text>
          <Text style={styles.animalSubText}>{item.idade}</Text>
        </View>
        <View style={styles.genderIcon}>
          <Text style={styles.genderText}>
            {item.sexo === 'Macho' ? '♂' : '♀'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SearchLocation = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [query, setQuery] = useState('');

  const locations = [
    'São Paulo, São Paulo',
    'Taboão da Serra, São Paulo',
    'Copacabana, Rio de Janeiro',
    'Maragogi, Alagoas',
  ];

  return (
    <View style={{ marginBottom: 25 }}>
      {!searchVisible ? (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: Colors.primaryPurple,
            borderRadius: 15,
            paddingHorizontal: 15,
            paddingVertical: 12,
          }}
          onPress={() => setSearchVisible(true)}
        >
          <Ionicons name="search-outline" size={20} color={Colors.white} />
          <Text style={{ color: Colors.white, marginLeft: 10 }}>Procure um amigo</Text>
          <Ionicons name="options-outline" size={20} color={Colors.white} />
        </TouchableOpacity>
      ) : (
        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: 15,
            padding: 15,
            elevation: 5,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity onPress={() => setSearchVisible(false)}>
              <Ionicons name="close-outline" size={24} color={Colors.primaryPurple} />
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Digite sua localização"
            value={query}
            onChangeText={setQuery}
            style={{
              borderWidth: 1,
              borderColor: Colors.lightGray,
              borderRadius: 10,
              paddingHorizontal: 15,
              paddingVertical: 10,
              marginBottom: 10,
            }}
          />
          {locations
            .filter((loc) => loc.toLowerCase().includes(query.toLowerCase()))
            .map((loc, idx) => (
              <TouchableOpacity key={idx} style={{ paddingVertical: 10 }}>
                <Text style={{ color: Colors.primaryPurple }}>{loc}</Text>
              </TouchableOpacity>
            ))}
        </View>
      )}
    </View>
  );
};


// --- Componente Principal da Tela ---
const Adote = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { tipoInicial } = route.params || {}; 
  const [tipoAnimal, setTipoAnimal] = useState(tipoInicial || 'Cachorro');
  const [pets, setPets] = useState([]); // Inicia com uma lista vazia
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [petIndisponivel, setPetIndisponivel] = useState(null);

  const fetchPets = async () => {
  setLoading(true);
  try {
    const petsCollection = collection(db, "petsong");
    const q = query(petsCollection, where("especie", "==", tipoAnimal));
    const querySnapshot = await getDocs(q);
    const fetchedPets = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        nome: data.nome,
        raca: data.raca,
        cor: data.cor,
        idade: data.idade ? `${data.idade} anos` : 'Idade N/A',
        gender: data.sexo || 'N/A',
        especie: data.especie || tipoAnimal, 
        petImageUri: data.petImageUrl || null, 
        ownerId: data.ownerId,
        descricao: data.descricao,
        informacoes: data.informacoes,
        porte: data.porte,
        status: data.status,
      };
    });

    setPets(fetchedPets);
  } catch (error) {
    console.error("Erro ao buscar pets:", error);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  fetchPets();
}, [tipoAnimal]);

const handleAnimalPress = (animal) => {
  if (animal.status && animal.status.toLowerCase() === "indisponivel") {
    setPetIndisponivel(animal);
    setModalVisible(true);
    return;
  }
  if (animal.especie === "Gato") {
    navigation.navigate("PerfilGatoUser", { pet: animal });
  } else if (animal.especie === "Cachorro") {
    navigation.navigate("PerfilCaoUser", { pet: animal });
  }
};


  const themeColor =
    tipoAnimal === 'Gato' ? Colors.primaryOrange : Colors.primaryPurple;
  const oppositeColor =
    tipoAnimal === 'Gato' ? Colors.primaryPurple : Colors.primaryOrange;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.headerBackground, { backgroundColor: themeColor }]}>
        <View style={styles.topNav}>
          <Menu background="colorful" />
        </View>

        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Ajude um</Text>
            <Text style={styles.headerSubtitle}>
              {tipoAnimal === 'Gato' ? 'gatinho!' : 'cachorro!'}
            </Text>
          </View>
        </View>
      </View>

      <Image
        source={
          tipoAnimal === 'Gato'
            ? require('../assets/FotosPerfisAnimais/GatoDeitado.png')
            : require('../assets/FotosPerfisAnimais/CachorroDeitado.png')
        }
        style={
          tipoAnimal === 'Gato'
            ? styles.gatoHeaderImage
            : styles.cachorroHeaderImage
        }
        resizeMode="contain"
      />

      <View style={styles.contentContainer}>
        <FlatList
          data={pets}
          renderItem={({ item, index }) => (
            <AnimalCard item={item} index={index} onPress={handleAnimalPress} />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContentContainer}
          ListEmptyComponent={
            loading ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Carregando animais...</Text>
                </View>
             ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    Não há animais disponíveis nesta região
                  </Text>
                </View>
             )
          }
          ListHeaderComponent={
            <>
              <View style={styles.addNewButtonContainer}>

                <SearchLocation />

              </View>
              <View style={styles.animalSelector}>
                <TouchableOpacity
                  style={styles.selectorButton}
                  onPress={() => setTipoAnimal('Cachorro')}
                  activeOpacity={0.7}>
                  <View
                    style={[
                      styles.animalIconContainer,
                      { backgroundColor: Colors.primaryPurple },
                    ]}>
                    <Image
                      source={require('../assets/FotosPerfisAnimais/Dog.png')}
                      style={[
                        styles.animalIconImage,
                        { tintColor: Colors.white },
                      ]}
                      resizeMode="contain"
                    />
                  </View>
                  <Text
                    style={[
                      styles.selectorText,
                      tipoAnimal === 'Cachorro' && { color: Colors.primaryPurple },
                    ]}>
                    Cachorros
                  </Text>
                  {tipoAnimal === 'Cachorro' && (
                    <View
                      style={[
                        styles.activeTabIndicator,
                        { backgroundColor: Colors.primaryPurple },
                      ]}
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.selectorButton}
                  onPress={() => setTipoAnimal('Gato')}
                  activeOpacity={0.7}>
                  <View
                    style={[
                      styles.animalIconContainer,
                      { backgroundColor: Colors.primaryOrange },
                    ]}>
                    <Image
                      source={require('../assets/FotosPerfisAnimais/Cat.png')}
                      style={[
                        styles.animalIconImage,
                        { tintColor: Colors.white },
                      ]}
                      resizeMode="contain"
                    />
                  </View>
                  <Text
                    style={[
                      styles.selectorText,
                      tipoAnimal === 'Gato' && { color: Colors.primaryOrange },
                    ]}>
                    Gatos
                  </Text>
                  {tipoAnimal === 'Gato' && (
                    <View
                      style={[
                        styles.activeTabIndicator,
                        { backgroundColor: Colors.primaryOrange },
                      ]}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </>
          }
        />
      </View>

      <Modal
        animationType="fade" // Efeito de esmaecimento suave
        transparent={true} // Fundo transparente para o modal flutuar
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Animal Indisponível</Text>
                <Text style={styles.modalText}>
                    O animal **{petIndisponivel?.name || 'este pet'}** não está mais disponível para adoção no momento.
                </Text>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: Colors.primaryPurple }]}
                    onPress={() => setModalVisible(false)}>
                    <Text style={styles.textStyle}>Entendi</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.white },
  headerBackground: { paddingBottom: 35 },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  navButton: { padding: 8 },
  profileButton: { padding: 3 },
  navIcon: { fontSize: 30, color: Colors.white },
  headerContent: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  headerTitle: { fontSize: 20, color: Colors.white },
  headerSubtitle: {
    fontSize: 26,
    fontWeight: 'bold',
    top: -10,
    color: Colors.white,
  },
  gatoHeaderImage: {
    position: 'absolute',
    zIndex: 2,
    width: 300,
    height: 125,
    right: -30,
    top: 75,
  },
  cachorroHeaderImage: {
    position: 'absolute',
    zIndex: 2,
    width: 225,
    height: 110,
    right: -2,
    top: 92,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -20,
  },
  listContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  addNewButtonContainer: { position: 'relative', marginBottom: 25 },
  addNewButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    elevation: 3,
  },
  addNewText: { color: Colors.white, fontSize: 16, fontWeight: '500' },
  plusIcon: {
    width: 50,
    height: 35,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -12,
    right: 0,
  },
  plusText: { color: Colors.white, fontSize: 24 },
  animalSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 20,
  },
  selectorButton: { alignItems: 'center', gap: 8 },
  animalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  animalIconImage: { width: 50, height: 50 },
  selectorText: { color: Colors.mediumGray, fontWeight: '600' },
  activeTabIndicator: {
    height: 4,
    width: '60%',
    borderRadius: 2,
    marginTop: -2,
  },
  row: { justifyContent: 'space-between' },
  animalCard: {
    width: width / 2 - 30,
    height: 220,
    borderRadius: 20,
    elevation: 5,
    padding: 10,
    marginBottom: 20,
  },
  animalImagePlaceholder: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    marginBottom: 10,
  },
  animalImage: {
    height: width * 0.35,
    width: width * 0.35,
    borderRadius: 15,
    marginBottom: 10,
  },
  animalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  animalName: { fontSize: 16, fontWeight: 'bold', color: Colors.white },
  animalSubText: { fontSize: 12, color: 'rgba(255, 255, 255, 0.9)' },
  genderIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderText: {
    color: Colors.white,
    fontSize: 35,
    fontWeight: 'bold',
    marginTop: -15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.mediumGray,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    opacity: 0.6,
  },
  centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escurecido
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        color: Colors.primaryPurple,
    },
    modalText: {
        marginBottom: 25,
        textAlign: 'center',
        fontSize: 14,
        color: Colors.mediumGray,
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default Adote;

