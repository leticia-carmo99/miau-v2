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

// Telas de Parceiro - Empresa (CNPJ)
import FormCNPJ1 from './src/screens/Partner/CNPJ/formCNPJ1';
import FormCNPJ2 from './src/screens/Partner/CNPJ/FormCNPJ2';
import FormCNPJ3 from './src/screens/Partner/CNPJ/FormCNPJ3';
import FormCNPJ4 from './src/screens/Partner/CNPJ/FormCNPJ4';
import RevisaoCNPJ1 from './src/screens/Partner/CNPJ/RevisaoCNPJ1';
import RevisaoCNPJ2 from './src/screens/Partner/CNPJ/RevisaoCNPJ2';
import RevisaoCNPJ3 from './src/screens/Partner/CNPJ/RevisaoCNPJ3';

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
// Novas importações para About Us da ONG
import AboutUsO1 from './src/screens/Ong/AboutUsO1';
import AboutUsO2 from './src/screens/Ong/AboutUsO2';
import AboutUsO3 from './src/screens/Ong/AboutUsO3';

// Tela de Finalização 
import Finalizacao from './src/screens/Partner/Finalizacao';
import FinalizacaoONG from './src/screens/Ong/FinalizacaoONG';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}>

        {/* Categoria: Telas Iniciais */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="UserType" component={UserTypeScreen} />
        <Stack.Screen name="TypePartner" component={TypePartner} />
        
        {/* Categoria: Usuário Comum */}
        <Stack.Screen name="LoginUser" component={LoginUser} />
        <Stack.Screen name="CadUser" component={CadUser} />
        <Stack.Screen name="AboutUs1" component={AboutUs1} />
        <Stack.Screen name="AboutUs2" component={AboutUs2} />
        <Stack.Screen name="AboutUs3" component={AboutUs3} />
        
        {/* Categoria: Parceiro (Geral) */}
        <Stack.Screen name="LoginPartner" component={LoginPartner} />
        <Stack.Screen name="CadPartner" component={CadPartner} />
        <Stack.Screen name="AboutUs1P" component={AboutUs1P} />
        <Stack.Screen name="AboutUs2P" component={AboutUs2P} />
        <Stack.Screen name="AboutUs3P" component={AboutUs3P} />
        
        {/* Categoria: Parceiro - Pessoa Física (CPF) */}
        <Stack.Screen name="FormCPF1" component={FormCPF1} />
        <Stack.Screen name="FormCPF2" component={FormCPF2} />
        <Stack.Screen name="FormCPF3" component={FormCPF3} />
        <Stack.Screen name="FormCPF4" component={FormCPF4} />
        <Stack.Screen name="RevisaoCPF1" component={RevisaoCPF1} />
        <Stack.Screen name="RevisaoCPF2" component={RevisaoCPF2} />
        <Stack.Screen name="RevisaoCPF3" component={RevisaoCPF3} />
        
        {/* Categoria: Parceiro - Empresa (CNPJ) */}
        <Stack.Screen name="FormCNPJ1" component={FormCNPJ1} />
        <Stack.Screen name="FormCNPJ2" component={FormCNPJ2} />
        <Stack.Screen name="FormCNPJ3" component={FormCNPJ3} />
        <Stack.Screen name="FormCNPJ4" component={FormCNPJ4} />
        <Stack.Screen name="RevisaoCNPJ1" component={RevisaoCNPJ1} />
        <Stack.Screen name="RevisaoCNPJ2" component={RevisaoCNPJ2} />
        <Stack.Screen name="RevisaoCNPJ3" component={RevisaoCNPJ3} />
        
        {/* Categoria: ONG */}
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
        
        
        <Stack.Screen name="Finalizacao" component={Finalizacao} />
        <Stack.Screen name="FinalizacaoONG" component={FinalizacaoONG} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
