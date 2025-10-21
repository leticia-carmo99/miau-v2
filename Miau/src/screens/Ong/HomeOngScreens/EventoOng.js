
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';


import AddEventModal from '../Modal/AddEventModal'; 


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
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
const weekDays = ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'];

const getDayName = (date) => {
  const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  return days[date.getDay()];
};


const CalendarScreen = () => {
  const navigation = useNavigation();

  const [nunitoFontsLoaded] = useNunitoFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  });
  const [josefinFontsLoaded] = useJosefinFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
    JosefinSans_300Light,
  });


  const [markedEvents, setMarkedEvents] = useState({});
  const [currentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [isAddEventModalVisible, setAddEventModalVisible] = useState(false);
  const [selectedDateForEvent, setSelectedDateForEvent] = useState(null);


  const EXTRA_BOTTOM_SPACE = Math.round(width * 0.45);

  useEffect(() => {
    const today = new Date();
    const eventYear = today.getFullYear();
    const eventMonth = String(today.getMonth() + 1).padStart(2, '0');
    const eventDay = '23';
    const eventDateKey = `${eventYear}-${eventMonth}-${eventDay}`;
    const eventDisplayDate = `${eventDay} de ${monthNames[today.getMonth()].toLowerCase()}`;

    const DUMMY_EVENTS = {
      [eventDateKey]: {
        marked: true,
        dotColor: '#9156D1',
        events: [
          {
            id: 'dummy-1',
            title: 'Encontro e doação de cães e gatos',
            date: eventDisplayDate,
            isoDate: eventDateKey,
            startTime: '09:00',
            endTime: '16:00',
            location: 'Rua Professora Rosália dos Santos, 123 - Bairro Cidade',
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
        <TouchableOpacity
          key={day}
          style={[styles.dayCell, isToday && styles.todayCell]}
          onPress={() => {
           
            const selectedDate = new Date(selectedYear, selectedMonth, day);
            const displayDate = selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
            const isoDate = dateKey;
            
            setSelectedDateForEvent({ displayDate, isoDate });
            setAddEventModalVisible(true);
          }}
        >
          <Text style={[styles.dayText, isMarked && styles.markedDayText, isToday && styles.todayText]}>
            {day}
          </Text>
          {isMarked && <View style={styles.eventMarkerBar} />}
        </TouchableOpacity>
      );
    }

    const remainingCells = totalCells - (days.length);
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


  const handleAddEventFromModal = (newEvent) => {
    const dateKey = newEvent.isoDate;

    setMarkedEvents(prevEvents => {
      const existingEventsForDate = prevEvents[dateKey]?.events || [];
      return {
        ...prevEvents,
        [dateKey]: {
          marked: true,
          dotColor: '#9156D1',
          events: [...existingEventsForDate, newEvent],
        },
      };
    });

    setAddEventModalVisible(false);
  };

  if (!nunitoFontsLoaded || !josefinFontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.fixedHeaderContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Feather name="menu" size={width * 0.12} color='#FFFFFF'/>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('PerfilOngOng')}
          >
            <Image source={require('../Images/foto-user-branco.png')} style={{ width: width * 0.12, height: width * 0.12, resizeMode: 'contain',}} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.scrollableOrangeSection}>
          <TouchableOpacity
            style={styles.addEventButton}
            onPress={() => {
              const today = new Date();
              const displayDate = today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
              const isoDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
              
              setSelectedDateForEvent({ displayDate, isoDate });
              setAddEventModalVisible(true);
            }}
          >
            <Text style={styles.addEventText}>Adicione um evento!</Text>
          </TouchableOpacity>

          <View style={styles.monthYearContainer}>
            <TouchableOpacity onPress={handlePrevMonth}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.dateTextContainer}>
              <Text style={styles.monthText}>{monthNames[selectedMonth]}</Text>
              <Text style={styles.yearText}>{selectedYear}</Text>
            </View>
            <TouchableOpacity onPress={handleNextMonth}>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>
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
              <Text style={styles.noEventsSubText}>Clique em "Adicione um evento!" para começar.</Text>
            </View>
          ) : (
            getAllMarkedEvents().map((event, index) => {
              const eventDate = new Date(event.isoDate);
              const dayName = getDayName(eventDate);
              
              return (
                <View style={styles.eventBanner} key={event.id || index}> 
                  <TouchableOpacity onPress={() => navigation.navigate('EventoDetalhes')}>
                    <View style={styles.eventCard}>
                      <View style={styles.eventDarkArea}>
                        <Text style={styles.eventDate}>{event.date}</Text>
                        <Text style={styles.eventTitle}>{event.title}</Text>
                      </View> 
                      <View style={styles.eventLocationContainer}>
                        <Text style={styles.eventWeekTime}>{`${dayName} • ${event.startTime} às ${event.endTime}`}</Text>
                        <Text style={styles.eventLocation}>{event.location}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })
          )}

     
          <View style={{ height: EXTRA_BOTTOM_SPACE }} />
        </View>
     
      </ScrollView>

      
      {selectedDateForEvent && (
        <AddEventModal
          isVisible={isAddEventModalVisible}
          onClose={() => setAddEventModalVisible(false)}
          onAddEvent={handleAddEventFromModal}
          initialDate={selectedDateForEvent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.orange,
  },
  fixedHeaderContainer: {
    backgroundColor: COLORS.orange,
    paddingHorizontal: 15,
    paddingBottom: 0,
    zIndex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 35,
    paddingBottom: 5,
  },
  menuButton: {
    padding: 3,
  },
  profileButton: {
    padding: 3,
  },
  scrollableOrangeSection: {
    backgroundColor: COLORS.orange,
    paddingHorizontal: 15,
    paddingTop: 0,
  },
  addEventButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignSelf: 'center',
    marginBottom: 10,
    width: '75%',
  },
  addEventText: {
    color: COLORS.orange,
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'JosefinSans_700Bold',
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
  monthText: {
    color: COLORS.white,
    fontSize: 22,
    textTransform: 'capitalize',
    marginRight: 8,
    fontFamily: 'JosefinSans_700Bold',
  },
  yearText: {
    color: COLORS.white,
    fontSize: 22,
    fontFamily: 'JosefinSans_700Bold',
  },
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
    color: COLORS.white,
    fontSize: 15,
    flex: 1,
    textAlign: 'center',
    fontFamily: 'JosefinSans_400Regular',
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
  emptyDay: {
    width: (width - 50) / 7,
    height: 35,
  },
  todayCell: {
    backgroundColor: COLORS.primaryPurple,
    borderRadius: 17,
  },
  dayText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: 'JosefinSans_400Regular',
  },
  markedDayText: {
    color: COLORS.white,
    fontFamily: 'JosefinSans_700Bold',
  },
  todayText: {
    fontFamily: 'JosefinSans_700Bold',
    color: COLORS.white,
  },
  eventMarkerBar: {
    width: '50%',
    height: 3,
    backgroundColor: COLORS.white,
    borderRadius: 2,
    position: 'absolute',
    bottom: 5,
  },
  eventsSection: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingTop: 25, 
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    flexGrow: 1,
    zIndex: 2,
  },
  eventsTitle: {
    fontSize: 18,
    color: COLORS.primaryPurple,
    marginBottom: 10, 
    fontFamily: 'JosefinSans_700Bold',
  },
  noEventsContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  noEventsText: {
    fontSize: 16,
    color: COLORS.blogTextGray,
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: 'JosefinSans_400Regular',
  },
  noEventsSubText: {
    fontSize: 14,
    color: COLORS.blogTextGray,
    textAlign: 'center',
    fontFamily: 'JosefinSans_300Light',
  },
  eventBanner: {
    alignSelf: 'center',
    marginBottom: width * 0.03, 
    paddingVertical: width * 0.03, 
    width: '100%',
    justifyContent: 'center',
  },
  eventCard: {
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderTopLeftRadius: 0,
    paddingBottom: width * 0.05,
    width: '90%',
    height: width * 0.40, 
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'column',
  },
  eventDate: {
    fontSize: width * 0.055,
    color: COLORS.white,
    marginTop: width * 0.014,
    marginBottom: width * 0.003,
    fontFamily: 'JosefinSans_700Bold',
  },
  eventTitle: {
    fontSize: width * 0.035,
    color: COLORS.white,
    marginBottom: width * 0.025,
    fontFamily: 'JosefinSans_700Bold',
    textAlign: 'center',
    marginHorizontal: width * 0.03,
  },
  eventLocationContainer: {
    marginLeft: width * 0.03,
    marginBottom: width * 0.05,
    justifyContent: 'center',
    flex: 1,
  },
  eventWeekTime: {
    fontSize: width * 0.04,
    color: COLORS.blogTextGray,
    marginLeft: width * 0.012,
    fontFamily: 'Nunito_400Regular',
    marginRight: width * 0.04,
  },
  eventLocation: {
    fontSize: width * 0.04,
    color: COLORS.primaryPurple,
    marginLeft: width * 0.012,
    fontFamily: 'Nunito_400Regular',
    marginRight: width * 0.04,
  },
  eventDarkArea: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryPurple,
    alignItems: 'center',
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    width: '75%',
    marginBottom: width * 0.02,
    height: '50%',
    justifyContent: 'center',
  },
});

export default CalendarScreen;
