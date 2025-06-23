// hooks/useGazeCapture.ts
import { useRef } from 'react';
import { Camera } from 'react-native-vision-camera';
import { uploadSensorDataToCloud } from '../utils/uploadSensorData';

export function useGazeCapture() {
  const cameraRef = useRef<Camera>(null);

  const captureGaze = async (userId: string) => {
    if (!cameraRef.current) {
      console.warn('Camera ref not ready');
      return null;
    }

    const photo = await cameraRef.current.takePhoto({
      flash: 'off',
    });

    const fileUri = `file://${photo.path}`;
    const imageBase64 = await readFileAsBase64(fileUri);

    const gazeData = {
      userId,
      timestamp: Date.now(),
      imageBase64,
    };

    await uploadSensorDataToCloud('gaze', gazeData);
    return gazeData;
  };

  const readFileAsBase64 = async (uri: string): Promise<string> => {
    const fs = await import('react-native-fs');
    return await fs.default.readFile(uri, 'base64');
  };

  return { cameraRef, captureGaze };
}
