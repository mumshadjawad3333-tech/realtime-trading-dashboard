// src/helper/fcmHelper.ts
import { getToken, onMessage, type MessagePayload } from "firebase/messaging";
import { messaging } from "../firebase";
import { apiRequest } from "../network/apiClient";
import { ENDPOINTS } from "./connectionStrings";

export const setupFCM = async (
  onForegroundMessage: (payload: MessagePayload) => void
) => {
  try {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied.");
      return;
    }

    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

    const currentToken = await getToken(messaging, { vapidKey });

    if (currentToken) {
      console.log("FCM Token Acquired:", currentToken);

      await apiRequest(ENDPOINTS.SUBSCRIBE, {
        method: 'POST',
        body: { token: currentToken, topic: 'market-alerts' }
      });

      onMessage(messaging, (payload: MessagePayload) => {
        console.log('FCM Payload received in foreground:', payload);
        
        if (Notification.permission === "granted") {
          new Notification(payload.notification?.title || "Market Alert", {
            body: payload.notification?.body,
            icon: '/logo192.png',
          });
        }

        onForegroundMessage(payload);
      });
    }
  } catch (err: any) {
    console.error('An error occurred during FCM setup:', err.message);
  }
};