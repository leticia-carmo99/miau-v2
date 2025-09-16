import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, StatusBar, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from "expo-image-picker"; 
import { useUser } from "../NavigationUser/UserContext";

// Firebase imports
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from "../../../../firebaseConfig"; 

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

const userPets = [
  { id: '1', name: 'Luninha', breed: 'Vira-Lata', age: '6 anos', gender: 'female', type: 'dog' },
  { id: '2', name: 'Mia', breed: 'Frajola', age: '4 anos', gender: 'female', type: 'cat' },
];

export default function PerfilUser() {
  const navigation = useNavigation();
  const { userData, setUserData } = useUser(); // Pegue a função setUserData para atualizar o contexto

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempImage, setTempImage] = useState(null);

  // Use useEffect para sincronizar os dados do contexto com o estado local
  useEffect(() => {
    if (userData) {
      setTempName(userData.nome || '');
      setTempImage(userData.profileImage ? { uri: userData.profileImage } : UserIcon);
    }
  }, [userData]); // Roda sempre que userData muda

  // Função para abrir a galeria e carregar a imagem
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      // Salva a URI local no estado temporário. O upload para o Firebase será na função saveChanges
      setTempImage({ uri: result.assets[0].uri });
    }
  };

  // Função para salvar as mudanças no Firebase e no Contexto
  const saveChanges = async () => {
    try {
      if (!userData || !userData.uid) {
        Alert.alert("Erro", "Usuário não autenticado. Tente fazer login novamente.");
        return;
      }

      const userDocRef = doc(db, "usuarios", userData.uid);
      const updates = {};

      // 1. Lógica para UPLOAD da imagem se ela foi alterada
      if (tempImage && tempImage.uri !== userData.profileImage) {
        // Pega a URI local da nova imagem
        const response = await fetch(tempImage.uri);
        const blob = await response.blob();
        
        // Cria uma referência para o local no Firebase Storage
        const storageRef = ref(storage, `profile_images/${userData.uid}`);
        
        // Faz o upload da imagem
        const uploadResult = await uploadBytes(storageRef, blob);
        
        // Pega a URL de download da imagem
        const newImageUrl = await getDownloadURL(uploadResult.ref);
        
        updates.profileImage = newImageUrl;
      }

      // 2. Lógica para ATUALIZAR o nome no Firestore se ele foi alterado
      if (tempName !== userData.nome) {
        updates.nome = tempName;
      }

      // 3. Atualiza o Firestore apenas se houverem mudanças
      if (Object.keys(updates).length > 0) {
        await updateDoc(userDocRef, updates);
        
        // Atualiza o contexto global com os novos dados
        setUserData({ ...userData, ...updates });

        Alert.alert("Sucesso!", "Seu perfil foi atualizado.");
      }
      
      setIsEditing(false); // Fecha o modal de edição

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
    <TouchableOpacity
      style={styles.petCard}
      onPress={() => navigation.navigate('PerfilPet', { petId: item.id })}
    >
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{item.name}</Text>
        <View style={styles.petDetailsRow}>
          <Text style={styles.petBreed}>{item.breed}</Text>
          <Text style={styles.petSeparator}> • </Text>
          <Text style={styles.petAge}>{item.age}</Text>
        </View>
      </View>
      <View style={styles.petIcons}>
        <Ionicons name={item.gender === 'female' ? 'female' : 'male'} size={width * 0.045} color={COLORS.primaryPurple} style={styles.genderIcon} />
        <Ionicons name="paw" size={width * 0.045} color={COLORS.primaryPurple} />
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
  if (!userData) {
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
            <Image source={{ uri: userData.profileImage }} style={styles.profileImageHeader} />
            <Text style={styles.userNameHeader}>{userData.nome}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editIcon}>
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>

        <View style={styles.userDetailsSection}>
          <Text style={styles.detailLabel}>E-mail</Text>
          <Text style={styles.detailValue}>{userData.email}</Text>
          <Text style={styles.detailLabel}>CPF</Text>
          <Text style={styles.detailValue}>{userData.cpf}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Favoritos</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Favoritos')}>
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
            {userPets.length > 0 ? (
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
    paddingTop: width * 0.08,
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
    fontSize: width * 0.07,
    fontFamily: 'JosefinSans_700Bold',
    color: COLORS.white,
    marginLeft: width * 0.06,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.petCardBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.petCardBorder,
    paddingVertical: width * 0.04,
    paddingHorizontal: width * 0.05,
    marginBottom: width * 0.03,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: width * 0.005,
  },
  petDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petBreed: {
    fontSize: width * 0.035,
    color: COLORS.mediumGray,
  },
  petSeparator: {
    fontSize: width * 0.035,
    color: COLORS.mediumGray,
    marginHorizontal: width * 0.01,
  },
  petAge: {
    fontSize: width * 0.035,
    color: COLORS.mediumGray,
  },
  petIcons: {
    flexDirection: 'row',
    alignItems: 'center',
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
    padding: 8,
    alignSelf: 'flex-end',
    margin: width * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editText: {
    width: width * 0.2,
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