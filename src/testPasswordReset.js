import { resetPassword } from './firebaseHelpers';

/**
 * Test password reset email functionality
 * Open browser console and run: window.testPasswordReset('your@email.com')
 */

window.testPasswordReset = async (email) => {
  console.log('🧪 Testing password reset for:', email);
  console.log('---');
  
  if (!email) {
    console.error('❌ Please provide an email: window.testPasswordReset("your@email.com")');
    return;
  }
  
  console.log('📧 Attempting to send password reset email...');
  
  const result = await resetPassword(email);
  
  if (result.success) {
    console.log('✅ SUCCESS!');
    console.log('Message:', result.message);
    console.log('---');
    console.log('📬 Check your email inbox (and spam folder)');
    console.log('📧 Email should arrive within 2-5 minutes');
    console.log('🔍 Look for email from: noreply@finance-app-c2cd5.firebaseapp.com');
  } else {
    console.error('❌ FAILED!');
    console.error('Error:', result.error);
    console.log('---');
    
    // Provide specific help based on error
    if (result.error.includes('user-not-found')) {
      console.log('💡 This email is not registered. Try a different email.');
    } else if (result.error.includes('invalid-email')) {
      console.log('💡 Email format is invalid. Check for typos.');
    } else if (result.error.includes('configuration-not-found')) {
      console.log('💡 Email provider not configured in Firebase.');
      console.log('   Go to: Firebase Console → Authentication → Templates');
    } else if (result.error.includes('missing-continue-url')) {
      console.log('💡 Missing configuration. Check firebaseHelpers.js');
    } else {
      console.log('💡 Unknown error. Check Firebase Console for more details.');
    }
  }
  
  return result;
};

console.log('🧪 Password Reset Tester Loaded!');
console.log('📝 Usage: window.testPasswordReset("your@email.com")');
console.log('---');
