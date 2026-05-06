import admin from 'firebase-admin';
import path from 'path';

/**
 * process.cwd() is the most reliable way in Docker.
 * It points to the folder containing your package.json (/app).
 */
const serviceAccountPath = path.join(process.cwd(), 'service-account-file.json');

// Log this so you can see exactly where it is looking in the Docker logs
console.log('Attempting to load Firebase key from:', serviceAccountPath);

if (admin.apps.length === 0) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });
    console.log('Firebase Admin Initialized Successfully');
  } catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
    // CRITICAL: If initialization fails, don't let the app think it's fine.
    process.exit(1); 
  }
}

export const messaging = admin.apps.length > 0 ? admin.messaging() : null;

export const sendPushNotification = async (symbol: string, price: number) => {
  if (!messaging) {
     console.error('FCM not initialized. Skipping notification.');
     return;
  }
  
  const message = {
    notification: {
      title: `${symbol} Target Hit!`,
      body: `The price is now $${price.toLocaleString()}. Check your dashboard for details.`,
    },
    topic: 'market-alerts', 
    webpush: {
      fcmOptions: {
        link: 'http://localhost:5173'
      }
    }
  };

  try {
    const response = await messaging.send(message);
    console.log('Successfully sent FCM message:', response);
    return response;
  } catch (error) {
    console.error('Error sending FCM message:', error);
  }
};