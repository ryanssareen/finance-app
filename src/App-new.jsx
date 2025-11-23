import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DollarSign, TrendingUp, Briefcase, Settings, LogOut, Plus, Moon, Sun, ArrowRight, Mail, Phone, MapPin, Upload, Camera, FileText, Home, Building, Building2, Wallet, CheckSquare, Square, X, Menu, Shield, BarChart3, Zap, Target, TrendingDown, Calculator, Eye, Trash2, Edit2, Save } from 'lucide-react';
import { auth } from './firebase';
import { 
  signUpUser, 
  signInUser, 
  signOutUser, 
  resetPassword, 
  getUserData, 
  updateUserData,
  addCustomCategory,
  deleteCustomCategory,
  addTransaction as saveTransaction,
  getTransactions,
  deleteTransaction as removeTransaction,
  addInvestment as saveInvestment,
  getInvestments,
  migrateLocalData,
  listenToAuthChanges
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

// Default categories
const defaultIncomeCategories = ['Salary', 'Business'];
const defaultExpenseCategories = ['Food', 'Rent', 'Entertainment', 'Shopping'];

export default function App() {
  // Auth States
  const [currentUser, setCurrentUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  
  // Page Navigation
  const [appPage, setAppPage] = useState('landing'); // landing, contact, auth, app
  const [currentPage, setCurrentPage] = useState('dashboard'); // dashboard, income, expense, investments, settings
  
  // User Data
  const [userData, setUserData] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [customIncomeCategories, setCustomIncomeCategories] = useState([]);
  const [customExpenseCategories, setCustomExpenseCategories] = useState([]);
  
  // Theme
  const [theme, setTheme] = useState('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Transactions
  const [transactions, setTransactions] = useState([]);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionForm, setTransactionForm] = useState({ 
    type: 'income', // income or expense
    category: 'Salary', 
    amount: '', 
    label: '', 
    date: new Date().toISOString().split('T')[0], 
    receiptImage: null
  });
  
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
  
  // Category Management
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState('income'); // income or expense
  
  // Receipt validation
  const [receiptError, setReceiptError] = useState('');
  
  // Contact Form
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

  const currencySymbol = currencies.find(c => c.code === currency)?.symbol || '$';

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = listenToAuthChanges(async (user) => {
      if (user) {
        setCurrentUser(user);
        setAppPage('app');
        
        // Load user data
        const result = await getUserData(user.uid);
        if (result.success) {
          setUserData(result.data);
          setCurrency(result.data.currency || 'USD');
          setCustomIncomeCategories(result.data.customIncomeCategories || []);
          setCustomExpenseCategories(result.data.customExpenseCategories || []);
          
          // Load transactions
          const transResult = await getTransactions(user.uid);
          if (transResult.success) {
            setTransactions(transResult.transactions);
          }
          
          // Load investments
          const invResult = await getInvestments(user.uid);
          if (invResult.success) {
            setInvestments(invResult.investments);
          }
        }
      } else {
        setCurrentUser(null);
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

  // Save theme
  useEffect(() => {
    localStorage.setItem('financeAppTheme', theme);
  }, [theme]);


  // Authentication Functions
  const handleSignUp = async () => {
    if (!email || !password || !username) {
      setAuthMessage('Please fill in all fields');
      return;
    }
    
    setAuthLoading(true);
    setAuthMessage('');
    
    const result = await signUpUser(email, password, username, selectedCurrency);
    
    if (result.success) {
      // Migration happens automatically via auth listener
      setAuthMessage('Account created successfully!');
      // Clear form
      setEmail('');
      setPassword('');
      setUsername('');
    } else {
      setAuthMessage(result.error);
    }
    
    setAuthLoading(false);
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      setAuthMessage('Please fill in all fields');
      return;
    }
    
    setAuthLoading(true);
    setAuthMessage('');
    
    const result = await signInUser(email, password);
    
    if (result.success) {
      setAuthMessage('Signed in successfully!');
      setEmail('');
      setPassword('');
    } else {
      setAuthMessage(result.error);
    }
    
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    const result = await signOutUser();
    if (result.success) {
      setCurrentUser(null);
      setUserData(null);
      setTransactions([]);
      setInvestments([]);
      setCurrentPage('dashboard');
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      setAuthMessage('Please enter your email');
      return;
    }
    
    setAuthLoading(true);
    const result = await resetPassword(resetEmail);
    
    if (result.success) {
      setAuthMessage(result.message);
      setShowForgotPassword(false);
      setResetEmail('');
    } else {
      setAuthMessage(result.error);
    }
    
    setAuthLoading(false);
  };

  // Receipt Validation
  const validateReceipt = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      setReceiptError('Invalid file type. Please upload JPG, PNG, or WebP image.');
      return false;
    }
    
    if (file.size > maxSize) {
      setReceiptError('File too large. Maximum size is 5MB.');
      return false;
    }
    
    setReceiptError('');
    return true;
  };

  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!validateReceipt(file)) {
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      // Simulate OCR
      const mockParsedData = {
        amount: (Math.random() * 200 + 10).toFixed(2),
        label: file.name.toLowerCase().includes('grocery') ? 'Grocery Shopping' : 
               file.name.toLowerCase().includes('restaurant') || file.name.toLowerCase().includes('food') ? 'Restaurant' :
               file.name.toLowerCase().includes('gas') || file.name.toLowerCase().includes('fuel') ? 'Gas Station' :
               file.name.toLowerCase().includes('rent') ? 'Rent Payment' :
               file.name.toLowerCase().includes('utility') || file.name.toLowerCase().includes('electric') ? 'Utilities' :
               'Receipt Item',
        date: new Date().toISOString().split('T')[0]
      };
      
      setTransactionForm({ 
        ...transactionForm, 
        ...mockParsedData,
        receiptImage: event.target.result
      });
      setReceiptError('');
    };
    reader.readAsDataURL(file);
  };

  // Category Management
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    const result = await addCustomCategory(currentUser.uid, categoryType, newCategoryName);
    
    if (result.success) {
      if (categoryType === 'income') {
        setCustomIncomeCategories([...customIncomeCategories, newCategoryName]);
      } else {
        setCustomExpenseCategories([...customExpenseCategories, newCategoryName]);
      }
      setNewCategoryName('');
      setShowAddCategory(false);
    } else {
      alert(result.error);
    }
  };

  const handleDeleteCategory = async (type, categoryName) => {
    if (!confirm(`Delete category "${categoryName}"?`)) return;
    
    const result = await deleteCustomCategory(currentUser.uid, type, categoryName);
    
    if (result.success) {
      if (type === 'income') {
        setCustomIncomeCategories(customIncomeCategories.filter(c => c !== categoryName));
      } else {
        setCustomExpenseCategories(customExpenseCategories.filter(c => c !== categoryName));
      }
    }
  };

  // Transaction Management
  const handleAddTransaction = async () => {
    if (!transactionForm.amount || !transactionForm.label) {
      alert('Please fill in amount and description');
      return;
    }
    
    const newTransaction = {
      ...transactionForm,
      amount: parseFloat(transactionForm.amount),
      id: Date.now().toString()
    };
    
    const result = await saveTransaction(currentUser.uid, newTransaction);
    
    if (result.success) {
      setTransactions([...transactions, newTransaction]);
      setTransactionForm({ 
        type: transactionForm.type, // Keep the type (income/expense)
        category: transactionForm.type === 'income' ? 'Salary' : 'Food', 
        amount: '', 
        label: '', 
        date: new Date().toISOString().split('T')[0], 
        receiptImage: null
      });
      setShowTransactionForm(false);
      setReceiptError('');
    } else {
      alert(result.error);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!confirm('Delete this transaction?')) return;
    
    const result = await removeTransaction(currentUser.uid, transactionId);
    
    if (result.success) {
      setTransactions(transactions.filter(t => t.id !== transactionId));
    }
  };

  // Investment Management
  const handleAddInvestment = async () => {
    if (!investmentForm.amount || !investmentForm.label) {
      alert('Please fill in all fields');
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
      id: Date.now().toString()
    };
    
    const result = await saveInvestment(currentUser.uid, newInvestment);
    
    if (result.success) {
      setInvestments([...investments, newInvestment]);
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
      alert(result.error);
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

  // Get all income categories
  const allIncomeCategories = [...defaultIncomeCategories, ...customIncomeCategories];
  
  // Get all expense categories
  const allExpenseCategories = [...defaultExpenseCategories, ...customExpenseCategories];

  // Styling
  const bgColor = theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const cardBg = theme === 'dark' ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100';


  // ============================================
  // LANDING PAGE
  // ============================================
  if (appPage === 'landing') {
    return (
      <div className={`min-h-screen ${bgColor} ${textColor}`}>
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                  FinanceFlow
                </span>
              </div>
              
              <div className="hidden md:flex items-center gap-6">
                <button onClick={() => setAppPage('contact')} className="text-gray-300 hover:text-white transition">
                  Contact
                </button>
                <button onClick={() => setAppPage('auth')} className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 rounded-lg font-semibold transition shadow-lg shadow-emerald-600/20">
                  Get Started Free
                </button>
              </div>

              <button 
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-gray-800 pt-4">
                <button 
                  onClick={() => { setAppPage('contact'); setMobileMenuOpen(false); }} 
                  className="block w-full text-left text-gray-300 hover:text-white transition py-2"
                >
                  Contact
                </button>
                <button 
                  onClick={() => { setAppPage('auth'); setMobileMenuOpen(false); }} 
                  className="block w-full px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg font-semibold transition text-center"
                >
                  Get Started Free
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm">
                  <Shield className="w-4 h-4" />
                  <span>Secure Cloud Storage • Multi-Device Sync</span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                  Track Your Money,
                  <span className="block mt-2 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Build Real Wealth
                  </span>
                </h1>
                
                <p className="text-xl text-gray-400 leading-relaxed">
                  Manage income and expenses with custom categories. Your data syncs across all devices with bank-grade encryption.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => setAppPage('auth')}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 shadow-2xl shadow-emerald-600/30"
                  >
                    Start Free Today <ArrowRight className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setAppPage('contact')}
                    className="px-8 py-4 border-2 border-gray-700 hover:border-gray-600 hover:bg-gray-800/30 rounded-xl font-bold text-lg transition"
                  >
                    Contact Sales
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 blur-3xl rounded-full"></div>
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&q=80" 
                  alt="Finance Dashboard"
                  className="relative rounded-2xl shadow-2xl border border-gray-800/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="py-20 px-4 sm:px-6 lg:px-8 bg-black/40">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
              <p className="text-xl text-gray-400">Simple, powerful, secure</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className={`${cardBg} p-8 rounded-xl border ${borderColor}`}>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Track Income</h3>
                <p className="text-gray-400">Salary, business revenue, and custom income sources all in one place.</p>
              </div>

              <div className={`${cardBg} p-8 rounded-xl border ${borderColor}`}>
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingDown className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Track Expenses</h3>
                <p className="text-gray-400">Food, rent, shopping - organize with default and custom categories.</p>
              </div>

              <div className={`${cardBg} p-8 rounded-xl border ${borderColor}`}>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Cloud Sync</h3>
                <p className="text-gray-400">Access from any device. Your data is encrypted and always in sync.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-blue-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Start?</h2>
            <p className="text-xl mb-8">Join thousands tracking their finances with FinanceFlow</p>
            <button 
              onClick={() => setAppPage('auth')}
              className="px-10 py-4 bg-white text-gray-900 hover:bg-gray-100 rounded-xl font-bold text-lg transition inline-flex items-center gap-2"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800 bg-black/60">
          <div className="max-w-7xl mx-auto text-center text-gray-400">
            <div className="flex justify-center gap-2 items-center mb-4">
              <DollarSign className="w-6 h-6 text-emerald-500" />
              <span className="text-xl font-bold">FinanceFlow</span>
            </div>
            <p>&copy; 2024 FinanceFlow. All rights reserved.</p>
            <div className="mt-4 flex justify-center gap-6">
              <button onClick={() => setAppPage('contact')} className="hover:text-white transition">Contact</button>
              <button onClick={() => setAppPage('auth')} className="hover:text-white transition">Sign In</button>
            </div>
          </div>
        </footer>
      </div>
    );
  }


  // ============================================
  // CONTACT PAGE
  // ============================================
  if (appPage === 'contact') {
    return (
      <div className={`min-h-screen ${bgColor} ${textColor}`}>
        <nav className={`border-b ${borderColor} p-6`}>
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setAppPage('landing')}>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">FinanceFlow</span>
            </div>
            <button 
              onClick={() => setAppPage('landing')}
              className="text-gray-400 hover:text-white transition flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4 rotate-180" /> Back to Home
            </button>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Get In Touch</h1>
            <p className="text-xl text-gray-400">We're here to help!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className={`${cardBg} p-8 rounded-2xl border ${borderColor}`}>
              <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                  placeholder="Your Name"
                  required
                />
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                  placeholder="Your Email"
                  required
                />
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                  placeholder="Subject"
                  required
                />
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  rows="5"
                  className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                  placeholder="Your Message"
                  required
                ></textarea>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 rounded-lg font-semibold transition shadow-lg"
                >
                  Send Message
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className={`${cardBg} p-8 rounded-2xl border ${borderColor}`}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                    <Mail className="w-7 h-7 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Email Us</h3>
                    <a href="mailto:ryanssareen@gmail.com" className="text-emerald-500 hover:text-emerald-400 block">
                      ryanssareen@gmail.com
                    </a>
                    <a href="mailto:ryansareen6@gmail.com" className="text-emerald-500 hover:text-emerald-400 block mt-1">
                      ryansareen6@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className={`${cardBg} p-8 rounded-2xl border ${borderColor}`}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <Phone className="w-7 h-7 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Business Hours</h3>
                    <p className="text-gray-400">Monday - Friday: 9AM - 6PM EST</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // ============================================
  // AUTH PAGE (Sign In / Sign Up with Currency & Forgot Password)
  // ============================================
  if (appPage === 'auth') {
    if (showForgotPassword) {
      // Forgot Password Screen
      return (
        <div className={`min-h-screen ${bgColor} ${textColor} flex items-center justify-center px-4`}>
          <div className={`${cardBg} p-10 rounded-2xl border ${borderColor} w-full max-w-md`}>
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
              <p className="text-gray-400">Enter your email to receive reset instructions</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                  placeholder="Enter your email"
                />
              </div>

              {authMessage && (
                <div className={`p-4 rounded-lg ${authMessage.includes('success') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                  {authMessage}
                </div>
              )}

              <button
                onClick={handleForgotPassword}
                disabled={authLoading}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 rounded-lg font-bold transition disabled:opacity-50"
              >
                {authLoading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <button
                onClick={() => { setShowForgotPassword(false); setAuthMessage(''); }}
                className={`w-full py-3 border ${borderColor} ${hoverBg} rounded-lg font-semibold transition`}
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Regular Sign In / Sign Up Screen
    return (
      <div className={`min-h-screen ${bgColor} ${textColor} flex items-center justify-center px-4`}>
        <div className={`${cardBg} p-10 rounded-2xl border ${borderColor} w-full max-w-md`}>
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-gray-400">
              {isLogin ? 'Sign in to access your finances' : 'Start your financial journey'}
            </p>
          </div>

          <div className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                  placeholder="Choose a username"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                placeholder="Enter your password"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Select Your Currency</label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                >
                  {currencies.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} ({curr.symbol}) - {curr.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-400 mt-2">You can change this later in settings</p>
              </div>
            )}

            {authMessage && (
              <div className={`p-4 rounded-lg ${authMessage.includes('success') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                {authMessage}
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div></div>
                <button
                  onClick={() => { setShowForgotPassword(true); setAuthMessage(''); }}
                  className="text-sm text-emerald-500 hover:text-emerald-400"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              onClick={isLogin ? handleSignIn : handleSignUp}
              disabled={authLoading}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 rounded-lg font-bold transition disabled:opacity-50"
            >
              {authLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${borderColor}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-4 ${cardBg} text-gray-400`}>
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                </span>
              </div>
            </div>

            <button
              onClick={() => { setIsLogin(!isLogin); setAuthMessage(''); }}
              className={`w-full py-4 border-2 ${borderColor} ${hoverBg} rounded-lg font-semibold transition`}
            >
              {isLogin ? 'Create Account' : 'Sign In Instead'}
            </button>

            <button
              onClick={() => setAppPage('landing')}
              className="w-full py-3 text-gray-400 hover:text-white transition flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4 rotate-180" /> Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }


  // ============================================
  // MAIN APP
  // ============================================
  if (appPage === 'app' && currentUser) {
    return (
      <div className={`min-h-screen ${bgColor} ${textColor}`}>
        {/* Top Navigation */}
        <nav className={`border-b ${borderColor} ${cardBg} sticky top-0 z-40 backdrop-blur-md`}>
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">FinanceFlow</h1>
                  <p className="text-xs text-gray-400">Welcome, {userData?.username || currentUser.displayName}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`p-2 ${hoverBg} rounded-lg`}>
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                
                <div className="text-sm font-semibold px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg">
                  {currencySymbol} {currency}
                </div>

                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-500 hover:bg-red-600/20 rounded-lg transition">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  currentPage === 'dashboard' ? 'bg-emerald-600 text-white' : `${hoverBg} text-gray-400`
                }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </div>
              </button>

              <button
                onClick={() => setCurrentPage('income')}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  currentPage === 'income' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' : `${hoverBg} text-gray-400`
                }`}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Income
                </div>
              </button>

              <button
                onClick={() => setCurrentPage('expense')}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  currentPage === 'expense' ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' : `${hoverBg} text-gray-400`
                }`}
              >
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Expense
                </div>
              </button>

              <button
                onClick={() => setCurrentPage('investments')}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  currentPage === 'investments' ? 'bg-orange-600 text-white' : `${hoverBg} text-gray-400`
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Investments
                </div>
              </button>

              <button
                onClick={() => setCurrentPage('settings')}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  currentPage === 'settings' ? 'bg-gray-600 text-white' : `${hoverBg} text-gray-400`
                }`}
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </div>
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">


          {/* ========== DASHBOARD PAGE ========== */}
          {currentPage === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-400 text-sm font-medium">Total Income</h3>
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="text-3xl font-bold text-emerald-500">{currencySymbol}{totalIncome.toFixed(2)}</div>
                </div>

                <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-400 text-sm font-medium">Total Expenses</h3>
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="text-3xl font-bold text-red-500">{currencySymbol}{totalExpense.toFixed(2)}</div>
                </div>

                <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-400 text-sm font-medium">Net Balance</h3>
                    <DollarSign className={`w-5 h-5 ${balance >= 0 ? 'text-blue-500' : 'text-orange-500'}`} />
                  </div>
                  <div className={`text-3xl font-bold ${balance >= 0 ? 'text-blue-500' : 'text-orange-500'}`}>
                    {currencySymbol}{Math.abs(balance).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Charts */}
              {transactions.length > 0 && (
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                    <h3 className="text-xl font-bold mb-4">Income vs Expenses</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Income', value: totalIncome, color: '#10b981' },
                            { name: 'Expenses', value: totalExpense, color: '#ef4444' }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={(entry) => `${entry.name}: ${currencySymbol}${entry.value.toFixed(0)}`}
                        >
                          <Cell fill="#10b981" />
                          <Cell fill="#ef4444" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                    <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {transactions.slice(-5).reverse().map((t) => (
                        <div key={t.id} className={`flex items-center justify-between p-4 ${inputBg} rounded-lg`}>
                          <div className="flex items-center gap-3">
                            {t.type === 'income' ? (
                              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                                <TrendingDown className="w-5 h-5 text-red-500" />
                              </div>
                            )}
                            <div>
                              <div className="font-semibold">{t.label}</div>
                              <div className="text-sm text-gray-400">{t.category}</div>
                            </div>
                          </div>
                          <div className={`text-lg font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                            {t.type === 'income' ? '+' : '-'}{currencySymbol}{t.amount.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {transactions.length === 0 && (
                <div className={`${cardBg} p-12 rounded-xl border ${borderColor} text-center`}>
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-bold mb-2">No transactions yet</h3>
                  <p className="text-gray-400 mb-6">Start tracking your income and expenses</p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => setCurrentPage('income')}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg font-semibold transition"
                    >
                      Add Income
                    </button>
                    <button
                      onClick={() => setCurrentPage('expense')}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-lg font-semibold transition"
                    >
                      Add Expense
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}


          {/* ========== INCOME PAGE ========== */}
          {currentPage === 'income' && (
            <div className="space-y-6">
              {/* Add Transaction Button at Top */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Income</h2>
                  <p className="text-gray-400">Track all your income sources</p>
                </div>
                <button
                  onClick={() => {
                    setTransactionForm({...transactionForm, type: 'income', category: 'Salary'});
                    setShowTransactionForm(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg font-semibold transition shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add Income
                </button>
              </div>

              {/* Category Management */}
              <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Income Categories</h3>
                  <button
                    onClick={() => { setCategoryType('income'); setShowAddCategory(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-semibold transition"
                  >
                    <Plus className="w-4 h-4" />
                    Add Category
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allIncomeCategories.map((cat) => (
                    <div key={cat} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      <span>{cat}</span>
                      {customIncomeCategories.includes(cat) && (
                        <button
                          onClick={() => handleDeleteCategory('income', cat)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Income Transactions */}
              <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                <h3 className="text-xl font-bold mb-6">Income History</h3>
                {incomeTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {incomeTransactions.map((t) => (
                      <div key={t.id} className={`flex items-center justify-between p-5 ${inputBg} rounded-lg`}>
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-emerald-500" />
                          </div>
                          <div>
                            <div className="font-bold text-lg">{t.label}</div>
                            <div className="text-sm text-gray-400 flex items-center gap-3">
                              <span>{t.date}</span>
                              <span>•</span>
                              <span className="capitalize">{t.category}</span>
                              {t.receiptImage && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1 text-emerald-500">
                                    <Camera className="w-3 h-3" /> Receipt
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-2xl font-bold text-emerald-500">
                            +{currencySymbol}{t.amount.toFixed(2)}
                          </div>
                          <button
                            onClick={() => handleDeleteTransaction(t.id)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No income recorded yet</p>
                    <button
                      onClick={() => {
                        setTransactionForm({...transactionForm, type: 'income', category: 'Salary'});
                        setShowTransactionForm(true);
                      }}
                      className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold transition"
                    >
                      Add Your First Income
                    </button>
                  </div>
                )}
              </div>

              {/* Summary Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                {allIncomeCategories.map((category) => {
                  const categoryTotal = incomeTransactions
                    .filter(t => t.category === category)
                    .reduce((sum, t) => sum + t.amount, 0);
                  
                  if (categoryTotal === 0) return null;
                  
                  return (
                    <div key={category} className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                      <div className="text-sm text-gray-400 mb-2">{category}</div>
                      <div className="text-2xl font-bold text-emerald-500">
                        {currencySymbol}{categoryTotal.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========== EXPENSE PAGE ========== */}
          {currentPage === 'expense' && (
            <div className="space-y-6">
              {/* Add Transaction Button at Top */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Expenses</h2>
                  <p className="text-gray-400">Track your spending by category</p>
                </div>
                <button
                  onClick={() => {
                    setTransactionForm({...transactionForm, type: 'expense', category: 'Food'});
                    setShowTransactionForm(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-lg font-semibold transition shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add Expense
                </button>
              </div>

              {/* Category Management */}
              <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Expense Categories</h3>
                  <button
                    onClick={() => { setCategoryType('expense'); setShowAddCategory(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition"
                  >
                    <Plus className="w-4 h-4" />
                    Add Category
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allExpenseCategories.map((cat) => (
                    <div key={cat} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <span>{cat}</span>
                      {customExpenseCategories.includes(cat) && (
                        <button
                          onClick={() => handleDeleteCategory('expense', cat)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Expense Transactions */}
              <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                <h3 className="text-xl font-bold mb-6">Expense History</h3>
                {expenseTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {expenseTransactions.map((t) => (
                      <div key={t.id} className={`flex items-center justify-between p-5 ${inputBg} rounded-lg`}>
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                            <TrendingDown className="w-6 h-6 text-red-500" />
                          </div>
                          <div>
                            <div className="font-bold text-lg">{t.label}</div>
                            <div className="text-sm text-gray-400 flex items-center gap-3">
                              <span>{t.date}</span>
                              <span>•</span>
                              <span className="capitalize">{t.category}</span>
                              {t.receiptImage && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1 text-emerald-500">
                                    <Camera className="w-3 h-3" /> Receipt
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-2xl font-bold text-red-500">
                            -{currencySymbol}{t.amount.toFixed(2)}
                          </div>
                          <button
                            onClick={() => handleDeleteTransaction(t.id)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <TrendingDown className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No expenses recorded yet</p>
                    <button
                      onClick={() => {
                        setTransactionForm({...transactionForm, type: 'expense', category: 'Food'});
                        setShowTransactionForm(true);
                      }}
                      className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
                    >
                      Add Your First Expense
                    </button>
                  </div>
                )}
              </div>

              {/* Summary Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                {allExpenseCategories.map((category) => {
                  const categoryTotal = expenseTransactions
                    .filter(t => t.category === category)
                    .reduce((sum, t) => sum + t.amount, 0);
                  
                  if (categoryTotal === 0) return null;
                  
                  return (
                    <div key={category} className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                      <div className="text-sm text-gray-400 mb-2">{category}</div>
                      <div className="text-2xl font-bold text-red-500">
                        {currencySymbol}{categoryTotal.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}


          {/* Transaction Form Modal */}
          {showTransactionForm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Add {transactionForm.type === 'income' ? 'Income' : 'Expense'}</h3>
                  <button onClick={() => { setShowTransactionForm(false); setReceiptError(''); }} className={`${hoverBg} p-2 rounded-lg`}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  {/* Receipt Upload */}
                  <div className={`p-6 border-2 border-dashed ${borderColor} rounded-xl`}>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h4 className="font-bold mb-2">Upload Receipt (Optional)</h4>
                      <p className="text-sm text-gray-400 mb-4">JPG, PNG, or WebP - Max 5MB</p>
                      <label className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold cursor-pointer transition">
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleReceiptUpload}
                          className="hidden"
                        />
                        Choose Receipt
                      </label>
                      {transactionForm.receiptImage && (
                        <div className="mt-4">
                          <img src={transactionForm.receiptImage} alt="Receipt" className="max-h-48 mx-auto rounded-lg border border-gray-700" />
                          <p className="text-sm text-emerald-500 mt-2">✓ Receipt uploaded!</p>
                        </div>
                      )}
                      {receiptError && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                          ⚠️ {receiptError}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={transactionForm.category}
                      onChange={(e) => setTransactionForm({ ...transactionForm, category: e.target.value })}
                      className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                    >
                      {(transactionForm.type === 'income' ? allIncomeCategories : allExpenseCategories).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Amount ({currencySymbol})</label>
                    <input
                      type="number"
                      step="0.01"
                      value={transactionForm.amount}
                      onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                      className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <input
                      type="text"
                      value={transactionForm.label}
                      onChange={(e) => setTransactionForm({ ...transactionForm, label: e.target.value })}
                      className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                      placeholder="e.g., Monthly salary, Groceries"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input
                      type="date"
                      value={transactionForm.date}
                      onChange={(e) => setTransactionForm({ ...transactionForm, date: e.target.value })}
                      className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleAddTransaction}
                      className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 rounded-lg font-semibold transition"
                    >
                      Add {transactionForm.type === 'income' ? 'Income' : 'Expense'}
                    </button>
                    <button
                      onClick={() => { setShowTransactionForm(false); setReceiptError(''); }}
                      className={`px-6 py-3 border ${borderColor} ${hoverBg} rounded-lg font-semibold transition`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Category Modal */}
          {showAddCategory && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} w-full max-w-md`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Add {categoryType === 'income' ? 'Income' : 'Expense'} Category</h3>
                  <button onClick={() => { setShowAddCategory(false); setNewCategoryName(''); }} className={`${hoverBg} p-2 rounded-lg`}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category Name</label>
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                      placeholder="e.g., Freelance, Healthcare"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleAddCategory}
                      className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 rounded-lg font-semibold transition"
                    >
                      Add Category
                    </button>
                    <button
                      onClick={() => { setShowAddCategory(false); setNewCategoryName(''); }}
                      className={`px-6 py-3 border ${borderColor} ${hoverBg} rounded-lg font-semibold transition`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* ========== INVESTMENTS PAGE ========== */}
          {currentPage === 'investments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Investments</h2>
                <button
                  onClick={() => setShowInvestmentForm(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-lg font-semibold transition shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add Investment
                </button>
              </div>

              {/* Investment Form Modal */}
              {showInvestmentForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} w-full max-w-xl`}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold">Add Investment</h3>
                      <button onClick={() => setShowInvestmentForm(false)} className={`${hoverBg} p-2 rounded-lg`}>
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-5">
                      <select
                        value={investmentForm.type}
                        onChange={(e) => setInvestmentForm({ ...investmentForm, type: e.target.value })}
                        className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                      >
                        <option value="sip">SIP/Recurring</option>
                        <option value="lumpsum">Lump Sum</option>
                        <option value="stocks">Stocks</option>
                        <option value="crypto">Cryptocurrency</option>
                      </select>

                      <input
                        type="number"
                        step="0.01"
                        value={investmentForm.amount}
                        onChange={(e) => setInvestmentForm({ ...investmentForm, amount: e.target.value })}
                        className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                        placeholder={`Amount (${currencySymbol})`}
                      />

                      <input
                        type="text"
                        value={investmentForm.label}
                        onChange={(e) => setInvestmentForm({ ...investmentForm, label: e.target.value })}
                        className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                        placeholder="Investment Name"
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="number"
                          value={investmentForm.duration}
                          onChange={(e) => setInvestmentForm({ ...investmentForm, duration: parseInt(e.target.value) || 12 })}
                          className={`px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                          placeholder="Duration (months)"
                        />
                        <input
                          type="number"
                          step="0.1"
                          value={investmentForm.returnRate}
                          onChange={(e) => setInvestmentForm({ ...investmentForm, returnRate: parseFloat(e.target.value) || 12 })}
                          className={`px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                          placeholder="Return Rate (%)"
                        />
                      </div>

                      <input
                        type="number"
                        step="0.1"
                        value={investmentForm.inflationRate}
                        onChange={(e) => setInvestmentForm({ ...investmentForm, inflationRate: parseFloat(e.target.value) || 6 })}
                        className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                        placeholder="Inflation Rate (%)"
                      />

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handleAddInvestment}
                          className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-lg font-semibold transition"
                        >
                          Calculate & Add
                        </button>
                        <button
                          onClick={() => setShowInvestmentForm(false)}
                          className={`px-6 py-3 border ${borderColor} ${hoverBg} rounded-lg font-semibold transition`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Investments List */}
              <div className="grid lg:grid-cols-2 gap-6">
                {investments.map((inv) => (
                  <div key={inv.id} className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{inv.label}</h3>
                        <p className="text-sm text-gray-400 capitalize">{inv.type} • {inv.duration} months</p>
                      </div>
                      <Calculator className="w-6 h-6 text-orange-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-400">Principal</div>
                        <div className="text-lg font-bold">{currencySymbol}{inv.amount.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Return</div>
                        <div className="text-lg font-bold text-emerald-500">{inv.returnRate}%</div>
                      </div>
                    </div>

                    <div className={`p-4 ${inputBg} rounded-lg space-y-2`}>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Nominal Gain:</span>
                        <span className="font-bold text-emerald-500">+{currencySymbol}{inv.nominalGain}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Real Gain:</span>
                        <span className="font-bold text-blue-500">+{currencySymbol}{inv.realGain}</span>
                      </div>
                      <div className="border-t border-gray-700 pt-2 mt-2"></div>
                      <div className="flex justify-between">
                        <span className="font-bold">Final Value:</span>
                        <span className="font-bold text-orange-500">{currencySymbol}{inv.nominalReturn}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {investments.length === 0 && (
                  <div className={`${cardBg} p-12 rounded-xl border ${borderColor} col-span-2 text-center`}>
                    <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">No investments tracked yet</h3>
                    <p className="text-gray-400 mb-6">Calculate returns and track your portfolio</p>
                    <button
                      onClick={() => setShowInvestmentForm(true)}
                      className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-lg font-semibold transition inline-flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add First Investment
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========== SETTINGS PAGE ========== */}
          {currentPage === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Settings</h2>

              <div className={`${cardBg} p-8 rounded-xl border ${borderColor}`}>
                <h3 className="text-2xl font-bold mb-6">Account Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">Username</label>
                    <div className={`px-4 py-3 ${inputBg} border ${borderColor} rounded-lg mt-1`}>
                      {userData?.username || currentUser.displayName}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Email</label>
                    <div className={`px-4 py-3 ${inputBg} border ${borderColor} rounded-lg mt-1`}>
                      {currentUser.email}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${cardBg} p-8 rounded-xl border ${borderColor}`}>
                <h3 className="text-2xl font-bold mb-6">Preferences</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Theme</label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className={`w-full max-w-md px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Currency</label>
                    <select
                      value={currency}
                      onChange={async (e) => {
                        setCurrency(e.target.value);
                        await updateUserData(currentUser.uid, { currency: e.target.value });
                      }}
                      className={`w-full max-w-md px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                    >
                      {currencies.map(c => (
                        <option key={c.code} value={c.code}>{c.name} ({c.symbol})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className={`${cardBg} p-8 rounded-xl border ${borderColor} border-red-500/30 bg-red-500/5`}>
                <h3 className="text-2xl font-bold mb-4 text-red-500">Sign Out</h3>
                <p className="text-gray-400 mb-6">You'll need to sign in again to access your data</p>
                <button
                  onClick={handleLogout}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  return null;
}
