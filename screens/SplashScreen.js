// SplashScreen.js

import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const SplashScreen = ({ hideSplash }) => {
  useEffect(() => {
    // Simulate loading process
    setTimeout(() => {
      // After 2 seconds, hide the splash screen
      hideSplash();
    }, 2000); //
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/splash.png')} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F04A00', // Customize splash screen background color
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Adjust image resizeMode as needed
  },
});

export default SplashScreen;
