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
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import PetBackground from '../assets/FotosMeuPet/PetBackground.png';
import FotoPerfilBack from '../assets/FotosMeuPet/FotoPerfilBack.png';
import * as ImagePicker from "expo-image-picker";
import { usePet } from "../NavigationUser/PetContext";

import UploadCarteirinha from '../assets/FotosMeuPet/UploadCarteirinha.png';
import * as DocumentPicker from "expo-document-picker";

import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
} from '@expo-google-fonts/josefin-sans';
import { Nunito_700Bold, Nunito_400Regular } from '@expo-google-fonts/nunito';

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

export default function EditarMeuPet() {
  const navigation = useNavigation();
 const { petData, setPetData } = usePet();

const [nome, setNome] = useState(petData.nome);
const [idade, setIdade] = useState(petData.idade);
const [peso, setPeso] = useState(petData.peso);
const [cor, setCor] = useState(petData.cor);
const [raca, setRaca] = useState(petData.raca);
const [sexo, setSexo] = useState(petData.sexo);
const [especie, setEspecie] = useState(petData.especie);
const [image, setImage] = useState(petData.image || require('../assets/FotosMeuPet/UpdatePic.png'));
   
const pickImage = async ()=>{ 
let result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ['image'],
  allowsEditing: true, // provavelmente você quis dizer 'allowsEditing', não 'allowsEdition'
  aspect: [4, 3],
  quality: 1,
});
if (!result.canceled) {
  setImage(result.assets[0].uri);
}};

    const [modalVisible, setModalVisible] = useState(false);


  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView style={styles.scroll}>
      <SafeAreaView style={styles.container}>
        <View>
          <Image source={PetBackground} style={styles.petbackground} />

          <View style={styles.menuView}>
            <TouchableOpacity onPress={() => setModalVisible(true)}  style={styles.close}>
              <Feather name="x" size={width * 0.15} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: 'center' }}>
            <View style={styles.pictureView}>
              <Image source={FotoPerfilBack} style={styles.profilePicBack} />

              <TouchableOpacity onPress={pickImage}>
              <Image source={image} style={styles.profilePic} />
              </TouchableOpacity>

            </View>
          </View>
        </View>

    {/* MODAL */}
        <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          {/* Conteúdo do Modal: impede o fechamento ao clicar nele */}
          <Pressable onPress={(e) => e.stopPropagation()}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Deseja descartar suas alterações?</Text>
            <Text style={styles.modalText}>Esta ação não poderá ser desfeita e você perderá suas alterações.</Text>
            <TouchableOpacity
              style={styles.discardButton}
              onPress={() => navigation.navigate('MeuPetUser')}
            >
              <Text style={styles.discardButtonText} onPress={() => setModalVisible(false)}>
Continuar editando</Text>
            </TouchableOpacity>

             <TouchableOpacity
              style={styles.saveAltButton}   onPress={() => {
    setModalVisible(false); 
    navigation.navigate('MeuPetUser');
  }}>
              <Text style={styles.saveAltButtonText}>Descartar alterações</Text>
            </TouchableOpacity>
          </View>
        </View>
        </Pressable>
      </Pressable>
      </Modal>

        <View style={styles.formView}>
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome do pet</Text>
              <TextInput
                placeholder="Insira aqui"
                style={styles.input}
                value={nome}
                onChangeText={setNome}
              />
            </View>
            <View style={styles.inputContainerSmall}>
              <Text style={styles.label}>Idade</Text>
              <TextInput
                placeholder="Insira aqui"
                style={styles.input}
                value={idade}
                onChangeText={setIdade}
              />
            </View>
          </View>

          {/* Peso e Cor */}
          <View style={styles.row}>
            <View style={styles.inputContainerSmall}>
              <Text style={styles.label}>Peso</Text>
              <TextInput
                placeholder="Insira aqui"
                style={styles.input}
                value={peso}
                onChangeText={setPeso}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Cor</Text>
              <TextInput
                placeholder="Insira aqui"
                style={styles.input}
                value={cor}
                onChangeText={setCor}
              />
            </View>
          </View>

          {/* Raça */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Raça</Text>
            <TextInput
              placeholder="Insira aqui"
              style={styles.input}
              value={raca}
              onChangeText={setRaca}
            />
          </View>

          {/* Sexo e Espécie */}
          <View style={styles.row}>
            <View style={styles.radioGroup}>
              <Text style={styles.label}>Sexo</Text>
              <View style={styles.radioRow}>
                <RadioOption
                  label="Macho"
                  selected={sexo === 'Macho'}
                  onPress={() => setSexo('Macho')}
                />
                <RadioOption
                  label="Fêmea"
                  selected={sexo === 'Fêmea'}
                  onPress={() => setSexo('Fêmea')}
                />
              </View>
            </View>

            <View style={styles.radioGroup}>
              <Text style={styles.label}>Espécie</Text>
              <View style={styles.radioRow}>
                <RadioOption
                  label="Gato"
                  selected={especie === 'Gato'}
                  onPress={() => setEspecie('Gato')}
                />
                <RadioOption
                  label="Cachorro"
                  selected={especie === 'Cachorro'}
                  onPress={() => setEspecie('Cachorro')}
                />
              </View>
            </View>
          </View>

        <View style={styles.vacineView}>
            <Text style={styles.label}>Carteira de Vacinação</Text>
      <TouchableOpacity style={styles.button} >
        <Image source={UploadCarteirinha} style={styles.uploadCarteirinha}/>
      </TouchableOpacity>

            </View>

          {/* Botão Salvar */}
          <TouchableOpacity style={styles.saveButton} onPress={() => {setPetData({
      nome,
      idade,
      peso,
      cor,
      raca,
      sexo,
      especie,
      image,}); navigation.navigate('MeuPet');}}>
            <Text style={styles.saveText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

function RadioOption({ label, selected, onPress }) {
  return (
    <TouchableOpacity style={styles.radioOption} onPress={onPress}>
      <View
        style={[styles.radioCircle, selected && styles.radioCircleSelected]}
      />
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  close: {
    marginLeft: width * 0.05
  },
    modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    height: '100%'
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    marginBottom: 20,
    fontSize: 18,
    fontFamily: 'JosefinSans_400Regular',
    color: COLORS.blogTextGray

  },
    modalTitle: {
    marginBottom: 20,
    fontSize: width * 0.07,
    fontFamily: 'JosefinSans_700Bold',
    color: COLORS.darkGray
  },
  discardButton: {
    backgroundColor: COLORS.redHeart,
    paddingVertical: width * 0.05,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: width * 0.02, 
    width: '100%',
    alignItems: 'center',
  },
  discardButtonText: {
    color: "#fff",
    fontFamily: 'JosefinSans_700Bold',
    fontSize: width * 0.06,
  },
    saveAltButton: {
    paddingVertical: width * 0.05,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: width * 0.02, 
    width: '100%',
    borderColor: COLORS.blogTextGray,
    borderWidth: 1,
    alignItems: 'center',
  },
  saveAltButtonText: {
    color: COLORS.blogTextGray,
    fontFamily: 'JosefinSans_700Bold',
    fontSize: width * 0.06,
  },
  menuView: {
    height: width * 0.4,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
  },
  petbackground: {
    width: '100%',
    height: width * 0.8,
    position: 'absolute',
  },
  scroll: {
    flex: 1,
  },
  profilePic: {
    height: width * 0.55,
    width: width * 0.55,
    borderRadius: 800,
  },
  profilePicBack: {
    height: width * 0.56,
    width: width * 0.56,
    position: 'absolute',
  },
  pictureView: {
    alignItems: 'center',
    marginTop: width * 0.25,
    position: 'absolute',
  },
  formView: {
    marginTop: width * 0.85,
    marginHorizontal: width * 0.1
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
    },
  inputContainer: { 
    flex: 1, 
    marginVertical: 10, 
    marginRight: 10 
    },
  inputContainerSmall: { 
    flex: 0.7, 
    marginVertical: 10, 
    marginRight: 10 
    },
  label: { 
    fontSize: width * 0.05, 
    color: '#444', 
    marginBottom: 5,
    fontFamily: 'JosefinSans_400Regular',
    },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 15,
    elevation: 2,
    fontFamily: 'JosefinSans_400Regular',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    color: COLORS.blogTextGray,
  },
  radioGroup: { 
    flex: 1, 
    marginTop: 10 
    },
  radioRow: { 
    flexDirection: 'column', 
    marginTop: 5 
    },
  radioOption: { 
    alignItems: 'center', 
    marginRight: 15,
    flexDirection: 'row',
    marginTop: 4,
    },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 8,
  },
  radioCircleSelected: { 
    backgroundColor: '#FFAB36', 
    borderColor: '#FFAB36' 
    },
  radioLabel: { 
    fontSize: 16, 
    color: '#444',
    fontFamily: 'JosefinSans_400Regular', 
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#9156D1',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 20,
  },
  saveText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
    },
  vacineView: { 
    marginTop: 20,
  },
  uploadCarteirinha:{
    width: '95%',
    height: width * 0.2
  }
});
