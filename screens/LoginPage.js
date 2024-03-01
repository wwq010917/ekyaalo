import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function LoginPage ({ navigation }){
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [hcName, setHcName] = useState('');

  const handleLogin = async () => {
    const baseURL = 'https://gymconnect.onrender.com/operator/login';
    try {
      const response = await axios.get(baseURL, {
        params: {
          fname: fname,
          lname: lname,
          hc_name: hcName,
        }
      });
      console.log(response.data)
      await AsyncStorage.setItem('userData', JSON.stringify(response.data));
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Login Failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Ekyaalo</Text>
      <TextInput placeholder="First Name" value={fname} onChangeText={setFname} style={styles.input} />
      <TextInput placeholder="Last Name" value={lname} onChangeText={setLname} style={styles.input} />
      <TextInput placeholder="Health Center Name" value={hcName} onChangeText={setHcName} style={styles.input} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  logo: {
    fontSize: 36, 
    fontWeight: 'bold',
    textAlign: 'center', 
    marginBottom: 40,
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
  },

});


