// utilities/imageProcessing.js
import * as tf from '@tensorflow/tfjs';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';

export const preprocess = async (imageUri, modelWidth, modelHeight) => {
  const imgB64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
  const raw = new Uint8Array(imgBuffer); 
  let imgTensor = decodeJpeg(raw);
  const imgShape = imgTensor.shape;
  const height = imgShape[0];
  const width = imgShape[1];
  const maxSize = Math.max(width, height);
  const padH = Math.floor((maxSize - height) / 2);
  const padW = Math.floor((maxSize - width) / 2);
  imgTensor = imgTensor.pad([[padH, maxSize - height - padH], [padW, maxSize - width - padW], [0, 0]]);
  let resizedImg = imgTensor.resizeBilinear([modelHeight, modelWidth]);
  return resizedImg;
};

export const detectClusters = async (model, imageTensor) => {
    imageTensor = imageTensor.expandDims(0).transpose([0, 3, 1, 2]) .div(255.0)
    const predictions = await model.execute({images: imageTensor});
    const transRes = predictions.transpose([0, 2, 1]); 
    const boxes = tf.tidy(() => {
        const w = transRes.slice([0, 0, 2], [-1, -1, 1]); // get width
        const h = transRes.slice([0, 0, 3], [-1, -1, 1]); // get height
        const x1 = tf.sub(transRes.slice([0, 0, 0], [-1, -1, 1]), tf.div(w, 2)); // x1
        const y1 = tf.sub(transRes.slice([0, 0, 1], [-1, -1, 1]), tf.div(h, 2)); // y1
        return tf
        .concat(
            [
            y1,
            x1,
            tf.add(y1, h), //y2
            tf.add(x1, w), //x2
            ],
            2
        )
        .squeeze();
    }); 
    const [scores, classes] = tf.tidy(() => {
        const rawScores = transRes.slice([0, 0, 4], [-1, -1, 1]).squeeze(0); 
        return [rawScores.max(1), rawScores.argMax(1)];
    }); 
    const nms = await tf.image.nonMaxSuppressionAsync(boxes, scores, 500, 0.1, 0.2); // NMS to filter boxes
    const boxes_data = boxes.gather(nms, 0).dataSync(); // indexing boxes by nms index
    const scores_data = scores.gather(nms, 0).dataSync(); // indexing scores by nms index
    const classes_data = classes.gather(nms, 0).dataSync(); // indexing classes by nms index
    let processedBoxes = [];
    for (let i = 0; i < scores_data.length; ++i) {
        const score = (scores_data[i] * 100).toFixed(1);
        let [y1, x1, y2, x2] = boxes_data.slice(i * 4, (i + 1) * 4);
        const width = x2 - x1;
        const height = y2 - y1;
        processedBoxes.push({ x: x1, y: y1, width, height });
    }
    //console.log(processedBoxes);
    return processedBoxes;
};

export const renderBox = async (originalBoxes,originalWidth,originalHeight,displayHeight,displayWidth) => { 
    console.log(originalBoxes,originalWidth,originalHeight,displayHeight,displayWidth)
    const widthScaleFactor = displayWidth / originalWidth;
    const heightScaleFactor = displayHeight / originalHeight;
    const boxes = originalBoxes.map(box => ({
      x: (box.x * widthScaleFactor)>0 ? box.x * widthScaleFactor : 0,
      y: (box.y * heightScaleFactor)>0 ? box.y * heightScaleFactor : 0,
      width: box.width * widthScaleFactor,
      height: box.height * heightScaleFactor,
    }));
    console.log(boxes)
    return boxes
}