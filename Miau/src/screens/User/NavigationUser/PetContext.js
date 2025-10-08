// PetContext.js
import React, { createContext, useState, useContext } from "react";
import FotoPerfilCao from '../assets/FotosMeuPet/FotoPerfilCao.png';
import { auth, db } from "../../../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const PetContext = createContext();

export const PetProvider = ({ children }) => {
  const [petData, setPetData] = useState({
    nome: "Animal",
    idade: "6",
    peso: "3kg",
    cor: "Branco",
    raca: "Vira-lata",
    sexo: "Macho",
    especie: "Cachorro",
    image: FotoPerfilCao,
    carteirinha: FotoPerfilCao,
    email_usuario: " "
  });

  return (
    <PetContext.Provider value={{ petData, setPetData }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePet = () => useContext(PetContext);
