import React, { createContext, useState, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../../firebaseConfig"; // Importe a conexão

const OngContext = createContext();

// Objeto de valores padrão para garantir que todos os campos existam no estado inicial
const DEFAULT_ONG_DATA = {
  uid: null,
  nomeOng: "Nova ONG",
  email: "", // Campo usado no PerfilOng.js para edição de contato
  telefone: "", // Campo usado no PerfilOng.js para edição de contato
  instagram: "", // Campo usado no PerfilOng.js para edição de redes sociais
  facebook: "", // Campo usado no PerfilOng.js para edição de redes sociais
  emailContato: "", // Campo da imagem no console (se for diferente de 'email')
  siteOficial: "", // URL do site
  sobre: "", // Biografia da ONG
  horarioInicio: "08:00",
  horarioFim: "22:00",
  diasAbertos: { // Deve ser um objeto para Checkbox funcionar
    segunda: false,
    terca: false,
    quarta: false,
    quinta: false,
    sexta: false,
    sabado: false,
    domingo: false,
  },
  headerImage: null, // Será a URI (string) do Firestore, ou null
  logoImage: null, // Será a URI (string) do Firestore, ou null
  fotos: [], // Array de URIs (string) para a galeria
  endereco: {
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "", // Você tem este campo no código original
    cep: "",
  },
  cnpjCpf: "",
  comprovanteCNPJouEstatuto: "",
  dataCadastro: "",
  documentoResponsavel: "",
  espacoFisicoVisitacao: "não", // Para sim/não (booleano ou string 'sim'/'não')
  especiesAtendidas: "Não Informado", // Ex: "Cães, Gatos" (string)
  tipoInstituicao: "ONG",
  regioesAtuacao: [], // Array de strings ou objetos
  numAnimaisAcolhidos: "0",
};


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
          ...DEFAULT_ONG_DATA,
          ...fetchedData,
          uid: user.uid,
        };


        consolidatedData.endereco = {
            ...DEFAULT_ONG_DATA.endereco,
            ...fetchedData.endereco,
        };
        consolidatedData.diasAbertos = {
            ...DEFAULT_ONG_DATA.diasAbertos,
            ...fetchedData.diasAbertos,
        };
        consolidatedData.regioesAtuacao = consolidatedData.regioesAtuacao || DEFAULT_ONG_DATA.regioesAtuacao;
        consolidatedData.fotos = consolidatedData.fotos || DEFAULT_ONG_DATA.fotos;


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