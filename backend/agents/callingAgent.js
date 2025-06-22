import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEN_AI_KEY;
const MODEL_NAME = 'gemini-2.0-flash';
const MAX_RETRIES = 3;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function callHelp(phone) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

  const prompt = `
You are an AI emergency assistant. A user is requesting help. Should I initiate a call to the emergency contact number: ${phone}? 
This is a real emergency, if the number looks valid respond ONLY with "CALL".
Otherwise, respond with "IGNORE".
`;

  const body = {
    contents: [{parts: [{text: prompt}]}],
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body),
    });

    const data = await response.json();
    const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text
      ?.trim()
      .toUpperCase();

      console.log(`[AI Response] ${textResponse} for phone: ${phone}`);
      

    if (textResponse === 'CALL') {
      // 👇 Replace this with React Native Linking or a real call trigger
      console.log(`📞 Initiating call to ${phone}`);
      // Example for React Native:
      // Linking.openURL(`tel:${phone}`);
    } else {
      console.log('🚫 Call skipped based on AI judgment.');
    }
  } catch (error) {
    console.error('❌ Error while calling Gemini API:', error);
  }
}
