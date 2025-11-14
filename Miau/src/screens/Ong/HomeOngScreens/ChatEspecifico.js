
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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
} from '@expo-google-fonts/josefin-sans';
import { useRoute, useNavigation } from '@react-navigation/native';
import PatinhaBranca from '../Images/LogoMiniPretoBranco.png';
import { collection, query, where, onSnapshot, orderBy, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { useOng } from '../NavigationOng/OngContext';
import { db } from "../../../../firebaseConfig";

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

const convertUriToBase64 = async (uri) => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Data = reader.result.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
                resolve(base64Data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });

    } catch (error) {
        console.error("Erro ao converter para Base64:", error);
        return null;
    }
};

export default function ChatScreen() {
const navigation = useNavigation();
    const route = useRoute();
    const { ongData } = useOng();
    const ongId = ongData?.uid; 
    const { 
     chatId, 
     targetName, 
     targetUser, 
     targetImage,
     data
    } = route.params || {};

const otherUserName = targetName || data?.nomeOutroLado || 'Usuário';
const otherUserAvatar = targetImage || data?.fotoOutroLado || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150';
    const [messages, setMessages] = useState([]); 
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

  const INPUT_BAR_HEIGHT = 105;

    useEffect(() => {
        if (!chatId) return;

        const msgsRef = collection(db, "chat", chatId, "mensagens");
        const q = query(msgsRef, orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => {
                const msgData = doc.data();
                const senderType = msgData.remetenteId === ongId ? 'user' : 'friend';
                
                const timeString = msgData.timestamp?.toDate()?.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }) || '...';

                return {
                    id: doc.id,
                    text: msgData.texto || null,
                    image: msgData.fotoBase64 || null, // Se for Base64
                    sender: senderType,
                    time: timeString,
                };
            });
            setMessages(fetchedMessages);
            setIsLoading(false);
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 50);
        }, (error) => {
            console.error("Erro ao buscar mensagens:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [chatId, ongId]); 
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [messages.length]);
    const handleSend = useCallback(async () => {
        const text = inputText.trim();
        if (!chatId || !ongId || !text) return;

        try {
            const msgsRef = collection(db, "chat", chatId, "mensagens");
            
            await addDoc(msgsRef, {
                texto: text,
                remetenteId: ongId,
                timestamp: serverTimestamp(),
            });
            const chatDocRef = doc(db, "chat", chatId);
            await updateDoc(chatDocRef, {
                ultima_msg: text,
                ultima_alz: serverTimestamp(),
                naoLidasOng: 0, 
            });


            setInputText('');
        } catch (error) {
            console.error("Erro ao enviar mensagem de texto:", error);
            Alert.alert("Erro", "Não foi possível enviar a mensagem.");
        }
    }, [inputText, chatId, ongId]);

    const handleImagePicker = useCallback(async () => {
        if (!chatId || !ongId) return;

        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert('Permissão necessária', 'É necessário permitir o acesso à galeria para enviar imagens.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.2, 
            });

            if (!result.canceled && result.assets?.[0]?.uri) {
                const uri = result.assets[0].uri;
                const base64Image = await convertUriToBase64(uri);
                
                if (base64Image) {
                    const msgsRef = collection(db, "chat", chatId, "mensagens");
                    await addDoc(msgsRef, {
                        fotoBase64: base64Image,
                        remetenteId: ongId,
                        timestamp: serverTimestamp(),
                    });

                    const chatDocRef = doc(db, "chat", chatId);
                    await updateDoc(chatDocRef, {
                        ultima_msg: "📷 Foto",
                        ultima_alz: serverTimestamp(),
                        naoLidasOng: 0, 
                    });
                }
            }
        } catch (err) {
            console.warn('ImagePicker error', err);
            Alert.alert('Erro', 'Não foi possível selecionar ou enviar a imagem.');
        }
    }, [chatId, ongId]);

  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
  });

 if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Carregando conversa...</Text>
            </View>
        );
    }
    
    if (!chatId) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Chat inválido ou não selecionado.</Text>
            </View>
        );
    }

const renderMessage = ({ item }) => {
        const imageSource = item.image ? `data:image/jpeg;base64,${item.image}` : null;

        return (
            <View
                style={
                    item.sender === 'user' ? styles.userMessage : styles.friendMessage
                }>
                {item.text && <Text style={styles.messageText}>{item.text}</Text>}
                {imageSource && (
                    <Image source={{ uri: imageSource }} style={styles.messageImage} />
                )}
                <Text style={styles.timeText}>{item.time}</Text>
            </View>
        );
    };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginRight: 15 }}>
          <Ionicons name="arrow-back" size={28} color={COLORS.darkGray} />
        </TouchableOpacity>

        <Image source={{ uri: otherUserAvatar }} style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.username}>{otherUserName}</Text>
          <Text style={styles.status}>Online</Text>
        </View>

        <Image source={PatinhaBranca} style={styles.patinha} />
      </View>

      <View style={styles.chatContent}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>Hoje - 26/05/2025</Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>

   
      <View style={[styles.inputContainerFixed, { height: INPUT_BAR_HEIGHT }]}>
        <TouchableOpacity onPress={handleImagePicker} style={styles.clipButton}>
          <Ionicons name="attach" size={24} color="#666" />
        </TouchableOpacity>
        <TextInput
          style={styles.inputFixed}
          placeholder="Digite sua mensagem"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendBtnFixed}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryOrange,
    paddingTop: width * 0.02,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: width * 0.025,
    paddingHorizontal: 12,
    marginTop: 25,
    paddingTop: Platform.OS === 'android' ? 8 : 0,
  },
  username: {
    fontSize: 20,
    fontFamily: 'JosefinSans_700Bold',
    color: COLORS.darkGray,
  },
  status: {
    fontSize: 14,
    color: 'green',
    fontFamily: 'JosefinSans_400Regular',
  },
  dateContainer: { marginVertical: width * 0.02, alignItems: 'center' },
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
  messageList: { flex: 1 },
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
  messageText: {
    fontSize: 15,
    color: COLORS.darkGray,
    fontFamily: 'JosefinSans_400Regular',
  },
  timeText: {
    fontSize: width * 0.03,
    color: '#aaa',
    alignSelf: 'flex-end',
    marginTop: 6,
    fontFamily: 'JosefinSans_400Regular',
  },
  inputContainerFixed: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: COLORS.offWhite,
  },
  clipButton: { padding: 5 },
  inputFixed: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    fontFamily: 'JosefinSans_400Regular',
  },
  sendBtnFixed: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryOrange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageImage: { width: 200, height: 150, borderRadius: 10, marginBottom: 5 },
  avatar: { borderRadius: 30, height: width * 0.08, width: width * 0.08 },
  patinha: { width: width * 0.12, height: width * 0.12, marginRight: '6%' },
  loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.offWhite,
    },
    loadingText: {
        fontFamily: 'JosefinSans_400Regular',
        fontSize: 16,
        color: COLORS.mediumGray,
    },
});
