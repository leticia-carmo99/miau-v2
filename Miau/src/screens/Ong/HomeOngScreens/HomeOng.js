import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';


import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
} from '@expo-google-fonts/josefin-sans';
import { Nunito_700Bold } from '@expo-google-fonts/nunito';

const { width, height } = Dimensions.get('window');

const Colors = {
  primaryOrange: '#FFAB36',
  lightGray: '#F0F0F0',
  darkGray: '#333333',
  white: '#FFFFFF',
  black: '#737373',
};

export default function HomeOng() {
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState(new Date());

  
  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
    Nunito_700Bold,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getMonthName = (date) => {
    const options = { month: 'short' };
    return date.toLocaleString('pt-BR', options).toUpperCase().replace('.', '');
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const navigateToEvents = () => {
    navigation.navigate('EventosOngTab');
  };

  const navigateToAddDog = () => {
    navigation.navigate('PetsAdocaoTab', { tipoInicial: 'cao' });
  };

  const navigateToAddCat = () => {
    navigation.navigate('PetsAdocaoTab', { tipoInicial: 'gato' });
  };

  const today = currentDate;
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push('');
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.orangeBackground} />
      <View style={styles.fixedHeaderContainer}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Feather name="menu" size={width * 0.12} color='#FFFFFF'/>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('PerfilOng')}>
            <Image source={require('../Images/foto-user-branco.png')} style={{ width: width * 0.12, height: width * 0.12, resizeMode: 'contain',}} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.scrollableOrangeSection}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Bem-vindo,</Text>
            <Text style={styles.ongName}>Patinhas Felizes</Text>
          </View>
          <Text style={styles.adoptionSubtitle}>Coloque para adoção!</Text>
          <View style={styles.petButtonsContainer}>
            <TouchableOpacity
              style={styles.petButton}
              onPress={navigateToAddDog}>
              <Image
                source={require('../Images/AdicionarCao.png')}
                style={styles.petButtonImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.petButton}
              onPress={navigateToAddCat}>
              <Image
                source={require('../Images/AdicionarGato.png')}
                style={styles.petButtonImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.calendarSection}>
          <Text style={styles.eventTitle}>Adicione um evento!</Text>
      
          <TouchableOpacity
            style={styles.calendarContainer}
            onPress={navigateToEvents}>
            <View style={styles.calendarHeader}>
              <Text style={styles.headerDateText}>
                {String(currentDay).padStart(2, '0')}
              </Text>
              <Text style={styles.headerDateText}>
                {getMonthName(currentDate)}
              </Text>
              <Text style={styles.headerDateText}>{currentYear}</Text>
            </View>

            <View style={styles.calendarBody}>
              <View style={styles.calendarGrid}>
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => (
                  <View
                    key={`header-${index}`}
                    style={styles.calendarHeaderDay}>
                    <Text style={styles.calendarDayOfWeek}>{day}</Text>
                  </View>
                ))}
                {calendarDays.slice(0, 35).map((day, index) => {
                  const isCurrentDay =
                    day === today.getDate() &&
                    currentMonth === today.getMonth() &&
                    currentYear === today.getFullYear();
                  return (
                    <View
                      key={`day-${index}`}
                      style={styles.calendarDayContainer}>
                      <View
                        style={[isCurrentDay && styles.calendarTodayContainer]}>
                        <Text
                          style={[
                            styles.calendarDay,
                            isCurrentDay && styles.calendarToday,
                          ]}>
                          {day}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  orangeBackground: {
    position: 'absolute',
    top: 0,
    left: -width * 0.25,
    right: -width * 0.25,
    width: width * 1.5,
    height: height * 0.45,
    backgroundColor: Colors.primaryOrange,
    borderBottomLeftRadius: width * 1.2,
    borderBottomRightRadius: width * 1.2,
    zIndex: 0,
  },
  fixedHeaderContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 25,
    paddingBottom: 0,
    zIndex: 2,
    marginTop: 15,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 5,
  },
  menuButton: {
    padding: 3,
  },
  profileButton: {
    padding: 3,
  },
  scrollableOrangeSection: {
    backgroundColor: 'transparent',
    paddingHorizontal: 25,
    paddingTop: 0,
    zIndex: 1,
  },
  welcomeSection: {
    paddingHorizontal: 0,
    marginBottom: 25,
    marginTop: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end', 
  },
  welcomeText: {
    fontSize: 24,
    color: Colors.white,
    fontFamily: 'JosefinSans_400Regular',
    marginBottom: -10, 
  },
  ongName: {
    fontSize: 30,
    color: Colors.white,
    fontFamily: 'JosefinSans_700Bold',
  },
  adoptionSubtitle: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 1)',
    marginTop: 8,
    marginBottom: 7,
    marginLeft:25, 
    fontFamily: 'Nunito_700Bold',
  },
  petButtonsContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 40,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  petButton: {
    flex: 1,
    aspectRatio: 0.85,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#DCDCDC',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  petButtonImage: {
    width: '100%',
    height: '100%',
  },
  calendarSection: {
    backgroundColor: 'transparent',
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 40,
    zIndex: 0,
    flexGrow: 1,
  },
  eventTitle: {
    fontSize: 18,
    color: Colors.primaryOrange,
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Nunito_700Bold',
  },
  calendarContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginHorizontal: 55, 
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  calendarHeader: {
    backgroundColor: Colors.primaryOrange,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8, 
    paddingHorizontal: 10,
    justifyContent: 'space-around',
  },
  headerDateText: {
    fontSize: 14,
    color: Colors.white,
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Nunito_700Bold',
  },
  
  calendarBody: {
    backgroundColor: Colors.white,
    padding: 8, 
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calendarHeaderDay: {
    width: '14.28%',
    paddingVertical: 2, 
    alignItems: 'center',
    marginBottom: 2, 
  },
  calendarDayOfWeek: {
    color: Colors.darkGray,
    fontSize: 10, 
    fontFamily: 'Nunito_700Bold',
  },
  calendarDayContainer: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#737373',
  },
  calendarTodayContainer: {
    backgroundColor: Colors.primaryOrange,
    borderRadius: 50,
    width: '80%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDay: {
    textAlign: 'center',
    color: '#737373',
    fontSize: 12, 
    fontFamily: 'JosefinSans_400Regular',
  },
  calendarToday: {
    color: Colors.white,
    fontFamily: 'JosefinSans_700Bold',
  },
});

