// MainDrawerOng.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';

// telas — ajuste os paths conforme seu projeto
import HomeOng from '../HomeOngScreens/HomeOng';
import AddAdocaoPet from '../HomeOngScreens/AddAdocaoPet';
import ChatOng from '../HomeOngScreens/ChatOng';
import EventoOng from '../HomeOngScreens/EventoOng';
import PerfilAdocaoPet from '../HomeOngScreens/PerfilAdocaoPet';
import PerfilOng from '../HomeOngScreens/PerfilOng';
import SobreAPP from '../HomeOngScreens/SobreAPP';
import { useOng } from './OngContext';
import MainAppTabs from './MainTabsOng';


import { getAuth, signOut } from "firebase/auth";
import { auth } from "../../../../firebaseConfig"; 

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get('window');

const Colors = {
  primaryOrange: '#FFAB36',
  white: '#FFFFFF',
  darkGray: '#737373',
  lightGray: '#999999',
  mediumGray: '#666666',
  drawerBackground: '#F8F8F8',
  primaryPurple: '#9156D1',
};



function CustomDrawerContent(props) {
 const { ongData, setOngData } = useOng();
 if (ongData === null) {
   return (
     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
       <ActivityIndicator size="large" color={Colors.primaryPurple} />
     </View>
   );
}

const handleLogout = async () => {
    try {
        await signOut(auth);
        setOngData(null);
        // CORREÇÃO AQUI: Use props.navigation
        props.navigation.navigate('InitialStack', { screen: 'SplashScreen' }); 
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContainer}
    >
      <TouchableOpacity
        style={styles.profileSection}
        onPress={() => props.navigation.navigate('PerfilOng')}
      >
        <View style={styles.avatarPlaceholder} />
        <Text style={styles.profileName}>{ongData?.nomeOng || 'ONG'}</Text>
        <Text style={styles.profileLink}>Ver perfil</Text>
      </TouchableOpacity>

      <View style={styles.separator} />

      <View style={styles.menuSection}>
        <DrawerItem icon="home-outline" label="Início" onPress={() => props.navigation.navigate('HomeTabs', { screen: 'HomeOngTab' })} />
        <DrawerItem icon="heart-outline" label="Pets" onPress={() => props.navigation.navigate('HomeTabs', { screen: 'PetsAdocaoTab' })} />
        <DrawerItem icon="calendar-outline" label="Eventos" onPress={() => props.navigation.navigate('HomeTabs', { screen: 'EventosOngTab' })} />
        <DrawerItem icon="account-group-outline" label="Sobre o app" onPress={() => props.navigation.navigate('SobreAPP')} />
        <DrawerItem icon="cog-outline" label="Configurações" onPress={() => props.navigation.navigate('Configuracoes')} />

                    {/* Botão Sair */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={width * 0.06} color={Colors.mediumGray} />
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

function DrawerItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
      <Icon name={icon} size={24} color={Colors.darkGray} />
      <Text style={styles.drawerLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function MainDrawerOng() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: Colors.drawerBackground,
          width: width * 0.75,
          borderTopRightRadius: 40,
          borderBottomRightRadius: 40,
          overflow: 'hidden',
        },
        overlayColor: 'rgba(0,0,0,0.4)',
      }}
    >
      <Drawer.Screen name="HomeTabs" component={MainAppTabs}/>
      <Drawer.Screen name="SobreAPP" component={SobreAPP} />
      <Drawer.Screen name="Configuracoes" component={() => <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}><Text>Configurações</Text></View>} />
      <Drawer.Screen name="PerfilOng" component={PerfilOng} />
      <Drawer.Screen name="AddAdocaoPet" component={AddAdocaoPet} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flexGrow: 1,
    backgroundColor: Colors.drawerBackground,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  profileSection: {
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.lightGray,
    marginBottom: 10,
  },
  profileName: {
    color: Colors.primaryOrange,
    fontWeight: 'bold',
    fontSize: 18,
  },
  profileLink: {
    color: Colors.mediumGray,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  menuSection: {
    marginTop: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  drawerLabel: {
    fontSize: 16,
    marginLeft: 15,
    color: Colors.darkGray,
    fontWeight: '500',
  },
    logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: width * 0.035,
    paddingHorizontal: width * 0.05,
    marginTop: width * 0.05, // Espaçamento antes do botão Sair
   borderTopWidth: 0.5,
    borderTopColor: Colors.lightGray,
  },
  logoutButtonText: {
    fontSize: width * 0.045,
    marginLeft: width * 0.03,
    color: Colors.mediumGray,
    fontFamily: 'Nunito_400Regular', // Alterado para Nunito
  },
});
