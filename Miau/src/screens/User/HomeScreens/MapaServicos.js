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
  FlatList
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RadioButton } from "react-native-paper";
import WebView from 'react-native-webview';

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

export default function MapaServicos() {
   const navigation = useNavigation();
     const [value, setValue] = React.useState("1");
  const [search, setSearch] = useState('');
  const [cep, setCep] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [region, setRegion] = useState({
    latitude: -23.55052,
    longitude: -46.633308,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });


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
    {
      id: 'p2',
      name: 'Pet Point',
      logo: require('../assets/FotosInicial/petz.png'),
      distance: '0.4 km',
      description: 'Pet shop',
      lat: -23.54,
      lon: -46.64,
    },
    {
      id: 'p3',
      name: 'Pet-shop',
      logo: require('../assets/FotosInicial/petz.png'),
      distance: '0.8 km',
      description: 'Produtos para cães e',
      lat: -23.553,
      lon: -46.635,
    },
  ];

    const data = [
    {
      id: "1",
      name: "Nicolas Cunha",
      role: "Adestrador",
      username: "@adenico",
      image: require('../assets/FotosMapa/Nicolas.png'),
    },
    {
      id: "2",
      name: "Nicolas Cunha",
      role: "Adestrador",
      username: "@adenico",
      image: require('../assets/FotosMapa/Nicolas.png'),
    },
    {
      id: "3",
      name: "Nicolas Cunha",
      role: "Adestrador",
      username: "@adenico",
      image:  require('../assets/FotosMapa/Nicolas.png'),
    },
  ];

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
        // Usa o script para atualizar o Leaflet dentro do WebView
        webViewRef.current.injectJavaScript(moveMapScript(region));
    }
  }, [region]); 


  // Buscar CEP
  const handleCepSearch = async () => {
    if (cep.length < 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const json = await response.json();

if (json.erro) {
        Alert.alert('Erro', 'CEP não encontrado!');
        return;
      }

      // >>> SUBSTITUA ESTA SEÇÃO A SEGUIR PELO CÓDIGO ABAIXO:

const fullAddress = `${json.logradouro}, ${json.bairro}, ${json.localidade}, ${json.uf}`;

// 2. Usa o Nominatim para buscar as coordenadas desse endereço
const encodedAddress = encodeURIComponent(fullAddress);
const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;

const geoResponse = await fetch(geoUrl, {
    headers: {
        // ESSENCIAL: Adicionar o User-Agent aqui também!
        'User-Agent': 'PetshopApp (seuemail@seudominio.com)', // <-- USE O SEU VALOR REAL
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
      
      // 3. Define a nova região do mapa
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


// ...
  const handleAddressSearch = async () => {
    if (search.trim() === '') return;

    // Codifica a busca para uso na URL
    const encodedSearch = encodeURIComponent(search.trim());
    // URL do serviço de geocodificação Nominatim
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodedSearch}&format=json&limit=1&countrycodes=br`;

    try {
      const response = await fetch(nominatimUrl, {
          headers: {
            'User-Agent': 'PetshopApp (seuemail@seudominio.com)', // ✅ Mantenha e personalize
          }
      });
      
      if (!response.ok) {
        // Se a resposta HTTP não for 200 (OK), lança um erro com o status
        throw new Error(`Status HTTP: ${response.status}. Verifique o User-Agent e o formato da URL.`);
      }

      // Tenta analisar o JSON
      const json = await response.json();

      if (json.length === 0) {
        Alert.alert('Atenção', `Endereço "${search}" não encontrado. Tente ser mais específico.`);
        return;
      }

      const result = json[0];
      
      // Verificação de sanidade para garantir que lat/lon existem
      if (!result.lat || !result.lon) {
        throw new Error('Dados de latitude/longitude ausentes na resposta da API.');
      }
      
      // Converte as coordenadas encontradas para o formato do estado `region`
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
<TouchableOpacity onPress={() => navigation.navigate('MapaPetshopUser')}>
          <View style={styles.category}>
          <View style={styles.categoryPic}>
            <MaterialIcons name="store" size={width * 0.12} color="#9156D1" />
          </View>
            <Text style={styles.categoryText}>Petshops</Text>
          </View>
</TouchableOpacity>
<TouchableOpacity>
          <View style={styles.category}>
          <View style={styles.categoryPicSelected}>
            <MaterialIcons
              name="miscellaneous-services"
              size={width * 0.12}
              color="#fff"
            />
            </View>
            <Text style={styles.categoryText}>Serviços</Text>
          </View>
</TouchableOpacity>

          <View style={styles.category}>
          <View style={styles.categoryPic}>
            <FontAwesome5 name="paw" size={width * 0.12} color="#9156D1" />
            </View>
            <Text style={styles.categoryText}>Veterinário</Text>
          </View>
        </View>

    <View style={styles.radioView}>
      {/* Grupo de opções */}
      <RadioButton.Group onValueChange={setValue} value={value}>
        <View style={styles.option}>
          <RadioButton value="1"   color="#FFAB36" uncheckedColor="#aaa"/>
          <Text style={styles.optionText}>Adestrador</Text>
        </View>

        <View style={styles.option}>
          <RadioButton value="2" color="#FFAB36" uncheckedColor="#aaa" />
          <Text style={styles.optionText}>Banho e Tosa</Text>
        </View>

        <View style={styles.option}>
          <RadioButton value="3" color="#FFAB36" uncheckedColor="#aaa"/>
          <Text style={styles.optionText}>Passeador de cães</Text>
        </View>
      </RadioButton.Group>
          </View>

      {/* Conteúdos que trocam conforme opção */}
      {value === "1" && (
        <View style={styles.box}>
         <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Foto de perfil */}
            <Image source={item.image} style={styles.image} />

            {/* Texto */}
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.role}>{item.role}</Text>
              <Text style={styles.username}>{item.username}</Text>
            </View>

            {/* Botão */}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ServicoUser', {data})}>
              <Text style={styles.buttonText}>Ver perfil</Text>
            </TouchableOpacity>
          </View>
        )}
         />
        </View>
      )}
      {value === "2" && (
        <View style={styles.box}>
         <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Foto de perfil */}
            <Image source={item.image} style={styles.image} />

            {/* Texto */}
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.role}>{item.role}</Text>
              <Text style={styles.username}>{item.username}</Text>
            </View>

            {/* Botão */}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Servico', {data})}>
              <Text style={styles.buttonText}>Ver perfil</Text>
            </TouchableOpacity>
          </View>
        )}
         />
        </View>
      )}
      {value === "3" && (
        <View style={styles.box}>
         <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Foto de perfil */}
            <Image source={item.image} style={styles.image} />

            {/* Texto */}
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.role}>{item.role}</Text>
              <Text style={styles.username}>{item.username}</Text>
            </View>

            {/* Botão */}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Servico', {data})}>
              <Text style={styles.buttonText}>Ver perfil</Text>
            </TouchableOpacity>
          </View>
        )}
         />
        </View>
      )}


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
    maxHeight: height * 0.9,
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
  radioView: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'center',
   backgroundColor: COLORS.offWhite,
   width: '100%'
  },
  option: {
   flexDirection: 'row',
   width: width * 0.7,
   alignItems: 'center',
   justifyContent: 'center'
  },
  optionText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: width * 0.045,
    color: COLORS.mediumGray,
  },
  box: {
    marginVertical: width * 0.05
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4, // Android
    shadowColor: "#000", // iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: 16,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: "JosefinSans_700Bold",
    fontSize: width * 0.06,
    color: "#333",
  },
  role: {
    fontFamily: "JosefinSans_400Regular",
    fontSize: width * 0.04,
    color: "#f39c12",
  },
  username: {
    fontFamily: "JosefinSans_400Regular",
    fontSize: 14,
    color: "#888",
  },
  button: {
    backgroundColor: "#f39c12",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: 'flex-end',
    margin: width * 0.02
  },
  buttonText: {
    fontFamily: "JosefinSans_700Bold",
    fontSize: 14,
    color: "#fff",
  },
});
