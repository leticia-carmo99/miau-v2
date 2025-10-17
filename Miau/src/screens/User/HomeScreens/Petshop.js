import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Dimensions,
  StyleSheet,
  Animated,
  PanResponder,
  Alert,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
    ImageBackground,
    
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import Back from '../assets/FotosInicial/Back.png';

// You can import supported modules from npm
import { Card } from 'react-native-paper';
import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
    JosefinSans_300Light,
} from '@expo-google-fonts/josefin-sans';
import {
  Nunito_400Regular,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
const { width, height } = Dimensions.get('window');
const SNAP_POINTS = [height * 0.25, height * 0.65]; // fechado e aberto
import WebView from 'react-native-webview';

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
  darkPurple: '#3C2B5E',
};
import MapHtmlModule from '../../../../assets/map_data.js';

const allImages = [
  { id: "1", uri: "https://diskmadeiras.com.br/wp-content/uploads/2024/06/MDF-CINZA-URBANO-MATT-SOFT-06MM-1-FACE-EUCATEX.jpg" },
  { id: "2", uri: "https://diskmadeiras.com.br/wp-content/uploads/2024/06/MDF-CINZA-URBANO-MATT-SOFT-06MM-1-FACE-EUCATEX.jpg" },
  { id: "3", uri: "https://diskmadeiras.com.br/wp-content/uploads/2024/06/MDF-CINZA-URBANO-MATT-SOFT-06MM-1-FACE-EUCATEX.jpg" },
  { id: "4", uri: "https://diskmadeiras.com.br/wp-content/uploads/2024/06/MDF-CINZA-URBANO-MATT-SOFT-06MM-1-FACE-EUCATEX.jpg" },
  { id: "5", uri: "https://diskmadeiras.com.br/wp-content/uploads/2024/06/MDF-CINZA-URBANO-MATT-SOFT-06MM-1-FACE-EUCATEX.jpg" },
  { id: "6", uri: "https://diskmadeiras.com.br/wp-content/uploads/2024/06/MDF-CINZA-URBANO-MATT-SOFT-06MM-1-FACE-EUCATEX.jpg" },
  { id: "7", uri: "https://diskmadeiras.com.br/wp-content/uploads/2024/06/MDF-CINZA-URBANO-MATT-SOFT-06MM-1-FACE-EUCATEX.jpg" },
];

export default function Petshop() {

    const route = useRoute();
  const { nome, foto } = route.params;

     const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [cep, setCep] = useState('');
  const [filtered, setFiltered] = useState([]);
    const webViewRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: -23.55052,
    longitude: -46.633308,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

    const mapRef = useRef(null);
  const translateY = useRef(new Animated.Value(height * 0.5)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dy) > 10,
      onPanResponderMove: (_, gesture) => {
        translateY.setValue(Math.max(100, gesture.moveY));
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.moveY < height / 2) {
          Animated.spring(translateY, {
            toValue: 100,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(translateY, {
            toValue: height * 0.5,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

    const moveMapScript = (newRegion) => {
    return `
(function() {
          if (typeof window.map !== 'undefined') {
              window.map.setView([${newRegion.latitude}, ${newRegion.longitude}], window.map.getZoom());
          }
      })();
      true;
    `;
};

const addCenterMarkerScript = (newRegion) => {
    return `
      (function() {
          if (typeof window.map !== 'undefined') {
              const lat = ${newRegion.latitude};
              const lon = ${newRegion.longitude};
              
              // Remove o marcador central anterior, se houver
              if (window.centerMarker) {
                  window.map.removeLayer(window.centerMarker);
              }
              
              // O ícone padrão do Leaflet é um pouco feio, vamos criar um simples
              const customIcon = L.divIcon({
                  className: 'center-marker-icon',
                  html: '<div style="background-color:#7b3aed; width:15px; height:15px; border: 3px solid white; border-radius: 50%;"></div>',
                  iconSize: [21, 21], // Tamanho do div container
                  iconAnchor: [10, 21], // Ponto de ancoragem (fundo do alfinete)
                  popupAnchor: [1, -15] // Ponto para o popup
              });

              // Cria e adiciona o novo marcador central ao mapa
              window.centerMarker = L.marker([lat, lon], { icon: customIcon })
                  .addTo(window.map)
                  .bindPopup("Sua Localização de Busca")
                  .openPopup(); // Abre o popup automaticamente
          }
      })();
      true;
    `;
};

const TILE_PROVIDERS = {
    'OpenStreetMap': {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    },
    'CartoDB_Positron': {
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    },
    'CartoDB_DarkMatter': {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }
};
const MAP_PROVIDER_KEY = 'CartoDB_Positron'; 
const MAP_PROVIDER = TILE_PROVIDERS[MAP_PROVIDER_KEY] || TILE_PROVIDERS['OpenStreetMap'];

  const petshop = [
    {
      id: 'p1',
      name: 'Petz',
      logo: require('../assets/FotosInicial/petz.png'),
      distance: '0.4 km',
      description: 'Pet shop',
      lat: -23.55,
      lon: -46.63,
    },
  ];
  const [selectedIndex, setSelectedIndex] = useState(null); // null = modal fechado

  const previewImages = allImages.slice(0, 4);
  const extraCount = Math.max(0, allImages.length - 4);

  const openAt = (index) => setSelectedIndex(index);
  const close = () => setSelectedIndex(null);

  const next = () =>
    setSelectedIndex((i) => (i === null ? null : (i + 1) % allImages.length));
  const prev = () =>
    setSelectedIndex((i) =>
      i === null ? null : (i - 1 + allImages.length) % allImages.length
    );

// AVALIACAO CLICAVEL

function AvaliacaoEstrelas({ max = 5, onChange }) {
  const [rating, setRating] = useState(0);

  const handlePress = (index) => {
    let newRating = index;

    // se clicar na mesma estrela -> alterna entre cheia ↔ meia
    if (rating === index) {
      newRating = index - 0.5;
    } else if (rating === index - 0.5) {
      newRating = index;
    }

    setRating(newRating);
    if (onChange) onChange(newRating);
  };

  const renderIcon = (starNumber) => {
    if (rating >= starNumber) {
      return "star"; // cheia
    } else if (rating >= starNumber - 0.5) {
      return "star-half-full"; // meia
    } else {
      return "star-o"; // vazia
    }
  };

  return (
    <View style={{ flexDirection: "row", marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
      {[...Array(max)].map((_, index) => {
        const starNumber = index + 1;
        return (
          <TouchableOpacity key={index} onPress={() => handlePress(starNumber)}>
            <FontAwesome
              name={renderIcon(starNumber)}
              size={width * 0.15}
              color="#FFD700"
              style={{ marginHorizontal: 2 }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// AVALIAÇAO GERAL NO HEADER

const StarRating = ({ rating, maxStars = 5 }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = maxStars - Math.ceil(rating);

  return (
    <View style={{ flexDirection: 'row', marginTop: width * 0.01 }}>
      {[...Array(fullStars)].map((_, index) => (
        <Icon key={`full-${index}`} name="star" size={width * 0.05} color="#FFD700" />
      ))}
      {halfStar && <Icon name="star-half" size={width * 0.05} color="#FFD700" />}
      {[...Array(emptyStars)].map((_, index) => (
        <Icon key={`empty-${index}`} name="star-o" size={width * 0.05} color="#FFD700" />
      ))}
    </View>
  );
};

const nota = 4.5;

 useEffect(() => {
    if (search.trim() === '') {
      setFiltered(petshop);
    } else {
      setFiltered(
        petshop.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search]);
    useEffect(() => {
    if (webViewRef.current) {
        webViewRef.current.injectJavaScript(moveMapScript(region));
    }
  }, [region]); 
 const [favorited, setFavorited] = useState(false) 
  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
        JosefinSans_300Light,
    Nunito_400Regular,
    Nunito_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const mapHtmlContent = MapHtmlModule;

const centerCoord = { lat: region.latitude, lon: region.longitude };

// 2. Função para injetar o JavaScript que inicializa o mapa Leaflet
// ...
const generateMapScript = (data, center) => {
    return `
    (function() {
        if (typeof L === 'undefined' || document.getElementById('map')._leaflet_id) {
            return; 
        }
        
        // Variável global na WebView para armazenar os marcadores
        window.activeMarkers = [];
        
        const initialCenter = [${center.lat}, ${center.lon}];
        const zoomLevel = 13; 
         
        // Inicializa o mapa
        window.map = L.map('map').setView(initialCenter, zoomLevel);

        // Define o Tile Layer CartoDB Positron
        L.tileLayer('${MAP_PROVIDER.url}', {
            attribution: '${MAP_PROVIDER.attribution}',
            maxZoom: 19,
        }).addTo(map);

        // Função para criar o ícone customizado
        window.getCustomIcon = (initials) => L.divIcon({
            className: 'custom-div-icon',
            html: '<div style="background-color:#9156D1; width:30px; height:30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 14px;">' + initials + '</div>',
            iconSize: [30, 30], 
            iconAnchor: [15, 30], 
        });

        // Função para adicionar marcadores
        window.addMarkers = (petshops) => {
            // Remove marcadores antigos
            window.activeMarkers.forEach(marker => map.removeLayer(marker));
            window.activeMarkers = [];

            petshops.forEach(p => {
                const marker = L.marker([p.lat, p.lon], { icon: window.getCustomIcon(p.logo) })
                .addTo(map)
                .bindPopup('<b>' + p.name + '</b><br>' + p.description + '<br>Distância: ' + p.distance);
                
                window.activeMarkers.push(marker);
            });
        };

        // Adiciona os marcadores iniciais
        window.addMarkers(${JSON.stringify(petshop)});
    })();
    true;
`;
}


  return (
        <View style={styles.container}>

<View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
source={{ html: mapHtmlContent }}
          style={styles.map}
          // Injeta o JS para inicializar o mapa Leaflet APÓS o HTML carregar
          onLoadEnd={() => {
            setTimeout(() => {
        if (webViewRef.current) {
            webViewRef.current.injectJavaScript(generateMapScript(petshop, centerCoord));
        }
    }, 300); 
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          mixedContentMode="always"
        />
      </View>

        <View style={styles.menuView}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={Back} style={styles.back} />
          </TouchableOpacity>
        </View>

      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY: translateY }] },
        ]}
        {...panResponder.panHandlers}
      >

    <ScrollView
    style={{ flex: 1 }}
    contentContainerStyle={{ paddingBottom: 50 }}
    showsVerticalScrollIndicator={false}
    nestedScrollEnabled
  >

      <View style={styles.head}>
      <View style={styles.headInfos}>

      <Text style={styles.headTitle}>{nome || 'Petshop'}</Text>
      <View style={{flexDirection: 'row'}}>
<StarRating rating={nota} />
            <Text style={styles.headRating}>4,5</Text></View>

      <Text style={styles.headDate}> Seg a Dom | 08 às 22h</Text>
      </View>
        <TouchableOpacity onPress={() => setFavorited(!favorited)}>
          <Ionicons
            name={favorited ? "heart" : "heart-outline"}
            size={width * 0.1}
            color={COLORS.primaryPurple}
          />
        </TouchableOpacity>
      </View>


    <View style={styles.galeryView}>
  <View style={styles.grid}>
        {previewImages.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={styles.imageWrapper}
            onPress={() => openAt(index)}
            activeOpacity={0.9}
          >
            <Image source={{ uri: item.uri }} style={styles.image} />
            {index === 3 && extraCount > 0 && (
              <View style={styles.overlay}>
                <Text style={styles.overlayText}>+{extraCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

<Modal
  visible={selectedIndex !== null}
  transparent={true}
  animationType="fade"
  onRequestClose={close}
>
  <View style={styles.modalContainer}>
    {/* Fundo que fecha */}
    <TouchableOpacity
      style={StyleSheet.absoluteFillObject}
      activeOpacity={1}
      onPress={close}
    />

    {/* Imagem no centro */}
    {selectedIndex !== null && (
      <Image
        source={{ uri: allImages[selectedIndex].uri }}
        style={styles.fullImage}
        resizeMode="contain"
      />
    )}

    {/* Navegação (‹ / ›) */}
    <TouchableOpacity style={[styles.navButton, { left: 10 }]} onPress={prev}>
      <Text style={styles.navText}>‹</Text>
    </TouchableOpacity>
    <TouchableOpacity style={[styles.navButton, { right: 10 }]} onPress={next}>
      <Text style={styles.navText}>›</Text>
    </TouchableOpacity>
  </View>
</Modal>

    </View>

    <Text style={styles.paragraph}>
    Aqui na nossa petshop, você encontra tudo para o bem-estar do seu pet: alimentação de qualidade, acessórios, cuidados especiais e muito carinho! Trabalhamos com dedicação para oferecer um atendimento confiável e um ambiente acolhedor para você e seu melhor amigo. Também apoiamos a adoção responsável, porque acreditamos que todo pet merece um lar cheio de amor.
    </Text>


            <View style={styles.contactSectionWrapper}>
              <Image
                source={require('../assets/FotosMapa/GatoCaindo.png')}
                style={styles.catImage}
              />
              <ImageBackground
                source={require('../assets/FotosMapa/CaixaPerfil.png')}
                style={styles.contactCardBackground}
                resizeMode="stretch">
                <View style={styles.contactContent}>
                  <Text style={styles.contactTitle}>Contato</Text>
                  <Text style={styles.contactText}>petszcontato@gmail.com</Text>
                  <Text style={styles.contactText}>+55 11 99262-4521</Text>
                  <Text style={styles.socialTitle}>Redes Sociais</Text>
                  <View style={styles.socialRow}>
                    <Text style={styles.socialText}>@petx.official</Text>
                    <Image
                      source={require('../assets/FotosMapa/Instagram.png')}
                      style={styles.socialIconImage}
                    />
                  </View>
                  <View style={styles.socialRow}>
                    <Text style={styles.socialText}>@oficialpetz</Text>
                    <Image
                      source={require('../assets/FotosMapa/Facebook.png')}
                      style={styles.socialIconImage}
                    />
                  </View>
                </View>
              </ImageBackground>
            </View>


<Text style={styles.avaliationTitle}>Avalie esta loja</Text>

      <AvaliacaoEstrelas onChange={(nota) => console.log("Nota escolhida:", nota)} />

      <TouchableOpacity style={styles.saveButton}>
      <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>

</ScrollView>

</Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  mapContainer: {
 flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  map: {
    width: width,
    height: height,
    backgroundColor: COLORS.white, 
  },
    back: {
    height: width * 0.1,
    width: width * 0.1,
    padding: width * 0.1,
    marginRight: width * 0.65,
  },
  menuView: {
    height: width * 0.4,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: height,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    padding:  width * 0.05,
  },
  head: {
    marginHorizontal: '10%',
    flexDirection: 'row',
    justifyContent: 'space-between',
        marginTop: width * 0.08,
  },
  headTitle: {
    fontSize: width * 0.08,
    color: '#7b3aed',
    fontFamily: 'JosefinSans_700Bold',
  },
  headInfos: {
    flexDirection: 'column',
  },
  headDate: {
     fontSize: width * 0.05,
    color: COLORS.lightGray,
    fontFamily: 'JosefinSans_400Regular',   
  },
  headRating: {
    fontSize: width * 0.04,
    color: COLORS.lightGray,
    marginVertical: width * 0.02,
    fontFamily: 'JosefinSans_400Regular', 
    marginLeft: width * 0.059
  },
  galeryView: {
    height: width * 1,
    padding: width * 0.01,
      alignItems: 'center',
  justifyContent: 'center'

  },
grid: {
  flexDirection: "row",
  flexWrap: "wrap",
  width: "90%",
},
imageWrapper: {
  width: "50%",
  padding: 4,
  aspectRatio: 1,
},
image: {
  width: "100%",
  height: "100%",
  borderRadius: 8,
},
overlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(0,0,0,0.45)",
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
},
overlayText: {
  color: "#fff",
  fontSize: 28,
  fontWeight: "700",
},
modalContainer: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.95)",
  justifyContent: "center",
  alignItems: "center",
},
navButton: {
  position: "absolute",
  top: "50%",
  transform: [{ translateY: -24 }],
  padding: 12,
},
navText: { color: "#fff", fontSize: 44 },


  // --- Seção de Contato (Modo Visualização) ---
  contactSectionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 20,

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
    color: COLORS.primaryPurple,
    marginBottom: 8,
    fontFamily: 'Nunito_700Bold', // ALTERADO
  },
  contactText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontFamily: 'JosefinSans_300Light', // ALTERADO
  },
  socialTitle: {
    fontSize: 15,
    color: COLORS.primaryPurple,
    marginTop: 12,
    marginBottom: 8,
    fontFamily: 'Nunito_700Bold', // ALTERADO
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
    fontFamily: 'JosefinSans_300Light', // ALTERADO
  },
  socialIconImage: { width: 28, height: 28, marginLeft: 10 },


  paragraph: {
    fontSize: width * 0.05,
    color: COLORS.black,
    marginVertical: width * 0.02,
    fontFamily: 'JosefinSans_300Light', 
    flexWrap: 'wrap',
    marginHorizontal: '7%',
    textAlign: 'justify'
  },
  avaliationTitle: {
    fontSize: width * 0.06,
    color: COLORS.darkPurple,
    fontFamily: 'Nunito_700Bold',
    marginHorizontal: '10%',
    marginTop: width * 0.1,
  },
  saveButton: {
    backgroundColor: COLORS.primaryPurple,
    padding: width * 0.02,
    width: width * 0.3,
    borderRadius: width * 0.02,
   alignSelf: 'flex-end', 
       margin: '10%',
       alignItems: 'center'
  },
  saveButtonText: {
    fontSize: width * 0.05,
    color: COLORS.white,
    fontFamily: 'Nunito_700Bold',    
  }
});
