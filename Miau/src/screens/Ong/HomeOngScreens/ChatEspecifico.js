
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
  const route = useRoute();

  const INPUT_BAR_HEIGHT = 105;
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

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, []);

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
      setMessages((prev) => [...prev, newMessage]);
      setInputText('');
    }
  };

  const handleImagePicker = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Permissão necessária',
          'É necessário permitir o acesso à galeria para enviar imagens.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const newMessage = {
          id: Date.now().toString(),
          image: result.assets[0].uri,
          sender: 'user',
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    } catch (err) {
      console.warn('ImagePicker error', err);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  const { user } = route.params || {};
  const name = user?.name || 'Usuário';
  const avatar =
    user?.image ||
    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150';

  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
  });

  if (!fontsLoaded) return null;

  const renderMessage = ({ item }) => (
    <View
      style={
        item.sender === 'user' ? styles.userMessage : styles.friendMessage
      }>
      {item.text && <Text style={styles.messageText}>{item.text}</Text>}
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.messageImage} />
      )}
      <Text style={styles.timeText}>{item.time}</Text>
    </View>
  );

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

        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.username}>{name}</Text>
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
});
