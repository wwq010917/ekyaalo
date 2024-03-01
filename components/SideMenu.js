import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
const windowWidth = Dimensions.get('window').width;
const menuWidth = windowWidth * (3/5);


export default function SideMenu ({ isVisible, onClose  }) {
  const slideAnim = useRef(new Animated.Value(menuWidth)).current; 
  const navigation = useNavigation();
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : menuWidth, 
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);
  const navigateTo = (screen) => {
    navigation.navigate(screen);
    onClose();
  }
  return (
    <Animated.View
      style={[
        styles.menuContainer,
        {
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <Text style={styles.menuTitle}>Menu</Text>
      <TouchableOpacity style={styles.button} onPress={() => alert("Action 1")}>
        <Text style={styles.buttonText}>HomePage</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => alert("Action 2")}>
        <Text style={styles.buttonText}>CapturePage</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigateTo('Camera')}>
        <Text style={styles.buttonText}>CameraPage</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => alert("Action 3")}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close Menu</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    width: menuWidth,
    height: '100%',
    backgroundColor: '#444',
    right: 0,
    top: 0,
    zIndex: 100,
    padding: 20, 
  },
  menuTitle: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#555', 
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center', 
  },
});

