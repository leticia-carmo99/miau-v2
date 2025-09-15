import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput
} from 'react-native';
import { useNavigation, DrawerActions, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Menu from '../NavigationUser/MenuV1';

const { width } = Dimensions.get('window');

const Colors = {
  primaryOrange: '#FFAB36',
  primaryPurple: '#9156D1',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  mediumGray: '#A0A0A0',
};

// --- Componente do Card de Animal (com imagem e barra de info) ---
const AnimalCard = ({ item, index, onPress }) => {
  const cardColor =
    index % 4 === 0 || index % 4 === 3
      ? Colors.primaryPurple
      : Colors.primaryOrange;

  return (
    <TouchableOpacity
      style={[
        styles.animalCard,
        { backgroundColor: cardColor, marginTop: index % 2 !== 0 ? 40 : 0 },
      ]}
       onPress={() => onPress(item)}
      activeOpacity={0.8}>
      
      {item.petImageUri ? (
        <Image source={item.petImageUri} style={styles.animalImage} />
      ) : (
        <View style={styles.animalImagePlaceholder} />
      )}
      
      <View style={styles.animalInfo}>
        <View>
          <Text style={styles.animalName}>{item.name}</Text>
          <Text style={styles.animalSubText}>{item.raca}</Text>
          <Text style={styles.animalSubText}>{item.age}</Text>
        </View>
        <View style={styles.genderIcon}>
          <Text style={styles.genderText}>
            {item.gender === 'Male' ? '♂' : '♀'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// --- Componente SearchLocation ---
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
  const [tipoAnimal, setTipoAnimal] = useState(tipoInicial || 'gato');

  // A lista de pets começa vazia
// A lista de pets começa já com alguns exemplos
const [pets, setPets] = useState([
  {
    id: "1",
    name: "Amora",
    raca: "Vira-lata",
    age: "2 anos",
    gender: "Female",
    type: "cao",
    petImageUri: require('../assets/FotosPerfisAnimais/Amora.png'),
  },
  {
    id: "2",
    name: "Thor",
    raca: "Pastor Alemão",
    age: "4 anos",
    gender: "Male",
    type: "cao",
    petImageUri: require('../assets/FotosPerfisAnimais/Amora.png'),
  },
  {
    id: "3",
    name: "Prado",
    raca: "Siamês",
    age: "1 ano",
    gender: "Female",
    type: "gato",
    petImageUri:  require('../assets/FotosPerfisAnimais/Prado.png'),
  },
  {
    id: "5",
    name: "Nina",
    raca: "Persa",
    age: "2 anos",
    gender: "Female",
    type: "gato",
    petImageUri: require('../assets/FotosPerfisAnimais/Prado.png')
  },
]);



  const currentData = pets.filter((pet) => pet.type === tipoAnimal);

const handleAnimalPress = (animal) => {
  if (animal.type === "gato") {
    navigation.navigate("PerfilGato", { pet: animal });
  } else if (animal.type === "cao") {
    navigation.navigate("PerfilCao", { pet: animal });
  }
};


  const themeColor =
    tipoAnimal === 'gato' ? Colors.primaryOrange : Colors.primaryPurple;
  const oppositeColor =
    tipoAnimal === 'gato' ? Colors.primaryPurple : Colors.primaryOrange;

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
              {tipoAnimal === 'gato' ? 'gatinho!' : 'cachorro!'}
            </Text>
          </View>
        </View>
      </View>

      <Image
        source={
          tipoAnimal === 'gato'
            ? require('../assets/FotosPerfisAnimais/GatoDeitado.png')
            : require('../assets/FotosPerfisAnimais/CachorroDeitado.png')
        }
        style={
          tipoAnimal === 'gato'
            ? styles.gatoHeaderImage
            : styles.cachorroHeaderImage
        }
        resizeMode="contain"
      />

      <View style={styles.contentContainer}>
        <FlatList
          data={currentData}
          renderItem={({ item, index }) => (
            <AnimalCard item={item} index={index} onPress={handleAnimalPress} />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContentContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Você ainda não adicionou nenhum pet para adoção
              </Text>
            </View>
          }
          ListHeaderComponent={
            <>
              <View style={styles.addNewButtonContainer}>

                <SearchLocation />

              </View>
              <View style={styles.animalSelector}>
                <TouchableOpacity
                  style={styles.selectorButton}
                  onPress={() => setTipoAnimal('cao')}
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
                      tipoAnimal === 'cao' && { color: Colors.primaryPurple },
                    ]}>
                    Cachorros
                  </Text>
                  {tipoAnimal === 'cao' && (
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
                  onPress={() => setTipoAnimal('gato')}
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
                      tipoAnimal === 'gato' && { color: Colors.primaryOrange },
                    ]}>
                    Gatos
                  </Text>
                  {tipoAnimal === 'gato' && (
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
});

export default Adote;

