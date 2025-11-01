import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePet } from "../NavigationUser/PetContext";
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../NavigationUser/UserContext";

import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from "../../../../firebaseConfig"; 

const { width } = Dimensions.get('window');

// Importação das fontes (mesmas da outra tela)
import {
  useFonts as useNunitoFonts,
  Nunito_400Regular,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import {
  useFonts as useJosefinFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
  JosefinSans_300Light,
} from '@expo-google-fonts/josefin-sans';

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

const EscolherPet = ({ isVisible, onClose, onAddEvent, initialDate }) => {
  const navigation = useNavigation();
  const { userData } = useUser(); // Dados do usuário, incluindo o UID e petXId's
  const [userPets, setUserPets] = useState([]);
  const [isLoadingPets, setIsLoadingPets] = useState(false);
  const [nunitoFontsLoaded] = useNunitoFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  });
  const [josefinFontsLoaded] = useJosefinFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
    JosefinSans_300Light,
  });

  const renderPetItem = ({ item }) => (
  <TouchableOpacity style={styles.petCard} onPress={() => {
        onClose();
        navigation.navigate('MeuPetUser', { petId: item.id }); }}>
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
      </View>

    </TouchableOpacity>
  );

  const fetchUserPets = async () => {
    // Só busca se o modal estiver visível e se o userData estiver carregado e tiver um UID
    if (!userData || !userData.uid) {
      setUserPets([]);
      return;
    }
    setIsLoadingPets(true);
    try {
      const petsList = [];
      const userDocRef = doc(db, "usuarios", userData.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        
        let petCount = 1;
        let petIdKey = `pet${petCount}Id`;
        let petId = data[petIdKey];

        // Itera sobre pet1Id, pet2Id, pet3Id... até não encontrar mais um ID
        while(petId && petId.length > 0) { // Garante que o ID não é vazio ("")
            const petDocRef = doc(db, "pets", petId);
            const petDocSnap = await getDoc(petDocRef);

            if (petDocSnap.exists()) {
                petsList.push({ id: petId, ...petDocSnap.data() });
            }
            
            // Tenta buscar o próximo ID
            petCount++;
            petIdKey = `pet${petCount}Id`;
            petId = data[petIdKey]; 
        }
      }
      
      setUserPets(petsList);

    } catch (error) {
      console.error("Erro ao buscar a lista de pets:", error);
    } finally {
      setIsLoadingPets(false);
    }
  };

  useEffect(() => {
    if (isVisible && userData) {
      fetchUserPets();
    }
  }, [isVisible, userData]);

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            {/* Botão de voltar alinhado à esquerda */}
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#FFAB36" />
            </TouchableOpacity>

            {/* Container para o dia e o botão de calendário (agrupados) */}
            <View style={styles.dateAndButtonContainer}>
              <Text style={styles.modalTitle}>
                Escolha o perfil
              </Text>
            </View>

            {/* Espaçador invisível para centralizar o conteúdo do meio */}
            <View style={styles.backButton} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.previewSection}>

          <View style={styles.petsContentContainer}>
{isLoadingPets ? (
                <Text style={{ color: COLORS.mediumGray, marginTop: 20 }}>Carregando pets...</Text>
            ) : (
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
                      <Ionicons name="information-circle-outline" size={width * 0.1} color={COLORS.primaryPurple} />
                      <Text style={styles.noPetsText}>Nenhum pet adicionado ainda.</Text>
                      <Text style={styles.noPetsSubText}>Adicione seu primeiro pet para vê-lo aqui!</Text>
                    </View>
                  )}
                </View>
            )}
          </View>
            </View>

          </ScrollView>
          
            <TouchableOpacity style={styles.addButton} onPress={() => { onClose(); navigation.navigate('MeuPetUser', { petId: null });}}>
              <Ionicons
                name="add"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.addButtonText}>Adicionar Pet</Text>
            </TouchableOpacity>
        </View>
        
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white', // Fundo totalmente branco
    borderRadius: 20,
    width: width * 0.9,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: '55%',
  },
  scrollView: {
    width: '100%',
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  dateAndButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  modalTitle: {
    fontSize: 25,
    color: '#FFAB36',
    marginRight: 10,
    fontFamily: 'JosefinSans_700Bold', // aplicada fonte
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
  addButton: {
    backgroundColor: '#FFAB36',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 10,
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFAB36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    bottom: 0,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold', // aplicada fonte do botão
  },
  petsSectionBackgroundWrapper: {
    width: '100%',
    alignSelf: 'center',
    marginVertical: width * 0.1,
    backgroundColor: COLORS.darkerPurple,
    borderRadius: width * 0.18,
    paddingVertical: width * 0.02,
    position: 'relative',
  },
  petsContentContainer: {
    alignSelf: 'center',
    marginTop: width * 0.02,
  },
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
    height: width * 0.20,
    justifyContent: 'center',
    paddingHorizontal: width * 0.05,
  },
  petInfo:{
flexDirection: 'column'
  },
  petRow1: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-between',
    width: '90%'
  },
  petName: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: COLORS.primaryPurple,
    marginRight: width * 0.03
  },
  petDetailsRow: {
    flexDirection: 'row',
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
});

export default EscolherPet;
