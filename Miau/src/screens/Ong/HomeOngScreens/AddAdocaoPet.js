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
} from 'react-native';
import { useNavigation, DrawerActions, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

import { useFonts } from 'expo-font';
import {
  JosefinSans_400Regular,
  JosefinSans_700Bold,
  JosefinSans_300Light,
} from '@expo-google-fonts/josefin-sans';
import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';

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

  return (
    <TouchableOpacity
      style={[
        styles.animalCard,
        { backgroundColor: cardColor, marginTop: index % 2 !== 0 ? 20 : 0 },
      ]}
      onPress={() => onPress(item)}
      activeOpacity={0.8}>
      {item.petImageUri ? (
        <Image source={{ uri: item.petImageUri }} style={styles.animalImage} />
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

const AddAdocaoPet = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { tipoInicial } = route.params || {};
  const [tipoAnimal, setTipoAnimal] = useState(tipoInicial || 'gato');


  const [pets, setPets] = useState([]);
  const currentData = pets.filter((pet) => pet.type === tipoAnimal);

  const handleAnimalPress = (animal) => {
    navigation.navigate('PerfilAdocaoPet', { pet: animal });
  };

  const handleAddPet = () => {
    navigation.navigate('FormularioAdocao', {
      tipoAnimal,
      onGoBack: (novoPet) => {
        setPets((currentPets) => [...currentPets, novoPet]);
      },
    });
  };

  const themeColor =
    tipoAnimal === 'gato' ? Colors.primaryOrange : Colors.primaryPurple;


  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
    JosefinSans_300Light,
    Nunito_400Regular,
    Nunito_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.headerBackground, { backgroundColor: themeColor }]}>
        <View style={styles.topNav}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Feather name="menu" size={width * 0.12} color='#FFFFFF'/>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('PerfilOng')}>
            <Image source={require('../Images/foto-user-branco.png')} style={{ width: width * 0.12, height: width * 0.12, resizeMode: 'contain',}} />
          </TouchableOpacity>
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
            ? require('../Images/GatoDeitado.png')
            : require('../Images/CachorroDeitado.png')
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
              <Image
                source={require('../Images/LogoMini.png')}
                style={styles.emptyImage}
              />
            </View>
          }
          ListHeaderComponent={
            <>
              <View style={styles.addNewButtonContainer}>
                <TouchableOpacity
                  style={[styles.addNewButton, { backgroundColor: Colors.primaryPurple }]}
                  activeOpacity={0.8}
                  onPress={handleAddPet}>
                  <Text style={styles.addNewText}>Adicione um pet para adoção</Text>
                  <Text style={styles.addNewButtonPlus}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.animalSelector}>
                {/* Botão Cachorro */}
                <TouchableOpacity
                  style={styles.selectorButton}
                  onPress={() => setTipoAnimal('cao')}
                  activeOpacity={1}>
                  <View
                    style={[styles.animalIconContainer, { backgroundColor: Colors.primaryPurple }]}>
                    <Image
                      source={require('../Images/Dog.png')}
                      style={[styles.animalIconImage, { tintColor: Colors.white }]}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={[styles.selectorText, { color: Colors.primaryPurple }]}>
                    Cachorros
                  </Text>
                  {tipoAnimal === 'cao' && (
                    <View
                      style={[styles.activeTabIndicator, { backgroundColor: Colors.primaryPurple }]}
                    />
                  )}
                </TouchableOpacity>

                {/* Botão Gato */}
                <TouchableOpacity
                  style={styles.selectorButton}
                  onPress={() => setTipoAnimal('gato')}
                  activeOpacity={1}>
                  <View
                    style={[styles.animalIconContainer, { backgroundColor: Colors.primaryOrange }]}>
                    <Image
                      source={require('../Images/Cat.png')}
                      style={[styles.animalIconImage, { tintColor: Colors.white }]}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={[styles.selectorText, { color: Colors.primaryOrange }]}>
                    Gatos
                  </Text>
                  {tipoAnimal === 'gato' && (
                    <View
                      style={[styles.activeTabIndicator, { backgroundColor: Colors.primaryOrange }]}
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
    paddingTop: 35,
  },
  navButton: { padding: 8 },
  profileButton: { padding: 3 },
  headerContent: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    color: Colors.white,
    fontFamily: 'JosefinSans_700Bold',
  },
  headerSubtitle: {
    fontSize: 26,
    fontWeight: 'bold',
    top: -8,
    color: Colors.white,
    fontFamily: 'JosefinSans_700Bold',
  },
  gatoHeaderImage: {
    position: 'absolute',
    zIndex: 2,
    width: 300,
    height: 125,
    right: -30,
    top: 85,
  },
  cachorroHeaderImage: {
    position: 'absolute',
    zIndex: 2,
    width: 225,
    height: 110,
    right: -2,
    top: 95,
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
  addNewButtonContainer: { marginBottom: 25 },
  addNewButton: {
    height: 56,
    paddingHorizontal: 20,
    borderRadius: 15,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 72,
  },
  addNewText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'JosefinSans_700Bold',
  },
  addNewButtonPlus: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -16 }],
    fontSize: 32,
    color: Colors.white,
    fontFamily: 'JosefinSans_700Bold',
    includeFontPadding: false,
    textAlign: 'center',
    width: 34,
    height: 34,
    lineHeight: 34,
  },
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
  selectorText: {
    color: Colors.mediumGray,
    fontWeight: '600',
    fontFamily: 'JosefinSans_400Regular',
  },
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
  animalImage: { flex: 1, borderRadius: 15, marginBottom: 10 },
  animalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  animalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    fontFamily: 'JosefinSans_700Bold',
  },
  animalSubText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Nunito_400Regular',
  },
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
    fontFamily: 'JosefinSans_400Regular',
  },
  emptyImage: { width: 80, height: 80, resizeMode: 'contain', opacity: 0.6 },
});

export default AddAdocaoPet;
