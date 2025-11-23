import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Briefcase, Settings, LogOut, Plus, Moon, Sun, ArrowRight, Mail, Phone, MapPin, Upload, FileText, Home, Building, Building2, Wallet, CheckSquare, Square, X, Menu, Shield, Zap, TrendingDown, Edit2, Trash2 } from 'lucide-react';

// Import Firebase helpers
import { 
  signUpUser, 
  signInUser, 
  signOutUser, 
  resetPassword,
  getUserData,
  updateUserData,
  addTransaction as addTransactionFirebase,
  getTransactions,
  deleteTransaction as deleteTransactionFirebase,
  addInvestment as addInvestmentFirebase,
  getInvestments,
  migrateLocalData,
  listenToAuthChanges,
  addCustomCategory,
  deleteCustomCategory
} from './firebaseHelpers';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
];

// Default Income & Expense Categories
const defaultIncomeCategories = ['Salary', 'Business', 'Freelance', 'Investments', 'Other'];
const defaultExpenseCategories = ['Food', 'Rent', 'Entertainment', 'Shopping', 'Transportation', 'Healthcare', 'Utilities', 'Other'];

export default function App() {
  // Page Navigation
  const [appPage, setAppPage] = useState('landing');
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // User & Auth
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Theme & Settings
  const [theme, setTheme] = useState('dark');
  const [currency, setCurrency] = useState('USD');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Transactions & Categories
  const [transactions, setTransactions] = useState([]);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionForm, setTransactionForm] = useState({ 
    type: 'income', 
    category: 'Salary', 
    amount: '', 
    label: '', 
    date: new Date().toISOString().split('T')[0],
    receiptImage: null
  });
  const [incomeCategories, setIncomeCategories] = useState(defaultIncomeCategories);
  const [expenseCategories, setExpenseCategories] = useState(defaultExpenseCategories);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryModalType, setCategoryModalType] = useState('income');
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Investments
  const [investments, setInvestments] = useState([]);
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const [investmentForm, setInvestmentForm] = useState({ 
    type: 'sip', 
    amount: '', 
    label: '', 
    duration: 12, 
    returnRate: 12, 
    inflationRate: 6 
  });
  
  // Business (keeping existing structure)
  const [businessRecords, setBusinessRecords] = useState([]);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [businessForm, setBusinessForm] = useState({ 
    type: 'profit', 
    amount: '', 
    label: '', 
    taxRate: 0, 
    date: new Date().toISOString().split('T')[0] 
  });
  
  // Contact Form
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

  const currencySymbol = currencies.find(c => c.code === currency)?.symbol || '$';

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = listenToAuthChanges(async (user) => {
      if (user) {
        setCurrentUser(user);
        const result = await getUserData(user.uid);
        if (result.success) {
          setUserData(result.data);
          setCurrency(result.data.currency || 'USD');
          setIncomeCategories([...defaultIncomeCategories, ...(result.data.customIncomeCategories || [])]);
          setExpenseCategories([...defaultExpenseCategories, ...(result.data.customExpenseCategories || [])]);
        }
        loadUserData(user.uid);
        setAppPage('app');
      } else {
        setCurrentUser(null);
        setUserData(null);
        setAppPage('landing');
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Load theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('financeAppTheme');
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('financeAppTheme', theme);
  }, [theme]);

  // Load user data from Firestore
  const loadUserData = async (userId) => {
    const txResult = await getTransactions(userId);
    if (txResult.success) {
      setTransactions(txResult.transactions);
    }
    
    const invResult = await getInvestments(userId);
    if (invResult.success) {
      setInvestments(invResult.investments);
    }
  };

  // Receipt Upload & Validation
  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Invalid receipt format! Please upload a JPG, PNG, or WEBP image.');
      e.target.value = '';
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Receipt file is too large! Maximum size is 5MB.');
      e.target.value = '';
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setTransactionForm({ 
        ...transactionForm,
        receiptImage: event.target.result
      });
    };
    reader.readAsDataURL(file);
  };

  // Authentication Functions
  const handleAuth = async () => {
    setAuthError('');
    setAuthLoading(true);

    try {
      if (isLogin) {
        const result = await signInUser(email, password);
        if (!result.success) {
          setAuthError(result.error);
        }
      } else {
        if (!username.trim()) {
          setAuthError('Username is required');
          setAuthLoading(false);
          return;
        }
        const result = await signUpUser(email, password, username, currency);
        if (!result.success) {
          setAuthError(result.error);
        }
      }
    } catch (error) {
      setAuthError('An error occurred. Please try again.');
    }
    
    setAuthLoading(false);
    setEmail('');
    setPassword('');
    setUsername('');
  };

  const handleLogout = async () => {
    await signOutUser();
    setCurrentPage('dashboard');
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      alert('Please enter your email address');
      return;
    }
    
    const result = await resetPassword(resetEmail);
    if (result.success) {
      alert(result.message);
      setShowForgotPassword(false);
      setResetEmail('');
    } else {
      alert(result.error);
    }
  };

  // Transaction Functions
  const addTransaction = async () => {
    if (!transactionForm.amount || !transactionForm.label) {
      alert('Please fill in all required fields');
      return;
    }

    const newTransaction = { 
      ...transactionForm, 
      amount: parseFloat(transactionForm.amount),
      userId: currentUser.uid
    };

    const result = await addTransactionFirebase(currentUser.uid, newTransaction);
    if (result.success) {
      loadUserData(currentUser.uid);
      setTransactionForm({ 
        type: 'income', 
        category: 'Salary', 
        amount: '', 
        label: '', 
        date: new Date().toISOString().split('T')[0],
        receiptImage: null
      });
      setShowTransactionForm(false);
    } else {
      alert('Error adding transaction: ' + result.error);
    }
  };

  const deleteTransaction = async (transactionId) => {
    if (!confirm('Delete this transaction?')) return;
    
    const result = await deleteTransactionFirebase(currentUser.uid, transactionId);
    if (result.success) {
      loadUserData(currentUser.uid);
    } else {
      alert('Error deleting transaction: ' + result.error);
    }
  };

  // Category Management
  const openCategoryModal = (type) => {
    setCategoryModalType(type);
    setNewCategoryName('');
    setShowCategoryModal(true);
  };

  const addCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    const result = await addCustomCategory(currentUser.uid, categoryModalType, newCategoryName.trim());
    if (result.success) {
      if (categoryModalType === 'income') {
        setIncomeCategories([...incomeCategories, newCategoryName.trim()]);
      } else {
        setExpenseCategories([...expenseCategories, newCategoryName.trim()]);
      }
      setNewCategoryName('');
      setShowCategoryModal(false);
      
      // Reload user data to sync
      const userData = await getUserData(currentUser.uid);
      if (userData.success) {
        setUserData(userData.data);
      }
    } else {
      alert(result.error);
    }
  };

  const removeCategory = async (categoryName) => {
    if (!confirm(`Delete category "${categoryName}"?`)) return;

    const result = await deleteCustomCategory(currentUser.uid, categoryModalType, categoryName);
    if (result.success) {
      if (categoryModalType === 'income') {
        setIncomeCategories(incomeCategories.filter(c => c !== categoryName));
      } else {
        setExpenseCategories(expenseCategories.filter(c => c !== categoryName));
      }
      
      // Reload user data to sync
      const userData = await getUserData(currentUser.uid);
      if (userData.success) {
        setUserData(userData.data);
      }
    } else {
      alert(result.error);
    }
  };

  // Investment Functions
  const addInvestment = async () => {
    if (!investmentForm.amount || !investmentForm.label) {
      alert('Please fill in all required fields');
      return;
    }

    const principal = parseFloat(investmentForm.amount);
    const months = parseInt(investmentForm.duration);
    const annualReturn = parseFloat(investmentForm.returnRate);
    const inflation = parseFloat(investmentForm.inflationRate);
    const nominalReturn = principal * Math.pow(1 + annualReturn/100, months/12);
    const realReturn = principal * Math.pow(1 + (annualReturn - inflation)/100, months/12);
    
    const newInvestment = { 
      ...investmentForm, 
      amount: principal, 
      nominalReturn: nominalReturn.toFixed(2), 
      realReturn: realReturn.toFixed(2), 
      nominalGain: (nominalReturn - principal).toFixed(2), 
      realGain: (realReturn - principal).toFixed(2),
      userId: currentUser.uid
    };

    const result = await addInvestmentFirebase(currentUser.uid, newInvestment);
    if (result.success) {
      loadUserData(currentUser.uid);
      setInvestmentForm({ 
        type: 'sip', 
        amount: '', 
        label: '', 
        duration: 12, 
        returnRate: 12, 
        inflationRate: 6 
      });
      setShowInvestmentForm(false);
    } else {
      alert('Error adding investment: ' + result.error);
    }
  };

  // Business Functions (keep existing localStorage logic for now)
  const addBusinessRecord = () => {
    if (!businessForm.amount || !businessForm.label) {
      alert('Please fill in all fields');
      return;
    }
    const amount = parseFloat(businessForm.amount);
    const taxAmount = businessForm.type === 'profit' ? (amount * businessForm.taxRate / 100) : 0;
    const newRecord = { 
      id: Date.now(), 
      ...businessForm, 
      amount, 
      taxAmount, 
      netAmount: amount - taxAmount 
    };
    const updatedRecords = [...businessRecords, newRecord];
    setBusinessRecords(updatedRecords);
    localStorage.setItem(`business_${currentUser.uid}`, JSON.stringify(updatedRecords));
    setBusinessForm({ 
      type: 'profit', 
      amount: '', 
      label: '', 
      taxRate: 0, 
      date: new Date().toISOString().split('T')[0] 
    });
    setShowBusinessForm(false);
  };

  // Load business records from localStorage
  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`business_${currentUser.uid}`);
      if (saved) setBusinessRecords(JSON.parse(saved));
    }
  }, [currentUser]);

  // Contact Form
  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  // Calculations
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const businessProfit = businessRecords.filter(b => b.type === 'profit').reduce((sum, b) => sum + b.netAmount, 0);
  const businessExpense = businessRecords.filter(b => b.type === 'expense').reduce((sum, b) => sum + b.amount, 0);
  const businessBalance = businessProfit - businessExpense;

  // Styling
  const bgColor = theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const cardBg = theme === 'dark' ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
