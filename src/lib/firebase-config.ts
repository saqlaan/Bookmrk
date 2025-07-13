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
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:a1b2c3d4e5f6a7b8c9d0e1",
  measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
