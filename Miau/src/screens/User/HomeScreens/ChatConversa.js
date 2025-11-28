import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import { useRoute, useNavigation } from '@react-navigation/native';
import { useUser } from "../NavigationUser/UserContext"; 
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  orderBy, 
  query, 
  serverTimestamp, 
  doc, 
  updateDoc,
  getDoc,
  setDoc, 
} from 'firebase/firestore';
import { db } from "../../../../firebaseConfig";
import * as FileSystem from 'expo-file-system';


const { width } = Dimensions.get('window');

const COLORS = {
  primaryOrange: '#FFAB36',
  primaryPurple: '#9156D1',
  white: '#FFFFFF',
  black: '#000000',
  darkGray: '#333333',
  mediumGray: '#666666',
  offWhite: '#f8f8f8',
};

const getFormattedDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

export default function ChatScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
const { targetUser, targetName, chatId: routeChatId } = route.params || {};
  
  const { userData } = useUser(); 
  const currentUserId = userData?.uid; 
  const friendId = targetUser;
  const name = targetName || 'Prestador de Serviço';
  const avatar = 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'; // Usando o avatar mockado

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [chatId, setChatId] = useState(null); 
  const flatListRef = useRef(null);
  const [loading, setLoading] = useState(true);
  

  
// EFEITO PRINCIPAL CORRIGIDO: Implementando um cleanup mais seguro para Promises assíncronas
  useEffect(() => {
if (!currentUserId || !friendId || !routeChatId) {
            Alert.alert("Erro", "IDs de chat ou usuário ausentes. Não foi possível iniciar.");
            setLoading(false);
            return;
        }
    
    // Declara a variável de unsubscribe. Começa como undefined.
    let unsubscribe;

    const initializeChat = async () => {
        try {
            const generatedChatId = routeChatId;
            
            
            setChatId(generatedChatId); 
            
            const messagesRef = collection(db, "chat", generatedChatId, "msg");
            const q = query(messagesRef, orderBy("createdAt", "asc"));

            unsubscribe = onSnapshot(q, (snapshot) => {
                const msgs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    time: doc.data().createdAt?.toDate()?.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }) || '...',
                    sender: doc.data().senderId === currentUserId ? 'user' : 'friend',
                }));
                setMessages(msgs);
                setLoading(false);
            }, (error) => {
                // Captura o erro de permissão aqui
                console.error("Erro no onSnapshot (Listener de mensagens): ", error);
                Alert.alert("Erro de Permissão", "Não foi possível carregar as mensagens. Verifique as regras do Firebase.");
                setLoading(false);
            });
            
        } catch (error) {
            console.error("Erro ao inicializar o chat: ", error);
            Alert.alert("Erro", "Falha crítica ao iniciar o chat.");
            setLoading(false);
        }
    };
    
    // Chama a função assíncrona imediatamente
    initializeChat();
    return () => {
        if (typeof unsubscribe === 'function') {
            unsubscribe();
        }
    }; 

  }, [currentUserId, friendId, routeChatId]);

  useEffect(() => {
    if (!loading && flatListRef.current) {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 300); 
    }
  }, [messages, loading]);

const handleSend = async (messageText = inputText, imageUri = null) => {
    if (!chatId || !currentUserId || (!messageText.trim() && !imageUri)) return;

    try {
        const message = messageText.trim() || "Imagem";
        const newMessageData = {
            text: messageText.trim(),
            image: imageUri,
            senderId: currentUserId,
            createdAt: serverTimestamp(),
        };
        await addDoc(collection(db, "chat", chatId, "msg"), newMessageData);
        const chatRef = doc(db, "chat", chatId);
        await updateDoc(chatRef, {
            ultima_msg: message,
            ultima_alz: serverTimestamp(),
        });

        setInputText('');
    } catch (error) {
        console.error("Erro ao enviar mensagem: ", error);
        Alert.alert("Erro", "Não foi possível enviar a mensagem.");
    }
};
const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
        Alert.alert("Permissão Necessária", "Precisamos de permissão para acessar suas fotos para enviar uma imagem.");
        return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.2,
    });

    if (!result.canceled) {
        const uri = result.assets[0].uri;
        const base64Data = await convertUriToBase64(uri);
        
        if (base64Data) {
            await handleSend(null, base64Data); 
        } else {
            Alert.alert("Erro", "Não foi possível processar a imagem.");
        }
    }
};

const convertUriToBase64 = async (uri) => {
    try {
        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        return `data:image/jpeg;base64,${base64}`;
    } catch (e) {
        console.error("Erro ao converter para Base64:", e);
        return null;
    }
}


  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  
  const today = getFormattedDate(new Date());
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
            <Image 
                source={require('../assets/FotosInicial/Back.png')} // Caminho ajustado para evitar erros de mock
                style={styles.back}
            />
          </TouchableOpacity>

          <Image
            source={{ uri: avatar }}
            style={styles.avatar}
          />
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.username}>{name}</Text>
            <Text style={styles.status}>Offline</Text>
          </View>

          <Image 
            source={require('../assets/Logos/patinhabrancapreenchida.png')} // Caminho ajustado para evitar erros de mock
            style={styles.patinha}
          />
        </View>

        <View style={styles.chatContent}>
          {/* CORRIGIDO: Data dinâmica */}
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>Hoje - {today}</Text>
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
                    {item.text.length > 0 && <Text style={styles.messageText}>{item.text}</Text>}
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
            contentContainerStyle={{paddingBottom: 20}}
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
              onSubmitEditing={() => handleSend(inputText)} // Permite enviar pelo Enter/Return
              returnKeyType="send"
            />
            <TouchableOpacity onPress={() => handleSend(inputText)}>
              <Ionicons 
                name="send" 
                size={width * 0.07} 
                // Ícone laranja se tiver texto, cinza se estiver vazio
                color={inputText.trim() ? COLORS.primaryOrange : COLORS.mediumGray} 
              />
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
