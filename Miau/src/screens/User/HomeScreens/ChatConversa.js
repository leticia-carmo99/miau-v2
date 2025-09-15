// IMPORTANTE: ESSE COLCHETE NAS MENSAGENS SÓ APARECE NO WEB, NO ANDROID E IOS FICA NORMAL. NAO SEI O QUE É MAS DECIDI NAO MEXER.

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  Dimensions,
  Button,
  useWindowDimensions,
  KeyboardAvoidingView, 
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
} from '@expo-google-fonts/josefin-sans';
import * as SplashScreen from 'expo-splash-screen';
import { useRoute } from '@react-navigation/native';
import ChatUsuario from './ChatUsuario';
import { useNavigation } from '@react-navigation/native';
import PatinhaBranca from '../assets/Logos/patinhabrancapreenchida.png';
import Back from '../assets/FotosInicial/Back.png';

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

export default function ChatScreen() {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      sender: 'user',
      time: '11:32',
    },
    {
      id: '2',
      text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      sender: 'friend',
      time: '11:35',
    },
    {
      id: '3',
      text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      sender: 'friend',
      time: '11:39',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  // Rola para baixo quando o componente é montado
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, []);

  // Rola para baixo quando novas mensagens são adicionadas
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: inputText,
        sender: 'user',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  const handleImagePicker = async () => {
    // Solicita permissão para acessar a galeria
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Permissão necessária',
        'É necessário permitir o acesso à galeria para enviar imagens.'
      );
      return;
    }

    // Abre o seletor de imagens
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newMessage = {
        id: Date.now().toString(),
        image: result.assets[0].uri,
        sender: 'user',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages([...messages, newMessage]);
    }
  };


  const route = useRoute();
  const { user } = route.params || {};
  const { data } = route.params || {};
  const name = user?.name || data?.nome ||  'Usuário';
  const avatar = user?.image || data?.image|| 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150';

  // Para fontes

  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        if (fontsLoaded) {
        await SplashScreen.hideAsync();
        }
      }
    }
    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{backgroundColor: COLORS.offWhite, flex:1}}>
      <KeyboardAvoidingView 
    style={styles.container} 
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
  >
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={{ marginRight: 15 }}
        >
          <Image source={Back} style={styles.back}/>
        </TouchableOpacity>

        <Image
          source={{ uri: avatar }}
          style={styles.avatar}
        />
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.username}>{name}</Text>
          <Text style={styles.status}>Online</Text>
        </View>

        <Image source={PatinhaBranca} style={styles.patinha}/>
      </View>

      <View style={styles.chatContent}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>Hoje - 26/05/2025</Text>
        </View>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => (
            <View
              style={
                item.sender === 'user'
                  ? styles.userMessage
                  : styles.friendMessage
              }>
              {item.text && <Text>{item.text}</Text>}
              {item.image && (
                <Image
                  source={{ uri: item.image }}
                  style={styles.messageImage}
                />
              )}
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
          style={styles.messageList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />
        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={handleImagePicker}
            style={styles.clipButton}>
            <Ionicons name="attach" size={width * 0.07} color="#666" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity onPress={handleSend}>
            <Ionicons name="send" size={width * 0.07} color="#FF5733" />
          </TouchableOpacity>
        </View>
      </View>
      </KeyboardAvoidingView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryOrange,
    paddingTop: width * 0.2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: width * 0.025,
  },
  username: {
    fontSize: 24,
    fontFamily: 'JosefinSans_700Bold',
  },
  status: {
    fontSize: 16,
    color: 'green',
    fontFamily: 'JosefinSans_400Regular',
  },
  dateContainer: {
    marginVertical: width * 0.025,
    alignItems: 'center',
  },
  chatContent: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: width * 0.05,
  },
  dateText: {
    fontSize: 16,
    color: '#777',
    fontFamily: 'JosefinSans_400Regular',
  },
  messageList: {
    flex: 1,
  },
  userMessage: {
    backgroundColor: '#e1ffc7',
    padding: width * 0.025,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    marginVertical: width * 0.01,
    alignSelf: 'flex-end',
    maxWidth: '70%',
    fontFamily: 'JosefinSans_400Regular',
  },
  friendMessage: {
    backgroundColor: COLORS.white,
    padding: width * 0.025,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    marginVertical: width * 0.01,
    alignSelf: 'flex-start',
    maxWidth: '70%',
    fontFamily: 'JosefinSans_400Regular',
  },
  timeText: {
    fontSize: width * 0.03,
    color: '#aaa',
    alignSelf: 'flex-end',
    fontFamily: 'JosefinSans_400Regular',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
    borderRadius: 20,
    padding: width * 0.025,
    marginHorizontal: 5,
    fontFamily: 'JosefinSans_400Regular',
  },
  clipButton: {
    padding: 5,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
  back: {
    height: width * 0.08,
    width: width * 0.08,
    padding: width * 0.08,
  },
  avatar: {
    borderRadius: 30,
    height: width * 0.08,
    width: width * 0.08,
    padding: width * 0.08,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,   
  },
  patinha: {
    width: width * 0.12,
    height: width * 0.12,
    padding: width * 0.05,
    marginRight: '8%',
    paddingHorizontal: width * 0.08,
  }
});
