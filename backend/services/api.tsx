// services/api.ts
// services/api.ts

export async function triggerEmergency(userId: string, message: string): Promise<void> {
  // Placeholder: Replace with actual API call logic
  console.log(`Emergency triggered for ${userId}: ${message}`);
  // Example: await fetch('https://your-backend/api/emergency', { method: 'POST', body: JSON.stringify({ userId, message }) });
}