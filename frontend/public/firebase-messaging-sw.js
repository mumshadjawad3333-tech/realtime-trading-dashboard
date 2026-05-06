// Import scripts for FCM
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase in the Service Worker
// Use the same config as your frontend firebase.ts

firebase.initializeApp({
  apiKey: "AIzaSyDFHz1bwIKzk7fceS3EFcI8JOW6lWlpYdw",
  projectId: "temporary-54f28",
  messagingSenderId: "492992907320",
  appId: "1:492992907320:web:cf5b5440701de7efe2fecd"
});

const messaging = firebase.messaging();

// This is the magic part for background notifications
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title || "Market Alert";
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png', // Ensure this file exists in your public folder
    badge: '/logo192.png',
    data: {
      url: self.location.origin // Opens your site when clicked
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});