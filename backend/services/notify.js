// File: backend/services/notify.js
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://gls-whisperslink.firebaseio.com', // Replace with your actual DB URL
  });
}
const userId= "user123";
const db = getFirestore();
/**
 * Sends an emergency notification to a user via FCM.
 * @param {string} userId - Firestore document ID of the user
 * @param {string} message - Alert message content
 */
export async function sendAlertNotification(userId, message) {
  try {
    // Fetch the FCM token from Firestore
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      throw new Error(`User with ID "${userId}" does not exist.`);
    }

    const { fcmToken } = userDoc.data();

    if (!fcmToken) {
      console.error(`[Notification Error] No FCM token found for user ${userId}`);
      throw new Error('No FCM token found for user');
    }

    const payload = {
      notification: {
        title: 'Emergency Alert',
        body: message,
      },
    };

    console.log(`[Notification] Sending to user ${userId}:`, message);
    const response = await admin.messaging().sendToDevice(fcmToken, payload);
    console.log('✅ Notification sent:', response);
  } catch (error) {
    console.error(`[Notification Error] Failed to send to user ${userId}:`, error);
    throw error;
  }
}

// import admin from 'firebase-admin';
// import { getFirestore } from 'firebase-admin/firestore';
// import serviceAccount from '../services/serviceAccountKey.json' assert { type: 'json' };
// import messaging from '@react-native-firebase/messaging';

// // Initialize Firebase Admin SDK
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: 'https://gls-whisperslink.firebaseio.com', // Replace with your Firebase project URL
//   });
//   // admin.initializeApp();
// }
// const db = getFirestore();

// export async function sendAlertNotification(userId, message) {
//   //   messaging().onTokenRefresh(newToken => {
//   //   // Update Firestore or your backend with the new token
//   //   db.collection('users').doc(userId).update({
//   //     fcmToken: newToken,
//   //   });
//   // });

//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     const fcmToken = await messaging().getToken();

//     if (fcmToken) {
//       // Save the token to Firestore
//       await db.collection('users').doc(userId).update({
//         fcmToken,
//       });
//       console.log('FCM Token:', fcmToken);
//     } else {
//       console.log('Failed to get FCM token');
//     }
//   } else {
//     console.log('Notification permission not granted');
//   }

//   const userDoc = await db.collection('users').doc(userId).get();
//   const { fcmToken } = userDoc.data();
//   const payload = {
//     notification: {
//       title: 'Emergency Alert',
//       body: message,
//     },
//   };
//   console.log(`[Notification] Sending to user ${userId}:`, message);
//   if (!fcmToken) {
//     console.error(`[Notification Error] No FCM token found for user ${userId}`);
//     throw new Error('No FCM token found for user');
//   }
//   await admin.messaging().sendToDevice(fcmToken, payload);
// }
