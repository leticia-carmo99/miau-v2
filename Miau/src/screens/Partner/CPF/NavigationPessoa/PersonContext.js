import React, { createContext, useState } from "react";

export const PersonContext = createContext();

export const PersonProvider = ({ children }) => {
  const [personData, setPersonData] = useState({
    nome: "",
    localizacao:"",
    role: "",
    sobre: "",
    diasAbertos: {},
    horarioInicio: "08:00",
    horarioFim: "22:00",
    email: "",
    telefone: "",
    instagram: "",
    facebook: "",
    fotos: [],
    headerImage: null,
    profileImage: null,
  });

  return (
    <PersonContext.Provider value={{ personData, setPersonData }}>
      {children}
    </PersonContext.Provider>
  );
};
