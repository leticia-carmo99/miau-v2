import React, { createContext, useState } from "react";

export const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
  const [businessData, setBusinessData] = useState({
    sobre: "",
    diasAbertos: {},
    horarioInicio: "08:00",
    horarioFim: "22:00",
    email: "",
    telefone: "",
    instagram: "",
    facebook: "",
    endereco: {},
    fotos: [],
    headerImage: null,
    logoImage: null,
  });

  return (
    <BusinessContext.Provider value={{ businessData, setBusinessData }}>
      {children}
    </BusinessContext.Provider>
  );
};
