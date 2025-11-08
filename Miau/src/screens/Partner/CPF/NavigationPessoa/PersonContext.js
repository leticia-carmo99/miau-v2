import React, { createContext, useState, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../../../firebaseConfig"; 

const PersonContext = createContext();

export const PersonProvider = ({ children }) => {
  const [personData, setPersonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid;
        const docRef = doc(db, "prestador", userId);
        const docSnap = await getDoc(docRef);
        let fetchedData = {};
        if (docSnap.exists()) {
          fetchedData = docSnap.data();
        }
        let consolidatedData = {
          uid: userId,
          nome: fetchedData.nome || "",
          email: fetchedData.email || user.email || "",
          telefone: fetchedData.telefone || "",
          cpfCnpj: fetchedData.cpfCnpj || "",
          endereco: fetchedData.endereco || "",
          cidade: fetchedData.cidade || "",
          estado: fetchedData.estado || "",
          servico: fetchedData.servico || "",
          faixaPreco: fetchedData.faixaPreco || "",
          tipoProduto: fetchedData.tipoProduto || "",
          regioes: fetchedData.regioes || [], 
          redes: fetchedData.redes || { instagram: "", facebook: "" },
          imagensServico: fetchedData.imagensServico || [],
          documentoFoto: fetchedData.documentoFoto || null, 
          logoPerfil: fetchedData.logoPerfil || null, 
          localAtendimento: fetchedData.localAtendimento || null,
        };

        setPersonData(consolidatedData);
      } else {
        setPersonData(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <PersonContext.Provider value={{ personData, setPersonData, isLoading }}>
      {children}
    </PersonContext.Provider>
  );
};

export const usePerson = () => useContext(PersonContext);
