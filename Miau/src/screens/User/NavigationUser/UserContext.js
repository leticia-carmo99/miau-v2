// UserContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import UserIcon from "../assets/FotosInicial/foto-user-roxo.png"; 
import { auth, db } from "../../../../firebaseConfig";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const favoritos = data.favoritos || []; 
          setUserData({ 
              ...data, 
              uid: user.uid,
              favoritos: favoritos 
            });
        } else {
          setUserData({
            uid: user.uid,
            name: "Usuário",
            email: user.email,
            profileImage: UserIcon,
            tipo_usuario: "comum",
            cep: "6754160",
            telefone: "Nenhum número inserido ainda",
            pet1Id: "",
            pet2Id: "",
            favoritos: [], 
          });
        }
      } else {
        setUserData(null);
      }
setIsLoadingUser(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);