import { useState, useEffect, useRef } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

export const useObjectDetection = (videoRef, isActive = false) => {
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isDistracted, setIsDistracted] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const detectionIntervalRef = useRef(null);

  // Load COCO-SSD model
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log('Loading TensorFlow.js model...');
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        console.log('✅ Model loaded successfully');
      } catch (error) {
        console.error('Failed to load model:', error);
      }
    };

    loadModel();
  }, []);

  // Run detection loop
  useEffect(() => {
    if (!model || !isActive || !videoRef.current) {
      return;
    }

    const detect = async () => {
      try {
        const video = videoRef.current;
        
        if (video.readyState === 4) {
          const predictions = await model.detect(video);
          setPredictions(predictions);

          // Extract detected object classes
          const objectClasses = predictions.map(p => p.class);
          setDetectedObjects(objectClasses);

          // Check for distractions
          const hasPhone = objectClasses.includes('cell phone');
          const hasPerson = objectClasses.includes('person');
          
          // User is distracted if:
          // 1. Phone is detected
          // 2. No person detected (user left)
          const distracted = hasPhone || !hasPerson;
          setIsDistracted(distracted);
        }
      } catch (error) {
        console.error('Detection error:', error);
      }
    };

    // Run detection every 2 seconds
    detectionIntervalRef.current = setInterval(detect, 2000);

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [model, isActive, videoRef]);

  return {
    predictions,
    isDistracted,
    detectedObjects,
    modelLoaded: !!model
  };
};