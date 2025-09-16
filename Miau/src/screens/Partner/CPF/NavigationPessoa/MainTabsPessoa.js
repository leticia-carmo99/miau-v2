import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions, View, Text, StyleSheet } from 'react-native';

// Importa suas telas que farão parte da navegação por abas
import Home from '../HomePessoasScreens/HomePessoa';
import Perfil from '../HomePessoasScreens/PerfilPessoa';
import Chat from '../HomePessoasScreens/ChatPessoa';


const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

const COLORS = {
  primaryOrange: '#FFAB36',
  primaryPurple: '#9156D1',
  white: '#FFFFFF',
  mediumGray: '#666666',
  black: '#000000',
};

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: width * 0.23,
          backgroundColor: COLORS.white,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: COLORS.black,
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 10,
          paddingHorizontal: width * 0.02,
        },
        tabBarIcon: ({ focused }) => {
          let iconName;
          let labelText;
          let iconColor = focused ? COLORS.white : COLORS.mediumGray;
          let backgroundColor = 'transparent';

          if (route.name === 'HomeTab') {
            iconName = 'home';
            labelText = 'Home';
            if (focused) backgroundColor = COLORS.primaryPurple;
          } 
           else if (route.name === 'ChatTab') {
            iconName = 'chatbubbles';
            labelText = 'Chat';
            if (focused) backgroundColor = COLORS.primaryPurple;
          } else if (route.name === 'PerfilTab') {
            iconName = 'person';
            labelText = 'Perfil';
            if (focused) backgroundColor = COLORS.primaryPurple;
          }

          return (
            <View style={[
              styles.tabItem,
              { backgroundColor: backgroundColor, borderRadius: width * 0.05 }
            ]}>
              <Ionicons name={iconName} size={width * 0.06} color={iconColor} />
              {focused && (
                <Text style={styles.tabTextActive}>
                  {labelText}
                </Text>
              )}
            </View>
          );
        },
      })}
    >
      {/* Defina suas telas que aparecerão na barra de abas */}
      <Tab.Screen name="HomeTab" component={Home} />
      <Tab.Screen name="ChatTab" component={Chat} />
      <Tab.Screen name="PerfilTab" component={Perfil} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.04,
    marginHorizontal: width * 0.01,
    minHeight: 35,
    marginTop: 10,
    minWidth: 80, 
  },
  tabTextActive: {
    color: COLORS.white,
    fontSize: width * 0.03,
    fontFamily: 'Nunito_700Bold',
    marginLeft: width * 0.015,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});
