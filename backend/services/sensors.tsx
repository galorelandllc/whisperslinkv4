// services/sensors.tsx
import { generateEmergencyMessage } from '../agents/emergencyMessageAgent';
import { sendAlertNotification } from './notify';

export async function triggerEmergency(userId: string, context: string): Promise<{ success: boolean; message: string }> {
  try {
    const message = await generateEmergencyMessage(context);
    await sendAlertNotification(userId, message);
    return { success: true, message };
  } catch (error: any) {
    console.error('Emergency trigger failed:', error);
    throw new Error(error.message);
  }
}
