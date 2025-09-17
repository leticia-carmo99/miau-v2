import { TouchableOpacity, StyleSheet, View, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import PerfilUser from '../HomeScreens/PerfilUser';

const { width } = Dimensions.get('window');

export default function Menu({ background }) {
 const navigation = useNavigation();
  const iconeBranco = background === 'colorful';
  return (
    <View style={[styles.container]}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Feather
          name="menu"
          size={width * 0.12}
          color={iconeBranco ? '#FFFFFF' : '#6251A2'}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('PerfilUser')}>
        <Image
          source={
            iconeBranco
              ? require('../assets/FotosInicial/foto-user-branco.png')
              : require('../assets/FotosInicial/foto-user-roxo.png')
          }
          style={styles.profileIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  profileIcon: {
    width: width * 0.12,
    height: width * 0.12,
    resizeMode: 'contain',
  },
});
