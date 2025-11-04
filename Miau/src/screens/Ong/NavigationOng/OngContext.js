import React, { createContext, useState, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../../firebaseConfig"; // Importe a conexão

const OngContext = createContext();


export const OngProvider = ({ children }) => {
  const [ongData, setOngData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "ongs", user.uid);
        const docSnap = await getDoc(docRef);

        let fetchedData = {};
        if (docSnap.exists()) {
          fetchedData = docSnap.data();
        }
        let consolidatedData = {
          ...fetchedData,
          uid: user.uid,
        };
        consolidatedData.diasAbertos = {
            ...(fetchedData.diasAbertos || {}),
        };
        consolidatedData.regioesAtuacao = fetchedData.regioesAtuacao || [];
        consolidatedData.fotos = fetchedData.fotos || [];

        setOngData(consolidatedData);

      } else {
        // Sem usuário logado
        setOngData(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <OngContext.Provider value={{ ongData, setOngData, isLoading, setIsLoading }}>
      {children}
    </OngContext.Provider>
  );
};

export const useOng = () => useContext(OngContext);