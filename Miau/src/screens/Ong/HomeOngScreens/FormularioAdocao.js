import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { auth } from "../../../../firebaseConfig";
import { db } from "../../../../firebaseConfig";

import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
} from '@expo-google-fonts/josefin-sans';
import { Nunito_700Bold } from '@expo-google-fonts/nunito';

const { width } = Dimensions.get('window');

const Colors = {
  primaryOrange: '#FFAB36',
  primaryPurple: '#9156D1',
  white: '#FFFFFF',
  lightGray: '#737373',
  mediumGray: '#5A595D',
  inputBackground: '#F7F7F7',
  inputBorder: '#E8E8E8',
  asteriskRed: '#D9534F', // ADICIONADO
};


const RadioButtonGroup = ({ label, options, selected, onSelect }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>
      {label} <Text style={styles.asterisk}>*</Text>
    </Text>
    <View style={styles.radioContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={styles.radioOption}
          onPress={() => onSelect(option)}>
          <View style={[styles.radioCircle, selected === option && styles.radioCircleChecked]} />
          <Text style={styles.radioLabel}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const FormularioAdocao = ({ route }) => {
  const navigation = useNavigation();
  const { tipoAnimal, onGoBack } = route.params || {};
    const { petParaEdicao } = route.params || {};
  const [ongId, setOngId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [petId, setPetId] = useState(petParaEdicao ? petParaEdicao.id : null);

  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState(null);
  const [sexo, setSexo] = useState(null);
  const [raca, setRaca] = useState('');
  const [porte, setPorte] = useState(null);
  const [cor, setCor] = useState('');
  const [idade, setIdade] = useState('');
  const [descricao, setDescricao] = useState('');
  const [informacoes, setInformacoes] = useState('');
  const [petImageUri, setPetImageUri] = useState(null);
  const [vaccineImageUri, setVaccineImageUri] = useState(null);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);


  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
    Nunito_700Bold,
  });

useEffect(() => {
    if (auth.currentUser) {
      setOngId(auth.currentUser.uid);
    } else {
      Alert.alert('Erro de Acesso', 'É necessário estar logado como ONG para adicionar um pet.');
      navigation.goBack();
    }
    if (petParaEdicao) {
      setPetId(petParaEdicao.id);
      setNome(petParaEdicao.nome || '');
      setEspecie(petParaEdicao.especie || (tipoAnimal === 'Gato' ? 'Gato' : 'Cachorro')); 
      setSexo(petParaEdicao.sexo === 'Macho' ? 'Macho' : 'Fêmea');
      setRaca(petParaEdicao.raca || '');
      setPorte(petParaEdicao.porte || null);
      setCor(petParaEdicao.cor || '');
      setIdade(petParaEdicao.idade || '');
      setDescricao(petParaEdicao.descricao || '');
      setInformacoes(petParaEdicao.informacoes || '');
      setPetImageUri(petParaEdicao.petImageUri || null);
      setVaccineImageUri(petParaEdicao.vaccineImageUri || null);

    } else if (tipoAnimal) {
      setEspecie(tipoAnimal === 'Gato' ? 'Gato' : 'Cachorro');
    }
}, [navigation, petParaEdicao, tipoAnimal]);

  const pickImage = async (setImageUri) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setAttemptedSubmit(true);
    if (!ongId) {
        Alert.alert('Erro', 'O ID da ONG não foi carregado. Tente recarregar a tela.');
        return;
    }
    if (!nome || !especie || !sexo || !idade || !raca || !porte || !cor || !petImageUri || !vaccineImageUri) {
        Alert.alert('Campos Incompletos', 'Por favor, preencha todos os campos obrigatórios (*).');
        return;
    }
    setLoading(true); 
    const petData = {
        nome: nome,
        idade: idade,
        sexo: sexo === 'Macho' ? 'Macho' : 'Fêmea',
        especie: especie === 'Gato' ? 'Gato' : 'Cachorro',
        raca,
        porte,
        cor,
        descricao,
        informacoes,
        ownerId: ongId, 
        petImageUri, 
        vaccineImageUri,
    };
    try {
        if (petId) {
            const petRef = doc(db, 'petsong', petId);
            await updateDoc(petRef, {
                ...petData,
                updatedAt: new Date().toISOString(),
            });
            Alert.alert('Sucesso!', `O pet ${nome} foi atualizado com sucesso!`);
        } else {
            await addDoc(collection(db, 'petsong'), {
                ...petData,
                createdAt: new Date().toISOString(),
            });
            Alert.alert('Sucesso!', `O pet ${nome} foi adicionado para adoção com sucesso!`);
        }
        navigation.goBack();
    } catch (error) {
        console.error(`Erro ao ${petId ? 'atualizar' : 'adicionar'} pet: `, error);
        Alert.alert('Erro', `Não foi possível ${petId ? 'salvar a atualização' : 'adicionar o pet'}. Verifique sua conexão e regras do Firestore.`);
    } finally {
        setLoading(false); 
    }
};


  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={width * 0.12} color={Colors.white} />
          </TouchableOpacity>
          <Image
            source={require('../Images/miAuPretoBranco.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <TouchableOpacity>
            <Feather name="menu" size={width * 0.12} color='#FFFFFF'/>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.pageTitle}>{petId ? 'Editar perfil do pet' : 'Adicione um pet para adoção'}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Foto do pet <Text style={styles.asterisk}>*</Text>
            </Text>
            <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setPetImageUri)}>
              {petImageUri ? (
                <Image source={{ uri: petImageUri }} style={styles.previewImage} />
              ) : (
                <Ionicons name="cloud-upload-outline" size={32} color={Colors.primaryPurple} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nome do pet <Text style={styles.asterisk}>*</Text>
            </Text>
            <TextInput style={styles.input} placeholder="Insira aqui" value={nome} onChangeText={setNome} />
          </View>

          <RadioButtonGroup label="Espécie" options={['Gato', 'Cachorro']} selected={especie} onSelect={setEspecie} />
          <RadioButtonGroup label="Sexo" options={['Macho', 'Fêmea']} selected={sexo} onSelect={setSexo} />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Raça <Text style={styles.asterisk}>*</Text>
            </Text>
            <TextInput style={styles.input} placeholder="Insira aqui" value={raca} onChangeText={setRaca} />
          </View>

          <RadioButtonGroup label="Porte" options={['Pequeno', 'Médio', 'Grande']} selected={porte} onSelect={setPorte} />

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>
                Cor <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput style={styles.input} placeholder="Insira aqui" value={cor} onChangeText={setCor} />
            </View>
            <View style={{ width: 20 }} />
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>
                Idade <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput style={styles.input} placeholder="Ex: 2 anos" value={idade} onChangeText={setIdade} />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Escreva aqui a história do pet..." value={descricao} onChangeText={setDescricao} multiline />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Informações gerais</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Escreva aqui informações sobre a saúde do pet..." value={informacoes} onChangeText={setInformacoes} multiline />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Carteira de vacinação <Text style={styles.asterisk}>*</Text>
            </Text>
            <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setVaccineImageUri)}>
              {vaccineImageUri ? (
                <Image source={{ uri: vaccineImageUri }} style={styles.previewImage} />
              ) : (
                <Ionicons name="cloud-upload-outline" size={32} color={Colors.primaryPurple} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.button, styles.salvarButton]} 
            onPress={handleSave}
            disabled={loading} // <-- ADICIONADO
          >
            <Text style={styles.buttonText}>{loading ? 'Salvando...' : 'Salvar'}</Text> {/* <-- ALTERADO */}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.primaryOrange },
  scrollContainer: { 
    flexGrow: 1,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 25,
    backgroundColor: Colors.primaryOrange,
  },
  headerLogo: { width: 200, height: 80 },
  formContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 35,
  },
  pageTitle: {
    fontSize: 22,
    color: Colors.primaryOrange,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'JosefinSans_700Bold',
  },
  inputGroup: { marginBottom: 15 },
  label: {
    fontSize: 16,
    color: Colors.mediumGray,
    marginBottom: 8,
    fontFamily: 'JosefinSans_400Regular',
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    fontFamily: 'JosefinSans_400Regular',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  uploadButton: {
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 10,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  radioContainer: { flexDirection: 'row', gap: 20 },
  radioOption: { flexDirection: 'row', alignItems: 'center' },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primaryOrange,
    marginRight: 8,
  },
  radioCircleChecked: {
    backgroundColor: Colors.primaryOrange,
    borderWidth: 0,
  },
  radioLabel: {
    fontSize: 16,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.lightGray,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 25,
    backgroundColor: Colors.primaryOrange,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius:15,
    alignItems: 'center',
  },
  salvarButton: {
    backgroundColor: Colors.white,
    marginLeft: 10,
  },
  buttonText: {
    color: Colors.primaryOrange,
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
 
  asterisk: {
    color: Colors.asteriskRed,
  }
});

export default FormularioAdocao;

