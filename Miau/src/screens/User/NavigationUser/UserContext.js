// UserContext.js
import React, { createContext, useState, useContext } from "react";
import UserIcon from "../assets/FotosInicial/foto-user-roxo.png"; 

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    name: "Usuário",
    email: "usuario1212@gmail.com",
    phoneNumber: "+55 11 9998-9999",
    profileImage: UserIcon,
  });

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
