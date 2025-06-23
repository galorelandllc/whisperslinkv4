// File: app/constants.ts

// BLE UUIDs for Heart Rate and Temperature services
export const BLE_UUIDS = {
  HEART_RATE_SERVICE: '180D',
  HEART_RATE_CHARACTERISTIC: '2A37',
  TEMPERATURE_SERVICE: '1809',
  TEMPERATURE_CHARACTERISTIC: '2A1C',
};

// Eye tracking simulation intervals (in milliseconds)
export const EYE_TRACKING_INTERVAL = 3000;

// Gaze and eye movement labels
export const EYE_MOVEMENTS = ['Left', 'Right', 'Up', 'Down', 'Blinking', 'Stable'] as const;
export const GAZE_DIRECTIONS = ['Forward', 'Left', 'Right', 'Down'] as const;

// Thresholds for biometric alerts (example values)
export const BIOMETRIC_THRESHOLDS = {
  HEART_RATE_HIGH: 120, // bpm
  HEART_RATE_LOW: 50,
  TEMPERATURE_HIGH: 38, // Celsius
  TEMPERATURE_LOW: 35,
};

// BLE device filter (by name or ID fragment)
export const DEVICE_FILTERS = {
  NAME_INCLUDES: 'Sensor',
  LOCAL_NAME: 'MyHealthDevice',
};

// Default system states
export const DEFAULTS = {
  HEART_RATE: null,
  TEMPERATURE: null,
  EYE_MOVEMENT: 'Stable',
  GAZE_DIRECTION: 'Forward',
};
