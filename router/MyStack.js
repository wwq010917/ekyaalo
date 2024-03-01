import React,{useState,useEffect} from 'react';
import {createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from '../screens/HomePage';
import DetailPage from '../screens/DetailPage';
import LoginPage from '../screens/LoginPage';
import CameraPage from '../screens/CameraPage';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createNativeStackNavigator ();

export default function MyStack() {
  const [isLogged, setIsLogged] = useState(true);
  useEffect(() => {
    const checkLogin = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) setIsLogged(true);
    };
    checkLogin();
  }, []);
  return (
    <Stack.Navigator screenOptions={{
        headerShown: false}}>
      {isLogged ? (
        <Stack.Screen name="Home" component={HomePage} />
      ) : (
        <Stack.Screen name="Login" component={LoginPage} />
      )}
      <Stack.Screen name="Details" component={DetailPage} />
      <Stack.Screen name="Camera" component={CameraPage} />
    </Stack.Navigator>
  );
}


