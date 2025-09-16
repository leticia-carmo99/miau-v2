import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {View, Text, StyleSheet, Image, TouchableOpacity, Dimensions} from 'react-native';
import { DrawerContentScrollView} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import Tabs from './Tabs';
import UserIcon from '../assets/FotosInicial/foto-user-roxo.png';
import MeuPet from '../HomeScreens/MeuPet';
import Eventos from '../HomeScreens/Eventos';
import Favoritos from '../HomeScreens/Favoritos';
import Sobre from '../HomeScreens/Sobre';
import EditarMeuPet from '../HomeScreens/EditarMeuPet';
import Perfil from '../HomeScreens/PerfilUser';
import Blog from '../HomeScreens/Blog';
import { useUser } from "../NavigationUser/UserContext";

import { getAuth, signOut } from "firebase/auth";
import { auth } from "../../../../firebaseConfig"; 

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get('window');

const COLORS = {
  primaryOrange: '#FFAB36',
  primaryPurple: '#9156D1',
  white: '#FFFFFF',
  darkGray: '#333333',
  mediumGray: '#666666',
  lightGray: '#999999',
  offWhite: '#f8f8f8',
};

function ConfiguracoesScreen() {
  return (<View style={styles.placeholderContainer}><Text style={styles.placeholderText}>Tela Configurações (Drawer)</Text></View>);
}
function LogoutScreen() {

  return (<View style={styles.placeholderContainer}><Text style={styles.placeholderText}>Tela Sair (Ação de Logout)</Text></View>);
}

export default function MainDrawer() {

  const { userData, setUserData } = useUser(); // dados globais
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userData.nome);
  const [tempImage, setTempImage] = useState(userData.profileImage);

  const handleLogout = async () => {
    try {
        await signOut(auth);
 
        setUserData(null);
        navigation.navigate('SplashScreen'); 
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <DrawerContentScrollView {...props}>
          
          <TouchableOpacity
            style={styles.profileSection}
            onPress={() => props.navigation.navigate('PerfilUser')}
          >
            <Image source={userData?.profileImage || UserIcon} style={styles.profileImage} />
            <Text style={styles.profileName}>{userData?.nome || 'Usuário'}</Text>
            <Text style={styles.viewProfileText}>Ver perfil</Text>
          </TouchableOpacity>

          <View style={styles.drawerItemsContainer}>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => props.navigation.navigate('HomeWithTabs')}
            >
              <Ionicons name="home-outline" size={width * 0.06} color={COLORS.mediumGray} />
              <Text style={styles.drawerItemText}>Início</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => props.navigation.navigate('MeuPet')}
            >
              <Ionicons name="paw-outline" size={width * 0.06} color={COLORS.mediumGray} />
              <Text style={styles.drawerItemText}>Meu pet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => props.navigation.navigate('Eventos')}
            >
              <Ionicons name="calendar-outline" size={width * 0.06} color={COLORS.mediumGray} />
              <Text style={styles.drawerItemText}>Eventos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => props.navigation.navigate('Dicas e Cuidados')}
            >
              <Ionicons name="hand-right-outline" size={width * 0.06} color={COLORS.mediumGray} />
              <Text style={styles.drawerItemText}>Dicas e Cuidados</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => props.navigation.navigate('Favoritos')}
            >
              <Ionicons name="heart-outline" size={width * 0.06} color={COLORS.mediumGray} />
              <Text style={styles.drawerItemText}>Favoritos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => props.navigation.navigate('Sobre o App')}
            >
              <Ionicons name="information-circle-outline" size={width * 0.06} color={COLORS.mediumGray} />
              <Text style={styles.drawerItemText}>Sobre o app</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => props.navigation.navigate('Configuracoes')}
            >
              <Ionicons name="settings-outline" size={width * 0.06} color={COLORS.mediumGray} />
              <Text style={styles.drawerItemText}>Configurações</Text>
            </TouchableOpacity>

          </View>

          {/* Botão Sair */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={width * 0.06} color={COLORS.mediumGray} />
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </DrawerContentScrollView>
      )}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: 'white',
          width: '80%', 
        },
      }}
    >
      
      <Drawer.Screen name="HomeWithTabs" component={Tabs} />
      <Drawer.Screen name="MeuPet" component={MeuPet} />
      <Drawer.Screen name="Eventos" component={Eventos} />
      <Drawer.Screen name="Dicas e Cuidados" component={Blog} />
      <Drawer.Screen name="Favoritos" component={Favoritos} />
      <Drawer.Screen name="Sobre o App" component={Sobre} />
      <Drawer.Screen name="Configuracoes" component={ConfiguracoesScreen} />
      <Drawer.Screen name="Sair" component={LogoutScreen} />
      <Drawer.Screen name="EditarMeuPet" component={EditarMeuPet} />
            <Drawer.Screen name="PerfilTab" component={Perfil} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
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
  // Estilos para o conteúdo customizado do Drawer
  profileSection: {
    padding: width * 0.05,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    alignItems: 'flex-start',
  },
  profileImage: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: (width * 0.2) / 2,
    marginBottom: width * 0.02,
    backgroundColor: COLORS.lightGray, // Placeholder background
  },
  profileName: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: width * 0.01,
    fontFamily: 'Nunito_700Bold', // Alterado para Nunito
  },
  viewProfileText: {
    fontSize: width * 0.035,
    color: COLORS.primaryOrange,
    fontFamily: 'Nunito_400Regular', // Alterado para Nunito
  },
  drawerItemsContainer: {
    marginTop: width * 0.02,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: width * 0.035,
    paddingHorizontal: width * 0.05,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.offWhite, // Uma linha mais suave
  },
  drawerItemText: {
    fontSize: width * 0.045,
    marginLeft: width * 0.03,
    color: COLORS.darkGray,
    fontFamily: 'Nunito_400Regular', // Alterado para Nunito
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: width * 0.035,
    paddingHorizontal: width * 0.05,
    marginTop: width * 0.05, // Espaçamento antes do botão Sair
    borderTopWidth: 0.5,
    borderTopColor: COLORS.lightGray,
  },
  logoutButtonText: {
    fontSize: width * 0.045,
    marginLeft: width * 0.03,
    color: COLORS.mediumGray,
    fontFamily: 'Nunito_400Regular', // Alterado para Nunito
  },
});
