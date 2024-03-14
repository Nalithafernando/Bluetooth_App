import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleWorkFromHome = () => {
    // Get the user's current location
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        console.log('Latitude:', latitude);
        console.log('Longitude:', longitude);

        // Navigate to the WorkTimeScreen and pass the location as a parameter
        navigation.navigate('WorkTime', { latitude, longitude });
      },
      error => {
        // Handle any errors that occur while getting the location
        Alert.alert('Error', 'Failed to get current location.');
        console.error('Error getting location:', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to Your Bluetooth Attendance App!</Text>
      <Text style={[styles.chooseOption, { color: 'black' }]}>Choose Option:</Text>
      <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('Scan')}>
        <Text style={styles.buttonText}>Work from Office</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={handleWorkFromHome}>
        <Text style={styles.buttonText}>Work from home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#808080',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    marginBottom: 20,
    color: 'white',
  },
  chooseOption: {
    marginBottom: 10,
    fontSize: 18,
  },
  optionButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
});

export default HomeScreen;
