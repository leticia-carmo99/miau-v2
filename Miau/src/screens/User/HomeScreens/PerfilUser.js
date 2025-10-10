import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, StatusBar, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from "expo-image-picker"; 
import { useUser } from "../NavigationUser/UserContext";
import { usePet } from "../NavigationUser/PetContext";

// Firebase imports
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from "../../../../firebaseConfig"; 

import UserIcon from '../assets/FotosInicial/foto-user-roxo.png'; 
import PetzLogo from '../assets/FotosInicial/petz.png'; 
import GatoRoxoImage from '../assets/FotosInicial/GatoRoxo.png';
import PatinhaBranca from '../assets/Logos/patinhabrancapreenchida.png';
import Back from '../assets/FotosInicial/Back.png';
import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
} from '@expo-google-fonts/josefin-sans';
import { Nunito_700Bold, Nunito_400Regular } from '@expo-google-fonts/nunito';

// cuidar disso depooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooois 
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Text strings must be rendered within a <Text> component.',
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation',
]);

const { width, height } = Dimensions.get('window');

const COLORS = {
  primaryOrange: '#FFAB36',
  primaryPurple: '#9156D1', 
  darkerPurple: '#7A49B1', 
  lightPurple: '#E6E6FA',
  white: '#FFFFFF',
  black: '#000000',
  darkGray: '#333333',
  mediumGray: '#666666',
  lightGray: '#999999',
  offWhite: '#f8f8f8',
  yellowStar: '#FFD700',
  redHeart: '#FF6347',
  petPurpleBackground: '#9156D1',
  petCardBackground: '#FFFFFF',
  petCardBorder: '#D1C4E9',
};

const favoritedEstablishments = [
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
    name: 'Petz',
    logo: PetzLogo,
    rating: 4.8,
    distance: '0.6 km',
    description: 'Tudo para seu pet, de ração a brinquedos.',
  },
];



export default function PerfilUser() {
  const navigation = useNavigation();
  const { userData, setUserData } = useUser(); // Pegue a função setUserData para atualizar o contexto
const { petData, isLoading: isPetsLoading } = usePet(); 
const userPets = petData ? [petData] : []; 

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempImage, setTempImage] = useState(null);
  const [tempTelephone, setTempTelephone] = useState(null);

  useEffect(() => {
    if (userData) {
      setTempName(userData.nome || '');
      setTempTelephone(userData.telefone || 'Nenhum telefone inserido ainda.');
      setTempImage(userData.profileImage ? { uri: userData.profileImage } : UserIcon);
    }
  }, [userData]); 

  // Função para abrir a galeria e carregar a imagem
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      // Salva a URI local no estado temporário. O upload para o Firebase será na função saveChanges
      setTempImage({ uri: result.assets[0].uri });
    }
  };

const saveChanges = async () => {
  try {
    if (!userData || !userData.uid) {
      Alert.alert("Erro", "Usuário não autenticado. Tente fazer login novamente.");
      return;
    }
    
    const userDocRef = doc(db, "usuarios", userData.uid);
    const updates = {};

    // 1. Atualizar Nome
    if (tempName !== userData.nome) {
      updates.nome = tempName;
    }

    // 2. Atualizar Telefone
    if (tempTelephone !== userData.telefone) {
      updates.telefone = tempTelephone;
    }

    // 3. **ATUALIZAR URI DA IMAGEM NO FIRESTORE (SEM FIREBASE STORAGE)**
    const newImageUri = tempImage && typeof tempImage.uri === 'string' ? tempImage.uri : null;
    
    // Verifica se a nova URI é diferente da armazenada (ou se uma URI foi recém-selecionada)
    if (newImageUri && newImageUri !== userData.profileImage) {
      updates.profileImage = newImageUri;
    }

    // Atualiza o Firestore apenas se houver mudanças em algum campo
    if (Object.keys(updates).length > 0) {
      await updateDoc(userDocRef, updates);
      
      // Atualiza o contexto global do usuário com os novos dados
      setUserData({ 
        ...userData, 
        ...updates,
        profileImage: updates.profileImage || userData.profileImage // Garante que a imagem no contexto é a URI salva
      });

      Alert.alert("Sucesso!", "Seu perfil foi atualizado.");
    } else {
      Alert.alert("Nenhuma mudança", "Nenhuma alteração foi feita no perfil.");
    }

    setIsEditing(false); // Close the modal
  } catch (error) {
    console.error("Erro ao salvar o perfil:", error);
    Alert.alert("Ops!", "Não foi possível salvar as alterações. Tente novamente.");
  }
};


  const renderFavoritedEstablishment = ({ item }) => (
    <TouchableOpacity
      style={styles.favoriteEstablishmentCard}
      onPress={() => navigation.navigate('VeterinarioDetalhes', { establishmentId: item.id })}
    >
      <View style={styles.favoriteEstablishmentLogoContainer}>
        <Image source={item.logo} style={styles.favoriteEstablishmentLogo} />
      </View>
      <View style={styles.favoriteEstablishmentInfo}>
        <Text style={styles.favoriteEstablishmentName}>{item.name}</Text>
        <View style={styles.favoriteEstablishmentRatingDistance}>
          <Ionicons name="star" size={width * 0.03} color={COLORS.yellowStar} />
          <Text style={styles.favoriteRatingText}>{item.rating}</Text>
          <Text style={styles.favoriteDistanceText}> • {item.distance}</Text>
        </View>
        <Text style={styles.favoriteEstablishmentDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderPetItem = ({ item }) => (
  <TouchableOpacity style={styles.petCard} onPress={() => navigation.navigate('MeuPet', { petId: item.id })}>
      <View style={styles.petInfo}>
  <View style={styles.petRow1}>
        <Text style={styles.petName}>{item.nome}</Text> 
      <View style={styles.petIcons}>
        <Ionicons 
          name={item.sexo === 'Fêmea' ? 'female' : 'male'} 
          size={width * 0.07} 
          color={COLORS.primaryPurple} 
          style={styles.genderIcon} 
        />
        <Ionicons name="paw" size={width * 0.07} color={COLORS.primaryPurple} />
      </View>
</View>
        <View style={styles.petDetailsRow}>
          <Text style={styles.petBreed}>{item.raca}</Text> 
          <Text style={styles.petSeparator}> • </Text>
          <Text style={styles.petAge}>{item.idade} anos</Text> 
        </View>
      </View>

    </TouchableOpacity>
  );

  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  // Se userData ainda não foi carregado, mostre um indicador de carregamento
if (!userData || isPetsLoading) { 
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.loadingContainer}>
        <Text>Carregando perfil...</Text>
      </View>
    </SafeAreaView>
  );
}

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.topPurpleSection}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}>
              <Image source={Back} style={styles.back}/>
            </TouchableOpacity>
            <Image source={PatinhaBranca} style={styles.patinha}/>
          </View>
          <View style={styles.profileInfoContainer}>
            <Image source={tempImage && typeof tempImage.uri === 'string' ? { uri: tempImage.uri } : UserIcon} style={styles.profileImageHeader} />
            <Text style={styles.userNameHeader}>{userData.nome}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editIcon}>
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>

        <View style={styles.userDetailsSection}>
          <Text style={styles.detailLabel}>E-mail</Text>
          <Text style={styles.detailValue}>{userData.email}</Text>
          <Text style={styles.detailLabel}>Telefone</Text>
          <Text style={styles.detailValue}>{userData.telefone}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Favoritos</Text>
            <TouchableOpacity onPress={() => navigation.navigate('FavoritosUser')}>
              <Text style={styles.seeMoreText}>Ver mais</Text>
            </TouchableOpacity>
          </View>
          {favoritedEstablishments.length > 0 ? (
            <FlatList
              data={favoritedEstablishments}
              renderItem={renderFavoritedEstablishment}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.favoritesListContent}
            />
          ) : (
            <View style={styles.noFavoritesContainer}>
              <Text style={styles.noFavoritesText}>Nenhum favorito adicionado ainda.</Text>
            </View>
          )}
        </View>

        <Image source={GatoRoxoImage} style={styles.gatoRoxoImageStandalone} />

        <View style={styles.petsSectionBackgroundWrapper}>
          <View style={styles.petsContentContainer}>
            {userPets && userPets.length > 0 ? (
              <FlatList
                data={userPets} 
                renderItem={renderPetItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.petsListContent}
              />
            ) : (
              <View style={styles.noPetsContainer}>
                <Ionicons name="information-circle-outline" size={width * 0.1} color={COLORS.white} />
                <Text style={styles.noPetsText}>Nenhum pet adicionado ainda.</Text>
                <Text style={styles.noPetsSubText}>Adicione seu primeiro pet para vê-lo aqui!</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Modal de Edição */}
      <Modal visible={isEditing} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <TouchableOpacity onPress={pickImage}>
              <Image 
                source={tempImage} 
                style={styles.modalProfileImage} 
              />
              <Text style={styles.changePhotoText}>Alterar Foto</Text>
            </TouchableOpacity>

            <TextInput
              value={tempName}
              onChangeText={setTempName}
              style={styles.input}
              placeholder="Digite seu nome"
            />

            <TextInput
              value={tempTelephone}
              onChangeText={setTempTelephone}
              style={styles.input}
              placeholder="Digite seu telefone"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveChanges} style={styles.saveButton}>
                <Text style={styles.saveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.offWhite },
  scrollView: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topPurpleSection: {
    backgroundColor: COLORS.primaryPurple,
    paddingTop: StatusBar.currentHeight || 0,
    paddingBottom: width * 0.15,
    alignItems: 'flex-start',
    position: 'relative',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: width * 0.025,
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: width * 0.03,
    paddingTop: width * 0.03,
  },
  back: {
    height: width * 0.08,
    width: width * 0.08,
    padding: width * 0.08,
  },
  patinha: {
    width: width * 0.12,
    height: width * 0.12,
    padding: width * 0.05,
    paddingHorizontal: width * 0.08,
  },
  profileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: -width * 0.1,
    left: width * 0.15,
    zIndex: 1,
  },
  profileImageHeader: {
    width: width * 0.28,
    height: width * 0.28,
    borderRadius: (width * 0.28) / 2,
    borderWidth: 0,
    backgroundColor: COLORS.white,
    resizeMode: 'cover',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  userNameHeader: {
    fontSize: width * 0.09,
    fontFamily: 'JosefinSans_700Bold',
    color: COLORS.white,
    marginLeft: width * 0.06,
    marginBottom: width * 0.05
  },
  userDetailsSection: {
    paddingHorizontal: width * 0.08,
    marginTop: width * 0.05,
    marginBottom: width * 0.05,
  },
  detailLabel: {
    fontSize: width * 0.06,
    color: COLORS.darkGray,
    marginBottom: width * 0.01,
    fontFamily: 'Nunito_700Bold',
  },
  detailValue: {
    fontSize: width * 0.045,
    fontFamily: 'Nunito_400Regular',
    color: COLORS.mediumGray,
    marginBottom: width * 0.03,
  },
  section: {
    marginTop: width * 0.05,
    paddingHorizontal: width * 0.08,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: width * 0.04,
  },
  sectionTitle: {
    fontSize: width * 0.06,
    fontFamily: 'Nunito_700Bold',
    color: COLORS.darkGray,
  },
  seeMoreText: {
    fontSize: width * 0.05,
    color: COLORS.mediumGray,
    fontFamily: 'Nunito_400Regular',
  },
  favoritesListContent: {
    paddingRight: width * 0.08,
    paddingVertical: width * 0.05,
  },
  favoriteEstablishmentCard: {
    width: width * 0.4,
    height: width * 0.55,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginRight: width * 0.04,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  favoriteEstablishmentLogoContainer: {
    width: '100%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: width * 0.01,
  },
  favoriteEstablishmentLogo: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain',
  },
  favoriteEstablishmentInfo: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: width * 0.025,
    paddingVertical: width * 0.015,
  },
  favoriteEstablishmentName: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: width * 0.005,
  },
  favoriteEstablishmentRatingDistance: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: width * 0.005,
  },
  favoriteRatingText: {
    fontSize: width * 0.028,
    color: COLORS.yellowStar,
    marginLeft: width * 0.005,
  },
  favoriteDistanceText: {
    fontSize: width * 0.028,
    color: COLORS.mediumGray,
  },
  favoriteEstablishmentDescription: {
    fontSize: width * 0.025,
    color: COLORS.lightGray,
    textAlign: 'left',
  },
  noFavoritesContainer: {
    alignItems: 'center',
    paddingVertical: width * 0.05,
  },
  noFavoritesText: {
    fontSize: width * 0.04,
    color: COLORS.mediumGray,
  },
  gatoRoxoImageStandalone: {
    width: width * 0.7,
    height: width * 0.7,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: width * 0.05,
    marginBottom: -width * 0.19,
    zIndex: 2,
  },
  petsSectionBackgroundWrapper: {
    width: '100%',
    alignSelf: 'center',
    marginTop: -width * 0.15,
    marginBottom: width * 0.1,
    backgroundColor: COLORS.darkerPurple,
    borderRadius: width * 0.18,
    paddingTop: width * 0.08,
    paddingBottom: width * 0.08,
    position: 'relative',
  },
  petsContentContainer: {
    width: '80%',
    alignSelf: 'center',
    marginTop: width * 0.02,
    paddingVertical: width * 0.02,
  },
  petsListContent: {},
  petCard: {
    backgroundColor: COLORS.petCardBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.petCardBorder,
    marginBottom: width * 0.03,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    height: width * 0.25,
    justifyContent: 'center',
    paddingTop: width * 0.01,
    paddingHorizontal: width * 0.1
  },
  petInfo:{
flexDirection: 'column'
  },
  petRow1: {
flexDirection: 'row',
alignItems: 'center',
  },
  petName: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginRight: width * 0.03
  },
  petDetailsRow: {
    flexDirection: 'row',
  },
  petBreed: {
    fontSize: width * 0.04,
    color: COLORS.mediumGray,
  },
  petSeparator: {
    fontSize: width * 0.04,
    color: COLORS.mediumGray,
    marginHorizontal: 1,
  },
  petAge: {
    fontSize: width * 0.04,
    color: COLORS.mediumGray,
  },
  petIcons: {
    flexDirection: 'row',
  },
  genderIcon: {
    marginRight: width * 0.02,
  },
  noPetsContainer: {
    alignItems: 'center',
    paddingVertical: width * 0.1,
  },
  noPetsText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: width * 0.03,
    textAlign: 'center',
  },
  noPetsSubText: {
    fontSize: width * 0.04,
    color: COLORS.white,
    marginTop: width * 0.01,
    textAlign: 'center',
    opacity: 0.8,
  },
  editIcon: {
    backgroundColor: COLORS.primaryOrange,
    borderRadius: 20,
    padding: 12,
    alignSelf: 'flex-end',
    margin: width * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editText: {
    height: width * 0.06,
    color: COLORS.white,
    fontFamily: 'Nunito_700Bold',
    fontSize: width * 0.045,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    width: "85%",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  modalProfileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 8 },
  changePhotoText: { color: COLORS.primaryPurple, marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.mediumGray,
    borderRadius: 8,
    padding: 10,
    width: "100%",
    marginBottom: 20,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  cancelButton: { padding: 12 },
  cancelText: { color: COLORS.mediumGray },
  saveButton: {
    padding: 12,
    backgroundColor: COLORS.primaryPurple,
    borderRadius: 8,
  },
  saveText: { color: COLORS.white, fontWeight: "bold" },
});