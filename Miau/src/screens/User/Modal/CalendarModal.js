import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CalendarModal = ({ isVisible, onClose, onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getMonthName = (date) => {
    // Mantém o ano no cabeçalho para contexto
    return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDayPress = (day) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const isoDate = selected.toISOString();
    // Formato de exibição alterado para DIA e MÊS
    const displayDate = selected.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
    });
    onSelectDate({ isoDate, displayDate });
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);

    // Define o "hoje" sem as horas para comparação correta
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const calendarDays = [];
    for (let i = 0; i < firstDayIndex; i++) {
      calendarDays.push(<View key={`empty-${i}`} style={styles.dayContainer} />);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const isPastDate = dayDate < today;

      calendarDays.push(
        <TouchableOpacity
          key={`day-${i}`}
          style={styles.dayContainer}
          onPress={() => handleDayPress(i)}
          disabled={isPastDate} // Desabilita o toque para dias passados
        >
          <Text style={[styles.dayText, isPastDate && styles.disabledDayText]}>
            {i}
          </Text>
        </TouchableOpacity>
      );
    }
    return calendarDays;
  };

  const changeMonth = (amount) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + amount, 1));
  };

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}>
      <TouchableOpacity style={styles.centeredView} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.modalView}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => changeMonth(-1)}>
              <Ionicons name="chevron-back" size={24} color="#FFAB36" />
            </TouchableOpacity>
            <Text style={styles.monthText}>{getMonthName(currentDate)}</Text>
            <TouchableOpacity onPress={() => changeMonth(1)}>
              <Ionicons name="chevron-forward" size={24} color="#FFAB36" />
            </TouchableOpacity>
          </View>
          <View style={styles.weekDaysContainer}>
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => (
              <Text key={`weekday-${index}`} style={styles.weekDayText}>{day}</Text>
            ))}
          </View>
          <View style={styles.calendarGrid}>{renderCalendar()}</View>
        </TouchableOpacity>
      </TouchableOpacity>
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
    backgroundColor: 'white',
    borderRadius: 20,
    width: width * 0.9,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFAB36',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekDayText: {
    fontWeight: 'bold',
    color: '#999',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayContainer: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  disabledDayText: {
    color: '#ccc', // Estilo para dias desabilitados
  },
});

export default CalendarModal;
