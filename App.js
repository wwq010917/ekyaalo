import React from 'react';
import 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import  MyStack  from './router/MyStack';
import { NavigationContainer } from '@react-navigation/native';
export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}> 
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </SafeAreaView>
  );
}
