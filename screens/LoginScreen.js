import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const mockUser = {
    email: 'test@example.com',
    password: '123',
  };

  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');

  const handleLogin = () => {
    if (enteredEmail === mockUser.email && enteredPassword === mockUser.password) {
      navigation.navigate('Home');
    } else {
      Alert.alert('Login Failed', 'Incorrect login details. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEnteredEmail(text)}
        value={enteredEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setEnteredPassword(text)}
        value={enteredPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: 'black', 
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'black', 
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default LoginScreen;
