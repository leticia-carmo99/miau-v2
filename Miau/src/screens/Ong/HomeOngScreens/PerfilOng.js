import React, { useState, useEffect } from 'react';
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
import { Feather } from '@expo/vector-icons';


import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
  JosefinSans_300Light,
} from '@expo-google-fonts/josefin-sans';
import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';

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

const PerfilOng = () => {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [initialOngData, setInitialOngData] = useState({});
  const [ongData, setOngData] = useState({
    sobre: '',
    diasAbertos: {},
    horarioInicio: '08:00',
    horarioFim: '22:00',
    email: '',
    telefone: '',
    instagram: '',
    facebook: '',
    endereco: {},
    fotos: [],
    headerImage: null,
    logoImage: null,
  });

  // ADICIONADO: Carregamento das fontes
  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
    JosefinSans_300Light,
    Nunito_400Regular,
    Nunito_700Bold,
  });

  const [timeError, setTimeError] = useState('');
  const [isGalleryExpanded, setIsGalleryExpanded] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


  useEffect(() => {
    const fetchedData = {
      sobre:
        "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      diasAbertos: {
        segunda: true,
        terca: true,
        quarta: true,
        quinta: true,
        sexta: true,
        sabado: false,
        domingo: false,
      },
      horarioInicio: '08:00',
      horarioFim: '22:00',
      email: 'petscantoro@gmail.com',
      telefone: '+55 11 99262-4521',
      instagram: '@petx.official',
      facebook: '@oficialpetz',
      endereco: {
        rua: 'Rua das Palmeiras',
        numero: '123',
        bairro: 'Jardim Central',
        cidade: 'Taboão da Serra',
        cep: '06850-000',
      },
      fotos: [
        require('../Images/exemplo1.png'),
        require('../Images/Exemplo2.png'),
        require('../Images/Exemplo3.png'),
        require('../Images/Exemplo4.png'),
        require('../Images/Exemplo5.png'),
      ],
      headerImage: require('../Images/FundoPatinhasUnidas.png'),
      logoImage: require('../Images/LogoPatinhasUnidas.png'),
    };
    setOngData(fetchedData);
    setInitialOngData(fetchedData);
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
    const allowsMultipleSelection = imageType === 'gallery';

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: !allowsMultipleSelection,
      aspect: imageType === 'headerImage' ? [16, 9] : [1, 1],
      quality: 1,
      allowsMultipleSelection: allowsMultipleSelection,
    });

    if (!result.canceled) {
      if (allowsMultipleSelection && result.assets) {
        const newImageUris = result.assets.map((asset) => asset.uri);
        setOngData((prev) => ({
          ...prev,
          fotos: [...prev.fotos, ...newImageUris],
        }));
      } else if (result.assets && result.assets.length > 0) {
        const newImageUri = result.assets[0].uri;
        handleInputChange(imageType, { uri: newImageUri });
      }
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
      Alert.alert(
        'Erro',
        'Por favor, corrija o formato do horário antes de salvar.'
      );
      return;
    }
    setInitialOngData(ongData);
    setIsGalleryExpanded(true);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setOngData(initialOngData);
    setIsGalleryExpanded(true);
    setIsEditing(false);
  };

  const handleInputChange = (field, value, subField = null) => {
    if (subField) {
      setOngData((prev) => ({
        ...prev,
        [field]: { ...prev[field], [subField]: value },
      }));
    } else {
      setOngData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleCheckboxChange = (day) => {
    setOngData((prev) => ({
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

    const openDays = days.filter((day) => ongData.diasAbertos[day.key]);

    if (openDays.length === 0) return 'Fechado';
    if (openDays.length === 7) return 'Todos os dias';

    if (
      ongData.diasAbertos.segunda &&
      ongData.diasAbertos.terca &&
      ongData.diasAbertos.quarta &&
      ongData.diasAbertos.quinta &&
      ongData.diasAbertos.sexta &&
      openDays.length === 5
    ) {
      return 'Segunda a Sexta';
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
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeImageModal}>
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
          source={ongData.headerImage}
          style={styles.headerBackground}>
          <View style={styles.headerOverlay} />
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={styles.menuButton}>
            <Feather name="menu" size={width * 0.12} color='#FFFFFF'/>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => openImageModal(ongData.logoImage)}>
              <Image source={ongData.logoImage} style={styles.ongLogo} />
            </TouchableOpacity>
            <Text style={styles.ongNameHeader}>Patinhas Unidas</Text>
            <Text style={styles.enderecoOng}>Jardim das Esmeraldas, SP</Text>
          </View>
        </ImageBackground>

        {isEditing ? (
          
          <View style={styles.container}>
            <View style={styles.editHeader}>
              <View style={styles.editPhotoButtons}>
                <TouchableOpacity
                  onPress={() => pickImage('headerImage')}
                  style={styles.photoEditButton}>
                  <Text style={styles.photoEditButtonText}>Trocar Fundo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => pickImage('logoImage')}
                  style={styles.photoEditButton}>
                  <Text style={styles.photoEditButtonText}>Trocar Logo</Text>
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
            <Text style={styles.editLabel}>
              Dias da semana que o local fica aberto
            </Text>
            <View style={styles.checkboxGroup}>
              <Checkbox
                label="Segunda-feira"
                isSelected={ongData.diasAbertos.segunda}
                onValueChange={() => handleCheckboxChange('segunda')}
              />
              <Checkbox
                label="Terça-feira"
                isSelected={ongData.diasAbertos.terca}
                onValueChange={() => handleCheckboxChange('terca')}
              />
              <Checkbox
                label="Quarta-feira"
                isSelected={ongData.diasAbertos.quarta}
                onValueChange={() => handleCheckboxChange('quarta')}
              />
              <Checkbox
                label="Quinta-feira"
                isSelected={ongData.diasAbertos.quinta}
                onValueChange={() => handleCheckboxChange('quinta')}
              />
              <Checkbox
                label="Sexta-feira"
                isSelected={ongData.diasAbertos.sexta}
                onValueChange={() => handleCheckboxChange('sexta')}
              />
              <Checkbox
                label="Sábado"
                isSelected={ongData.diasAbertos.sabado}
                onValueChange={() => handleCheckboxChange('sabado')}
              />
              <Checkbox
                label="Domingo"
                isSelected={ongData.diasAbertos.domingo}
                onValueChange={() => handleCheckboxChange('domingo')}
              />
            </View>

            <Text style={styles.editLabel}>Horário</Text>
            <View style={styles.timeInputsContainer}>
              <TextInput
                style={styles.timeInput}
                value={ongData.horarioInicio}
                onChangeText={(text) => handleTimeChange('horarioInicio', text)}
                keyboardType="numeric"
                maxLength={5}
              />
              <Ionicons name="time-outline" size={24} color={COLORS.orange} />
              <TextInput
                style={styles.timeInput}
                value={ongData.horarioFim}
                onChangeText={(text) => handleTimeChange('horarioFim', text)}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            {timeError ? (
              <Text style={styles.errorText}>{timeError}</Text>
            ) : null}

            <Text style={styles.editLabel}>Descrição</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              multiline
              value={ongData.sobre}
              onChangeText={(text) => handleInputChange('sobre', text)}
            />

            <Text style={styles.sectionTitle}>CONTATO</Text>
            <TextInput
              style={styles.textInput}
              placeholder="E-mail"
              value={ongData.email}
              onChangeText={(text) => handleInputChange('email', text)}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Telefone"
              keyboardType="phone-pad"
              value={ongData.telefone}
              onChangeText={(text) => handleInputChange('telefone', text)}
            />

            <Text style={styles.sectionTitle}>REDES SOCIAIS</Text>
            <View style={styles.socialEditRow}>
              <Image
                source={require('../Images/Instagram.png')}
                style={styles.socialIconImage}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Página no Instagram"
                value={ongData.instagram}
                onChangeText={(text) => handleInputChange('instagram', text)}
              />
            </View>
            <View style={styles.socialEditRow}>
              <Image
                source={require('../Images/Facebook.png')}
                style={styles.socialIconImage}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Página no Facebook"
                value={ongData.facebook}
                onChangeText={(text) => handleInputChange('facebook', text)}
              />
            </View>

            <Text style={styles.sectionTitle}>ENDEREÇO</Text>
            <View style={styles.addressGrid}>
              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                placeholder="Rua"
                value={ongData.endereco.rua}
                onChangeText={(text) =>
                  handleInputChange('endereco', text, 'rua')
                }
              />
              <TextInput
                style={[styles.textInput, { width: 80, marginLeft: 10 }]}
                placeholder="Número"
                value={ongData.endereco.numero}
                onChangeText={(text) =>
                  handleInputChange('endereco', text, 'numero')
                }
              />
            </View>
            <View style={styles.addressGrid}>
              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                placeholder="Bairro"
                value={ongData.endereco.bairro}
                onChangeText={(text) =>
                  handleInputChange('endereco', text, 'bairro')
                }
              />
              <TextInput
                style={[styles.textInput, { width: 120, marginLeft: 10 }]}
                placeholder="Cidade"
                value={ongData.endereco.cidade}
                onChangeText={(text) =>
                  handleInputChange('endereco', text, 'cidade')
                }
              />
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="CEP"
              keyboardType="numeric"
              value={ongData.endereco.cep}
              onChangeText={(text) =>
                handleInputChange('endereco', text, 'cep')
              }
            />

            <Text style={styles.sectionTitle}>FOTOS</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => pickImage('gallery')}>
              <Ionicons
                name="cloud-upload-outline"
                size={32}
                color={COLORS.primaryPurple}
              />
            </TouchableOpacity>
          </View>
        ) : (
          // ---- MODO DE VISUALIZAÇÃO ----
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
              <Text style={styles.hoursText}>{`${formatOpenDays()} | ${
                ongData.horarioInicio
              } às ${ongData.horarioFim}`}</Text>
              <Text style={styles.sectionContent}>{ongData.sobre}</Text>
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
                  <Text style={styles.contactText}>{ongData.email}</Text>
                  <Text style={styles.contactText}>{ongData.telefone}</Text>
                  <Text style={styles.socialTitle}>Redes Sociais</Text>
                  <View style={styles.socialRow}>
                    <Text style={styles.socialText}>{ongData.instagram}</Text>
                    <Image
                      source={require('../Images/Instagram.png')}
                      style={styles.socialIconImage}
                    />
                  </View>
                  <View style={styles.socialRow}>
                    <Text style={styles.socialText}>{ongData.facebook}</Text>
                    <Image
                      source={require('../Images/Facebook.png')}
                      style={styles.socialIconImage}
                    />
                  </View>
                </View>
              </ImageBackground>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ENDEREÇO</Text>
              <Image
                source={require('../Images/EnderecoPatinhasUnidas.png')}
                style={styles.mapImage}
              />
              <Text
                style={
                  styles.addressText
                }>{`${ongData.endereco.rua}, ${ongData.endereco.numero} - ${ongData.endereco.bairro}, ${ongData.endereco.cidade}`}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>FOTOS</Text>
              <View style={styles.photoGrid}>
                {isGalleryExpanded ? (
                  ongData.fotos.map((foto, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.photo}
                      onPress={() => openImageModal(foto)}>
                      <Image
                        source={renderImageSource(foto)}
                        style={styles.fullSize}
                        imageStyle={{ borderRadius: 10 }}
                      />
                    </TouchableOpacity>
                  ))
                ) : (
                  <>
                    {ongData.fotos.slice(0, 4).map((foto, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.photo}
                        onPress={() => openImageModal(foto)}>
                        <Image
                          source={renderImageSource(foto)}
                          style={styles.fullSize}
                          imageStyle={{ borderRadius: 10 }}
                        />
                      </TouchableOpacity>
                    ))}
                    {ongData.fotos.length > 4 && (
                      <TouchableOpacity
                        onPress={() => setIsGalleryExpanded(true)}
                        style={styles.photo}>
                        <ImageBackground
                          source={renderImageSource(ongData.fotos[4])}
                          style={styles.fullSize}
                          imageStyle={{ borderRadius: 10 }}>
                          <View style={styles.photoOverlay}>
                            <Text style={styles.photoOverlayText}>
                              Ver mais {ongData.fotos.length - 4}
                            </Text>
                          </View>
                        </ImageBackground>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
              {isGalleryExpanded && (
                <TouchableOpacity
                  style={styles.toggleGalleryButton}
                  onPress={() => setIsGalleryExpanded(false)}>
                  <Text style={styles.toggleGalleryButtonText}>Ver menos</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
 
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContainer: { paddingBottom: 40 },
  container: { paddingHorizontal: 25, marginTop: 5 },
  section: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },

 
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
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 15,
    padding: 10,
    zIndex: 1,
  },
  headerContent: { alignItems: 'center' },
  ongLogo: {
    width: 90,
    height: 90,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.white,
    marginBottom: 10,
    marginTop: 50,
  },
  ongNameHeader: {
    fontSize: 28,
    color: COLORS.white,
    textShadowRadius: 10,
    fontFamily: 'JosefinSans_700Bold', 
  },
  enderecoOng: {
    fontSize: 16,
    color: COLORS.white,
    textShadowRadius: 10,
    fontFamily: 'JosefinSans_400Regular', 
  },

  
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
  editIconImage: { width: 24, height: 24, tintColor: COLORS.white },
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

 
  contactSectionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
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
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photo: { width: '48%', aspectRatio: 1, borderRadius: 10, marginBottom: 10 },
  photoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  photoOverlayText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Nunito_700Bold', 
  },
  toggleGalleryButton: {
    backgroundColor: COLORS.primaryPurple,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  toggleGalleryButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: 'Nunito_700Bold', 
  },
  fullSize: {
    width: '100%',
    height: '100%',
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
  addressGrid: { flexDirection: 'row', marginBottom: 10 },
  uploadButton: {
    borderWidth: 0,
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 10 },
});

export default PerfilOng;

