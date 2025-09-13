// MainTabsOng.js (corrigido)
import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dimensions, View, Text, StyleSheet, Image, Keyboard, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- Telas Reais da ONG que serão as ABAS ---
// Ajuste os paths conforme sua pasta:
import HomeOng from '../HomeOngScreens/HomeOng';
import EventoOng from '../HomeOngScreens/EventoOng';
import ChatOng from '../HomeOngScreens/ChatOng';
import AddAdocaoPet from '../HomeOngScreens/AddAdocaoPet';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

const COLORS = {
  primaryOrange: '#FFAB36',
  primaryPurple: '#9156D1',
  white: '#FFFFFF',
  lightGray: '#D9D9D9',
  mediumGray: '#666666',
  black: '#000000',
};

export default function MainAppTabs() {
  const insets = useSafeAreaInsets();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Base height da tab (ajuste conforme seu design)
  const TAB_BAR_BASE_HEIGHT = Math.round(width * 0.1); // mantive sua ideia original
  const paddingHorizontal = Math.round(width * 0.02);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const show = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hide = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);


  const availableWidth = width - paddingHorizontal * 2;
  const tabItemWidth = Math.round(availableWidth / 4);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        // Força altura fixa e padding com safe area — evita recalculos estranhos
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: TAB_BAR_BASE_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom,
          backgroundColor: COLORS.white,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          shadowColor: COLORS.black,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 5,
          elevation: 5,
          paddingHorizontal: paddingHorizontal,
          // Quando o teclado estiver aberto, escondemos a tab para evitar "pulos" — 
          // se preferir mantê-la visível, altere para 'flex' sempre.
          display: keyboardVisible ? 'none' : 'flex',
        },
        tabBarIcon: ({ focused }) => {
          let iconSource;
          let labelText;
          let backgroundColor = 'transparent';

          if (route.name === 'HomeOngTab') {
            iconSource = focused
              ? require('../Images/DogHouseOn.png')
              : require('../Images/DogHouseOff.png');
            labelText = 'Início';
            if (focused) backgroundColor = COLORS.primaryPurple;
          } else if (route.name === 'ChatOngTab') {
            iconSource = focused
              ? require('../Images/ChatOn.png')
              : require('../Images/ChatIconOff.png');
            labelText = 'Chat';
            if (focused) backgroundColor = COLORS.primaryPurple;
          } else if (route.name === 'EventosOngTab') {
            iconSource = focused
              ? require('../Images/CalendarioIconOn.png')
              : require('../Images/CalendarioIconOff.png');
            labelText = 'Eventos';
            if (focused) backgroundColor = COLORS.primaryPurple;
          } else if (route.name === 'PetsAdocaoTab') {
            iconSource = focused
              ? require('../Images/AdocaoIconOn.png')
              : require('../Images/AdocaoIconOff.png');
            labelText = 'Pets';
            if (focused) backgroundColor = COLORS.primaryPurple;
          }

          return (
            <View
              style={[
                styles.tabItem,
                {
                  backgroundColor: backgroundColor,
                  borderRadius: width * 0.05,
                  width: tabItemWidth,
                },
              ]}
            >
              {/* Proteção caso alguma imagem não exista */}
              {iconSource ? (
                <Image source={iconSource} style={styles.tabIconImage} />
              ) : (
                <View style={{ width: 20, height: 20 }} />
              )}
              {focused && <Text style={styles.tabTextActive}>{labelText}</Text>}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="HomeOngTab" component={HomeOng} />
      <Tab.Screen name="ChatOngTab" component={ChatOng} />
      <Tab.Screen name="EventosOngTab" component={EventoOng} />
      <Tab.Screen name="PetsAdocaoTab" component={AddAdocaoPet} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  tabIconImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  tabTextActive: {
    color: COLORS.white,
    fontSize: 10,
    marginLeft: 6,
  },
});
