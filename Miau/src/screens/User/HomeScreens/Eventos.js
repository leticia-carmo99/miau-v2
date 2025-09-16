import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Menu from '../NavigationUser/MenuV1';

const { width } = Dimensions.get('window');

const COLORS = {
  primaryPurple: '#9156D1',
  blogTextGray: '#7A7A7A',
  white: '#FFFFFF',
  black: '#000000',
  orange: '#FFA726',
  lightGray: '#F5F5F5',
};

const monthNames = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
];
const weekDays = ['Do','Se','Te','Qu','Qu','Se','Sa'];

const getDayName = (date) => {
  const days = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
  return days[date.getDay()];
};

const getEventImage = (eventType) => {
  const eventImages = {
    'vacinação': require('../assets/FotosEvento/Vacina.png'),
    'castração': require('../assets/FotosEvento/Castracao.png'),
    'adoção': require('../assets/FotosEvento/pataAdocao.png'),
  };
  return eventImages[eventType] || eventImages['vacinação'];
};

const Eventos = () => {
  const navigation = useNavigation();

  const [markedEvents, setMarkedEvents] = useState({});
  const [currentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    const DUMMY_EVENTS = {
      '2025-09-25': {
        marked: true,
        dotColor: '#9156D1',
        events: [
          {
            id: 'dummy-1',
            title: 'Evento de adoção de pets',
            date: '25 de setembro',
            isoDate: '2025-09-25',
            startTime: '13:00',
            endTime: '17:00',
            location: 'Parque Municipal',
            eventType: 'adoção',
            petType: 'ambos',
            address: 'Parque Municipal - Centro'
          }
        ]
      },
    };
    setMarkedEvents(DUMMY_EVENTS);
  }, []);

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setSelectedMonth(prevMonth => {
      if (prevMonth === 0) {
        setSelectedYear(prevYear => prevYear - 1);
        return 11;
      }
      return prevMonth - 1;
    });
  };

  const handleNextMonth = () => {
    setSelectedMonth(prevMonth => {
      if (prevMonth === 11) {
        setSelectedYear(prevYear => prevYear + 1);
        return 0;
      }
      return prevMonth + 1;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];
    const totalCells = 42;

    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isMarked = markedEvents[dateKey];
      const isToday = day === currentDate.getDate() &&
        selectedMonth === currentDate.getMonth() &&
        selectedYear === currentDate.getFullYear();

      days.push(
        <View
          key={day}
          style={[
            styles.dayCell,
            isToday && styles.todayCell
          ]}
        >
          <Text style={[
            styles.dayText,
            isMarked && styles.markedDayText,
            isToday && styles.todayText
          ]}>
            {day}
          </Text>
          {isMarked && <View style={styles.eventMarkerBar} />}
        </View>
      );
    }

    const remainingCells = totalCells - days.length;
    for (let i = 0; i < remainingCells; i++) {
      days.push(<View key={`empty-end-${i}`} style={styles.emptyDay} />);
    }

    return days;
  };

  const getAllMarkedEvents = () => {
    const events = [];
    if (markedEvents && typeof markedEvents === 'object') {
      Object.values(markedEvents).forEach(dateData => {
        if (dateData && dateData.events) {
          events.push(...dateData.events);
        }
      });
    }
    return events.sort((a, b) => new Date(a.isoDate) - new Date(b.isoDate));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.fixedHeaderContainer}>
        <View style={styles.header}>
          <Menu background='colorful' />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.scrollableOrangeSection}>

          <View style={styles.monthYearContainer}>
            <Ionicons name="chevron-back" size={24} color="white" onPress={handlePrevMonth} />
            <View style={styles.dateTextContainer}>
              <Text style={styles.monthText}>{monthNames[selectedMonth]}</Text>
              <Text style={styles.yearText}>{selectedYear}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="white" onPress={handleNextMonth} />
          </View>

          <View style={styles.calendar}>
            <View style={styles.weekDaysRow}>
              {weekDays.map((day, index) => (
                <Text key={index} style={styles.weekDayText}>{day}</Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {renderCalendar()}
            </View>
          </View>
        </View>

        <View style={styles.eventsSection}>
          <Text style={styles.eventsTitle}>Eventos marcados</Text>

          {getAllMarkedEvents().length === 0 ? (
            <View style={styles.noEventsContainer}>
              <Text style={styles.noEventsText}>Nenhum evento marcado ainda.</Text>
            </View>
          ) : (
            getAllMarkedEvents().map((event, index) => {
              const eventDate = new Date(event.isoDate);
              const dayName = getDayName(eventDate);
              
              return (
                <View key={event.id || index} style={styles.eventBanner}>
                  <View style={styles.eventCard}>
                    <View style={styles.eventPurpleSection}>
                      <View style={styles.eventInfo}>
                        <Text style={styles.eventDate}>{event.date}</Text>
                        <Text style={styles.eventTitle}>{event.title}</Text>
                      </View>
                      <View style={styles.eventImageBox}>
                        <Image
                          source={getEventImage(event.eventType)}
                          style={styles.eventImage}
                          resizeMode="contain"
                        />
                      </View>
                    </View>

                    <View style={styles.eventWhiteSection}>
                      <Text style={styles.eventWeekTime}>
                        {`${dayName} • ${event.startTime} às ${event.endTime}`}
                      </Text>
                      <Text style={styles.eventLocation}>{event.location}</Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFA726' },
  fixedHeaderContainer: {
    backgroundColor: '#FFA726',
    paddingHorizontal: 15,
    paddingBottom: 0,
    zIndex: 1,
  },
  scrollViewContent: { flexGrow: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 35,
    paddingBottom: 5,
  },
  scrollableOrangeSection: {
    backgroundColor: '#FFA726',
    paddingHorizontal: 15,
    paddingTop: 0,
  },
  monthYearContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 3,
  },
  dateTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  monthText: { color: 'white', fontSize: 22, fontWeight: 'bold', marginRight: 8 },
  yearText: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  calendar: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    marginHorizontal: 0, 
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 4,
  },
  weekDayText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', 
  },
  dayCell: {
    width: (width - 10) / 8, 
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    position: 'relative',
  },
  emptyDay: { width: (width - 50) / 7, height: 35 },
  todayCell: { backgroundColor: '#9156D1', borderRadius: 17 },
  dayText: { color: 'white', fontSize: 14 },
  markedDayText: { color: 'white', fontWeight: 'bold' },
  todayText: { fontWeight: 'bold', color: 'white' },
  eventMarkerBar: {
    width: '50%',
    height: 3,
    backgroundColor: 'white',
    borderRadius: 2,
    position: 'absolute',
    bottom: 5,
  },
  eventsSection: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingTop: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    flexGrow: 1,
    zIndex: 2,
  },
  eventsTitle: { fontSize: 17, fontWeight: 'bold', color: '#9156D1', marginBottom: 10 },
  noEventsContainer: { alignItems: 'center', paddingVertical: 40 },
  noEventsText: { fontSize: 16, color: '#7A7A7A', textAlign: 'center', marginBottom: 5 },
  eventBanner: { marginBottom: 20, width: '100%', alignItems: 'center' },
  eventCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    width: '90%',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  eventPurpleSection: {
    backgroundColor: COLORS.primaryPurple,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  eventInfo: { flex: 1, marginRight: 10 },
  eventDate: { fontSize: 16, fontWeight: 'bold', color: COLORS.white, marginBottom: 2 },
  eventTitle: { fontSize: 12, fontWeight: '600', color: COLORS.white },
  eventImageBox: {
    width: 40, height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventImage: { width: 24, height: 24, tintColor: COLORS.white },
  eventWhiteSection: { backgroundColor: COLORS.white, padding: 15 },
  eventWeekTime: { fontSize: 12, color: COLORS.blogTextGray, fontWeight: '400', marginBottom: 4 },
  eventLocation: { fontSize: 12, color: COLORS.primaryPurple, fontWeight: '500', lineHeight: 15 },
});

export default Eventos;
