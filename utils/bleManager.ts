// File: app/utils/bleManager.ts
import { BleManager } from 'react-native-ble-plx';
import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

// Singleton BleManager instance
let bleManager: BleManager | null = null;

// Optional: NativeEventEmitter only on iOS to avoid crash
let bleEmitter: NativeEventEmitter | null = null;

export function getBleManager(): BleManager {
  if (!bleManager) {
    bleManager = new BleManager();

    if (Platform.OS === 'ios' && NativeModules.BleClientManager) {
      bleEmitter = new NativeEventEmitter(NativeModules.BleClientManager);
    }
  }

  return bleManager;
}

export function getBleEmitter(): NativeEventEmitter | null {
  return bleEmitter;
}
export function destroyBleManager() {
  if (bleManager) {
    bleManager.destroy();
    bleManager = null;
  }
  if (bleEmitter) {
    // Replace 'YourEventType' with the actual event type(s) you registered listeners for
    bleEmitter.removeAllListeners('YourEventType');
    bleEmitter = null;
  }
}