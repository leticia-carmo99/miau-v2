// UserContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import UserIcon from "../assets/FotosInicial/foto-user-roxo.png"; 
import { auth, db } from "../../../../firebaseConfig"; // Importe a conexão

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Escuta o estado de login do Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Se um usuário está logado, busca os dados dele no Firestore
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // Garante que 'favoritos' seja um array, mesmo que não venha do Firestore
          // (Isso é uma segurança caso você não tenha criado o campo para todos os usuários)
          const favoritos = data.favoritos || []; // Se existir, usa; senão, inicializa como array vazio

          // Salva todos os dados no contexto, incluindo o tipo
          setUserData({ 
              ...data, 
              uid: user.uid,
              favoritos: favoritos // Adiciona o campo garantindo que é um array
            });
        } else {
          // Se o documento não existir, usa dados básicos
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
        // Se não houver usuário logado, limpa o estado
        setUserData(null);
      }
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