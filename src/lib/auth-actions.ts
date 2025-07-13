"use client";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase-config";

const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    await signInWithPopup(auth, provider);
    return null;
  } catch (error: any) {
    return {
      code: error.code,
      message: error.message,
    };
  }
}

export async function signUpWithEmail(email: string, password: string) {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    return null;
  } catch (error: any) {
    return {
      code: error.code,
      message: error.message,
    };
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return null;
  } catch (error: any) {
    return {
      code: error.code,
      message: error.message,
    };
  }
}

export async function clientSignOut() {
  try {
    await signOut(auth);
    return null;
  } catch (error: any) {
     return {
      code: error.code,
      message: error.message,
    };
  }
}
