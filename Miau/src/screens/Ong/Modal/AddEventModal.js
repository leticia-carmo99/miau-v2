import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CalendarModal from './CalendarModal';

const { width } = Dimensions.get('window');

// Importação das fontes (mesmas da outra tela)
import {
  useFonts as useNunitoFonts,
  Nunito_400Regular,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import {
  useFonts as useJosefinFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
  JosefinSans_300Light,
} from '@expo-google-fonts/josefin-sans';

// Função para gerar título baseado no tipo de evento e pets
const generateEventTitle = (eventType, petType) => {
  const eventNames = {
    vacinação: 'Campanha de Vacinação',
    castração: 'Feira de Castração',
    adoção: 'Evento de Adoção',
  };

  const petNames = {
    cães: ' para Cães',
    gatos: ' para Gatos',
    ambos: ' de Pets',
  };

  return `${eventNames[eventType]}${petNames[petType]}`;
};

const AddEventModal = ({ isVisible, onClose, onAddEvent, initialDate }) => {
  // carregar fonts
  const [nunitoFontsLoaded] = useNunitoFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  });
  const [josefinFontsLoaded] = useJosefinFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
    JosefinSans_300Light,
  });

  const [eventType, setEventType] = useState('vacinação');
  const [petType, setPetType] = useState('cães');
  const [address, setAddress] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('16:00');
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [errorMessage, setErrorMessage] = useState('');

  // Sincroniza a data inicial passada como prop com o estado local
  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
    }
  }, [initialDate]);

  // Limpa o formulário quando o modal é aberto
  useEffect(() => {
    if (isVisible) {
      setEventType('vacinação');
      setPetType('cães');
      setAddress('');
      setStartTime('09:00');
      setEndTime('16:00');
      setErrorMessage('');
    }
  }, [isVisible]);

  // espera as fonts carregarem
  if (!nunitoFontsLoaded || !josefinFontsLoaded) {
    return null;
  }

  const handleAddPress = () => {
    // Validação
    if (!address.trim() || !selectedDate) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Validação de horário
    if (startTime >= endTime) {
      setErrorMessage(
        'O horário de início deve ser anterior ao horário final.'
      );
      return;
    }

    setErrorMessage('');

    // Gera o título baseado nas seleções
    const title = generateEventTitle(eventType, petType);

    // Prepara o objeto de evento com a estrutura correta
    const newEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: title,
      date: selectedDate.displayDate,
      isoDate: selectedDate.isoDate,
      startTime,
      endTime,
      location: address, // O endereço será usado como localização
      address: address,
      eventType,
      petType,
    };

    console.log('Novo evento criado:', newEvent);
    onAddEvent(newEvent);
    onClose();
  };

  const RadioButton = ({ label, value, selectedValue, onSelect }) => (
    <TouchableOpacity
      style={styles.radioButtonContainer}
      onPress={() => onSelect(value)}>
      <View
        style={[
          styles.radioCircle,
          selectedValue === value && styles.selectedRadioCircle,
        ]}>
        {selectedValue === value && <View style={styles.selectedRadioDot} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            {/* Botão de voltar alinhado à esquerda */}
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#FFAB36" />
            </TouchableOpacity>

            {/* Container para o dia e o botão de calendário (agrupados) */}
            <View style={styles.dateAndButtonContainer}>
              <Text style={styles.modalTitle}>
                {selectedDate?.displayDate || 'Selecionar Data'}
              </Text>
              <TouchableOpacity
                style={styles.headerCalendarButton}
                onPress={() => setCalendarVisible(true)}>
                <Ionicons name="calendar-outline" size={24} color="#FFAB36" />
              </TouchableOpacity>
            </View>

            {/* Espaçador invisível para centralizar o conteúdo do meio */}
            <View style={styles.backButton} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}>

            {/* Mensagem de erro */}
            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}

            {/* Preview do título que será gerado */}
            <View style={styles.previewSection}>
              <Text style={styles.previewTitle}>
                {generateEventTitle(eventType, petType)}
              </Text>
            </View>

            {/* Formulário de adição de evento */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Tipo de evento:</Text>
              <View style={styles.radioGroup}>
                <RadioButton
                  label="Vacinação"
                  value="vacinação"
                  selectedValue={eventType}
                  onSelect={setEventType}
                />
                <RadioButton
                  label="Castração"
                  value="castração"
                  selectedValue={eventType}
                  onSelect={setEventType}
                />
                <RadioButton
                  label="Adoção"
                  value="adoção"
                  selectedValue={eventType}
                  onSelect={setEventType}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Pets:</Text>
              <View style={styles.radioGroup}>
                <RadioButton
                  label="Cães"
                  value="cães"
                  selectedValue={petType}
                  onSelect={setPetType}
                />
                <RadioButton
                  label="Gatos"
                  value="gatos"
                  selectedValue={petType}
                  onSelect={setPetType}
                />
                <RadioButton
                  label="Ambos"
                  value="ambos"
                  selectedValue={petType}
                  onSelect={setPetType}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Local do evento: *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Parque Municipal, Praça Central, etc."
                value={address}
                onChangeText={setAddress}
                multiline={true}
                numberOfLines={2}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Horário:</Text>
              <View style={styles.timeInputsContainer}>
                <View style={styles.timeInputWrapper}>
                  <Text style={styles.timeLabel}>Início</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={startTime}
                    onChangeText={setStartTime}
                    placeholder="00:00"
                    placeholderTextColor="#999"
                  />
                </View>
                <Ionicons
                  name="time"
                  size={24}
                  color="#FFAB36"
                  style={styles.timeIcon}
                />
                <View style={styles.timeInputWrapper}>
                  <Text style={styles.timeLabel}>Final</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={endTime}
                    onChangeText={setEndTime}
                    placeholder="00:00"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
              <Text style={styles.timeHint}>Formato: HH:MM (ex: 14:30)</Text>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
              <Ionicons
                name="add"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.addButtonText}>Adicionar Evento</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {/* Modal do calendário */}
      <CalendarModal
        isVisible={isCalendarVisible}
        onClose={() => setCalendarVisible(false)}
        onSelectDate={(date) => {
          setSelectedDate(date);
          setCalendarVisible(false);
        }}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white', // Fundo totalmente branco
    borderRadius: 20,
    width: width * 0.9,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '85%',
  },
  scrollView: {
    width: '100%',
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  dateAndButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFAB36',
    marginRight: 10,
    fontFamily: 'JosefinSans_700Bold', // aplicada fonte
  },
  headerCalendarButton: {
    padding: 5,
  },
  errorMessage: {
    color: '#e74c3c',
    marginBottom: 15,
    textAlign: 'center',
    backgroundColor: '#ffeaea',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    fontFamily: 'JosefinSans_300Light', // aplicada fonte leve
  },
  previewSection: {
    width: '100%',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFAB36',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9156D1',
    fontFamily: 'JosefinSans_700Bold', // aplicada fonte
  },
  formSection: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFAB36',
    marginBottom: 10,
    fontFamily: 'JosefinSans_700Bold', // aplicada fonte
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '45%',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFAB36',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectedRadioCircle: {
    borderColor: '#FFAB36',
  },
  selectedRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFAB36',
  },
  radioLabel: {
    fontSize: 15,
    color: '#5A595D',
    fontFamily: 'JosefinSans_400Regular', // aplicada fonte
  },
  input: {
    borderRadius: 10,
    padding: 12,
    width: '100%',
    fontSize: 15,
    backgroundColor: 'white', // Fundo branco
    // Sombra para diferenciação
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    color: '#737373', // Cor do texto do input
    fontFamily: 'Nunito_400Regular', // aplicada fonte para input
  },
  timeInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeInputWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
    fontFamily: 'Nunito_400Regular', // aplicada fonte
  },
  timeInput: {
    borderRadius: 10,
    padding: 10,
    width: '85%',
    textAlign: 'center',
    fontSize: 15,
    backgroundColor: 'white', // Fundo branco
    // Sombra para diferenciação
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    color: '#737373', // Cor do texto do input
    fontFamily: 'Nunito_400Regular', // aplicada fonte
  },
  timeIcon: {
    marginHorizontal: 15,
  },
  timeHint: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'Nunito_400Regular', // aplicada fonte
  },
  addButton: {
    backgroundColor: '#FFAB36',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 10,
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFAB36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Nunito_700Bold', // aplicada fonte do botão
  },
});

export default AddEventModal;
