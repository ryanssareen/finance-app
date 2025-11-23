// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB2dlsyeCST6Z__xAX77xXAVyzT8xvpQAg",
  authDomain: "finance-app-c2cd5.firebaseapp.com",
  projectId: "finance-app-c2cd5",
  storageBucket: "finance-app-c2cd5.firebasestorage.app",
  messagingSenderId: "159904262556",
  appId: "1:159904262556:web:fd220b868ed0b0b4964059",
  measurementId: "G-8672CHT8QM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore Database
export const db = getFirestore(app);

export default app;
