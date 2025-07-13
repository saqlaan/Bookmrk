import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
console.log(process.env.NEXT_PUBLIC_TEST);
// Check if required environment variables are present
const requiredEnvVars = [
  'NEXT_PUBLIC_API_KEY',
  'NEXT_PUBLIC_AUTH_DOMAIN',
  'NEXT_PUBLIC_PROJECT_ID',
  'NEXT_PUBLIC_STORAGE_BUCKET',
  'NEXT_PUBLIC_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_APP_ID'
] as const;

console.log(process.env.NEXT_PUBLIC_TEST);
console.log(process.env.NEXT_PUBLIC_API_KEY);

const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}\n` +
    'Please check your .env.local file.'
  );
}

// Debug: Log all environment variables (remove in production)
console.log('Environment Variables:', {
    API_KEY: process.env.NEXT_PUBLIC_API_KEY,
    AUTH_DOMAIN: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
    STORAGE_BUCKET: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    APP_ID: process.env.NEXT_PUBLIC_APP_ID,
    MEASUREMENT_ID: process.env.NEXT_PUBLIC_MEASUREMENT_ID
  });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
};

let app;
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
