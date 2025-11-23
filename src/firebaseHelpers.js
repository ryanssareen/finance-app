// Authentication helper functions
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection, addDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Sign up new user
export const signUpUser = async (email, password, username, currency) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update display name
    await updateProfile(user, { displayName: username });
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      username,
      email,
      currency,
      createdAt: new Date().toISOString(),
      customIncomeCategories: [],
      customExpenseCategories: []
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign in existing user
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Send password reset email
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: 'Password reset email sent! Check your inbox.' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get user data
export const getUserData = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: 'User data not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update user data
export const updateUserData = async (userId, data) => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Add custom category
export const addCustomCategory = async (userId, type, categoryName) => {
  try {
    const userData = await getUserData(userId);
    if (!userData.success) return userData;
    
    const field = type === 'income' ? 'customIncomeCategories' : 'customExpenseCategories';
    const currentCategories = userData.data[field] || [];
    
    if (currentCategories.includes(categoryName)) {
      return { success: false, error: 'Category already exists' };
    }
    
    await updateDoc(doc(db, 'users', userId), {
      [field]: [...currentCategories, categoryName]
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete custom category
export const deleteCustomCategory = async (userId, type, categoryName) => {
  try {
    const userData = await getUserData(userId);
    if (!userData.success) return userData;
    
    const field = type === 'income' ? 'customIncomeCategories' : 'customExpenseCategories';
    const currentCategories = userData.data[field] || [];
    
    await updateDoc(doc(db, 'users', userId), {
      [field]: currentCategories.filter(cat => cat !== categoryName)
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Add transaction
export const addTransaction = async (userId, transaction) => {
  try {
    await addDoc(collection(db, 'users', userId, 'transactions'), {
      ...transaction,
      createdAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all transactions
export const getTransactions = async (userId) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users', userId, 'transactions'));
    const transactions = [];
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, transactions };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete transaction
export const deleteTransaction = async (userId, transactionId) => {
  try {
    await deleteDoc(doc(db, 'users', userId, 'transactions', transactionId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Add investment
export const addInvestment = async (userId, investment) => {
  try {
    await addDoc(collection(db, 'users', userId, 'investments'), {
      ...investment,
      createdAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all investments
export const getInvestments = async (userId) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users', userId, 'investments'));
    const investments = [];
    querySnapshot.forEach((doc) => {
      investments.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, investments };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Migrate localStorage data to Firestore
export const migrateLocalData = async (userId) => {
  try {
    // Get local data
    const transactions = JSON.parse(localStorage.getItem(`transactions_${userId}`) || '[]');
    const investments = JSON.parse(localStorage.getItem(`investments_${userId}`) || '[]');
    
    // Migrate transactions
    for (const transaction of transactions) {
      await addTransaction(userId, transaction);
    }
    
    // Migrate investments
    for (const investment of investments) {
      await addInvestment(userId, investment);
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Listen to auth state changes
export const listenToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};
