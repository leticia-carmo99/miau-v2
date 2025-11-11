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
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import WebView from 'react-native-webview';
import { db } from "../../../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
} from '@expo-google-fonts/josefin-sans';

const { width, height } = Dimensions.get('window');
const SNAP_POINTS = [height * 0.25, height * 0.65]; // fechado e aberto
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
import MapHtmlModule from '../../../../assets/map_data.js';

export default function MapaPetshop() {
   const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [cep, setCep] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [region, setRegion] = useState({
    latitude: -23.55052,
    longitude: -46.633308,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [dbPetshops, setDbPetshops] = useState([]);

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(dbPetshops); 
    } else {
      setFiltered(
        dbPetshops.filter((item) => 
          item.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, dbPetshops]);

useEffect(() => {
    const fetchPetshops = async () => {
        const petshopsRef = collection(db, "empresa");
        const q = query(petshopsRef, where("tipoServico", "==", "Petshop"));
        
        try {
            const querySnapshot = await getDocs(q);
            const petshopsData = [];
            for (const docSnapshot of querySnapshot.docs) {
                const data = docSnapshot.data();
                const cep = data.cep;
                if (!cep) continue;
                try {
                    const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${cep}&format=json&limit=1&countrycodes=br`, {
                        headers: {
                            'User-Agent': 'PetshopApp (seuemail@seudominio.com)',
                        }
                    });

                    if (!geoResponse.ok) throw new Error("Falha na geocodificação.");

                    const geoJson = await geoResponse.json();

                    if (geoJson.length > 0) {
                        const result = geoJson[0];
                        petshopsData.push({
                            id: docSnapshot.id,
                            name: data.nome || 'Petshop Sem Nome',
                            logo: data.logoEmpresa || '../assets/incognita.jpg', 
                            description: data.sobre || 'Sem descrição',
                            lat: parseFloat(result.lat),
                            lon: parseFloat(result.lon),
                        });
                    }

                } catch (geoError) {
                    console.warn(`Aviso: Não foi possível geocodificar o CEP ${cep}.`, geoError.message);
                }
            }
            
            setDbPetshops(petshopsData);
            setFiltered(petshopsData);
            
        } catch (error) {
            console.error("Erro ao buscar petshops do Firestore:", error);
            Alert.alert("Erro", "Não foi possível carregar os petshops do mapa.");
        }
    };

    fetchPetshops();
}, []);

useEffect(() => {
    if (webViewRef.current && dbPetshops.length > 0) {
        webViewRef.current.injectJavaScript(updateMarkersScript(dbPetshops));
    }
}, [dbPetshops]);


  const translateY = useRef(new Animated.Value(height * 0.5)).current;
  const webViewRef = useRef(null);

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
              if (window.centerMarker) {
                  window.map.removeLayer(window.centerMarker);
              }
              const customIcon = L.divIcon({
                  className: 'center-marker-icon',
                  html: '<div style="background-color:#7b3aed; width:15px; height:15px; border: 3px solid white; border-radius: 50%;">P</div>',
                  iconSize: [21, 21],
                  iconAnchor: [10, 21],
                  popupAnchor: [1, -15] 
              });

              window.centerMarker = L.marker([lat, lon], { icon: customIcon })
                  .addTo(window.map)
                  .bindPopup("Sua Localização de Busca")
                  .openPopup();
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

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(dbPetshops);
    } else {
      setFiltered(
        dbPetshops.filter((item) =>
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


const handleCepSearch = async () => {
    if (cep.length < 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const json = await response.json();

if (json.erro) {
        Alert.alert('Erro', 'CEP não encontrado!');
        return;
      }
const fullAddress = `${json.logradouro}, ${json.bairro}, ${json.localidade}, ${json.uf}`;
const encodedAddress = encodeURIComponent(fullAddress);
const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;
const geoResponse = await fetch(geoUrl, {
    headers: {
        'User-Agent': 'PetshopApp (seuemail@seudominio.com)',
    }
});
if (!geoResponse.ok) {
    throw new Error(`Erro na Geocodificação do CEP: Status HTTP ${geoResponse.status}. Verifique o User-Agent e o formato.`);
}
const geoJson = await geoResponse.json();
      if (geoJson.length === 0) {
        Alert.alert('Atenção', 'Endereço encontrado, mas não foi possível localizar no mapa.');
        return;
      }
      const result = geoJson[0];
      const newRegion = {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setRegion(newRegion);
if (webViewRef.current) {
          webViewRef.current.injectJavaScript(addCenterMarkerScript(newRegion));
      }
    } catch (e) {
      Alert.alert('Erro', `Não foi possível buscar o CEP: ${e.message}`);
    }
  };
  const handleAddressSearch = async () => {
    if (search.trim() === '') return;
    const encodedSearch = encodeURIComponent(search.trim());
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodedSearch}&format=json&limit=1&countrycodes=br`;
    try {
      const response = await fetch(nominatimUrl, {
          headers: {
            'User-Agent': 'PetshopApp (seuemail@seudominio.com)',
          }
      }); 
      if (!response.ok) {
        throw new Error(`Status HTTP: ${response.status}. Verifique o User-Agent e o formato da URL.`);
      }
      const json = await response.json();
      if (json.length === 0) {
        Alert.alert('Atenção', `Endereço "${search}" não encontrado. Tente ser mais específico.`);
        return;
      }
      const result = json[0];
      if (!result.lat || !result.lon) {
        throw new Error('Dados de latitude/longitude ausentes na resposta da API.');
      }
      const newRegion = {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setRegion(newRegion);
if (webViewRef.current) {
            webViewRef.current.injectJavaScript(addCenterMarkerScript(newRegion));
        }
    } catch (e) {
      console.error("Erro na busca de endereço:", e);
      Alert.alert('Erro', `Não foi possível buscar o endereço: ${e.message}`);
    }
  };

  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

const centerCoord = { lat: region.latitude, lon: region.longitude };
const generateMapScript = (data, center) => {
    return `
    (function() {
        if (typeof L === 'undefined' || document.getElementById('map')._leaflet_id) {
            return; 
        }
        window.activeMarkers = [];
        
        const initialCenter = [${center.lat}, ${center.lon}];
        const zoomLevel = 13;
        window.map = L.map('map').setView(initialCenter, zoomLevel);
        L.tileLayer('${MAP_PROVIDER.url}', {
            attribution: '${MAP_PROVIDER.attribution}',
            maxZoom: 19,
        }).addTo(map);
        window.getCustomIcon = (initials) => L.divIcon({
            className: 'custom-div-icon',
            html: '<div style="background-color:#9156D1; width:30px; height:30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 14px;">'P'</div>',
            iconSize: [30, 30], 
            iconAnchor: [15, 30], 
        });
        window.addMarkers = (petshops) => {
            window.activeMarkers.forEach(marker => map.removeLayer(marker));
            window.activeMarkers = [];

            petshops.forEach(p => {
                const marker = L.marker([p.lat, p.lon], { icon: window.getCustomIcon(P) })
                .addTo(map)
                .bindPopup('<b>' + p.name + '</b><br>' + p.description + '<br>Distância: ' + p.distance);
                
                window.activeMarkers.push(marker);
            });
        };
window.addMarkers(${JSON.stringify(dbPetshops)});
    })();
    true;
`;
}

const updateMarkersScript = (newPetshops) => `
  (function() {
      if (typeof window.addMarkers === 'function') {
          window.addMarkers(${JSON.stringify(newPetshops)});
      }
  })();
  true;
`;

const mapHtmlContent = MapHtmlModule;

  return (
    <View style={styles.container}>
      {/* MAPA */}

<View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
source={{ html: mapHtmlContent }}
          style={styles.map}
          onLoadEnd={() => {
setTimeout(() => {
        if (webViewRef.current) {
            webViewRef.current.injectJavaScript(generateMapScript(dbPetshops, centerCoord));
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

    {/* Busca */}
    <View style={styles.searchBox}>
      <Ionicons name="search" size={width * 0.07} color="#7b3aed" />
      <TextInput
        style={styles.input}
        placeholder="Procure aqui"
        placeholderTextColor="#aaa"
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={handleAddressSearch}
      />
    </View>

    {/* CEP */}
    <View style={styles.searchBox2}>
      <TextInput
        style={styles.input}
        placeholder="Insira seu CEP"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={cep}
        onChangeText={setCep}
        onSubmitEditing={handleCepSearch}
      />
    </View>

    <Text style={styles.title}>Mais próximos</Text>

    {/* Categorias */}
    <View style={styles.row}>
      <TouchableOpacity>
        <View style={styles.category}>
          <View style={styles.categoryPicSelected}>
            <MaterialIcons name="store" size={width * 0.12} color="#fff" />
          </View>
          <Text style={styles.categoryText}>Petshops</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('MapaServicos')}>
        <View style={styles.category}>
          <View style={styles.categoryPic}>
            <MaterialIcons
              name="miscellaneous-services"
              size={width * 0.12}
              color="#9156D1"
            />
          </View>
          <Text style={styles.categoryText}>Serviços</Text>
        </View>
      </TouchableOpacity>

<TouchableOpacity onPress={() => navigation.navigate('MapaVeterinarioUser')}>
          <View style={styles.category}>
          <View style={styles.categoryPic}>
            <FontAwesome5 name="paw" size={width * 0.12} color="#9156D1" />
            </View>
            <Text style={styles.categoryText}>Veterinário</Text>
          </View>
</TouchableOpacity>
    </View>

    {/* Cards */}
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {filtered.map((item) => (
        <TouchableOpacity key={item.id} onPress={() => navigation.navigate('PetshopUser', { nome: item.name, foto: item.logo})}>
        <View key={item.id} style={styles.card}>
          <Image source={item.logo} style={styles.cardImage} />
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardText}> {'• ' + item.distance} </Text>
          </View>
          <Text style={styles.cardText}>{item.description}</Text>
        </View>
        </TouchableOpacity>
      ))}
    </ScrollView>

</ScrollView>

</Animated.View>

    </View>
  );
}

/* ================== STYLES ================== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eee' },
   mapContainer: {
 flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  map: {
    width: width,
    height: height,
    backgroundColor: COLORS.white, 
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: height,
    backgroundColor: COLORS.offWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    padding:  width * 0.05,
  },
  handle: {
    width: 60,
    height: 6,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom:  width * 0.05,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding:  width * 0.01,
    borderRadius: width * 0.2,
    marginBottom:  width * 0.05,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    justifyContent: 'center',
  },
    searchBox2: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: width * 0.01,
    borderRadius: width * 0.2,
    marginBottom:  width * 0.05,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    justifyContent: 'center',
    width: '65%',
    alignSelf: 'center'
  },
  input: {
    flex: 1,
    marginLeft: width * 0.06,
    color: '#333',
    fontFamily: 'JosefinSans_400Regular',
    fontSize: width * 0.045
  },
  title: {
    fontSize: width * 0.08,
    color: '#7b3aed',
    marginVertical: width * 0.08,
    fontFamily: 'JosefinSans_700Bold',
    alignSelf: 'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  category: {
    alignItems: 'center',

    padding: 10,
    borderRadius: width * 0.3,
    width: 100,

  },
    categoryPicSelected: {
    alignItems: 'center',
    backgroundColor: COLORS.primaryPurple,
    padding: width * 0.04,
    borderRadius: width * 0.6,
    width: width * 0.2,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
      categoryPic: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: width * 0.04,
    borderRadius: width * 0.6,
    width: width * 0.2,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  categoryText: {
    fontSize: width * 0.035,
    color: COLORS.mediumGray,
    marginTop: 5,
    textAlign: 'center',
    fontFamily: 'JosefinSans_400Regular',
  },
  card: {
    width: width * 0.45,
    height: width * 0.6,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginRight: 15,
    padding: 10,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: width * 0.5
  },
  cardImage: {
    width: '100%',
    height: '65%',
    borderRadius: 10,
    marginBottom: width * 0.05,
  },
  cardText: {
    fontSize: 13,
    color: '#555',
    fontFamily: 'JosefinSans_400Regular',
  },
  cardTitle: {
    fontSize: 13,
    color: '#555',
    fontFamily: 'JosefinSans_700Bold',
  },
  cardTitleContainer: {
    flexDirection: 'row',
  },
});
