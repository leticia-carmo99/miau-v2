import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';


import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
  JosefinSans_300Light,
} from '@expo-google-fonts/josefin-sans';
import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';

const { width } = Dimensions.get('window');

const Colors = {
  primaryPurple: '#9156D1',
  backgroundPurple: '#9156D1',
  cardWhite: '#FFFFFF',
  textDark: '#333333',
  textMedium: '#8A8A8A',
  textLight: '#BDBDBD',
  primaryOrange: '#FFAB36',
  bubbleBackground: '#FFFFFF',
};


const fixedOngData = {
    id: '123-abc-456',
    name: 'Associação Patinhas Unidas de Parintins',
    telefone: '(92) 992624521',
    logo: require('../Images/LogoPatinhasUnidas.png')
};


const DogPorteIcon = ({ porte, petPorte, size }) => {
  const imageSource =
    porte === petPorte
      ? require('../Images/CachorroLaranja.png')
      : require('../Images/CachorroRoxo.png');

  return (
    <Image
      source={imageSource}
      style={{
        width: 120 * size,
        height: 100 * size,
        marginHorizontal: -25, 
      }}
      resizeMode="contain"
    />
  );
};

const PerfilPetAdocao = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
    JosefinSans_300Light,
    Nunito_400Regular,
    Nunito_700Bold,
  });

  const { pet } = route.params || {};

  if (!fontsLoaded) {
    return null; 
  }


  if (!pet) {
   
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color={Colors.cardWhite} />
                </TouchableOpacity>
            </View>
            <Text style={styles.errorText}>Pet não encontrado!</Text>
        </SafeAreaView>
    );
  }


  const petParaExibicao = { ...pet, ong: fixedOngData };
  return <PerfilPetComponent pet={petParaExibicao} />;
};

const PerfilPetComponent = ({ pet }) => {
    const navigation = useNavigation();

    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <ImageBackground
            source={require('../Images/fundo.png')}
            resizeMode="repeat"
            style={styles.backgroundImage}
            imageStyle={{ transform: [{ scale: 2 }] }}>
            
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={28} color={Colors.cardWhite} />
              </TouchableOpacity>
            </View>

            <View style={styles.contentWrapper}>
              <View style={styles.imageContainer}>
                {pet.petImageUri ? (
                  <Image source={typeof pet.petImageUri === 'string' ? { uri: pet.petImageUri } : pet.petImageUri} style={styles.petImage} />
                ) : (
                  <View style={styles.imagePlaceholder} />
                )}
              </View>

              <View style={styles.mainCard}>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petBreed}>{pet.raca}</Text>

                <View style={styles.infoBubbleRow}>
                  <View style={styles.infoBubble}>
                    <Text style={styles.bubbleTitle}>Idade</Text>
                    <Text style={styles.bubbleContent}>{pet.age}</Text>
                  </View>
                  <View style={styles.infoBubble}>
                    <Text style={styles.bubbleTitle}>Sexo</Text>
                    <Text style={styles.bubbleContent}>{pet.gender === 'Male' ? 'Macho' : 'Fêmea'}</Text>
                  </View>
                  <View style={styles.infoBubble}>
                    <Text style={styles.bubbleTitle}>Cor</Text>
                    <Text style={styles.bubbleContent}>{pet.cor}</Text>
                  </View>
                </View>
                
                <View style={styles.bannerWrapper}>
                  <View style={styles.ongContainer}>
                    <Image
                      source={pet.ong.logo}
                      style={styles.ongLogo}
                    />
                    <View style={styles.ongBanner}>
                        <Text style={styles.ongName}>{pet.ong.name}</Text>
                        <Text style={styles.ongId}>{pet.ong.telefone}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Porte</Text>
                  <View style={styles.porteContainer}>
                    <DogPorteIcon porte="Pequeno" petPorte={pet.porte} size={1} />
                    <DogPorteIcon porte="Médio" petPorte={pet.porte} size={1.2} />
                    <DogPorteIcon porte="Grande" petPorte={pet.porte} size={1.4} />
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Descrição</Text>
                  <Text style={styles.sectionContent}>{pet.descricao}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Informações gerais</Text>
                  <Text style={styles.sectionContent}>{pet.infoGerais}</Text>
                </View>

                <View style={styles.buttonContainerLeft}>
                  <TouchableOpacity style={styles.vacinaButton}>
                    <Text style={styles.vacinaButtonText}>Carteira de vacinação</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </ScrollView>
      </SafeAreaView>
    );
}


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundPurple,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80, 
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    width: '100%',
  },
  contentWrapper: {
    marginTop: width * 0.30,
    alignItems: 'center',
    paddingBottom: 40,
  },
  mainCard: {
    backgroundColor: Colors.cardWhite,
    borderRadius: 35,
    width: '100%',
    paddingTop: width * 0.25 + 20,
    paddingBottom: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  imageContainer: {
    position: 'absolute',
    top: -(width * 0.25),
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  imagePlaceholder: {
    width: width * 0.5,
    height: width * 0.5,
    backgroundColor: Colors.bubbleBackground,
    borderRadius: 25,
  },
  petImage: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: 25,
  },
  petName: {
    fontSize: 30,
    color: Colors.primaryPurple,
    fontFamily: 'JosefinSans_700Bold',
  },
  petBreed: {
    fontSize: 18,
    color: Colors.textMedium,
    marginBottom: 25,
    fontFamily: 'JosefinSans_400Regular',
  },
  infoBubbleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 25,
  },
  infoBubble: {
    backgroundColor: Colors.bubbleBackground,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bubbleTitle: {
    fontSize: 14,
    color: Colors.textMedium,
    fontFamily: 'JosefinSans_400Regular',
  },
  bubbleContent: {
    fontSize: 16,
    color: Colors.primaryPurple,
    fontFamily: 'JosefinSans_700Bold',
  },
  bannerWrapper: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 25,
    marginRight: -20,
  },
  ongContainer: {
    position: 'relative',
    paddingLeft: 45,
    justifyContent: 'center',
  },
  ongBanner: {
    backgroundColor: Colors.primaryPurple,
    borderRadius: 15,
    paddingVertical: 10,
    paddingLeft: 55,
    paddingRight: 15,
    minHeight: 70,
    justifyContent: 'center',
  },
  ongLogo: {
    width: 90,
    height: 90,
    borderRadius: 40,
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  ongName: {
    color: Colors.cardWhite,
    fontSize: 15,
    fontFamily: 'JosefinSans_700Bold',
  },
  ongId: {
    color: Colors.cardWhite,
    fontSize: 13,
    fontFamily: 'JosefinSans_400Regular',
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: Colors.primaryPurple,
    marginBottom: 10,
    fontFamily: 'Nunito_700Bold',
  },
  sectionContent: {
    fontSize: 15,
    color: Colors.textMedium,
    lineHeight: 22,
    fontFamily: 'JosefinSans_300Light',
  },
  porteContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  buttonContainerLeft: {
    width: '100%',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  vacinaButton: {
    backgroundColor: Colors.cardWhite,
    borderWidth: 0,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  vacinaButtonText: {
    color: Colors.primaryPurple,
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  editButton: {
    backgroundColor: Colors.primaryPurple,
    width: '55%',
    marginTop: 30,
    paddingVertical: 8,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  editButtonText: {
    color: Colors.cardWhite,
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  errorText: {
    color: Colors.cardWhite,
    textAlign: 'center',
    fontSize: 18,
    marginTop: 50,
    fontFamily: 'Nunito_700Bold',
  },
});

export default PerfilPetAdocao;

