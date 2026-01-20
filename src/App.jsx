import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DollarSign, TrendingUp, Briefcase, Settings, LogOut, Plus, Moon, Sun, ArrowRight, Mail, Phone, MapPin, Upload, FileText, Home, Building, Building2, Wallet, CheckSquare, Square, X, Menu, Shield, Zap, TrendingDown, Edit2, Trash2, Sparkles, PiggyBank, CreditCard, Target, ChevronRight, Bell, Search, Calendar, Filter, Download, RefreshCw } from 'lucide-react';

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
  const [aiMessages, setAiMessages] = useState(() => {
    const saved = localStorage.getItem('aiChatHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
  const [viewMode, setViewMode] = useState('modern');
  
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
  
  // Custom Budgeting
  const [customBudgets, setCustomBudgets] = useState({});
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetCategory, setBudgetCategory] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  
  // Business
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

  useEffect(() => {
    const savedTheme = localStorage.getItem('financeAppTheme');
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (aiMessages.length > 0) {
      localStorage.setItem('aiChatHistory', JSON.stringify(aiMessages));
    }
  }, [aiMessages]);

  useEffect(() => {
    localStorage.setItem('financeAppTheme', theme);
  }, [theme]);

  const loadUserData = async (userId) => {
    const txResult = await getTransactions(userId);
    if (txResult.success) setTransactions(txResult.transactions);
    const invResult = await getInvestments(userId);
    if (invResult.success) setInvestments(invResult.investments);
  };

  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Invalid receipt format! Please upload a JPG, PNG, or WEBP image.');
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Receipt file is too large! Maximum size is 5MB.');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setTransactionForm({ ...transactionForm, receiptImage: event.target.result });
    };
    reader.readAsDataURL(file);
  };

  const handleAuth = async () => {
    setAuthError('');
    setAuthLoading(true);
    try {
      if (isLogin) {
        const result = await signInUser(email, password);
        if (!result.success) setAuthError(result.error);
      } else {
        if (!username.trim()) {
          setAuthError('Username is required');
          setAuthLoading(false);
          return;
        }
        const result = await signUpUser(email, password, username, currency);
        if (!result.success) setAuthError(result.error);
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
    if (result.success) loadUserData(currentUser.uid);
    else alert('Error deleting transaction: ' + result.error);
  };

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
      const userData = await getUserData(currentUser.uid);
      if (userData.success) setUserData(userData.data);
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
      const userData = await getUserData(currentUser.uid);
      if (userData.success) setUserData(userData.data);
    } else {
      alert(result.error);
    }
  };

  const addInvestment = async () => {
    if (!investmentForm.amount || !investmentForm.label) {
      alert('Please fill in all required fields');
      return;
    }
    const principal = parseFloat(investmentForm.amount);
    if (principal <= 0) {
      alert('❌ Investment amount must be greater than zero');
      return;
    }
    if (principal > balance) {
      alert(`❌ Insufficient balance!\n\nAvailable: ${currencySymbol}${balance.toFixed(2)}\nRequested: ${currencySymbol}${principal.toFixed(2)}`);
      return;
    }
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
      setInvestmentForm({ type: 'sip', amount: '', label: '', duration: 12, returnRate: 12, inflationRate: 6 });
      setShowInvestmentForm(false);
    } else {
      alert('Error adding investment: ' + result.error);
    }
  };

  const addBusinessRecord = () => {
    if (!businessForm.amount || !businessForm.label) {
      alert('Please fill in all fields');
      return;
    }
    const amount = parseFloat(businessForm.amount);
    const taxAmount = businessForm.type === 'profit' ? (amount * businessForm.taxRate / 100) : 0;
    const newRecord = { id: Date.now(), ...businessForm, amount, taxAmount, netAmount: amount - taxAmount };
    const updatedRecords = [...businessRecords, newRecord];
    setBusinessRecords(updatedRecords);
    localStorage.setItem(`business_${currentUser.uid}`, JSON.stringify(updatedRecords));
    setBusinessForm({ type: 'profit', amount: '', label: '', taxRate: 0, date: new Date().toISOString().split('T')[0] });
    setShowBusinessForm(false);
  };

  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`business_${currentUser.uid}`);
      if (saved) setBusinessRecords(JSON.parse(saved));
    }
  }, [currentUser]);

  const startNewConversation = () => {
    if (confirm('Start a new conversation? This will clear your current chat history.')) {
      setAiMessages([]);
      localStorage.removeItem('aiChatHistory');
    }
  };

  const handleAIChat = async (message) => {
    if (!message.trim()) return;
    if (!groqApiKey) {
      setAiMessages(prev => [...prev, { role: 'assistant', content: '⚠️ AI Assistant is not configured.', timestamp: new Date().toISOString(), error: true }]);
      return;
    }
    const userMessage = { role: 'user', content: message, timestamp: new Date().toISOString() };
    setAiMessages(prev => [...prev, userMessage]);
    setAiInput('');
    setAiLoading(true);
    try {
      const contextText = `Financial Context:\n- Total Income: ${currencySymbol}${totalIncome.toFixed(2)}\n- Total Expenses: ${currencySymbol}${totalExpense.toFixed(2)}\n- Balance: ${currencySymbol}${balance.toFixed(2)}\n\nUser Question: ${message}`;
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${groqApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'You are a helpful financial assistant. Be concise and practical.' },
            { role: 'user', content: contextText }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();
      setAiMessages(prev => [...prev, { role: 'assistant', content: data.choices[0].message.content, timestamp: new Date().toISOString() }]);
    } catch (error) {
      setAiMessages(prev => [...prev, { role: 'assistant', content: `❌ Error: ${error.message}`, timestamp: new Date().toISOString(), error: true }]);
    } finally {
      setAiLoading(false);
    }
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
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);

  // Enhanced Styling with Gradients
  const bgColor = theme === 'dark' 
    ? 'bg-[#0a0a0f]' 
    : 'bg-gradient-to-br from-slate-50 via-white to-blue-50';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textMuted = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const cardBg = theme === 'dark' 
    ? 'bg-gradient-to-br from-gray-900/80 via-gray-800/50 to-gray-900/80 backdrop-blur-xl border border-gray-700/50' 
    : 'bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl shadow-gray-200/20';
  const borderColor = theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100';
  const glassCard = theme === 'dark'
    ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-gray-700/30'
    : 'bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg';


  // LANDING PAGE
  if (appPage === 'landing') {
    return (
      <div className={`min-h-screen ${bgColor} ${textColor} overflow-hidden`}>
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Navigation */}
        <nav className={`${glassCard} sticky top-0 z-50`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  FinanceFlow
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <button onClick={() => setAppPage('features')} className={`${textColor} ${hoverBg} px-5 py-2.5 rounded-xl transition-all duration-300`}>
                  Features
                </button>
                <button onClick={() => setAppPage('contact')} className={`${textColor} ${hoverBg} px-5 py-2.5 rounded-xl transition-all duration-300`}>
                  Contact
                </button>
                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={`${hoverBg} p-2.5 rounded-xl transition-all duration-300`}
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button onClick={() => setAppPage('auth')} className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 font-medium">
                  Get Started
                </button>
              </div>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`${glassCard} md:hidden mx-4 mt-2 rounded-2xl`}>
            <div className="px-4 py-4 space-y-2">
              <button onClick={() => { setMobileMenuOpen(false); setAppPage('features'); }} className={`${textColor} ${hoverBg} w-full text-left px-4 py-3 rounded-xl`}>Features</button>
              <button onClick={() => { setMobileMenuOpen(false); setAppPage('contact'); }} className={`${textColor} ${hoverBg} w-full text-left px-4 py-3 rounded-xl`}>Contact</button>
              <button onClick={() => setAppPage('auth')} className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white w-full px-4 py-3 rounded-xl font-medium">Get Started</button>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 px-4 py-2 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className={`text-sm font-medium ${textMuted}`}>AI-Powered Financial Management</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">Master Your</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Financial Future</span>
            </h1>
            
            <p className={`text-xl md:text-2xl ${textMuted} mb-12 max-w-3xl mx-auto leading-relaxed`}>
              Track income, expenses, and investments with AI-powered insights. 
              Beautiful charts, smart budgeting, and real-time sync across all devices.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setAppPage('auth')} 
                className="group bg-gradient-to-r from-emerald-500 via-emerald-400 to-blue-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Start Free Today</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setAppPage('features')} 
                className={`${glassCard} px-8 py-4 rounded-2xl text-lg font-semibold hover:border-emerald-500/50 transition-all duration-300 flex items-center justify-center space-x-2`}
              >
                <span>View Features</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {[
              { value: '10K+', label: 'Active Users', icon: TrendingUp },
              { value: '99.9%', label: 'Uptime', icon: Shield },
              { value: '256-bit', label: 'Encryption', icon: Zap },
              { value: '24/7', label: 'AI Support', icon: Sparkles }
            ].map((stat, i) => (
              <div key={i} className={`${glassCard} p-6 rounded-2xl text-center group hover:border-emerald-500/30 transition-all duration-300`}>
                <stat.icon className="w-8 h-8 text-emerald-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className={`text-3xl font-bold ${textColor} mb-1`}>{stat.value}</p>
                <p className={textMuted}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Feature Preview Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            {[
              { icon: Wallet, title: 'Smart Budgeting', desc: 'Set budgets and get real-time alerts when you\'re close to limits', gradient: 'from-emerald-500 to-green-600' },
              { icon: PiggyBank, title: 'Track Savings', desc: 'Watch your savings grow with beautiful visualizations', gradient: 'from-blue-500 to-cyan-600' },
              { icon: Target, title: 'Investment Goals', desc: 'Calculate returns with inflation-adjusted projections', gradient: 'from-purple-500 to-pink-600' }
            ].map((feature, i) => (
              <div key={i} className={`${glassCard} p-8 rounded-3xl group hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-2`}>
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className={`text-xl font-bold ${textColor} mb-3`}>{feature.title}</h3>
                <p className={textMuted}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // FEATURES PAGE
  if (appPage === 'features') {
    return (
      <div className={`min-h-screen ${bgColor} ${textColor}`}>
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
        </div>

        <nav className={`${glassCard} sticky top-0 z-50`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <button onClick={() => setAppPage('landing')} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">FinanceFlow</span>
              </button>
              <div className="flex items-center gap-3">
                <button onClick={() => setAppPage('landing')} className={`${hoverBg} px-4 py-2 rounded-xl`}>Home</button>
                <button onClick={() => setAppPage('auth')} className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-2.5 rounded-xl font-medium">Get Started</button>
              </div>
            </div>
          </div>
        </nav>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Powerful Features
            </h1>
            <p className={`text-xl ${textMuted} max-w-2xl mx-auto`}>
              Everything you need to take complete control of your financial life
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Bank-Level Security', desc: 'AES-256 encryption keeps your data safe. Secure Firebase Cloud storage with multi-device sync.' },
              { icon: TrendingUp, title: 'Smart Analytics', desc: 'Beautiful charts show spending patterns. Track income vs expenses with interactive visualizations.' },
              { icon: Zap, title: 'Real-Time Sync', desc: 'Access finances from any device. Changes sync instantly across phone, tablet, and computer.' },
              { icon: Sparkles, title: 'AI Assistant', desc: 'Get personalized financial advice. Upload receipts for automatic transaction extraction.' },
              { icon: Wallet, title: 'Budget Tracking', desc: 'Set category budgets with real-time progress bars. Get alerts before overspending.' },
              { icon: Briefcase, title: 'Investment Calculator', desc: 'Calculate returns with inflation adjustment. Track SIPs, stocks, crypto, and more.' }
            ].map((f, i) => (
              <div key={i} className={`${glassCard} p-8 rounded-3xl hover:border-emerald-500/30 transition-all duration-300 group`}>
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className={`text-xl font-bold ${textColor} mb-3`}>{f.title}</h3>
                <p className={textMuted}>{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button onClick={() => setAppPage('auth')} className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-10 py-4 rounded-2xl text-lg font-semibold hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105">
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
        <nav className={`${glassCard} sticky top-0 z-50`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <button onClick={() => setAppPage('landing')} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold">FinanceFlow</span>
              </button>
              <button onClick={() => setAppPage('landing')} className={`${hoverBg} px-4 py-2 rounded-xl`}>Back</button>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">Get In Touch</h1>
            <p className={textMuted}>Have questions? We'd love to hear from you.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className={`${glassCard} p-6 rounded-2xl flex items-start space-x-4`}>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className={`${textMuted} text-sm`}>ryanssareen@gmail.com</p>
              </div>
            </div>
            <div className={`${glassCard} p-6 rounded-2xl flex items-start space-x-4`}>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className={`${textMuted} text-sm`}>+91 7428769797</p>
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
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className={`relative ${glassCard} rounded-3xl p-8 w-full max-w-md`}>
          <button onClick={() => setAppPage('landing')} className={`absolute top-4 left-4 ${hoverBg} p-2 rounded-xl`}>
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>

          <div className="text-center mb-8 mt-4">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/25">
              <DollarSign className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p className={textMuted}>{isLogin ? 'Sign in to continue' : 'Start your financial journey'}</p>
          </div>

          {authError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center space-x-2">
              <X className="w-5 h-5 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {!showForgotPassword ? (
            <div className="space-y-5">
              {!isLogin && (
                <div>
                  <label className={`block mb-2 font-medium text-sm ${textMuted}`}>Username</label>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                    className={`w-full ${inputBg} ${textColor} border rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all`}
                    placeholder="Choose a username" disabled={authLoading} />
                </div>
              )}

              <div>
                <label className={`block mb-2 font-medium text-sm ${textMuted}`}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className={`w-full ${inputBg} ${textColor} border rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all`}
                  placeholder="Enter your email" disabled={authLoading} />
              </div>

              <div>
                <label className={`block mb-2 font-medium text-sm ${textMuted}`}>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className={`w-full ${inputBg} ${textColor} border rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all`}
                  placeholder="Enter your password" disabled={authLoading} />
              </div>

              {!isLogin && (
                <div>
                  <label className={`block mb-2 font-medium text-sm ${textMuted}`}>Currency</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)}
                    className={`w-full ${inputBg} ${textColor} border rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all`} disabled={authLoading}>
                    {currencies.map(curr => <option key={curr.code} value={curr.code}>{curr.symbol} {curr.name}</option>)}
                  </select>
                </div>
              )}

              {isLogin && (
                <div className="flex justify-end">
                  <button onClick={() => setShowForgotPassword(true)} className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                    Forgot Password?
                  </button>
                </div>
              )}

              <button onClick={handleAuth} disabled={authLoading}
                className={`w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 ${authLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}>
                {authLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>

              <button onClick={() => { setIsLogin(!isLogin); setAuthError(''); }} disabled={authLoading}
                className={`w-full ${hoverBg} py-3 rounded-xl transition-all ${textMuted}`}>
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className={`block mb-2 font-medium text-sm ${textMuted}`}>Email</label>
                <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)}
                  className={`w-full ${inputBg} ${textColor} border rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all`}
                  placeholder="Enter your email" />
              </div>
              <button onClick={handlePasswordReset}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all">
                Send Reset Email
              </button>
              <button onClick={() => { setShowForgotPassword(false); setResetEmail(''); }}
                className={`w-full ${hoverBg} py-3 rounded-xl transition-all ${textMuted}`}>
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // MAIN APP
  return (
    <div className={`min-h-screen ${bgColor}`}>
      {/* Top Navigation */}
      <nav className={`${glassCard} sticky top-0 z-50 border-t-0 border-x-0`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xl font-bold ${textColor}`}>FinanceFlow</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`hidden sm:block ${textMuted} text-sm`}>
                Hi, {userData?.username || currentUser?.displayName}
              </span>
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`${hoverBg} p-2.5 rounded-xl transition-all ${textColor}`}>
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={handleLogout}
                className="bg-red-500/10 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/20 transition-all flex items-center space-x-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Navigation Tabs */}
      <div className={`${glassCard} border-t-0 border-x-0`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex space-x-1 overflow-x-auto scrollbar-hide py-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Home },
                { id: 'income', label: 'Income', icon: TrendingUp },
                { id: 'expense', label: 'Expenses', icon: CreditCard },
                { id: 'investments', label: 'Investments', icon: Briefcase },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map(tab => (
                <button key={tab.id} onClick={() => setCurrentPage(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                    currentPage === tab.id
                      ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-400 border border-emerald-500/30'
                      : `${textMuted} ${hoverBg}`
                  }`}>
                  <tab.icon className="w-5 h-5" />
                  <span className="whitespace-nowrap font-medium text-sm">{tab.label}</span>
                </button>
              ))}
            </div>
            
            <button onClick={() => setShowAIChat(!showAIChat)}
              className="ml-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium text-sm whitespace-nowrap">AI Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* DASHBOARD PAGE */}
        {currentPage === 'dashboard' && (
          <div className="space-y-8">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className={`text-3xl font-bold ${textColor}`}>
                  Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {userData?.username || 'there'}! 👋
                </h1>
                <p className={`${textMuted} mt-1`}>Here's your financial overview</p>
              </div>
              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <button onClick={() => setCurrentPage('income')} className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center space-x-2 text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  <span>Add Income</span>
                </button>
                <button onClick={() => setCurrentPage('expense')} className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all flex items-center space-x-2 text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  <span>Add Expense</span>
                </button>
              </div>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className={`${glassCard} rounded-2xl p-6 group hover:border-emerald-500/30 transition-all duration-300`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">+{incomeTransactions.length}</span>
                </div>
                <p className={`text-sm ${textMuted} mb-1`}>Total Income</p>
                <p className={`text-2xl md:text-3xl font-bold text-emerald-400`}>{currencySymbol}{totalIncome.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
              </div>
              
              <div className={`${glassCard} rounded-2xl p-6 group hover:border-red-500/30 transition-all duration-300`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingDown className="w-6 h-6 text-red-400" />
                  </div>
                  <span className="text-xs font-medium text-red-400 bg-red-500/10 px-2 py-1 rounded-lg">-{expenseTransactions.length}</span>
                </div>
                <p className={`text-sm ${textMuted} mb-1`}>Total Expenses</p>
                <p className={`text-2xl md:text-3xl font-bold text-red-400`}>{currencySymbol}{totalExpense.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
              </div>
              
              <div className={`${glassCard} rounded-2xl p-6 group hover:border-blue-500/30 transition-all duration-300`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Wallet className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-lg ${balance >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
                    {savingsRate}%
                  </span>
                </div>
                <p className={`text-sm ${textMuted} mb-1`}>Net Balance</p>
                <p className={`text-2xl md:text-3xl font-bold ${balance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                  {currencySymbol}{balance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </p>
              </div>

              <div className={`${glassCard} rounded-2xl p-6 group hover:border-purple-500/30 transition-all duration-300`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Briefcase className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-1 rounded-lg">{investments.length}</span>
                </div>
                <p className={`text-sm ${textMuted} mb-1`}>Invested</p>
                <p className={`text-2xl md:text-3xl font-bold text-purple-400`}>{currencySymbol}{totalInvested.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
              </div>
            </div>


            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Income vs Expenses Area Chart */}
              <div className={`${glassCard} rounded-2xl p-6`}>
                <h3 className={`text-lg font-bold mb-6 ${textColor}`}>Income vs Expenses Trend</h3>
                {transactions.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={(() => {
                      const last6Months = [];
                      for (let i = 5; i >= 0; i--) {
                        const d = new Date();
                        d.setMonth(d.getMonth() - i);
                        const month = d.toLocaleString('default', { month: 'short' });
                        const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                        const income = transactions.filter(t => t.type === 'income' && t.date?.startsWith(monthStr)).reduce((s, t) => s + t.amount, 0);
                        const expense = transactions.filter(t => t.type === 'expense' && t.date?.startsWith(monthStr)).reduce((s, t) => s + t.amount, 0);
                        last6Months.push({ month, income, expense });
                      }
                      return last6Months;
                    })()}>
                      <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                      <XAxis dataKey="month" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} fontSize={12} />
                      <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} fontSize={12} tickFormatter={(v) => `${currencySymbol}${v}`} />
                      <Tooltip formatter={(v) => `${currencySymbol}${v.toFixed(2)}`} contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }} />
                      <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fill="url(#incomeGradient)" name="Income" />
                      <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fill="url(#expenseGradient)" name="Expense" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className={`flex flex-col items-center justify-center h-64 ${textMuted}`}>
                    <TrendingUp className="w-12 h-12 mb-3 opacity-30" />
                    <p>No transaction data yet</p>
                  </div>
                )}
              </div>

              {/* Expense Categories Pie Chart */}
              <div className={`${glassCard} rounded-2xl p-6`}>
                <h3 className={`text-lg font-bold mb-6 ${textColor}`}>Spending by Category</h3>
                {expenseTransactions.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={Object.entries(expenseTransactions.reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {}))
                          .map(([name, value]) => ({ name, value }))
                          .sort((a, b) => b.value - a.value)
                          .slice(0, 6)}
                        cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value"
                        stroke={theme === 'dark' ? '#1f2937' : '#ffffff'} strokeWidth={2}>
                        {['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map((c, i) => <Cell key={i} fill={c} />)}
                      </Pie>
                      <Tooltip formatter={(v) => `${currencySymbol}${v.toFixed(2)}`} contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className={`flex flex-col items-center justify-center h-64 ${textMuted}`}>
                    <PieChart className="w-12 h-12 mb-3 opacity-30" />
                    <p>No expense data yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Budget Overview & Recent Transactions */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Quick Budget Overview */}
              <div className={`${glassCard} rounded-2xl p-6`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg font-bold ${textColor}`}>Budget Overview</h3>
                  <button onClick={() => { setCurrentPage('expense'); }} className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                    Manage →
                  </button>
                </div>
                {totalIncome > 0 ? (
                  <div className="space-y-4">
                    {[
                      { label: 'Needs', value: expenseTransactions.filter(t => ['Food', 'Rent', 'Transportation', 'Healthcare', 'Utilities'].includes(t.category)).reduce((s, t) => s + t.amount, 0), color: 'blue', max: totalIncome * 0.5 },
                      { label: 'Wants', value: expenseTransactions.filter(t => ['Entertainment', 'Shopping', 'Other'].includes(t.category)).reduce((s, t) => s + t.amount, 0), color: 'pink', max: totalIncome * 0.3 },
                      { label: 'Savings', value: Math.max(0, balance), color: 'emerald', max: totalIncome * 0.2 }
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-2">
                          <span className={`text-sm font-medium ${textColor}`}>{item.label}</span>
                          <span className={`text-sm font-semibold text-${item.color}-400`}>{currencySymbol}{item.value.toFixed(2)}</span>
                        </div>
                        <div className={`w-full h-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <div className={`h-2 rounded-full bg-gradient-to-r ${item.color === 'blue' ? 'from-blue-500 to-cyan-500' : item.color === 'pink' ? 'from-pink-500 to-rose-500' : 'from-emerald-500 to-green-500'} transition-all duration-500`}
                            style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`flex flex-col items-center justify-center py-8 ${textMuted}`}>
                    <Target className="w-12 h-12 mb-3 opacity-30" />
                    <p>Add income to see budget breakdown</p>
                  </div>
                )}
              </div>

              {/* Recent Transactions */}
              <div className={`${glassCard} rounded-2xl p-6`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg font-bold ${textColor}`}>Recent Transactions</h3>
                  <span className={`text-sm ${textMuted}`}>{transactions.length} total</span>
                </div>
                {transactions.length === 0 ? (
                  <div className={`flex flex-col items-center justify-center py-8 ${textMuted}`}>
                    <CreditCard className="w-12 h-12 mb-3 opacity-30" />
                    <p>No transactions yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.slice(-5).reverse().map(t => (
                      <div key={t.id} className={`flex items-center justify-between p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'} hover:scale-[1.02] transition-transform cursor-pointer`}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                            {t.type === 'income' ? <TrendingUp className="w-5 h-5 text-emerald-400" /> : <TrendingDown className="w-5 h-5 text-red-400" />}
                          </div>
                          <div>
                            <p className={`font-medium text-sm ${textColor}`}>{t.label}</p>
                            <p className={`text-xs ${textMuted}`}>{t.category} • {t.date}</p>
                          </div>
                        </div>
                        <p className={`font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {t.type === 'income' ? '+' : '-'}{currencySymbol}{t.amount.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* INCOME PAGE */}
        {currentPage === 'income' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className={`text-3xl font-bold ${textColor}`}>Income</h1>
                <p className={`${textMuted} mt-1`}>Total: <span className="text-emerald-400 font-semibold">{currencySymbol}{totalIncome.toFixed(2)}</span></p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => openCategoryModal('income')}
                  className={`${glassCard} px-4 py-2.5 rounded-xl hover:border-blue-500/30 transition-all flex items-center space-x-2 text-sm font-medium ${textColor}`}>
                  <Settings className="w-4 h-4" />
                  <span>Categories</span>
                </button>
                <button onClick={() => { setTransactionForm({ ...transactionForm, type: 'income', category: incomeCategories[0] }); setShowTransactionForm(true); }}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center space-x-2 text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  <span>Add Income</span>
                </button>
              </div>
            </div>

            {incomeTransactions.length === 0 ? (
              <div className={`${glassCard} rounded-2xl p-12 text-center`}>
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className={`text-xl font-bold ${textColor} mb-2`}>No Income Yet</h3>
                <p className={`${textMuted} mb-6`}>Start tracking your earnings</p>
                <button onClick={() => { setTransactionForm({ ...transactionForm, type: 'income' }); setShowTransactionForm(true); }}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-medium">
                  Add Your First Income
                </button>
              </div>
            ) : (
              <div className={`${glassCard} rounded-2xl overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}>
                      <tr>
                        <th className={`px-6 py-4 text-left text-sm font-semibold ${textColor}`}>Date</th>
                        <th className={`px-6 py-4 text-left text-sm font-semibold ${textColor}`}>Description</th>
                        <th className={`px-6 py-4 text-left text-sm font-semibold ${textColor}`}>Category</th>
                        <th className={`px-6 py-4 text-right text-sm font-semibold ${textColor}`}>Amount</th>
                        <th className={`px-6 py-4 text-center text-sm font-semibold ${textColor}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incomeTransactions.map((t, i) => (
                        <tr key={t.id} className={`border-t ${borderColor} ${hoverBg} transition-colors`}>
                          <td className={`px-6 py-4 text-sm ${textMuted}`}>{t.date}</td>
                          <td className={`px-6 py-4 text-sm font-medium ${textColor}`}>{t.label}</td>
                          <td className={`px-6 py-4 text-sm`}>
                            <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg text-xs font-medium">{t.category}</span>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-emerald-400">+{currencySymbol}{t.amount.toFixed(2)}</td>
                          <td className="px-6 py-4 text-center">
                            <button onClick={() => deleteTransaction(t.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-all">
                              <Trash2 className="w-4 h-4" />
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className={`text-3xl font-bold ${textColor}`}>Expenses</h1>
                <p className={`${textMuted} mt-1`}>Total: <span className="text-red-400 font-semibold">{currencySymbol}{totalExpense.toFixed(2)}</span></p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => openCategoryModal('expense')}
                  className={`${glassCard} px-4 py-2.5 rounded-xl hover:border-blue-500/30 transition-all flex items-center space-x-2 text-sm font-medium ${textColor}`}>
                  <Settings className="w-4 h-4" />
                  <span>Categories</span>
                </button>
                <button onClick={() => { setTransactionForm({ ...transactionForm, type: 'expense', category: expenseCategories[0] }); setShowTransactionForm(true); }}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all flex items-center space-x-2 text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  <span>Add Expense</span>
                </button>
              </div>
            </div>

            {expenseTransactions.length === 0 ? (
              <div className={`${glassCard} rounded-2xl p-12 text-center`}>
                <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingDown className="w-10 h-10 text-red-400" />
                </div>
                <h3 className={`text-xl font-bold ${textColor} mb-2`}>No Expenses Yet</h3>
                <p className={`${textMuted} mb-6`}>Start tracking your spending</p>
                <button onClick={() => { setTransactionForm({ ...transactionForm, type: 'expense' }); setShowTransactionForm(true); }}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-medium">
                  Add Your First Expense
                </button>
              </div>
            ) : (
              <div className={`${glassCard} rounded-2xl overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}>
                      <tr>
                        <th className={`px-6 py-4 text-left text-sm font-semibold ${textColor}`}>Date</th>
                        <th className={`px-6 py-4 text-left text-sm font-semibold ${textColor}`}>Description</th>
                        <th className={`px-6 py-4 text-left text-sm font-semibold ${textColor}`}>Category</th>
                        <th className={`px-6 py-4 text-right text-sm font-semibold ${textColor}`}>Amount</th>
                        <th className={`px-6 py-4 text-center text-sm font-semibold ${textColor}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenseTransactions.map(t => (
                        <tr key={t.id} className={`border-t ${borderColor} ${hoverBg} transition-colors`}>
                          <td className={`px-6 py-4 text-sm ${textMuted}`}>{t.date}</td>
                          <td className={`px-6 py-4 text-sm font-medium ${textColor}`}>{t.label}</td>
                          <td className={`px-6 py-4 text-sm`}>
                            <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-lg text-xs font-medium">{t.category}</span>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-red-400">-{currencySymbol}{t.amount.toFixed(2)}</td>
                          <td className="px-6 py-4 text-center">
                            <button onClick={() => deleteTransaction(t.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-all">
                              <Trash2 className="w-4 h-4" />
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className={`text-3xl font-bold ${textColor}`}>Investment Portfolio</h1>
                <p className={`${textMuted} mt-1`}>Total Invested: <span className="text-purple-400 font-semibold">{currencySymbol}{totalInvested.toFixed(2)}</span></p>
              </div>
              <button onClick={() => setShowInvestmentForm(true)}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center space-x-2 text-sm font-medium">
                <Plus className="w-4 h-4" />
                <span>Add Investment</span>
              </button>
            </div>

            {investments.length === 0 ? (
              <div className={`${glassCard} rounded-2xl p-12 text-center`}>
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className={`text-xl font-bold ${textColor} mb-2`}>No Investments Yet</h3>
                <p className={`${textMuted} mb-6`}>Start building your portfolio</p>
                <button onClick={() => setShowInvestmentForm(true)}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-medium">
                  Add Your First Investment
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {investments.map(inv => (
                  <div key={inv.id} className={`${glassCard} rounded-2xl p-6 hover:border-purple-500/30 transition-all group`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-medium px-3 py-1 rounded-lg ${
                        inv.type === 'sip' ? 'bg-purple-500/20 text-purple-400' :
                        inv.type === 'stocks' ? 'bg-blue-500/20 text-blue-400' :
                        inv.type === 'crypto' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>{inv.type?.toUpperCase()}</span>
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Briefcase className="w-5 h-5 text-purple-400" />
                      </div>
                    </div>
                    <h3 className={`text-lg font-bold ${textColor} mb-4`}>{inv.label}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={`text-sm ${textMuted}`}>Principal</span>
                        <span className={`text-sm font-semibold ${textColor}`}>{currencySymbol}{inv.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${textMuted}`}>Duration</span>
                        <span className={`text-sm font-semibold ${textColor}`}>{inv.duration} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${textMuted}`}>Return Rate</span>
                        <span className={`text-sm font-semibold ${textColor}`}>{inv.returnRate}%</span>
                      </div>
                      <div className={`pt-3 border-t ${borderColor}`}>
                        <div className="flex justify-between">
                          <span className={`text-sm ${textMuted}`}>Expected Return</span>
                          <span className="text-sm font-bold text-emerald-400">+{currencySymbol}{inv.nominalGain}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className={`text-sm ${textMuted}`}>Final Value</span>
                          <span className="text-lg font-bold text-purple-400">{currencySymbol}{inv.nominalReturn}</span>
                        </div>
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
            
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Account Info */}
              <div className={`${glassCard} rounded-2xl p-6`}>
                <h3 className={`text-lg font-bold ${textColor} mb-6 flex items-center space-x-2`}>
                  <Settings className="w-5 h-5 text-emerald-400" />
                  <span>Account Information</span>
                </h3>
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                    <p className={`text-sm ${textMuted} mb-1`}>Username</p>
                    <p className={`font-semibold ${textColor}`}>{userData?.username || currentUser?.displayName}</p>
                  </div>
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                    <p className={`text-sm ${textMuted} mb-1`}>Email</p>
                    <p className={`font-semibold ${textColor}`}>{currentUser?.email}</p>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className={`${glassCard} rounded-2xl p-6`}>
                <h3 className={`text-lg font-bold ${textColor} mb-6 flex items-center space-x-2`}>
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span>Preferences</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block mb-2 text-sm font-medium ${textMuted}`}>Currency</label>
                    <select value={currency}
                      onChange={async (e) => {
                        const newCurrency = e.target.value;
                        if (currency === newCurrency) return;
                        const rate = getConversionRate(currency, newCurrency);
                        if (confirm(`Convert all amounts to ${newCurrency}? (Rate: 1 ${currency} = ${rate.toFixed(4)} ${newCurrency})`)) {
                          const convertedTx = convertAllTransactions(transactions, currency, newCurrency);
                          setTransactions(convertedTx);
                          const convertedInv = convertAllInvestments(investments, currency, newCurrency);
                          setInvestments(convertedInv);
                          setCurrency(newCurrency);
                          await updateUserData(currentUser.uid, { currency: newCurrency });
                        }
                      }}
                      className={`w-full ${inputBg} ${textColor} border rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all`}>
                      {currencies.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={`block mb-2 text-sm font-medium ${textMuted}`}>Theme</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setTheme('light')}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center ${theme === 'light' ? 'border-emerald-500 bg-emerald-500/10' : `${borderColor} ${hoverBg}`}`}>
                        <Sun className={`w-6 h-6 mb-2 ${theme === 'light' ? 'text-emerald-400' : textMuted}`} />
                        <span className={`text-sm font-medium ${textColor}`}>Light</span>
                      </button>
                      <button onClick={() => setTheme('dark')}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center ${theme === 'dark' ? 'border-emerald-500 bg-emerald-500/10' : `${borderColor} ${hoverBg}`}`}>
                        <Moon className={`w-6 h-6 mb-2 ${theme === 'dark' ? 'text-emerald-400' : textMuted}`} />
                        <span className={`text-sm font-medium ${textColor}`}>Dark</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Status */}
              <div className={`${glassCard} rounded-2xl p-6`}>
                <h3 className={`text-lg font-bold ${textColor} mb-6 flex items-center space-x-2`}>
                  <Sparkles className="w-5 h-5 text-pink-400" />
                  <span>AI Assistant Status</span>
                </h3>
                <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${groqApiKey ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className={`font-medium ${groqApiKey ? 'text-emerald-400' : 'text-red-400'}`}>
                      {groqApiKey ? 'Active & Ready' : 'Not Configured'}
                    </span>
                  </div>
                  <p className={`text-sm ${textMuted} mt-2`}>
                    {groqApiKey ? 'Your AI assistant is ready to help!' : 'API key not found'}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className={`${glassCard} rounded-2xl p-6`}>
                <h3 className={`text-lg font-bold ${textColor} mb-6 flex items-center space-x-2`}>
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <span>Quick Stats</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'} text-center`}>
                    <p className="text-2xl font-bold text-emerald-400">{incomeTransactions.length}</p>
                    <p className={`text-sm ${textMuted}`}>Income Records</p>
                  </div>
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'} text-center`}>
                    <p className="text-2xl font-bold text-red-400">{expenseTransactions.length}</p>
                    <p className={`text-sm ${textMuted}`}>Expense Records</p>
                  </div>
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'} text-center`}>
                    <p className="text-2xl font-bold text-purple-400">{investments.length}</p>
                    <p className={`text-sm ${textMuted}`}>Investments</p>
                  </div>
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'} text-center`}>
                    <p className="text-2xl font-bold text-blue-400">{savingsRate}%</p>
                    <p className={`text-sm ${textMuted}`}>Savings Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>


      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`${glassCard} rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${textColor}`}>
                Add {transactionForm.type === 'income' ? 'Income' : 'Expense'}
              </h2>
              <button onClick={() => setShowTransactionForm(false)} className={`${hoverBg} p-2 rounded-xl`}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className={`block mb-2 text-sm font-medium ${textMuted}`}>Category</label>
                <select value={transactionForm.category}
                  onChange={(e) => setTransactionForm({...transactionForm, category: e.target.value})}
                  className={`w-full ${inputBg} ${textColor} border rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all`}>
                  {(transactionForm.type === 'income' ? incomeCategories : expenseCategories).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className={`block mb-2 text-sm font-medium ${textMuted}`}>Amount</label>
                <input type="number" value={transactionForm.amount}
                  onChange={(e) => setTransactionForm({...transactionForm, amount: e.target.value})}
                  className={`w-full ${inputBg} ${textColor} border rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all`}
                  placeholder="0.00" step="0.01" />
              </div>

              <div>
                <label className={`block mb-2 text-sm font-medium ${textMuted}`}>Description</label>
                <input type="text" value={transactionForm.label}
                  onChange={(e) => setTransactionForm({...transactionForm, label: e.target.value})}
                  className={`w-full ${inputBg} ${textColor} border rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all`}
                  placeholder="What was this for?" />
              </div>

              <div>
                <label className={`block mb-2 text-sm font-medium ${textMuted}`}>Date</label>
                <input type="date" value={transactionForm.date}
                  onChange={(e) => setTransactionForm({...transactionForm, date: e.target.value})}
                  className={`w-full ${inputBg} ${textColor} border rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all`} />
              </div>

              <div className="flex space-x-3 pt-4">
                <button onClick={() => setShowTransactionForm(false)}
                  className={`flex-1 ${hoverBg} py-3 rounded-xl transition-all font-medium border ${borderColor}`}>
                  Cancel
                </button>
                <button onClick={addTransaction}
                  className={`flex-1 py-3 rounded-xl transition-all font-medium text-white ${
                    transactionForm.type === 'income' 
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25' 
                      : 'bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg hover:shadow-red-500/25'
                  }`}>
                  Add {transactionForm.type === 'income' ? 'Income' : 'Expense'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Investment Form Modal */}
      {showInvestmentForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`${glassCard} rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${textColor}`}>Add Investment</h2>
              <button onClick={() => setShowInvestmentForm(false)} className={`${hoverBg} p-2 rounded-xl`}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className={`block mb-2 text-sm font-medium ${textMuted}`}>Investment Type</label>
                <select value={investmentForm.type}
                  onChange={(e) => setInvestmentForm({...investmentForm, type: e.target.value})}
                  className={`w-full ${inputBg} ${textColor} border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all`}>
                  {['sip', 'stocks', 'crypto', 'bonds', 'fd', 'real estate', 'other'].map(t => 
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  )}
                </select>
              </div>

              <div>
                <label className={`block mb-2 text-sm font-medium ${textMuted}`}>Investment Name</label>
                <input type="text" value={investmentForm.label}
                  onChange={(e) => setInvestmentForm({...investmentForm, label: e.target.value})}
                  className={`w-full ${inputBg} ${textColor} border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all`}
                  placeholder="e.g., Nifty 50 Index Fund" />
              </div>

              <div>
                <label className={`block mb-2 text-sm font-medium ${textMuted}`}>Amount ({currencySymbol})</label>
                <input type="number" value={investmentForm.amount}
                  onChange={(e) => setInvestmentForm({...investmentForm, amount: e.target.value})}
                  className={`w-full ${inputBg} ${textColor} border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all`}
                  placeholder="0.00" step="0.01" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-2 text-sm font-medium ${textMuted}`}>Duration (months)</label>
                  <input type="number" value={investmentForm.duration}
                    onChange={(e) => setInvestmentForm({...investmentForm, duration: e.target.value})}
                    className={`w-full ${inputBg} ${textColor} border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all`} />
                </div>
                <div>
                  <label className={`block mb-2 text-sm font-medium ${textMuted}`}>Expected Return (%)</label>
                  <input type="number" value={investmentForm.returnRate}
                    onChange={(e) => setInvestmentForm({...investmentForm, returnRate: e.target.value})}
                    className={`w-full ${inputBg} ${textColor} border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all`} />
                </div>
              </div>

              <div>
                <label className={`block mb-2 text-sm font-medium ${textMuted}`}>Inflation Rate (%)</label>
                <input type="number" value={investmentForm.inflationRate}
                  onChange={(e) => setInvestmentForm({...investmentForm, inflationRate: e.target.value})}
                  className={`w-full ${inputBg} ${textColor} border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all`} />
              </div>

              <div className="flex space-x-3 pt-4">
                <button onClick={() => setShowInvestmentForm(false)}
                  className={`flex-1 ${hoverBg} py-3 rounded-xl transition-all font-medium border ${borderColor}`}>
                  Cancel
                </button>
                <button onClick={addInvestment}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all font-medium">
                  Add Investment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`${glassCard} rounded-3xl p-8 max-w-md w-full`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${textColor}`}>
                {categoryModalType === 'income' ? 'Income' : 'Expense'} Categories
              </h2>
              <button onClick={() => setShowCategoryModal(false)} className={`${hoverBg} p-2 rounded-xl`}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex space-x-3">
                <input type="text" value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className={`flex-1 ${inputBg} ${textColor} border rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all`}
                  placeholder="New category name" />
                <button onClick={addCategory}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all">
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {(categoryModalType === 'income' ? incomeCategories : expenseCategories).map(cat => (
                  <div key={cat} className={`flex items-center justify-between p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                    <span className={`font-medium ${textColor}`}>{cat}</span>
                    {!defaultIncomeCategories.includes(cat) && !defaultExpenseCategories.includes(cat) && (
                      <button onClick={() => removeCategory(cat)} className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-500/10 transition-all">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Panel */}
      {showAIChat && (
        <div className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] z-50">
          <div className={`${glassCard} rounded-3xl overflow-hidden shadow-2xl`}>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-6 h-6 text-white" />
                <span className="font-bold text-white">AI Financial Assistant</span>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={startNewConversation} className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all">
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button onClick={() => setShowAIChat(false)} className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className={`h-80 overflow-y-auto p-4 space-y-3 ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
              {aiMessages.length === 0 ? (
                <div className={`text-center py-8 ${textMuted}`}>
                  <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Ask me anything about your finances!</p>
                </div>
              ) : (
                aiMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-none'
                        : msg.error
                          ? 'bg-red-500/10 text-red-400 rounded-bl-none'
                          : `${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} ${textColor} rounded-bl-none`
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {aiLoading && (
                <div className="flex justify-start">
                  <div className={`p-3 rounded-2xl rounded-bl-none ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={`p-4 border-t ${borderColor}`}>
              <div className="flex space-x-2">
                <input type="text" value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAIChat(aiInput)}
                  className={`flex-1 ${inputBg} ${textColor} border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm`}
                  placeholder="Ask about your finances..."
                  disabled={aiLoading} />
                <button onClick={() => handleAIChat(aiInput)}
                  disabled={aiLoading || !aiInput.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2.5 rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
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
