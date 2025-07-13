"use client";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase-config";
import { initializeUserData } from "./firebase-db";

const provider = new GoogleAuthProvider();

const actionCodeSettings = {
  url: typeof window !== 'undefined' ? window.location.origin + '/login' : '',
  handleCodeInApp: true,
};

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    // Initialize user data after successful sign-in
    await initializeUserData(result.user.uid);
    return null;
  } catch (error: any) {
    return {
      code: error.code,
      message: error.message,
    };
  }
}

export async function sendEmailLink(email: string) {
  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    // Save the email for later use
    window.localStorage.setItem('emailForSignIn', email);
    return {
      success: true,
      message: 'Check your email for the login link!'
    };
  } catch (error: any) {
    return {
      success: false,
      code: error.code,
      message: error.message,
    };
  }
}

export async function completeEmailSignIn() {
  try {
    if (!isSignInWithEmailLink(auth, window.location.href)) {
      return null;
    }

    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      // If missing email, prompt user for it
      email = window.prompt('Please provide your email for confirmation');
    }

    if (!email) {
      throw new Error('Email is required to complete sign in');
    }

    const result = await signInWithEmailLink(auth, email, window.location.href);
    // Initialize user data after successful sign-in
    await initializeUserData(result.user.uid);
    
    // Clear email from storage
    window.localStorage.removeItem('emailForSignIn');
    return {
      success: true,
      message: 'Successfully signed in!'
    };
  } catch (error: any) {
    return {
      success: false,
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
