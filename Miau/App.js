import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Telas Iniciais
import SplashScreen from './src/screens/initial/splashScreen';
import WelcomeScreen from './src/screens/initial/welcomeScreen';
import UserTypeScreen from './src/screens/initial/userTypeScreen';
import TypePartner from './src/screens/Partner/TypePartner';

// Telas de Usuário Comum (Cadastro e Login)
import LoginUser from './src/screens/User/loginUser';
import CadUser from './src/screens/User/CadUser';
import AboutUs1 from './src/screens/User/AboutUs1';
import AboutUs2 from './src/screens/User/AboutUs2';
import AboutUs3 from './src/screens/User/AboutUs3';
// Telas de Usuário Comum - TUDO
import InicialUser from './src/screens/User/HomeScreens/Inicial';
import PerfilUser from './src/screens/User/HomeScreens/PerfilUser';
import TabsUser from './src/screens/User/NavigationUser/Tabs';
import MainDrawerUser from './src/screens/User/NavigationUser/MainDrawer';
import AdoteUser from './src/screens/User/HomeScreens/Adote';
import BlogUser from './src/screens/User/HomeScreens/Blog';
import ChatUser from './src/screens/User/HomeScreens/ChatUsuario';
import EventosUser from './src/screens/User/HomeScreens/Eventos';
import FavoritosUser from './src/screens/User/HomeScreens/Favoritos';
import MeuPetUser from './src/screens/User/HomeScreens/MeuPet';
import PerfilCaoUser from './src/screens/User/HomeScreens/PerfilCao';
import PerfilGatoUser from './src/screens/User/HomeScreens/PerfilGato';
import SobreUser from './src/screens/User/HomeScreens/Sobre';
import ChatConversaUser from './src/screens/User/HomeScreens/ChatConversa';
import EditarMeuPetUser from './src/screens/User/HomeScreens/EditarMeuPet';
import MapaPetshopUser from './src/screens/User/HomeScreens/MapaPetshop';
import MapaServicosUser from './src/screens/User/HomeScreens/MapaServicos';
import PetshopUser from './src/screens/User/HomeScreens/Petshop';
import ServicoUser from './src/screens/User/HomeScreens/Servico';
import BlogDetalhesUser from './src/screens/User/HomeScreens/BlogDetalhes';
import { UserProvider } from './src/screens/User/NavigationUser/UserContext';
import { PetProvider } from './src/screens/User/NavigationUser/PetContext';
import MenuV1User from './src/screens/User/NavigationUser/MenuV1';


// Telas de Parceiro (Login, Cadastro)
import LoginPartner from './src/screens/Partner/loginPartner';
import CadPartner from './src/screens/Partner/CadPartner';
import AboutUs1P from './src/screens/Partner/AboutUs1P';
import AboutUs2P from './src/screens/Partner/AboutUs2P';
import AboutUs3P from './src/screens/Partner/AboutUs3P';

// Telas de Parceiro - Pessoa Física (CPF)
import FormCPF1 from './src/screens/Partner/CPF/formCPF1';
import FormCPF2 from './src/screens/Partner/CPF/FormCPF2';
import FormCPF3 from './src/screens/Partner/CPF/FormCPF3';
import FormCPF4 from './src/screens/Partner/CPF/FormCPF4';
import RevisaoCPF1 from './src/screens/Partner/CPF/RevisaoCPF1';
import RevisaoCPF2 from './src/screens/Partner/CPF/RevisaoCPF2';
import RevisaoCPF3 from './src/screens/Partner/CPF/RevisaoCPF3';
// Telas de Parceiro - Pessoa Física (CPF) - TUDO
import MainDrawerCPF from './src/screens/Partner/CPF/NavigationPessoa/MainDrawerPessoa';
import MainTabsCPF from './src/screens/Partner/CPF/NavigationPessoa/MainTabsPessoa';
import HomeCPF from './src/screens/Partner/CPF/HomePessoasScreens/HomePessoa';
import PerfilCPF from './src/screens/Partner/CPF/HomePessoasScreens/PerfilPessoa';
import SobreAppCPF from './src/screens/Partner/CPF/HomePessoasScreens/SobreApp';
import ChatConversaCPF from './src/screens/Partner/CPF/HomePessoasScreens/ChatConversa';
import ChatPessoaCPF from './src/screens/Partner/CPF/HomePessoasScreens/ChatPessoa';
import { PersonProvider } from './src/screens/Partner/CPF/NavigationPessoa/PersonContext';

// Telas de Parceiro - Empresa (CNPJ)
import FormCNPJ1 from './src/screens/Partner/CNPJ/formCNPJ1';
import FormCNPJ2 from './src/screens/Partner/CNPJ/FormCNPJ2';
import FormCNPJ3 from './src/screens/Partner/CNPJ/FormCNPJ3';
import FormCNPJ4 from './src/screens/Partner/CNPJ/FormCNPJ4';
import RevisaoCNPJ1 from './src/screens/Partner/CNPJ/RevisaoCNPJ1';
import RevisaoCNPJ2 from './src/screens/Partner/CNPJ/RevisaoCNPJ2';
import RevisaoCNPJ3 from './src/screens/Partner/CNPJ/RevisaoCNPJ3';
// Telas de Parceiro - Empresa (CNPJ) - TUDO
import HomeCNPJ from './src/screens/Partner/CNPJ/HomeBusinessScreens/Home';
import PerfilCNPJ from './src/screens/Partner/CNPJ/HomeBusinessScreens/Perfil';
import SobreCNPJ from './src/screens/Partner/CNPJ/HomeBusinessScreens/Sobre';
import { BusinessProvider } from './src/screens/Partner/CNPJ/NavigationBusiness/BusinessContext';
import MainDrawerCNPJ from './src/screens/Partner/CNPJ/NavigationBusiness/MainDrawer';
import MenuCNPJ from './src/screens/Partner/CNPJ/NavigationBusiness/Menu';
import TabsCNPJ from './src/screens/Partner/CNPJ/NavigationBusiness/Tabs';

// Telas de ONG (Login, Cadastro e Formulários)
import LoginOng from './src/screens/Ong/loginOng';
import CadOng from './src/screens/Ong/CadOng';
import FormONG1 from './src/screens/Ong/FormONG1';
import FormONG2 from './src/screens/Ong/FormONG2';
import FormONG3 from './src/screens/Ong/FormONG3';
import FormONG4 from './src/screens/Ong/FormONG4';
import RevisaoONG1 from './src/screens/Ong/RevisaoONG1';
import RevisaoONG2 from './src/screens/Ong/RevisaoONG2';
import RevisaoONG3 from './src/screens/Ong/RevisaoONG3';
// Telas da ONG (Tudo)
import TabsOng from './src/screens/Ong/NavigationOng/MainTabsOng';
import MainDrawerOng from './src/screens/Ong/NavigationOng/MainDrawerOng';
import AddAdocaoPetOng from './src/screens/Ong/HomeOngScreens/AddAdocaoPet';
import ChatEspecificoOng from './src/screens/Ong/HomeOngScreens/ChatEspecifico';
import ChatOngOng from './src/screens/Ong/HomeOngScreens/ChatOng';
import EventoOngOng from './src/screens/Ong/HomeOngScreens/EventoOng';
import HomeOngOng from './src/screens/Ong/HomeOngScreens/HomeOng';
import PerfilAdocaoPetOng from './src/screens/Ong/HomeOngScreens/PerfilAdocaoPet';
import FormularioAdocaoOng from './src/screens/Ong/HomeOngScreens/FormularioAdocao';
import PerfilOngOng from './src/screens/Ong/HomeOngScreens/PerfilOng';
import SobreAPPOng from './src/screens/Ong/HomeOngScreens/SobreAPP';
import { OngProvider } from './src/screens/Ong/NavigationOng/OngContext';


// Novas importações para About Us da ONG
import AboutUsO1 from './src/screens/Ong/AboutUsO1';
import AboutUsO2 from './src/screens/Ong/AboutUsO2';
import AboutUsO3 from './src/screens/Ong/AboutUsO3';

// Tela de Finalização 
import Finalizacao from './src/screens/Partner/Finalizacao';
import FinalizacaoONG from './src/screens/Ong/FinalizacaoONG';



const Stack = createNativeStackNavigator();

// --- Stack Usuario ---
function UsuarioStack() {
  return(
    <UserProvider>
      <PetProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Usuário comum */}
          <Stack.Screen name="LoginUser" component={LoginUser} />
          <Stack.Screen name="CadUser" component={CadUser} />
          <Stack.Screen name="AboutUs1" component={AboutUs1} />
          <Stack.Screen name="AboutUs2" component={AboutUs2} />
          <Stack.Screen name="AboutUs3" component={AboutUs3} />

          <Stack.Screen name="MainDrawerUser" component={MainDrawerUser} />
          <Stack.Screen name="TabsUser" component={TabsUser} /> 
          <Stack.Screen name="HomeUser" component={InicialUser} />
          <Stack.Screen name="PerfilUser" component={PerfilUser} />
          <Stack.Screen name="AdoteUser" component={AdoteUser} />
          <Stack.Screen name="BlogUser" component={BlogUser} />
          <Stack.Screen name="ChatUser" component={ChatUser} />
          <Stack.Screen name="ChatConversa" component={ChatConversaUser} />
          <Stack.Screen name="EventosUser" component={EventosUser} />
          <Stack.Screen name="FavoritosUser" component={FavoritosUser} />
          <Stack.Screen name="MeuPetUser" component={MeuPetUser} />
          <Stack.Screen name="PerfilCaoUser" component={PerfilCaoUser} />
          <Stack.Screen name="PerfilGatoUser" component={PerfilGatoUser} />
          <Stack.Screen name="SobreUser" component={SobreUser} />
          <Stack.Screen name="EditarMeuPetUser" component={EditarMeuPetUser} />
          <Stack.Screen name="MapaPetshopUser" component={MapaPetshopUser} />
          <Stack.Screen name="MapaServicosUser" component={MapaServicosUser} />
          <Stack.Screen name="ServicoUser" component={ServicoUser} />
          <Stack.Screen name="PetshopUser" component={PetshopUser} />
          <Stack.Screen name="BlogDetalhesUser" component={BlogDetalhesUser} />
          <Stack.Screen name="MenuV1User" component={MenuV1User} />
        </Stack.Navigator>
      </PetProvider>
    </UserProvider>
  );
}

// --- Stack Business (CNPJ) ---
function BusinessStack() {
  return (
    <BusinessProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainDrawerCNPJ" component={MainDrawerCNPJ} />
        <Stack.Screen name="HomeCNPJ" component={HomeCNPJ} />
        <Stack.Screen name="PerfilCNPJ" component={PerfilCNPJ} />
        <Stack.Screen name="SobreCNPJ" component={SobreCNPJ} />
        <Stack.Screen name="MenuCNPJ" component={MenuCNPJ} />
        <Stack.Screen name="TabsCNPJ" component={TabsCNPJ} />
      </Stack.Navigator>
    </BusinessProvider>
  );
}

function PersonStack() {
  return (
    <PersonProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainDrawerCPF" component={MainDrawerCPF} />
        <Stack.Screen name="MainTabsCPF" component={MainTabsCPF} />
        <Stack.Screen name="HomeCPF" component={HomeCPF} />
        <Stack.Screen name="PerfilCPF" component={PerfilCPF} />
        <Stack.Screen name="SobreAppCPF" component={SobreAppCPF} />
        <Stack.Screen name="ChatConversaCPF" component={ChatConversaCPF} />
        <Stack.Screen name="ChatPessoaCPF" component={ChatPessoaCPF} />
      </Stack.Navigator>
    </PersonProvider>
  );
}

// --- Stack ONG (sem provider por enquanto) ---
function OngStack() {
  return (
    <OngProvider>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* Telas ONG iniciais */}
      <Stack.Screen name="LoginOng" component={LoginOng} />
      <Stack.Screen name="CadOng" component={CadOng} />
      <Stack.Screen name="FormONG1" component={FormONG1} />
      <Stack.Screen name="FormONG2" component={FormONG2} />
      <Stack.Screen name="FormONG3" component={FormONG3} />
      <Stack.Screen name="FormONG4" component={FormONG4} />
      <Stack.Screen name="RevisaoONG1" component={RevisaoONG1} />
      <Stack.Screen name="RevisaoONG2" component={RevisaoONG2} />
      <Stack.Screen name="RevisaoONG3" component={RevisaoONG3} />
      <Stack.Screen name="AboutUsO1" component={AboutUsO1} />
      <Stack.Screen name="AboutUsO2" component={AboutUsO2} />
      <Stack.Screen name="AboutUsO3" component={AboutUsO3} />
      <Stack.Screen name="FinalizacaoONG" component={FinalizacaoONG} />
      
      <Stack.Screen name="MainDrawerOng" component={MainDrawerOng} />
      <Stack.Screen name="TabsOng" component={TabsOng} />
      <Stack.Screen name="AddAdocaoPetOng" component={AddAdocaoPetOng} />
      <Stack.Screen name="FormularioAdocaoOng" component={FormularioAdocaoOng} />
      <Stack.Screen name="ChatOngOng" component={ChatOngOng} />
      <Stack.Screen name="ChatEspecificoOng" component={ChatEspecificoOng} />
      <Stack.Screen name="EventoOngOng" component={EventoOngOng} />
      <Stack.Screen name="HomeOngOng" component={HomeOngOng} />
      <Stack.Screen name="PerfilAdocaoPetOng" component={PerfilAdocaoPetOng} />
      <Stack.Screen name="PerfilOngOng" component={PerfilOngOng} />
      <Stack.Screen name="SobreAPPOng" component={SobreAPPOng} />
      {/* Outras telas ONG específicas */}
    </Stack.Navigator>
    </OngProvider>
  );
}

// --- Stack Inicial (Splash, Welcome, Login, Cadastro, AboutUs) ---
function InitialStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false}} >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="UserType" component={UserTypeScreen} />
      <Stack.Screen name="TypePartner" component={TypePartner} />

      {/* Parceiro geral */}
      <Stack.Screen name="LoginPartner" component={LoginPartner} />
      <Stack.Screen name="CadPartner" component={CadPartner} />
      <Stack.Screen name="AboutUs1P" component={AboutUs1P} />
      <Stack.Screen name="AboutUs2P" component={AboutUs2P} />
      <Stack.Screen name="AboutUs3P" component={AboutUs3P} />

      {/* Telas CPF e CNPJ podem ser chamadas dentro do BusinessStack */}
      <Stack.Screen name="FormCPF1" component={FormCPF1} />
      <Stack.Screen name="FormCPF2" component={FormCPF2} />
      <Stack.Screen name="FormCPF3" component={FormCPF3} />
      <Stack.Screen name="FormCPF4" component={FormCPF4} />
      <Stack.Screen name="RevisaoCPF1" component={RevisaoCPF1} />
      <Stack.Screen name="RevisaoCPF2" component={RevisaoCPF2} />
      <Stack.Screen name="RevisaoCPF3" component={RevisaoCPF3} />

      <Stack.Screen name="FormCNPJ1" component={FormCNPJ1} />
      <Stack.Screen name="FormCNPJ2" component={FormCNPJ2} />
      <Stack.Screen name="FormCNPJ3" component={FormCNPJ3} />
      <Stack.Screen name="FormCNPJ4" component={FormCNPJ4} />
      <Stack.Screen name="RevisaoCNPJ1" component={RevisaoCNPJ1} />
      <Stack.Screen name="RevisaoCNPJ2" component={RevisaoCNPJ2} />
      <Stack.Screen name="RevisaoCNPJ3" component={RevisaoCNPJ3} />
      <Stack.Screen name="Finalizacao" component={Finalizacao} />


    </Stack.Navigator>
  );
}

// --- App principal ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="InitialStack">

        {/* Inicial */}
        <Stack.Screen name="InitialStack" component={InitialStack} />

        {/* Módulo Business */}
        <Stack.Screen name="BusinessStack" component={BusinessStack} />

        {/* Módulo Person */}
        <Stack.Screen name="PersonStack" component={PersonStack} />

        {/* Módulo ONG */}
        <Stack.Screen name="OngStack" component={OngStack} />

        {/* Módulo Usuário */}
        <Stack.Screen name="UsuarioStack" component={UsuarioStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
