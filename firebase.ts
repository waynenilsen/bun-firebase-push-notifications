import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "@firebase/app";
import { getMessaging } from "firebase/messaging";
import type { Messaging } from "@firebase/messaging";

let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;

export function getFirebaseConfig() {
  return {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  };
}

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeApp(getFirebaseConfig());
  }
  return app;
}

export function getAppMessaging(app: FirebaseApp) {
  if (!messaging) {
    messaging = getMessaging(app);
  }
  return messaging;
}
