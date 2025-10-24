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
  Flatlist,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from "../NavigationUser/UserContext";
import { usePet } from "../NavigationUser/PetContext";


import { doc, updateDoc } from 'firebase/firestore';
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
  // carregar fonts
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

const { userData, setUserData } = useUser(); // Pegue a função setUserData para atualizar o contexto
const { petData, isLoading: isPetsLoading } = usePet(); 
const userPets = petData ? [petData] : []; 

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

            <TouchableOpacity>
              <Text style={styles.previewTitle}>
                Luninha
              </Text>
            </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addButton}>
              <Ionicons
                name="add"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.addButtonText}>Adicionar Pet</Text>
            </TouchableOpacity>
          </ScrollView>
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
    height: '75%',
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
    fontSize: 20,
    fontWeight: 'bold',
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
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Nunito_700Bold', // aplicada fonte do botão
  },
});

export default EscolherPet;
