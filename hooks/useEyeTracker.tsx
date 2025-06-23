// File: app/hooks/useEyeTracker.tsx
import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, View, Text } from 'react-native';
import { Camera, CameraPermissionStatus, useCameraDevices } from 'react-native-vision-camera';
import { useGazeCapture } from '../hooks/useGazeCapture';

export type EyeMovement = 'Left' | 'Right' | 'Up' | 'Down' | 'Blinking' | 'Stable';
export type GazeDirection = 'Forward' | 'Left' | 'Right' | 'Down';

export function useEyeTracker() {
  const [eyeMovement, setEyeMovement] = useState<EyeMovement>('Stable');
  const [gazeDirection, setGazeDirection] = useState<GazeDirection>('Forward');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const requestCameraPermission = async () => {
      if (Platform.OS === 'android') {
        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'WhispersLink needs access to your camera to detect eye movement',
            buttonPositive: 'OK',
          }
        );
        setHasPermission(status === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        const status: CameraPermissionStatus = await Camera.requestCameraPermission();
        setHasPermission(status === 'granted');
      }
    };

    requestCameraPermission();

    const interval = setInterval(() => {
      const eyeOptions: EyeMovement[] = ['Left', 'Right', 'Up', 'Down', 'Blinking', 'Stable'];
      const gazeOptions: GazeDirection[] = ['Forward', 'Left', 'Right', 'Down'];

      setEyeMovement(eyeOptions[Math.floor(Math.random() * eyeOptions.length)]);
      setGazeDirection(gazeOptions[Math.floor(Math.random() * gazeOptions.length)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return {
    hasPermission,
    eyeMovement,
    gazeDirection,
  };
}

export function EyeTrackerCamera({ userId }: { userId: string }) {
  const { hasPermission, eyeMovement, gazeDirection } = useEyeTracker();
  const { captureGaze } = useGazeCapture();
  const devices = useCameraDevices();
  const device = devices.find((d) => d.position === 'front');

  useEffect(() => {
    if (eyeMovement === 'Blinking') {
      captureGaze(userId);
    }
  }, [eyeMovement]);

  if (hasPermission === null) return null;
  if (!hasPermission) return <Text>No access to camera</Text>;
  if (!device) return <Text>Loading camera...</Text>;

  return (
    <Camera
      style={{ flex: 1 }}
      device={device}
      isActive={true}
      video={false}
      audio={false}
    >
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0
      }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Eye Movement: {eyeMovement}</Text>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Gaze Direction: {gazeDirection}</Text>
      </View>
    </Camera>
  );
}
