
import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Animated } from 'react-native';

export default function SplashScreen({ navigation }) {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => navigation.navigate('Welcome'), 1500);
    });
  }, []);

  return (
    <View style={styles.container}>
      {[...Array(5)].map((_, i) => (
        <Animated.Image
          key={i}
          source={require('../../assets/gatoPreto1.png')} 
          style={[styles.paw, { top: i * 60 + 100, opacity }]}
          resizeMode="contain"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  paw: {
    width: 40,
    height: 40,
    marginVertical: 10,
  },
});
