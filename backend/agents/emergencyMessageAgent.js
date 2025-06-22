// // File: backend/services/genAI.js

import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEN_AI_KEY;
const MODEL_NAME = 'gemini-2.0-flash';
const MAX_RETRIES = 3;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function generateEmergencyMessage(context) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `User context: ${context}. `,
          },
        ],
      },
    ],
  };

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.status === 429) {
        const retryDelay =
          parseRetryDelay(data) ||
          parseInt(response.headers.get('Retry-After')) * 1000 ||
          10000; // Default to 10s
        console.warn(
          `429 Too Many Requests. Retry #${attempt} after ${retryDelay}ms...`
        );
        await sleep(retryDelay);
        continue;
      }

      if (!response.ok) {
        throw new Error(
          `Gemini API error: ${response.status} ${response.statusText} - ${JSON.stringify(data)}`
        );
      }

      const message = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!message) {
        throw new Error('No content received from Gemini API');
      }

      return message;
    } catch (error) {
      if (attempt === MAX_RETRIES) {
        throw new Error(`Gemini API error (after ${attempt} attempts): ${error.message}`);
      }
      console.warn(`Retrying after error: ${error.message}`);
      await sleep(3000); // small wait before retrying
    }
  }
}

// Helper to extract retry delay from response details
function parseRetryDelay(data) {
  try {
    const retryInfo = data?.error?.details?.find(
      d => d['@type']?.includes('RetryInfo')
    );
    if (retryInfo?.retryDelay) {
      const match = retryInfo.retryDelay.match(/(\d+)s/);
      if (match) return parseInt(match[1], 10) * 1000;
    }
  } catch (err) {
    console.warn('Could not parse retry delay:', err.message);
  }
  return null;
}
