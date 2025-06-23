interface SensorDataPayload {
  sensorType: string;
  data: unknown;
}

export async function uploadSensorDataToCloud(
  sensorType: string,
  data: unknown
): Promise<void> {
  try {
    await fetch('https://your-backend-url.com/api/alerts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sensorType, data } as SensorDataPayload),
    });
  } catch (error: unknown) {
    console.error('Upload error:', error);
  }
}
