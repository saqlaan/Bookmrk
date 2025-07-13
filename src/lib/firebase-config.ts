// Important: Replace the placeholder values with your actual
// Firebase project configuration. These settings are not real
// and are provided for demonstration purposes only.
//
// To get your Firebase project configuration:
// 1. Go to your Firebase project in the Firebase console.
// 2. In the project overview, click the Web icon (</>) to add a web app or
//    select an existing one.
// 3. Go to Project Settings (click the gear icon ⚙️).
// 4. In the "Your apps" card, find your web app.
// 5. In the "Firebase SDK snippet" pane, select "Config".
// 6. Copy the firebaseConfig object and paste it here.

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
