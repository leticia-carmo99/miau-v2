import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { PersonContext } from "../NavigationPessoa/PersonContext";


import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
  JosefinSans_300Light,
} from '@expo-google-fonts/josefin-sans';
import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import Menu from '../NavigationPessoa/Menu';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primaryPurple: '#9156D1',
  textPrimary: '#737373',
  textSecondary: '#737373',
  background: '#FFFFFF',
  white: '#FFFFFF',
  headerOverlay: 'rgba(0, 0, 0, 0.4)',
  divider: '#E0E0E0',
  timeInputBackground: '#E5E5E5',
  orange: '#FFAB36',
  saveButton: '#6A0DAD',
  cancelButton: '#BDBDBD',
  modalBackground: 'rgba(0, 0, 0, 0.8)',
};

const Checkbox = ({ label, isSelected, onValueChange }) => (
  <TouchableOpacity style={styles.checkboxContainer} onPress={onValueChange}>
    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
      {isSelected && (
        <Ionicons name="checkmark" size={16} color={COLORS.white} />
      )}
    </View>
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function PerfilPessoa() {
  const navigation = useNavigation();
    const { personData, setPersonData } = useContext(PersonContext); 
  const [isEditing, setIsEditing] = useState(false);
  const [initialPersonData, setInitialPersonData] = useState({});

  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
    JosefinSans_300Light,
    Nunito_400Regular,
    Nunito_700Bold,
  });

  const [timeError, setTimeError] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchedData = {
      nome: 'Nicolas',
      localizacao: 'Jardim das Esmeraldas, SP',
      role: 'Adestrador',
      sobre:
        'Aqui na nossa petshop, você encontra tudo para o bem-estar do seu pet: alimentação de qualidade, acessórios, medicamentos, banho e tosa. Também apoiamos a adoção responsável...',
      diasAbertos: {
        segunda: true,
        terca: true,
        quarta: true,
        quinta: true,
        sexta: true,
        sabado: true,
        domingo: true,
      },
      horarioInicio: '08:00',
      horarioFim: '22:00',
      email: 'petscantato@gmail.com',
      telefone: '+55 11 99262-4521',
      instagram: '@petx.official',
      facebook: '@oficialpetz',
      headerImage: require('../Images/FundoCao.png'),
      profileImage: require('../Images/Perfil.png'),
    };
  setPersonData(fetchedData);
}, []);

  
  const openImageModal = (image) => {
    setSelectedImage(image);
    setIsModalVisible(true);
  };
  const closeImageModal = () => {
    setIsModalVisible(false);
    setSelectedImage(null);
  };

  
  const pickImage = async (imageType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: imageType === 'headerImage' ? [16, 9] : [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImageUri = result.assets[0].uri;
      handleInputChange(imageType, { uri: newImageUri });
    }
  };

 
  const validateTime = (time) => {
    if (!/^\d{2}:\d{2}$/.test(time)) return false;
    const [hours, minutes] = time.split(':').map(Number);
    return !(isNaN(hours) || isNaN(minutes) || hours > 23 || minutes > 59);
  };

  const handleTimeChange = (field, value) => {
    let formatted = value.replace(/[^0-9]/g, '');
    if (formatted.length > 2) {
      formatted = formatted.slice(0, 2) + ':' + formatted.slice(2, 4);
    }
    handleInputChange(field, formatted);
    if (formatted.length === 5 && !validateTime(formatted)) {
      setTimeError('Horário inválido. Use HH:MM.');
    } else {
      setTimeError('');
    }
  };

  const handleSaveChanges = () => {
    if (timeError) {
      Alert.alert('Erro', 'Por favor, corrija o formato do horário.');
      return;
    }
    setInitialPersonData(personData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setPersonData(initialPersonData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setPersonData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (day) => {
    setPersonData((prev) => ({
      ...prev,
      diasAbertos: { ...prev.diasAbertos, [day]: !prev.diasAbertos[day] },
    }));
  };

  const renderImageSource = (source) => {
    return typeof source === 'string' ? { uri: source } : source;
  };


  const formatOpenDays = () => {
    const days = [
      { key: 'segunda', short: 'Seg' },
      { key: 'terca', short: 'Ter' },
      { key: 'quarta', short: 'Qua' },
      { key: 'quinta', short: 'Qui' },
      { key: 'sexta', short: 'Sex' },
      { key: 'sabado', short: 'Sáb' },
      { key: 'domingo', short: 'Dom' },
    ];
    const openDays = days.filter((day) => personData.diasAbertos[day.key]);
    if (openDays.length === 0) return 'Fechado';
    if (openDays.length === 7) return 'Seg. a Dom.';
    if (
      personData.diasAbertos.segunda &&
      personData.diasAbertos.terca &&
      personData.diasAbertos.quarta &&
      personData.diasAbertos.quinta &&
      personData.diasAbertos.sexta &&
      openDays.length === 5
    ) {
      return 'Seg. a Sex.';
    }
    return openDays.map((day) => day.short).join(', ');
  };
  
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeImageModal}>
            <Ionicons name="close" size={35} color={COLORS.white} />
          </TouchableOpacity>
          <Image
            source={renderImageSource(selectedImage)}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </View>
      </Modal>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        <ImageBackground
          source={renderImageSource(personData.headerImage)} 
          style={styles.headerBackground}>
          <View style={styles.headerOverlay} />
              <View style={styles.menu}>
          <Menu background="colorful" />
        </View>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => openImageModal(personData.profileImage)}>
              <Image source={renderImageSource(personData.profileImage)} style={styles.profileLogo} />
            </TouchableOpacity>
            <Text style={styles.profileNameHeader}>{personData.nome}</Text>
            <Text style={styles.profileLocation}>{personData.localizacao}</Text>
          </View>
        </ImageBackground>

        {isEditing ? (
          
          <View style={styles.container}>
            {/* ... (Todo o seu modo de edição permanece o mesmo) ... */}
            <View style={styles.editHeader}>
              <View style={styles.editPhotoButtons}>
                <TouchableOpacity
                  onPress={() => pickImage('headerImage')}
                  style={styles.photoEditButton}>
                  <Text style={styles.photoEditButtonText}>Trocar Fundo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => pickImage('profileImage')}
                  style={styles.photoEditButton}>
                  <Text style={styles.photoEditButtonText}>Trocar Foto</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.mainActionButtons}>
                <TouchableOpacity
                  onPress={handleCancelEdit}
                  style={[styles.editButton, styles.cancelButton]}>
                  <Text style={styles.editButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveChanges}
                  style={[styles.editButton, styles.saveButton]}>
                  <Text style={styles.editButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.sectionTitle}>SOBRE</Text>
            
            <Text style={styles.editLabel}>Função (Ex: Adestrador)</Text>
            <TextInput
              style={styles.textInput}
              value={personData.role}
              onChangeText={(text) => handleInputChange('role', text)}
            />

            <Text style={styles.editLabel}>Dias de atendimento</Text>
            <View style={styles.checkboxGroup}>
              <Checkbox label="Segunda" isSelected={personData.diasAbertos.segunda} onValueChange={() => handleCheckboxChange('segunda')} />
              <Checkbox label="Terça" isSelected={personData.diasAbertos.terca} onValueChange={() => handleCheckboxChange('terca')} />
              <Checkbox label="Quarta" isSelected={personData.diasAbertos.quarta} onValueChange={() => handleCheckboxChange('quarta')} />
              <Checkbox label="Quinta" isSelected={personData.diasAbertos.quinta} onValueChange={() => handleCheckboxChange('quinta')} />
              <Checkbox label="Sexta" isSelected={personData.diasAbertos.sexta} onValueChange={() => handleCheckboxChange('sexta')} />
              <Checkbox label="Sábado" isSelected={personData.diasAbertos.sabado} onValueChange={() => handleCheckboxChange('sabado')} />
              <Checkbox label="Domingo" isSelected={personData.diasAbertos.domingo} onValueChange={() => handleCheckboxChange('domingo')} />
            </View>

            <Text style={styles.editLabel}>Horário</Text>
            <View style={styles.timeInputsContainer}>
              <TextInput style={styles.timeInput} value={personData.horarioInicio} onChangeText={(text) => handleTimeChange('horarioInicio', text)} keyboardType="numeric" maxLength={5} />
              <Ionicons name="time-outline" size={24} color={COLORS.orange} />
              <TextInput style={styles.timeInput} value={personData.horarioFim} onChangeText={(text) => handleTimeChange('horarioFim', text)} keyboardType="numeric" maxLength={5} />
            </View>
            {timeError ? (<Text style={styles.errorText}>{timeError}</Text>) : null}

            <Text style={styles.editLabel}>Descrição</Text>
            <TextInput style={[styles.textInput, styles.textArea]} multiline value={personData.sobre} onChangeText={(text) => handleInputChange('sobre', text)} />

            <Text style={styles.sectionTitle}>CONTATO</Text>
            <TextInput style={styles.textInput} placeholder="E-mail" value={personData.email} onChangeText={(text) => handleInputChange('email', text)} />
            <TextInput style={styles.textInput} placeholder="Telefone" keyboardType="phone-pad" value={personData.telefone} onChangeText={(text) => handleInputChange('telefone', text)} />

            <Text style={styles.sectionTitle}>REDES SOCIAIS</Text>
            <View style={styles.socialEditRow}>
              <Image source={require('../Images/Instagram.png')} style={styles.socialIconImage} />
              <TextInput style={styles.textInput} placeholder="Instagram (ex: @petx.official)" value={personData.instagram} onChangeText={(text) => handleInputChange('instagram', text)} />
            </View>
            <View style={styles.socialEditRow}>
              <Image source={require('../Images/Facebook.png')} style={styles.socialIconImage} />
              <TextInput style={styles.textInput} placeholder="Facebook (ex: @oficialpetz)" value={personData.facebook} onChangeText={(text) => handleInputChange('facebook', text)} />
            </View>
          </View>
        ) : (
 
          <View style={styles.container}>
            <View style={styles.section}>
              <View style={styles.cardHeader}>
                <Text style={styles.sectionTitle}>SOBRE</Text>
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  style={styles.editIcon}>
                  <Image
                    source={require('../Images/Editar.png')}
                    style={styles.editIconImage}
                  />
                </TouchableOpacity>
              </View>
            
              <Text style={styles.hoursText}>{`${formatOpenDays()} | ${personData.horarioInicio} às ${personData.horarioFim} | ${personData.role}`}</Text>
              <Text style={styles.sectionContent}>{personData.sobre}</Text>
            </View>
            
          
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ATENDE</Text>
              <Image 
                source={require('../Images/CachorroRoxo.png')}
                style={styles.atendeIcon} 
                resizeMode="contain"
              />
            </View>

          
            <View style={styles.contactSectionWrapper}>
              <Image
                source={require('../Images/GatoCaindo.png')}
                style={styles.catImage}
              />
              <ImageBackground
                source={require('../Images/CaixaPerfil.png')}
                style={styles.contactCardBackground}
                resizeMode="stretch">
                <View style={styles.contactContent}>
                  <Text style={styles.contactTitle}>Contato</Text>
                  <Text style={styles.contactText}>{personData.email}</Text>
                  <Text style={styles.contactText}>{personData.telefone}</Text>
                  <Text style={styles.socialTitle}>Redes Sociais</Text>
                  <View style={styles.socialRow}>
                    <Text style={styles.socialText}>{personData.instagram}</Text>
                    <Image
                      source={require('../Images/Instagram.png')}
                      style={styles.socialIconImage}
                    />
                  </View>
                  <View style={styles.socialRow}>
                    <Text style={styles.socialText}>{personData.facebook}</Text>
                    <Image
                      source={require('../Images/Facebook.png')}
                      style={styles.socialIconImage}
                    />
                  </View>
                </View>
              </ImageBackground>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },

  scrollContainer: { paddingBottom: 120 }, // Aumentado de 40 para 120
  container: { paddingHorizontal: 25, marginTop: 5 },
  section: {
    paddingVertical: 20,
  },
  
  // Header
  headerBackground: {
    width: '100%',
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.headerOverlay,
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    marginBottom: 15,
    paddingHorizontal: width * 0.06,
    paddingTop: width * 0.08,
  },
  headerContent: { alignItems: 'center' },
  profileLogo: { 
    width: 90,
    height: 90,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.white,
    marginBottom: 10,
    marginTop: 50,
  },
  profileNameHeader: { 
    fontSize: 28,
    color: COLORS.white,
    textShadowRadius: 10,
    fontFamily: 'JosefinSans_700Bold',
  },
  profileLocation: { 
    fontSize: 16,
    color: COLORS.white,
    textShadowRadius: 10,
    fontFamily: 'JosefinSans_400Regular',
  },

  // Estilos de Conteúdo (View Mode)
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    color: COLORS.primaryPurple,
    textTransform: 'uppercase',
    marginBottom: 15,
    fontFamily: 'Nunito_700Bold',
  },
  editIcon: {
    backgroundColor: COLORS.primaryPurple,
    borderRadius: 20,
    padding: 8,
  },
  editIconImage: { width: 22, height: 22, tintColor: COLORS.white },
  hoursText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 10,
    fontFamily: 'JosefinSans_400Regular',
  },
  sectionContent: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    textAlign: 'justify',
    fontFamily: 'JosefinSans_300Light',
  },
  atendeIcon: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    tintColor: COLORS.primaryPurple, 
  },

  
  contactSectionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 20,
    marginHorizontal: -25,
  },
  catImage: {
    width: 120,
    height: 260,
    resizeMode: 'contain',
    marginRight: -50,
    zIndex: 1,
    bottom: 10,
  },
  contactCardBackground: {
    width: width * 0.65,
    height: 240,
    justifyContent: 'center',
  },
  contactContent: { paddingLeft: 60, paddingVertical: 15, paddingRight: 10 },
  contactTitle: {
    fontSize: 15,
    color: COLORS.textPrimary,
    marginBottom: 8,
    fontFamily: 'Nunito_700Bold',
  },
  contactText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontFamily: 'JosefinSans_400Regular',
  },
  socialTitle: {
    fontSize: 15,
    color: COLORS.textPrimary,
    marginTop: 12,
    marginBottom: 8,
    fontFamily: 'Nunito_700Bold',
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  socialText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
    fontFamily: 'JosefinSans_400Regular',
  },
  socialIconImage: { width: 28, height: 28, marginLeft: 10 },
  
  mapImage: { width: '100%', height: 150, borderRadius: 10, marginBottom: 10 },
  addressText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontFamily: 'JosefinSans_400Regular',
  },
  

  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.modalBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: width * 0.9,
    height: height * 0.8,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    padding: 10,
  },


  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 25,
  },
  editPhotoButtons: { flexDirection: 'column' },
  photoEditButton: {
    backgroundColor: COLORS.primaryPurple,
    borderRadius: 8,
    padding: 8,
    marginBottom: 5,
  },
  photoEditButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  mainActionButtons: { flexDirection: 'row' },
  editButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 10,
  },
  saveButton: { backgroundColor: COLORS.saveButton },
  cancelButton: { backgroundColor: COLORS.cancelButton },
  editButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  editLabel: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 10,
    marginTop: 15,
    fontFamily: 'Nunito_700Bold',
  },
  textInput: {
    borderWidth: 0,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 20,
    backgroundColor: COLORS.white,
    color: COLORS.textSecondary,
    fontFamily: 'JosefinSans_400Regular',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textArea: { height: 120, textAlignVertical: 'top' },
  checkboxGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: COLORS.orange,
    borderRadius: 5,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: { backgroundColor: COLORS.orange },
  checkboxLabel: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontFamily: 'JosefinSans_400Regular',
  },
  timeInputsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  timeInput: {
    borderRadius: 8,
    padding: 10,
    width: '40%',
    textAlign: 'center',
    fontSize: 15,
    borderWidth: 0,
    backgroundColor: COLORS.timeInputBackground,
    color: COLORS.textPrimary,
    fontFamily: 'JosefinSans_400Regular',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  socialEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 10 },
});