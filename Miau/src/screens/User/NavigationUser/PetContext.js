// PetContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import FotoPerfilCao from '../assets/FotosMeuPet/FotoPerfilCao.png';
import { auth, db } from "../../../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Importações necessárias

const PetContext = createContext();

export const PetProvider = ({ children }) => {
    // Estado inicial com petData e ID do pet ativo
    const [petData, setPetData] = useState(null); // Vai armazenar os dados do pet ativo (Pet1)
    const [pet1Id, setPet1Id] = useState(null); // Armazenará o ID do pet na coleção 'pets'
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDocRef = doc(db, "usuarios", user.uid);
                
                // 1. Buscar o ID do pet (pet1Id) na coleção 'usuarios'
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    const currentPetId = userData.pet1Id || null; // Focando no pet1Id
                    setPet1Id(currentPetId); // Armazena o ID do pet

                    if (currentPetId) {
                        // 2. Se houver ID, buscar os dados do pet na coleção 'pets'
                        const petDocRef = doc(db, "pets", currentPetId);
                        const petDocSnap = await getDoc(petDocRef);

                        if (petDocSnap.exists()) {
                            setPetData({ id: currentPetId, ...petDocSnap.data() });
                        } else {
                            // PetID existe, mas o documento do pet foi excluído (erro)
                            console.error("Documento do Pet não encontrado, mas ID está no usuário.");
                            setPetData(null); 
                        }
                    } else {
                        // Não há pet1Id, usa dados padrão vazios
                        setPetData({
                            id: null,
                            nome: "Animal",
                            idade: "6",
                            peso: "3kg",
                            cor: "Branco",
                            raca: "Vira-lata",
                            sexo: "Macho",
                            especie: "Cachorro",
                            image: FotoPerfilCao,
                            carteirinha: FotoPerfilCao,
                            email_usuario: user.email // Garante que o email esteja certo
                        });
                    }
                } else {
                    // Documento do usuário não encontrado
                    setPetData(null);
                }
            } else {
                // Usuário deslogado
                setPetData(null);
                setPet1Id(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribeAuth();
    }, []);

    return (
        <PetContext.Provider value={{ petData, setPetData, pet1Id, setPet1Id, isLoading }}>
            {children}
        </PetContext.Provider>
    );
};

export const usePet = () => useContext(PetContext);