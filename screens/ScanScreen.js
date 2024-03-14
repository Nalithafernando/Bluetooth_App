import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import Geolocation from 'react-native-geolocation-service';
import { useNavigation } from '@react-navigation/native';

const ScanScreen = () => {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [bleManager, setBleManager] = useState(null);
  const [isInsideGeofence, setIsInsideGeofence] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const manager = new BleManager();
    setBleManager(manager);

    return () => {
      manager.destroy();
    };
  }, []);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        const geofenceLatitude = 6.933346959705876;
        const geofenceLongitude = 79.84289300274733;
        const distance = calculateDistance(latitude, longitude, geofenceLatitude, geofenceLongitude);
        setIsInsideGeofence(distance < 50); // Assuming the geofence radius is 50 meters
        if (distance < 50) {
          console.log('Device is inside geofence.');
        }
      },
      error => {
        console.error('Error getting current location:', error);
      },
      { enableHighAccuracy: true, timeout: 20000 }
    );
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  };

  const startScan = () => {
    if (!bleManager || scanning || !isInsideGeofence) return;

    setDevices([]);
    setScanning(true);

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Error during scan:', error);
        return;
      }

      if (device) {
        setDevices(prevDevices => {
          if (device.localName && device.localName !== 'Unknown') {
            const index = prevDevices.findIndex(prevDevice => prevDevice.id === device.id);
            if (index === -1) {
              return [{ ...device }, ...prevDevices];
            }
          }
          return prevDevices;
        });
      }
    });

    setTimeout(() => {
      stopScan();
    }, 20000); // Stop scanning after 20 seconds
  };

  const stopScan = () => {
    if (!bleManager) return;

    setScanning(false);
    bleManager.stopDeviceScan();
  };

  const connectToDevice = async (deviceId) => {
    try {
      if (!bleManager) {
        console.error('BleManager is not initialized.');
        return;
      }

      stopScan();

      const connectedDevice = await bleManager.connectToDevice(deviceId);
      console.log('Connected to device:', connectedDevice.id);

      setConnectedDevice(connectedDevice);

      if (connectedDevice.id === 'EA:A0:01:28:E2:94') {
        navigation.navigate('WorkTime', { latitude, longitude });
      }
    } catch (error) {
      console.error('Error connecting to device:', error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => connectToDevice(item.id)}>
        <View style={{ marginVertical: 5 }}>
          <Text style={{ color: 'black' }}>{`Name: ${item.localName || 'Unknown'}`}</Text>
          <Text style={{ color: 'black' }}>{`MAC Address: ${item.id}`}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Start Scan" onPress={startScan} disabled={scanning || !isInsideGeofence} />
      {!isInsideGeofence && (
        <Text style={{ marginTop: 10, color: 'red' }}>Please move inside the geofence to start scanning.</Text>
      )}
      {connectedDevice && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Connected Device</Text>
          <Text style={{ marginTop: 5 }}>{`Name: ${connectedDevice.localName || 'Unknown'}`}</Text>
          <Text>{`MAC Address: ${connectedDevice.id}`}</Text>
        </View>
      )}
      <FlatList
        style={{ marginTop: 20 }}
        data={devices}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default ScanScreen;
