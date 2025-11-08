import React, { createContext, useState, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../../../firebaseConfig"; 

export const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
  const [businessData, setBusinessData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userId = user.uid;
          const docRef = doc(db, "empresa", userId);
          const docSnap = await getDoc(docRef);
          let fetchedData = {};
          if (docSnap.exists()) {
            fetchedData = docSnap.data();
          }
          let consolidatedData = {
            uid: userId,
            nome: fetchedData.nome || "",
            email: fetchedData.email || user.email || "",
            nomeResponsavel: fetchedData.nomeResponsavel || "",
            telefone: fetchedData.telefone || "",
            cpfCnpj: fetchedData.cpfCnpj || "",
            endereco: fetchedData.endereco || "",
            bairro: fetchedData.bairro || "",
            cidade: fetchedData.cidade || "",
            estado: fetchedData.estado || "",
            cep: fetchedData.cep || "",
            faixaPreco: fetchedData.faixaPreco || "",
            tipoServico: fetchedData.tipoServico || "",
            regioes: fetchedData.regioes || [], 
            redes: fetchedData.redes || "",
            site: fetchedData.site || "",
            imagensServico: fetchedData.imagensServico || [],
            comprovanteCNPJ: fetchedData.comprovanteCNPJ || null, 
            logoPerfil: fetchedData.logoPerfil || null, 
            localAtendimento: fetchedData.localAtendimento || null,
            localFisico: fetchedData.localFisico || null,
          };
          setBusinessData(consolidatedData);
        } else {
          setBusinessData(null);
        }
        setIsLoading(false);
      });
      return () => unsubscribe();
    }, []);

  return (
    <BusinessContext.Provider value={{ businessData, setBusinessData, isLoading }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => useContext(BusinessContext);
