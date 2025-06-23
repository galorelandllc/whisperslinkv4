import { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { BLE_UUIDS, DEVICE_FILTERS } from '../utils/constants';
import { getBleManager } from '../utils/bleManager';

function base64ToUint8Array(base64: string): Uint8Array {
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

export function useBLE() {
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    requestPermissions();

    return () => {
getBleManager().destroy();
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    }
  };

  const startScan = () => {
    setIsScanning(true);
    getBleManager().startDeviceScan(null, null, async (error, device) => {
      if (error) {
        console.error('Scan error:', error);
        setIsScanning(false);
        return;
      }

      if (
        device?.name?.includes(DEVICE_FILTERS.NAME_INCLUDES) ||
        device?.localName === DEVICE_FILTERS.LOCAL_NAME
      ) {
        getBleManager().stopDeviceScan();
        connectToDevice(device);
      }
    });
  };

  const connectToDevice = async (device: Device) => {
    try {
      const connected = await device.connect();
      await connected.discoverAllServicesAndCharacteristics();
      setConnectedDevice(connected);
      monitorCharacteristics(connected);
    } catch (err) {
      console.error('Connection error:', err);
    }
  };

  const monitorCharacteristics = async (device: Device) => {
    device.monitorCharacteristicForService(
      BLE_UUIDS.HEART_RATE_SERVICE,
      BLE_UUIDS.HEART_RATE_CHARACTERISTIC,
      (error, characteristic) => {
        if (error) return console.error('Heart rate error:', error);
        if (characteristic?.value) {
          const data = base64ToUint8Array(characteristic.value);
          setHeartRate(data[1]);
        }
      }
    );

    device.monitorCharacteristicForService(
      BLE_UUIDS.TEMPERATURE_SERVICE,
      BLE_UUIDS.TEMPERATURE_CHARACTERISTIC,
      (error, characteristic) => {
        if (error) return console.error('Temperature error:', error);
        if (characteristic?.value) {
          const data = base64ToUint8Array(characteristic.value);
          setTemperature(data[1]);
        }
      }
    );
  };

  return {
    startScan,
    heartRate,
    temperature,
    isScanning,
    connectedDevice,
  };
}
