import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

// Import Currency Converter
import { 
  convertCurrency, 
  convertAllTransactions, 
  convertAllInvestments,
  getConversionRate 
} from './currencyConverter';

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
  const [previousCurrency, setPreviousCurrency] = useState('USD');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // AI Assistant
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  
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

  // AI Chat Handler
  const handleAIChat = async (message, documentFile = null) => {
    if (!message.trim() && !documentFile) return;

    // Add user message
    const userMessage = { 
      role: 'user', 
      content: documentFile ? `[Document Upload] ${message || 'Please analyze this document'}` : message,
      timestamp: new Date().toISOString()
    };
    setAiMessages(prev => [...prev, userMessage]);
    setAiInput('');
    setAiLoading(true);

    try {
      const messages = [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: documentFile 
                ? `I'm uploading a financial document. Please analyze it and extract key information like amounts, dates, categories, merchant names, etc. Here's what I need: ${message || 'Extract transaction details'}\n\nMy current financial context:\n- Total Income: ${currencySymbol}${totalIncome.toFixed(2)}\n- Total Expenses: ${currencySymbol}${totalExpense.toFixed(2)}\n- Balance: ${currencySymbol}${balance.toFixed(2)}\n- Top expense categories: ${expenseTransactions.length > 0 ? Object.entries(expenseTransactions.reduce((acc, t) => {
                    acc[t.category] = (acc[t.category] || 0) + t.amount;
                    return acc;
                  }, {})).sort(([,a], [,b]) => b - a).slice(0, 3).map(([cat]) => cat).join(', ') : 'None yet'}`
                : `I need help with my finances. Here's my current situation:\n- Total Income: ${currencySymbol}${totalIncome.toFixed(2)}\n- Total Expenses: ${currencySymbol}${totalExpense.toFixed(2)}\n- Balance: ${currencySymbol}${balance.toFixed(2)}\n- Recent transactions: ${transactions.slice(-3).map(t => `${t.type === 'income' ? '+' : '-'}${currencySymbol}${t.amount} (${t.category})`).join(', ')}\n\nQuestion: ${message}`
            }
          ]
        }
      ];

      // Add document if provided
      if (documentFile) {
        const base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(documentFile);
        });

        const mediaType = documentFile.type === 'application/pdf' 
          ? 'application/pdf'
          : documentFile.type.startsWith('image/') 
            ? documentFile.type 
            : 'application/pdf';

        const contentType = documentFile.type === 'application/pdf' ? 'document' : 'image';

        messages[0].content.push({
          type: contentType,
          source: {
            type: 'base64',
            media_type: mediaType,
            data: base64Data
          }
        });
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: messages
        })
      });

      if (!response.ok) {
        throw new Error('AI request failed');
      }

      const data = await response.json();
      const aiResponse = data.content[0].text;

      setAiMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('AI Error:', error);
      setAiMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
        error: true
      }]);
    } finally {
      setAiLoading(false);
    }
  };

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

  // LANDING PAGE
  if (appPage === 'landing') {
    return (
      <div className={`min-h-screen ${bgColor} ${textColor}`}>
        <nav className={`${cardBg} border-b ${borderColor} sticky top-0 z-50 backdrop-blur-lg bg-opacity-90`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <span className="text-4xl">💰</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                  FinanceFlow
                </span>
              </div>
              <div className="hidden md:flex space-x-8">
                <button onClick={() => setAppPage('features')} className={`${textColor} ${hoverBg} px-4 py-2 rounded-lg transition`}>
                  Features
                </button>
                <button onClick={() => setAppPage('contact')} className={`${textColor} ${hoverBg} px-4 py-2 rounded-lg transition`}>Contact</button>
                <button onClick={() => setAppPage('auth')} className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition">
                  Get Started
                </button>
              </div>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className={`${cardBg} border-b ${borderColor} md:hidden`}>
            <div className="px-4 py-3 space-y-2">
              <button onClick={() => { setMobileMenuOpen(false); setAppPage('features'); }} className={`${textColor} ${hoverBg} w-full text-left px-4 py-2 rounded-lg`}>
                Features
              </button>
              <button onClick={() => setAppPage('contact')} className={`${textColor} ${hoverBg} w-full text-left px-4 py-2 rounded-lg`}>Contact</button>
              <button onClick={() => setAppPage('auth')} className="bg-emerald-500 text-white w-full px-4 py-2 rounded-lg hover:bg-emerald-600">
                Get Started
              </button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Master Your Finances
            </h1>
            <p className={`text-xl md:text-2xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-8 max-w-3xl mx-auto`}>
              Track income, expenses, investments, and business finances all in one intelligent platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setAppPage('auth')} className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transition transform hover:scale-105">
                Start Free Today <ArrowRight className="inline ml-2" />
              </button>
              <button onClick={() => setAppPage('features')} className={`${cardBg} border-2 ${borderColor} px-8 py-4 rounded-xl text-lg font-semibold hover:border-emerald-500 transition`}>
                View Features
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // FEATURES PAGE
  if (appPage === 'features') {
    return (
      <div className={`min-h-screen ${bgColor} ${textColor}`}>
        <nav className={`${cardBg} border-b ${borderColor} sticky top-0 z-50`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button onClick={() => setAppPage('landing')} className="flex items-center space-x-3">
                <span className="text-4xl">💰</span>
                <span className="text-2xl font-bold">FinanceFlow</span>
              </button>
              <div className="flex items-center gap-4">
                <button onClick={() => setAppPage('landing')} className={`${hoverBg} px-4 py-2 rounded-lg`}>Home</button>
                <button onClick={() => setAppPage('contact')} className={`${hoverBg} px-4 py-2 rounded-lg`}>Contact</button>
                <button onClick={() => setAppPage('auth')} className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Powerful Features
            </h1>
            <p className={`text-xl md:text-2xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              Everything you need to take control of your finances
            </p>
          </div>

          {/* Core Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              { 
                icon: Shield, 
                title: 'Bank-Level Security', 
                desc: 'Your financial data is encrypted with AES-256 encryption and stored securely in Firebase Cloud. Multi-device sync keeps all your data safe and accessible.' 
              },
              { 
                icon: TrendingUp, 
                title: 'Smart Analytics & Charts', 
                desc: 'Beautiful visualizations show your spending patterns. Track income vs expenses with pie charts, see top categories, and make data-driven financial decisions.' 
              },
              { 
                icon: Zap, 
                title: 'Real-Time Multi-Device Sync', 
                desc: 'Access your finances from phone, tablet, or computer. Changes sync instantly across all devices via secure Firebase Cloud Database.' 
              }
            ].map((feature, i) => (
              <div key={i} className={`${cardBg} border ${borderColor} p-8 rounded-2xl hover:shadow-xl transition transform hover:scale-105`}>
                <feature.icon className="w-12 h-12 text-emerald-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Additional Features */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {[
              {
                icon: TrendingUp,
                title: 'Income Tracking',
                desc: 'Track all income sources with custom categories. Monitor salary, business revenue, freelance work, and more.'
              },
              {
                icon: TrendingDown,
                title: 'Expense Management',
                desc: 'Organize expenses by category. Upload receipt photos and let AI extract transaction details automatically.'
              },
              {
                icon: Briefcase,
                title: 'Investment Calculator',
                desc: 'Calculate returns with inflation adjustment. Track SIPs, lump sums, stocks, and crypto investments.'
              },
              {
                icon: Wallet,
                title: 'Multi-Currency Support',
                desc: 'Support for USD, EUR, GBP, INR, JPY, CNY, CAD, and AUD. Convert all data when switching currencies.'
              }
            ].map((feature, i) => (
              <div key={i} className={`${cardBg} border ${borderColor} p-8 rounded-2xl hover:shadow-xl transition`}>
                <feature.icon className="w-10 h-10 text-emerald-500 mb-4" />
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <button onClick={() => setAppPage('auth')} className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transition transform hover:scale-105">
              Start Using FinanceFlow <ArrowRight className="inline ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CONTACT PAGE
  if (appPage === 'contact') {
    return (
      <div className={`min-h-screen ${bgColor} ${textColor}`}>
        <nav className={`${cardBg} border-b ${borderColor} sticky top-0 z-50`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button onClick={() => setAppPage('landing')} className="flex items-center space-x-3">
                <span className="text-4xl">💰</span>
                <span className="text-2xl font-bold">FinanceFlow</span>
              </button>
              <button onClick={() => setAppPage('landing')} className={`${hoverBg} px-4 py-2 rounded-lg`}>
                Back
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4 text-center">Get In Touch</h1>
          <p className={`text-center mb-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Have questions? We'd love to hear from you.
          </p>

          <div className="max-w-xl mx-auto">
            <div className="space-y-6">
              <div className={`${cardBg} border ${borderColor} p-6 rounded-2xl flex items-start space-x-4`}>
                <Mail className="w-6 h-6 text-emerald-500 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>ryanssareen@gmail.com</p>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>ryanssareen@outlook.com</p>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>ryansareen6@gmail.com</p>
                </div>
              </div>

              <div className={`${cardBg} border ${borderColor} p-6 rounded-2xl flex items-start space-x-4`}>
                <Phone className="w-6 h-6 text-emerald-500 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>+91 7428769797</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // AUTH PAGE
  if (appPage === 'auth') {
    return (
      <div className={`min-h-screen ${bgColor} ${textColor} flex items-center justify-center p-4`}>
        {!showForgotPassword ? (
          <div className={`${cardBg} border ${borderColor} rounded-2xl p-8 w-full max-w-md`}>
            <div className="text-center mb-8">
              <DollarSign className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {isLogin ? 'Sign in to continue' : 'Start managing your finances today'}
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                {authError}
              </div>
            )}

            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block mb-2 font-medium">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none`}
                    placeholder="Choose a username"
                    disabled={authLoading}
                  />
                </div>
              )}

              <div>
                <label className="block mb-2 font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none`}
                  placeholder="Enter your email"
                  disabled={authLoading}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none`}
                  placeholder="Enter your password"
                  disabled={authLoading}
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block mb-2 font-medium">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className={`w-full ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none`}
                    disabled={authLoading}
                  >
                    {currencies.map(curr => (
                      <option key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-end">
                  <button 
                    onClick={() => setShowForgotPassword(true)} 
                    className="text-sm text-emerald-500 hover:text-emerald-600"
                    disabled={authLoading}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                onClick={handleAuth}
                disabled={authLoading}
                className={`w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition font-semibold ${authLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {authLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>

              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setAuthError('');
                }}
                disabled={authLoading}
                className={`w-full ${hoverBg} py-3 rounded-lg transition`}
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>

              <button
                onClick={() => setAppPage('landing')}
                disabled={authLoading}
                className={`w-full ${hoverBg} py-3 rounded-lg transition`}
              >
                Back to Home
              </button>
            </div>
          </div>
        ) : (
          <div className={`${cardBg} border ${borderColor} rounded-2xl p-8 w-full max-w-md`}>
            <div className="text-center mb-8">
              <Mail className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Enter your email and we'll send you a reset link
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Email</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className={`w-full ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none`}
                  placeholder="Enter your email"
                />
              </div>

              <button
                onClick={handlePasswordReset}
                className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition font-semibold"
              >
                Send Reset Email
              </button>

              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail('');
                }}
                className={`w-full ${hoverBg} py-3 rounded-lg transition`}
              >
                Back to Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // MAIN APP
  return (
    <div className={`min-h-screen ${bgColor}`}>
      {/* Top Navigation */}
      <nav className={`${cardBg} border-b ${borderColor} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">💰</span>
              <span className={`text-xl font-bold ${textColor}`}>FinanceFlow</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`hidden sm:block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Welcome, {userData?.username || currentUser?.displayName}
              </span>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`${hoverBg} p-2 rounded-lg transition`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500/20 transition flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Navigation Tabs */}
      <div className={`${cardBg} border-b ${borderColor}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex space-x-1 overflow-x-auto">
              {[
                { id: 'settings', label: 'Settings', icon: Settings },
                { id: 'dashboard', label: 'Dashboard', icon: DollarSign },
                { id: 'income', label: 'Income', icon: TrendingUp },
                { id: 'expense', label: 'Expense', icon: TrendingDown },
                { id: 'investments', label: 'Investments', icon: Briefcase }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentPage(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition ${
                      currentPage === tab.id
                        ? 'border-emerald-500 text-emerald-500'
                        : `border-transparent ${textColor} ${hoverBg}`
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </button>
                );
              })}
            </div>
            
            {/* AI Assistant Button */}
            <button
              onClick={() => setShowAIChat(!showAIChat)}
              className="ml-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition flex items-center space-x-2 shadow-lg"
            >
              <span className="text-xl">🤖</span>
              <span className="font-semibold whitespace-nowrap">AI Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* DASHBOARD PAGE */}
        {currentPage === 'dashboard' && (
          <div className="space-y-6">
            <h1 className={`text-3xl font-bold ${textColor}`}>Financial Dashboard</h1>
            
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className={`${cardBg} border ${borderColor} rounded-2xl p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Total Income</h3>
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <p className={`text-3xl font-bold ${textColor}`}>{currencySymbol}{totalIncome.toFixed(2)}</p>
                <p className="text-sm text-green-500 mt-2">{incomeTransactions.length} transactions</p>
              </div>
              
              <div className={`${cardBg} border ${borderColor} rounded-2xl p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Total Expenses</h3>
                  <TrendingDown className="w-6 h-6 text-red-500" />
                </div>
                <p className={`text-3xl font-bold ${textColor}`}>{currencySymbol}{totalExpense.toFixed(2)}</p>
                <p className="text-sm text-red-500 mt-2">{expenseTransactions.length} transactions</p>
              </div>
              
              <div className={`${cardBg} border ${borderColor} rounded-2xl p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Net Balance</h3>
                  <DollarSign className={`w-6 h-6 ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                </div>
                <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {currencySymbol}{balance.toFixed(2)}
                </p>
              </div>
            </div>
        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Income vs Expense Donut Chart */}
          <div className={`${cardBg} border ${borderColor} rounded-2xl p-6`}>
            <h3 className={`text-xl font-bold mb-4 ${textColor}`}>Income vs Expenses</h3>
            {totalIncome > 0 || totalExpense > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Income', value: totalIncome, fill: '#10b981' },
                      { name: 'Expenses', value: totalExpense, fill: '#ef4444' }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent, value }) => `${name}: ${currencySymbol}${value.toFixed(0)} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={110}
                    innerRadius={70}
                    dataKey="value"
                    strokeWidth={3}
                    stroke={theme === 'dark' ? '#1f2937' : '#ffffff'}
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${currencySymbol}${value.toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                      border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      padding: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className={`text-center py-20 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                No data to display yet
              </p>
            )}
          </div>

          {/* Top Expense Categories Bar Chart */}
          <div className={`${cardBg} border ${borderColor} rounded-2xl p-6`}>
            <h3 className={`text-xl font-bold mb-4 ${textColor}`}>Top Expense Categories</h3>
            {expenseTransactions.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={Object.entries(
                    expenseTransactions.reduce((acc, t) => {
                      acc[t.category] = (acc[t.category] || 0) + t.amount;
                      return acc;
                    }, {})
                  )
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([category, amount]) => ({ category, amount }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                  <XAxis 
                    dataKey="category" 
                    stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                    angle={-25}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                  <Tooltip 
                    formatter={(value) => `${currencySymbol}${value.toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                      border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      padding: '12px'
                    }}
                  />
                  <Bar dataKey="amount" fill="#ef4444" radius={[8, 8, 0, 0]}>
                    {Object.entries(
                      expenseTransactions.reduce((acc, t) => {
                        acc[t.category] = (acc[t.category] || 0) + t.amount;
                        return acc;
                      }, {})
                    )
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#ef4444', '#f87171', '#fb923c', '#fbbf24', '#facc15'][index % 5]} />
                      ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className={`text-center py-20 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                No expenses yet
              </p>
            )}
          </div>
        </div>

        

            {/* Recent Transactions */}
            <div className={`${cardBg} border ${borderColor} rounded-2xl p-6`}>
              <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Recent Transactions</h2>
              {transactions.length === 0 ? (
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>No transactions yet</p>
              ) : (
                <div className="space-y-3">
                  {transactions.slice(-5).reverse().map(t => (
                    <div key={t.id} className={`flex justify-between items-center p-3 ${inputBg} rounded-lg`}>
                      <div>
                        <p className={`font-semibold ${textColor}`}>{t.label}</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {t.category} • {t.date}
                        </p>
                      </div>
                      <p className={`font-bold ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                        {t.type === 'income' ? '+' : '-'}{currencySymbol}{t.amount.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* INCOME PAGE */}
        {currentPage === 'income' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className={`text-3xl font-bold ${textColor}`}>Income</h1>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  Total: {currencySymbol}{totalIncome.toFixed(2)}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => openCategoryModal('income')}
                  className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition flex items-center space-x-2"
                >
                  <Settings className="w-5 h-5" />
                  <span>Manage Categories</span>
                </button>
                <button
                  onClick={() => {
                    setTransactionForm({ 
                      ...transactionForm, 
                      type: 'income', 
                      category: incomeCategories[0] 
                    });
                    setShowTransactionForm(true);
                  }}
                  className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Income</span>
                </button>
              </div>
            </div>

            {incomeTransactions.length === 0 ? (
              <div className={`${cardBg} border ${borderColor} rounded-2xl p-12 text-center`}>
                <TrendingUp className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>No income recorded yet</p>
                <button
                  onClick={() => {
                    setTransactionForm({ ...transactionForm, type: 'income' });
                    setShowTransactionForm(true);
                  }}
                  className="mt-4 bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition"
                >
                  Add Your First Income
                </button>
              </div>
            ) : (
              <div className={`${cardBg} border ${borderColor} rounded-2xl overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={inputBg}>
                      <tr>
                        <th className={`px-6 py-4 text-left ${textColor}`}>Date</th>
                        <th className={`px-6 py-4 text-left ${textColor}`}>Description</th>
                        <th className={`px-6 py-4 text-left ${textColor}`}>Category</th>
                        <th className={`px-6 py-4 text-right ${textColor}`}>Amount</th>
                        <th className={`px-6 py-4 text-center ${textColor}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incomeTransactions.map(t => (
                        <tr key={t.id} className={`border-t ${borderColor}`}>
                          <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t.date}</td>
                          <td className={`px-6 py-4 ${textColor}`}>{t.label}</td>
                          <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t.category}</td>
                          <td className="px-6 py-4 text-right font-bold text-green-500">
                            +{currencySymbol}{t.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => deleteTransaction(t.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* EXPENSE PAGE */}
        {currentPage === 'expense' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className={`text-3xl font-bold ${textColor}`}>Expenses</h1>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  Total: {currencySymbol}{totalExpense.toFixed(2)}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => openCategoryModal('expense')}
                  className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition flex items-center space-x-2"
                >
                  <Settings className="w-5 h-5" />
                  <span>Manage Categories</span>
                </button>
                <button
                  onClick={() => {
                    setTransactionForm({ 
                      ...transactionForm, 
                      type: 'expense', 
                      category: expenseCategories[0] 
                    });
                    setShowTransactionForm(true);
                  }}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Expense</span>
                </button>
              </div>
            </div>

            {expenseTransactions.length === 0 ? (
              <div className={`${cardBg} border ${borderColor} rounded-2xl p-12 text-center`}>
                <TrendingDown className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>No expenses recorded yet</p>
                <button
                  onClick={() => {
                    setTransactionForm({ ...transactionForm, type: 'expense' });
                    setShowTransactionForm(true);
                  }}
                  className="mt-4 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
                >
                  Add Your First Expense
                </button>
              </div>
            ) : (
              <div className={`${cardBg} border ${borderColor} rounded-2xl overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={inputBg}>
                      <tr>
                        <th className={`px-6 py-4 text-left ${textColor}`}>Date</th>
                        <th className={`px-6 py-4 text-left ${textColor}`}>Description</th>
                        <th className={`px-6 py-4 text-left ${textColor}`}>Category</th>
                        <th className={`px-6 py-4 text-right ${textColor}`}>Amount</th>
                        <th className={`px-6 py-4 text-center ${textColor}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenseTransactions.map(t => (
                        <tr key={t.id} className={`border-t ${borderColor}`}>
                          <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t.date}</td>
                          <td className={`px-6 py-4 ${textColor}`}>{t.label}</td>
                          <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t.category}</td>
                          <td className="px-6 py-4 text-right font-bold text-red-500">
                            -{currencySymbol}{t.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => deleteTransaction(t.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* INVESTMENTS PAGE */}
        {currentPage === 'investments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className={`text-3xl font-bold ${textColor}`}>Investment Portfolio</h1>
              <button
                onClick={() => setShowInvestmentForm(true)}
                className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Investment</span>
              </button>
            </div>

            {investments.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {investments.map(inv => (
                  <div key={inv.id} className={`${cardBg} border ${borderColor} rounded-2xl p-6`}>
                    <h3 className={`text-xl font-bold mb-4 ${textColor}`}>{inv.label}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Principal</span>
                        <span className={textColor}>{currencySymbol}{inv.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Duration</span>
                        <span className={textColor}>{inv.duration} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Return Rate</span>
                        <span className={textColor}>{inv.returnRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Nominal Return</span>
                        <span className="text-green-500 font-bold">{currencySymbol}{inv.nominalReturn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Real Return (inflation adj.)</span>
                        <span className="text-blue-500 font-bold">{currencySymbol}{inv.realReturn}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS PAGE */}
        {currentPage === 'settings' && (
          <div className="space-y-6">
            <h1 className={`text-3xl font-bold ${textColor}`}>Settings</h1>
            
            <div className={`${cardBg} border ${borderColor} rounded-2xl p-6 space-y-6`}>
              <div>
                <label className={`block mb-2 font-medium ${textColor}`}>Currency</label>
                <select
                  value={currency}
                  onChange={async (e) => {
                    const newCurrency = e.target.value;
                    const oldCurrency = currency;
                    
                    if (oldCurrency === newCurrency) return;
                    
                    const rate = getConversionRate(oldCurrency, newCurrency);
                    const confirmMsg = `Convert all amounts from ${oldCurrency} to ${newCurrency}?\n\nRate: 1 ${oldCurrency} = ${rate.toFixed(4)} ${newCurrency}\n\nThis will update ALL transactions and investments.`;
                    
                    if (confirm(confirmMsg)) {
                      try {
                        // Convert ALL transactions
                        const convertedTx = convertAllTransactions(transactions, oldCurrency, newCurrency);
                        setTransactions(convertedTx);
                        
                        // Convert ALL investments
                        const convertedInv = convertAllInvestments(investments, oldCurrency, newCurrency);
                        setInvestments(convertedInv);
                        
                        // Update currency state
                        setCurrency(newCurrency);
                        setPreviousCurrency(newCurrency);
                        
                        // Save to Firebase
                        await updateUserData(currentUser.uid, { currency: newCurrency });
                        
                        alert(`✅ Converted! All amounts changed from ${oldCurrency} to ${newCurrency}`);
                      } catch (error) {
                        console.error('Conversion error:', error);
                        alert('Error converting currency');
                      }
                    }
                  }}
                  className={`w-full ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none`}
                >
                  {currencies.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block mb-2 font-medium ${textColor}`}>Theme</label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 py-3 rounded-lg border-2 transition ${
                      theme === 'light'
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : `${borderColor} ${hoverBg}`
                    }`}
                  >
                    <Sun className="w-6 h-6 mx-auto" />
                    <p className="mt-2">Light</p>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 py-3 rounded-lg border-2 transition ${
                      theme === 'dark'
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : `${borderColor} ${hoverBg}`
                    }`}
                  >
                    <Moon className="w-6 h-6 mx-auto" />
                    <p className="mt-2">Dark</p>
                  </button>
                </div>
              </div>

              <div>
                <label className={`block mb-2 font-medium ${textColor}`}>Account Information</label>
                <div className={`${inputBg} rounded-lg p-4 space-y-2`}>
                  <p className={textColor}><span className="font-medium">Username:</span> {userData?.username || currentUser?.displayName}</p>
                  <p className={textColor}><span className="font-medium">Email:</span> {currentUser?.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`${cardBg} rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${textColor}`}>
                Add {transactionForm.type === 'income' ? 'Income' : 'Expense'}
              </h2>
              <button onClick={() => setShowTransactionForm(false)} className={hoverBg + ' p-2 rounded-lg'}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block mb-2 font-medium ${textColor}`}>Category</label>
                <select
                  value={transactionForm.category}
                  onChange={(e) => setTransactionForm({...transactionForm, category: e.target.value})}
                  className={`w-full ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none`}
                >
                  {(transactionForm.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block mb-2 font-medium ${textColor}`}>Amount</label>
                <input
                  type="number"
                  value={transactionForm.amount}
                  onChange={(e) => setTransactionForm({...transactionForm, amount: e.target.value})}
                  className={`w-full ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none`}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label className={`block mb-2 font-medium ${textColor}`}>Description</label>
                <input
                  type="text"
                  value={transactionForm.label}
                  onChange={(e) => setTransactionForm({...transactionForm, label: e.target.value})}
                  className={`w-full ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none`}
                  placeholder="Transaction description"
                />
              </div>

              <div>
                <label className={`block mb-2 font-medium ${textColor}`}>Date</label>
                <input
                  type="date"
                  value={transactionForm.date}
                  onChange={(e) => setTransactionForm({...transactionForm, date: e.target.value})}
                  className={`w-full ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none`}
                />
              </div>

              {transactionForm.type === 'expense' && (
                <div>
                  <label className={`block mb-2 font-medium ${textColor}`}>Upload Receipt (Optional)</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleReceiptUpload}
                    className={`w-full ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none`}
                  />
                  <p className="text-xs text-gray-500 mt-1">Accepted: JPG, PNG, WEBP (Max 5MB)</p>
                  {transactionForm.receiptImage && (
                    <div className="mt-2">
                      <img src={transactionForm.receiptImage} alt="Receipt" className="w-full rounded-lg" />
                    </div>
                  )}
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => setShowTransactionForm(false)}
                  className={`flex-1 ${hoverBg} py-3 rounded-lg transition`}
                >
                  Cancel
                </button>
                <button
                  onClick={addTransaction}
                  className={`flex-1 ${transactionForm.type === 'income' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'} text-white py-3 rounded-lg transition`}
                >
                  Add {transactionForm.type === 'income' ? 'Income' : 'Expense'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`${cardBg} rounded-2xl p-6 max-w-md w-full`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${textColor}`}>
                Manage {categoryModalType === 'income' ? 'Income' : 'Expense'} Categories
              </h2>
              <button onClick={() => setShowCategoryModal(false)} className={hoverBg + ' p-2 rounded-lg'}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block mb-2 font-medium ${textColor}`}>Add New Category</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className={`flex-1 ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none`}
                    placeholder="Category name"
                  />
                  <button
                    onClick={addCategory}
                    className="bg-emerald-500 text-white px-4 py-3 rounded-lg hover:bg-emerald-600 transition"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className={`block mb-2 font-medium ${textColor}`}>Custom Categories</label>
                <div className="space-y-2">
                  {(categoryModalType === 'income' ? 
                    incomeCategories.filter(c => !defaultIncomeCategories.includes(c)) :
                    expenseCategories.filter(c => !defaultExpenseCategories.includes(c))
                  ).map(cat => (
                    <div key={cat} className={`flex justify-between items-center p-3 ${inputBg} rounded-lg`}>
                      <span className={textColor}>{cat}</span>
                      <button
                        onClick={() => removeCategory(cat)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {(categoryModalType === 'income' ? 
                    incomeCategories.filter(c => !defaultIncomeCategories.includes(c)) :
                    expenseCategories.filter(c => !defaultExpenseCategories.includes(c))
                  ).length === 0 && (
                    <p className={`text-center py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      No custom categories yet
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setShowCategoryModal(false)}
                className={`w-full ${hoverBg} py-3 rounded-lg transition`}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Investment Form Modal */}
      {showInvestmentForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`${cardBg} rounded-2xl p-6 max-w-md w-full`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${textColor}`}>Add Investment</h2>
              <button onClick={() => setShowInvestmentForm(false)} className={hoverBg + ' p-2 rounded-lg'}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block mb-2 font-medium ${textColor}`}>Investment Name</label>
                <input
                  type="text"
                  value={investmentForm.label}
                  onChange={(e) => setInvestmentForm({...investmentForm, label: e.target.value})}
                  className={`w-full ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none`}
                  placeholder="e.g., Mutual Fund, Stock"
                />
              </div>

              <div>
                <label className={`block mb-2 font-medium ${textColor}`}>Principal Amount</label>
                <input
                  type="number"
                  value={investmentForm.amount}
                  onChange={(e) => setInvestmentForm({...investmentForm, amount: e.target.value})}
                  className={`w-full ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none`}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label className={`block mb-2 font-medium ${textColor}`}>Duration (months)</label>
                <input
                  type="number"
                  value={investmentForm.duration}
                  onChange={(e) => setInvestmentForm({...investmentForm, duration: e.target.value})}
                  className={`w-full ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none`}
                  placeholder="12"
                />
              </div>

              <div>
                <label className={`block mb-2 font-medium ${textColor}`}>Expected Return Rate (%)</label>
                <input
                  type="number"
                  value={investmentForm.returnRate}
                  onChange={(e) => setInvestmentForm({...investmentForm, returnRate: e.target.value})}
                  className={`w-full ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none`}
                  placeholder="12"
                  step="0.1"
                />
              </div>

              <div>
                <label className={`block mb-2 font-medium ${textColor}`}>Inflation Rate (%)</label>
                <input
                  type="number"
                  value={investmentForm.inflationRate}
                  onChange={(e) => setInvestmentForm({...investmentForm, inflationRate: e.target.value})}
                  className={`w-full ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none`}
                  placeholder="6"
                  step="0.1"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => setShowInvestmentForm(false)}
                  className={`flex-1 ${hoverBg} py-3 rounded-lg transition`}
                >
                  Cancel
                </button>
                <button
                  onClick={addInvestment}
                  className="flex-1 bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition"
                >
                  Add Investment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant Modal */}
      {showAIChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${cardBg} border ${borderColor} rounded-2xl w-full max-w-4xl h-[600px] flex flex-col shadow-2xl`}>
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b ${borderColor}">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🤖</span>
                <div>
                  <h2 className={`text-2xl font-bold ${textColor}`}>AI Financial Assistant</h2>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    Chat or upload documents for analysis
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAIChat(false);
                  setAiMessages([]);
                }}
                className={`${hoverBg} p-2 rounded-lg transition`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {aiMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <span className="text-6xl mb-4">💬</span>
                  <h3 className={`text-xl font-bold ${textColor} mb-2`}>How can I help you today?</h3>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    Ask me about your finances, upload receipts, or get budgeting advice!
                  </p>
                  <div className="grid grid-cols-2 gap-3 mt-6 max-w-lg">
                    <button
                      onClick={() => setAiInput("Analyze my spending patterns")}
                      className={`${cardBg} border ${borderColor} p-4 rounded-lg ${hoverBg} transition text-left`}
                    >
                      <span className="text-2xl mb-2 block">📊</span>
                      <p className={`font-semibold ${textColor}`}>Analyze Spending</p>
                    </button>
                    <button
                      onClick={() => setAiInput("Give me budgeting advice")}
                      className={`${cardBg} border ${borderColor} p-4 rounded-lg ${hoverBg} transition text-left`}
                    >
                      <span className="text-2xl mb-2 block">💡</span>
                      <p className={`font-semibold ${textColor}`}>Budget Advice</p>
                    </button>
                    <button
                      onClick={() => setAiInput("Help me plan my savings")}
                      className={`${cardBg} border ${borderColor} p-4 rounded-lg ${hoverBg} transition text-left`}
                    >
                      <span className="text-2xl mb-2 block">🎯</span>
                      <p className={`font-semibold ${textColor}`}>Savings Plan</p>
                    </button>
                    <button
                      onClick={() => document.getElementById('ai-file-input').click()}
                      className={`${cardBg} border ${borderColor} p-4 rounded-lg ${hoverBg} transition text-left`}
                    >
                      <span className="text-2xl mb-2 block">📄</span>
                      <p className={`font-semibold ${textColor}`}>Upload Document</p>
                    </button>
                  </div>
                </div>
              ) : (
                aiMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : `${cardBg} border ${borderColor} ${textColor}`
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <span className="text-xl">
                          {msg.role === 'user' ? '👤' : '🤖'}
                        </span>
                        <div className="flex-1">
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-purple-100' : 'text-gray-500'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {aiLoading && (
                <div className="flex justify-start">
                  <div className={`${cardBg} border ${borderColor} rounded-2xl p-4`}>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🤖</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className={`border-t ${borderColor} p-4`}>
              <input
                type="file"
                id="ai-file-input"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    handleAIChat(aiInput || "Analyze this document", e.target.files[0]);
                    e.target.value = '';
                  }
                }}
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => document.getElementById('ai-file-input').click()}
                  className={`${hoverBg} p-3 rounded-lg transition`}
                  disabled={aiLoading}
                >
                  <Upload className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !aiLoading) {
                      handleAIChat(aiInput);
                    }
                  }}
                  placeholder="Ask about your finances or upload a document..."
                  className={`flex-1 ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none`}
                  disabled={aiLoading}
                />
                <button
                  onClick={() => handleAIChat(aiInput)}
                  disabled={aiLoading || !aiInput.trim()}
                  className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}