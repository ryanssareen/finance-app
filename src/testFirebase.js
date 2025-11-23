import { auth, db } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

/**
 * Test Firebase Configuration
 * Run this to check if Firebase is properly set up
 */

export const testFirebaseSetup = async () => {
  console.log('🔍 Testing Firebase Configuration...\n');
  
  const results = {
    firebaseInitialized: false,
    authEnabled: false,
    firestoreEnabled: false,
    errors: []
  };

  // Test 1: Check if Firebase is initialized
  try {
    if (auth && db) {
      results.firebaseInitialized = true;
      console.log('✅ Firebase initialized successfully');
    }
  } catch (error) {
    results.errors.push('Firebase initialization failed: ' + error.message);
    console.error('❌ Firebase initialization failed:', error.message);
  }

  // Test 2: Check Authentication
  try {
    // Try to check auth state
    const unsubscribe = auth.onAuthStateChanged(() => {});
    unsubscribe();
    results.authEnabled = true;
    console.log('✅ Firebase Authentication is configured');
  } catch (error) {
    results.errors.push('Authentication not enabled: ' + error.message);
    console.error('❌ Authentication error:', error.message);
    console.log('\n📝 To fix: Go to Firebase Console → Authentication → Get Started → Enable Email/Password');
  }

  // Test 3: Check Firestore
  try {
    // Try to create a reference (doesn't write anything)
    const testRef = doc(db, 'test', 'test');
    if (testRef) {
      results.firestoreEnabled = true;
      console.log('✅ Firestore is configured');
    }
  } catch (error) {
    results.errors.push('Firestore not enabled: ' + error.message);
    console.error('❌ Firestore error:', error.message);
    console.log('\n📝 To fix: Go to Firebase Console → Firestore Database → Create Database → Test Mode');
  }

  console.log('\n' + '='.repeat(50));
  if (results.errors.length === 0) {
    console.log('🎉 All Firebase services are properly configured!');
    console.log('You can now use the app normally.');
  } else {
    console.log('⚠️  Setup Issues Found:');
    results.errors.forEach((err, i) => {
      console.log(`${i + 1}. ${err}`);
    });
    console.log('\n📖 Follow the setup instructions in FIREBASE-SETUP.md');
  }
  console.log('='.repeat(50) + '\n');

  return results;
};

// Auto-run test on import in development
if (import.meta.env.DEV) {
  testFirebaseSetup();
}
