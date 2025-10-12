import React, { createContext, useState, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
// Você pode adicionar um ícone ou imagem padrão para ONGs aqui, se tiver um
// import OngIcon from "../assets/FotosInicial/foto-ong-padrao.png"; 
import { auth, db } from "../../../../firebaseConfig"; // Importe a conexão

const OngContext = createContext();

export const OngProvider = ({ children }) => {
  const [ongData, setOngData] = useState(null);

  useEffect(() => {
    // Escuta o estado de login do Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Se um usuário está logado, verifica se ele é uma ONG na coleção 'ongs'
        const docRef = doc(db, "ongs", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Garante que 'regioesAtuacao' seja um array
          const regioesAtuacao = data.regioesAtuacao || []; 
          // Garante que 'redesSociais' seja uma string
          const redesSociais = data.redesSociais || "";
          
          // Salva todos os dados no contexto
          setOngData({ 
              ...data, 
              uid: user.uid,
              regioesAtuacao: regioesAtuacao,
              redesSociais: redesSociais,
              // Você pode adicionar outros campos que precisam ser garantidos aqui
            });
        } else {
          // Se o documento não existir, usa dados básicos/padrão da ONG
          // Isso pode acontecer se o usuário logado não for uma ONG, ou se a ONG não
          // completou o cadastro no Firestore ainda (o que é improvável se o app foi bem construído)
          setOngData({
            uid: user.uid,
            nomeOng: "ONG Não Encontrada",
            emailContato: user.email,
            tipoInstituicao: "ONG", // Tipo padrão
            regioesAtuacao: [], 
            numAnimaisAcolhidos: "0",
            siteOficial: "",
            telefoneContato: "Nenhum número inserido ainda",
            cidade: "Não Informada",
            estado: "Não Informado",
            // Adicione aqui todos os campos que sua ONG deve ter, com valores padrão
          });
        }
      } else {
        // Se não houver usuário logado, limpa o estado
        setOngData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <OngContext.Provider value={{ ongData, setOngData }}>
      {children}
    </OngContext.Provider>
  );
};

export const useOng = () => useContext(OngContext);