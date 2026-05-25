// Firebase Configuration for SmartPOS
// Replace with your actual Firebase project credentials
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA5aqIQNLAEuSWm5kaPNR7OiFTUQ66AOtI",
  authDomain: "juice-app-d5be7.firebaseapp.com",
  projectId: "juice-app-d5be7",
  storageBucket: "juice-app-d5be7.firebasestorage.app",
  messagingSenderId: "767495141095",
  appId: "1:767495141095:web:1b0bcc822e3144a0a69442"
};

// Initialize Firebase (prevent duplicate initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence for PWA support
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence failed: multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence not supported in this browser');
    }
  });
}

export default app;
