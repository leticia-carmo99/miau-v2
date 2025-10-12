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
  telefoneContato: "", // Campo da imagem no console (se for diferente de 'telefone')
  siteOficial: "", // URL do site
 
  // Campos de Perfil Detalhado (Usados no PerfilOng.js)
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

  // Campos de Imagem (URIs ou require()s)
  headerImage: null, // Será a URI (string) do Firestore, ou null
  logoImage: null, // Será a URI (string) do Firestore, ou null
  fotos: [], // Array de URIs (string) para a galeria
 
  // Campos do Console do Firestore (imagem inicial)
  bairro: "",
  cep: "",
  cidade: "",
  estado: "",
  cnpjCpf: "",
  comprovanteCNPJouEstatuto: "",
  dataCadastro: "",
  documentoResponsavel: "",
  espacoFisicoVisitacao: "não", // Para sim/não (booleano ou string 'sim'/'não')
  especiesAtendidas: "Não Informado", // Ex: "Cães, Gatos" (string)

  // Outros campos que podem existir (do seu código antigo)
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

        // 1. Começa com os valores padrão para garantir que todos os campos existam.
        // 2. Sobrescreve com os dados lidos do Firestore (fetchedData).
        // 3. Adiciona o UID.
        const consolidatedData = {
          ...DEFAULT_ONG_DATA,
          ...fetchedData,
          uid: user.uid,
        };

        // Corrigir e garantir que objetos/arrays não sejam sobrescritos por null ou undefined
        // Se os dados do Firestore tiverem campos nulos para objetos/arrays, 
        // garante que use o valor padrão (ex: {} ou [])
        consolidatedData.diasAbertos = consolidatedData.diasAbertos || DEFAULT_ONG_DATA.diasAbertos;
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