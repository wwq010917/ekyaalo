import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Image,Dimensions  } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { Asset } from 'expo-asset';
import { preprocess,detectClusters,renderBox } from '../utility/processing.js';

export default function CapturePage() {
  const [model, setModel] = useState(null);
  const [image, setImage] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const [imgHeight, setImgHeight] = useState(0);
  const deviceWidth = Dimensions.get('window').width;
  const [imgwidth, setImgWidth] = useState(deviceWidth);
  useEffect(() => {
    async function initializeAndProcessImage() {
      await tf.ready(); 
      try {
        // Load the model
        const modelJson = require('../offline_model/model.json');
        const modelWeights = [
          require('../offline_model/group1-shard1of11.bin'),
          require('../offline_model/group1-shard2of11.bin'),
          require('../offline_model/group1-shard3of11.bin'),
          require('../offline_model/group1-shard4of11.bin'),
          require('../offline_model/group1-shard5of11.bin'),
          require('../offline_model/group1-shard6of11.bin'),
          require('../offline_model/group1-shard7of11.bin'),
          require('../offline_model/group1-shard8of11.bin'),
          require('../offline_model/group1-shard9of11.bin'),
          require('../offline_model/group1-shard10of11.bin'),
          require('../offline_model/group1-shard11of11.bin'),
        ];
        tf.engine().startScope();
        const model = await tf.loadGraphModel(bundleResourceIO(modelJson, modelWeights));
        setModel(model);
  
        const asset = Asset.fromModule(require('../assets/2.jpg'));
        await asset.downloadAsync();
        const { width, height } = await new Promise((resolve, reject) => {
          Image.getSize(asset.localUri, (width, height) => {
            resolve({ width, height });
          }, (error) => {
            reject(error);
          });
        });
  
        const scaleFactor = width / deviceWidth;
        const imageHeight = height / scaleFactor;
        setImgHeight(imageHeight);
        setImage(asset);
  
        // Ensure this code runs only after imgHeight is set
        const imageTensor = await preprocess(asset.localUri, 1024, 1024);
        const result = await detectClusters(model, imageTensor);
        const processedBoxes = await renderBox(result, 1024, 1024, deviceWidth, imageHeight);
        setBoxes(processedBoxes);
  
      } catch (error) {
        console.error("Error initializing or processing:", error);
      } finally {
        tf.engine().endScope(); 
      }
    }
  
    initializeAndProcessImage();
  }, []); 
  

  

  return (
    <View style={styles.container}>
      {image && (
        <View>
          <Image
          source={{ uri: image.localUri }}
          style={{ width: imgwidth, height: imgHeight }}
          resizeMode="contain" 
          />
          {boxes.map((box, index) => (
            <View
              key={index}
              style={[
                styles.box,
                {
                  left: box.x,
                  top: box.y,
                  width: box.width,
                  height: box.height,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    position: 'absolute',
    borderColor: 'red',
    borderWidth: 2,
  },
});

