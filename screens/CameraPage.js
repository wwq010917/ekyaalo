import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Linking, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons'; 

const windowWidth = Dimensions.get('window').width;

export default function CameraPage() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);

  // Request permission
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === false) {
    return (
      <View style={styles.centeredView}>
        <Text style={styles.permissionText}>Camera access is required for this feature.</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => Linking.openSettings()}>
          <Text style={styles.settingsButtonText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const flipCamera = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      let photo = await cameraRef.current.takePictureAsync();
      console.log('photo', photo);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Camera style={styles.camera} type={cameraType} ref={cameraRef} />
      </View>
      <View style={styles.controls}>
        <TouchableOpacity onPress={takePicture} style={styles.captureButtonOuter}>
            <View style={styles.captureButtonInner}></View>
        </TouchableOpacity>
        <TouchableOpacity onPress={flipCamera} style={styles.flipButton}>
          <MaterialIcons name="flip-camera-ios" size={30} color="white" />
        </TouchableOpacity> 
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  wrapper: {
    flex: 9,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  controls: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  flipButton: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  captureButtonOuter: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 40,
    height: '75%',
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    backgroundColor: 'white',
    borderRadius: 35,
    height: '88%', 
    width: '88%', 
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  settingsButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 20,
  },
  settingsButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
