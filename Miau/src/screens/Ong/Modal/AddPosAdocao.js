import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
} from '@expo-google-fonts/josefin-sans';

const COLORS = {
  primaryOrange: '#FFAB36',
  primaryPurple: '#9156D1',
  lightPurple: '#E6E6FA',
  lightOrange: '#FFDAB9',
  white: '#FFFFFF',
  black: '#000000',
  darkGray: '#333333',
  mediumGray: '#666666',
  lightGray: '#f0f0f0',
  offWhite: '#f8f8f8',
};

export default function AddPosAdocao({ visible, onClose, conversas, onAdd }) {
  const [selecionadas, setSelecionadas] = useState([]);

  // carregar as fontes (se já estiverem carregadas no app, o segundo load retorna rápido)
  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
  });
  if (!fontsLoaded) return null;

  const toggleSelecionada = (id) => {
    setSelecionadas((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleAdd = () => {
    const itemsSelecionados = conversas.filter((c) => selecionadas.includes(c.id));
    if (itemsSelecionados.length > 0) {
      onAdd(itemsSelecionados);
    }
    setSelecionadas([]);
    onClose();
  };

  const renderItem = ({ item }) => {
    const selected = selecionadas.includes(item.id);
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => toggleSelecionada(item.id)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.image }} style={styles.avatar} />
        <View style={styles.nameWrap}>
          <Text style={styles.name}>{item.name}</Text>
        </View>

        <View style={styles.radio}>
          {selected && <View style={styles.radioSelected} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Adicionar à Pós-Adoção</Text>

          <FlatList
            data={conversas}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => { setSelecionadas([]); onClose(); }}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.addText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '92%',
    maxHeight: '82%',
    backgroundColor: COLORS.offWhite,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
  title: {
    fontSize: 18,
    fontFamily: 'JosefinSans_700Bold',
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: 12,
  },

  listContent: {
    paddingBottom: 12,
  },


  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,  
    paddingHorizontal: 6,
    marginBottom: 6,      
    borderRadius: 10,     
    backgroundColor: COLORS.white, 
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.lightPurple,
  },
  nameWrap: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontFamily: 'JosefinSans_700Bold',
    color: COLORS.darkGray,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.primaryPurple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: COLORS.primaryOrange,
  },

  // botões
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: COLORS.lightGray, // cinza claro pedido
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 8,
  },
  cancelText: {
    fontFamily: 'JosefinSans_700Bold',
    color: COLORS.darkGray,
  },
  addButton: {
    backgroundColor: COLORS.primaryPurple,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addText: {
    fontFamily: 'JosefinSans_700Bold',
    color: COLORS.white,
  },
});
