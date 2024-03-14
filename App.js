import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen'; 
import HomeScreen from './screens/HomeScreen';
import ScanScreen from './screens/ScanScreen';
import WorkTimeScreen from './screens/WorkTimeScreen'; // Import WorkTimeScreen

import PushNotification from 'react-native-push-notification';
import { request, PERMISSIONS, RESULTS,} from 'react-native-permissions';
import { Platform } from 'react-native';

const Stack = createStackNavigator();

const App = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [blePermission, setBlePermission] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);

  useEffect(() => {
    requestPermissions();
    setTimeout(() => {
      setIsSplashVisible(false);
    }, 2000); // Adjust the duration as needed

    // Schedule a notification to remind the user to log out before 6 pm
    scheduleLogoutReminder();
  }, []);

  const requestPermissions = async () => {
    try {
      const bluetoothPermission = await requestBluetoothPermission();
      setBlePermission(bluetoothPermission === RESULTS.GRANTED);

      const locationPermission = await requestLocationPermission();
      setLocationPermission(locationPermission === RESULTS.GRANTED);
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const requestBluetoothPermission = async () => {
    try {
      const result = await request(
        Platform.select({
          ios: PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
          android: PERMISSIONS.ANDROID.BLUETOOTH,
        })
      );
      return result;
    } catch (error) {
      console.error('Error requesting Bluetooth permissions:', error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const result = await request(
        Platform.select({
          ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        })
      );
      return result;
    } catch (error) {
      console.error('Error requesting Location permissions:', error);
    }
  };

  const scheduleLogoutReminder = () => {
    PushNotification.createChannel(
      {
        channelId: 'logout-channel',
        channelName: 'Logout Channel',
        channelDescription: 'Channel for logout reminders',
      },
      created => console.log(`createChannel returned '${created}'`)
    );

    PushNotification.localNotificationSchedule({
      channelId: 'logout-channel',
      title: 'Logout Reminder',
      message: 'Remember to log out before 6 pm!',
      date: new Date(Date.now() + 60 * 60 * 1000),
    });
  };

  return (
    <NavigationContainer>
      {isSplashVisible ? (
        <SplashScreen hideSplash={() => setIsSplashVisible(false)} />
      ) : (
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Scan" component={ScanScreen} />
          <Stack.Screen name="WorkTime" component={WorkTimeScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;
