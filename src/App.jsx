import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DollarSign, TrendingUp, Briefcase, Settings, LogOut, Plus, Moon, Sun, Globe, ArrowRight, AlertTriangle, Mail, Phone, MapPin, Upload, Camera, FileText, Home, Building, Building2, Wallet, Users, CheckSquare, Square, X, Menu, Shield, BarChart3, PieChart as PieChartIcon, Zap, Target, TrendingDown, Calculator, Eye, Edit, Trash2, Download, Filter, Search } from 'lucide-react';

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

const incomeSourceOptions = [
  { id: 'realEstateFlipping', label: 'Real Estate Flipping', icon: Home, color: 'emerald', gradient: 'from-emerald-500 to-teal-500' },
  { id: 'realEstateRenting', label: 'Real Estate Renting', icon: Building, color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'smallBusiness', label: 'Small Business', icon: Briefcase, color: 'purple', gradient: 'from-purple-500 to-pink-500' },
  { id: 'bigBusiness', label: 'Big Business', icon: Building2, color: 'orange', gradient: 'from-orange-500 to-red-500' },
  { id: 'salary', label: 'Salary/Employment', icon: Wallet, color: 'indigo', gradient: 'from-indigo-500 to-blue-500' }
];

export default function App() {
  // Page Navigation States
  const [appPage, setAppPage] = useState('landing'); // landing, contact, auth, onboarding, app
  const [currentPage, setCurrentPage] = useState('dashboard'); // dashboard, transactions, business, investments, settings, income-source
  const [selectedIncomeSource, setSelectedIncomeSource] = useState(null); // for viewing specific income source page
  
  // User & Auth States
  const [currentUser, setCurrentUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Onboarding States
  const [onboardingStep, setOnboardingStep] = useState(1); // 1: income sources, 2+: source details
  const [selectedIncomeSources, setSelectedIncomeSources] = useState([]);
  const [incomeSourceData, setIncomeSourceData] = useState({
    realEstateFlipping: { properties: '', avgProfit: '', annualFlips: '' },
    realEstateRenting: { properties: '', monthlyRent: '', expenses: '' },
    smallBusiness: { businessName: '', monthlyRevenue: '', monthlyExpenses: '' },
    bigBusiness: { companyName: '', annualRevenue: '', employees: '', role: '' },
    salary: { employer: '', position: '', monthlySalary: '', benefits: '' }
  });
  
  // Theme & Settings
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Transaction States
  const [transactions, setTransactions] = useState([]);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionForm, setTransactionForm] = useState({ 
    type: 'income', 
    category: 'essential', 
    amount: '', 
    label: '', 
    date: new Date().toISOString().split('T')[0], 
    receiptData: null,
    receiptImage: null
  });
  
  // Business States
  const [businessRecords, setBusinessRecords] = useState([]);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [businessForm, setBusinessForm] = useState({ 
    type: 'profit', 
    amount: '', 
    label: '', 
    taxRate: 0, 
    date: new Date().toISOString().split('T')[0] 
  });
  
  // Investment States
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
  
  // Contact Form States
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [showOverspendingWarning, setShowOverspendingWarning] = useState(false);
  
  // Save Success State
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const currencySymbol = currencies.find(c => c.code === currency)?.symbol || '$';

  // Load saved data on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('financeAppUser');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (savedUser && savedRememberMe) {
      setCurrentUser(JSON.parse(savedUser));
      setRememberMe(true);
      setAppPage('app');
    }
    
    const savedTheme = localStorage.getItem('financeAppTheme');
    if (savedTheme) setTheme(savedTheme);
    const savedCurrency = localStorage.getItem('financeAppCurrency');
    if (savedCurrency) setCurrency(savedCurrency);
  }, []);

  // Load user-specific data
  useEffect(() => {
    if (currentUser) {
      const savedTransactions = localStorage.getItem(`transactions_${currentUser.username}`);
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
      const savedBusiness = localStorage.getItem(`business_${currentUser.username}`);
      if (savedBusiness) setBusinessRecords(JSON.parse(savedBusiness));
      const savedInvestments = localStorage.getItem(`investments_${currentUser.username}`);
      if (savedInvestments) setInvestments(JSON.parse(savedInvestments));
      const savedIncomeSources = localStorage.getItem(`incomeSources_${currentUser.username}`);
      if (savedIncomeSources) setSelectedIncomeSources(JSON.parse(savedIncomeSources));
      const savedIncomeData = localStorage.getItem(`incomeData_${currentUser.username}`);
      if (savedIncomeData) setIncomeSourceData(JSON.parse(savedIncomeData));
    }
  }, [currentUser]);

  // Auto-save data
  useEffect(() => { if (currentUser) localStorage.setItem(`transactions_${currentUser.username}`, JSON.stringify(transactions)); }, [transactions, currentUser]);
  useEffect(() => { if (currentUser) localStorage.setItem(`business_${currentUser.username}`, JSON.stringify(businessRecords)); }, [businessRecords, currentUser]);
  useEffect(() => { if (currentUser) localStorage.setItem(`investments_${currentUser.username}`, JSON.stringify(investments)); }, [investments, currentUser]);
  useEffect(() => { if (currentUser) localStorage.setItem(`incomeSources_${currentUser.username}`, JSON.stringify(selectedIncomeSources)); }, [selectedIncomeSources, currentUser]);
  useEffect(() => { if (currentUser) localStorage.setItem(`incomeData_${currentUser.username}`, JSON.stringify(incomeSourceData)); }, [incomeSourceData, currentUser]);
  useEffect(() => { localStorage.setItem('financeAppTheme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('financeAppCurrency', currency); }, [currency]);

  // Receipt Upload with OCR Simulation
  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      // Simulate OCR - in production, use Tesseract.js or cloud OCR API
      const mockParsedData = {
        amount: (Math.random() * 200 + 10).toFixed(2),
        label: file.name.toLowerCase().includes('grocery') ? 'Grocery Shopping' : 
               file.name.toLowerCase().includes('restaurant') || file.name.toLowerCase().includes('food') ? 'Restaurant' :
               file.name.toLowerCase().includes('gas') || file.name.toLowerCase().includes('fuel') ? 'Gas Station' :
               file.name.toLowerCase().includes('rent') ? 'Rent Payment' :
               file.name.toLowerCase().includes('utility') || file.name.toLowerCase().includes('electric') ? 'Utilities' :
               'Receipt Item',
        date: new Date().toISOString().split('T')[0],
        category: file.name.toLowerCase().includes('grocery') || file.name.toLowerCase().includes('restaurant') || file.name.toLowerCase().includes('utility') ? 'essential' : 'nonEssential'
      };
      
      setTransactionForm({ 
        ...transactionForm, 
        ...mockParsedData,
        receiptImage: event.target.result,
        receiptData: mockParsedData 
      });
    };
    reader.readAsDataURL(file);
  };

  // Authentication
  const handleAuth = () => {
    if (!username || !password) return alert('Please fill in all fields');
    const users = JSON.parse(localStorage.getItem('financeAppUsers') || '{}');
    
    if (isLogin) {
      if (users[username] && users[username].password === password) {
        const user = { username, email: users[username].email };
        setCurrentUser(user);
        localStorage.setItem('financeAppUser', JSON.stringify(user));
        localStorage.setItem('rememberMe', rememberMe.toString());
        
        // Check if user has completed onboarding
        const savedIncomeSources = localStorage.getItem(`incomeSources_${username}`);
        if (!savedIncomeSources || JSON.parse(savedIncomeSources).length === 0) {
          setAppPage('onboarding');
          setOnboardingStep(1);
        } else {
          setAppPage('app');
        }
      } else {
        alert('Invalid credentials');
      }
    } else {
      if (!email) return alert('Please enter an email');
      if (users[username]) {
        alert('Username already exists');
      } else {
        users[username] = { password, email };
        localStorage.setItem('financeAppUsers', JSON.stringify(users));
        const user = { username, email };
        setCurrentUser(user);
        localStorage.setItem('financeAppUser', JSON.stringify(user));
        localStorage.setItem('rememberMe', rememberMe.toString());
        setAppPage('onboarding');
        setOnboardingStep(1);
      }
    }
    setUsername('');
    setPassword('');
    setEmail('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('financeAppUser');
    localStorage.removeItem('rememberMe');
    setAppPage('landing');
    setCurrentPage('dashboard');
  };

  // Onboarding
  const toggleIncomeSource = (sourceId) => {
    setSelectedIncomeSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const completeOnboarding = () => {
    if (selectedIncomeSources.length === 0) {
      return alert('Please select at least one income source');
    }
    setAppPage('app');
  };

  const updateIncomeSourceData = (sourceId, field, value) => {
    setIncomeSourceData(prev => ({
      ...prev,
      [sourceId]: {
        ...prev[sourceId],
        [field]: value
      }
    }));
  };

  const handleSaveIncomeSource = () => {
    // Data is already saved via useEffect, just show success message
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  // Transactions
  const addTransaction = () => {
    if (!transactionForm.amount || !transactionForm.label) return alert('Please fill in all fields');
    const newTransaction = { 
      id: Date.now(), 
      ...transactionForm, 
      amount: parseFloat(transactionForm.amount) 
    };
    setTransactions([...transactions, newTransaction]);
    
    setTransactionForm({ 
      type: 'income', 
      category: 'essential', 
      amount: '', 
      label: '', 
      date: new Date().toISOString().split('T')[0], 
      receiptData: null,
      receiptImage: null
    });
    setShowTransactionForm(false);
  };

  const deleteTransaction = (id) => {
    if (confirm('Delete this transaction?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  // Business
  const addBusinessRecord = () => {
    if (!businessForm.amount || !businessForm.label) return alert('Please fill in all fields');
    const amount = parseFloat(businessForm.amount);
    const taxAmount = businessForm.type === 'profit' ? (amount * businessForm.taxRate / 100) : 0;
    const newRecord = { 
      id: Date.now(), 
      ...businessForm, 
      amount, 
      taxAmount, 
      netAmount: amount - taxAmount 
    };
    setBusinessRecords([...businessRecords, newRecord]);
    setBusinessForm({ 
      type: 'profit', 
      amount: '', 
      label: '', 
      taxRate: 0, 
      date: new Date().toISOString().split('T')[0] 
    });
    setShowBusinessForm(false);
  };

  // Investments
  const addInvestment = () => {
    if (!investmentForm.amount || !investmentForm.label) return alert('Please fill in all fields');
    const principal = parseFloat(investmentForm.amount);
    const months = parseInt(investmentForm.duration);
    const annualReturn = parseFloat(investmentForm.returnRate);
    const inflation = parseFloat(investmentForm.inflationRate);
    const nominalReturn = principal * Math.pow(1 + annualReturn/100, months/12);
    const realReturn = principal * Math.pow(1 + (annualReturn - inflation)/100, months/12);
    const newInvestment = { 
      id: Date.now(), 
      ...investmentForm, 
      amount: principal, 
      nominalReturn: nominalReturn.toFixed(2), 
      realReturn: realReturn.toFixed(2), 
      nominalGain: (nominalReturn - principal).toFixed(2), 
      realGain: (realReturn - principal).toFixed(2) 
    };
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
  };

  // Contact Form
  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  // Calculations
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const essentialExpenses = transactions.filter(t => t.type === 'expense' && t.category === 'essential').reduce((sum, t) => sum + t.amount, 0);
  const nonEssentialExpenses = transactions.filter(t => t.type === 'expense' && t.category === 'nonEssential').reduce((sum, t) => sum + t.amount, 0);
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

  // ============================================
  // LANDING PAGE - Enhanced Version
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
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-6">
                <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
                <a href="#how-it-works" className="text-gray-300 hover:text-white transition">How It Works</a>
                <button onClick={() => setAppPage('contact')} className="text-gray-300 hover:text-white transition">
                  Contact
                </button>
                <button onClick={() => setAppPage('auth')} className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 rounded-lg font-semibold transition shadow-lg shadow-emerald-600/20">
                  Get Started Free
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-gray-800 pt-4">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-gray-300 hover:text-white transition py-2">Features</a>
                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-gray-300 hover:text-white transition py-2">How It Works</a>
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
                  <Zap className="w-4 h-4" />
                  <span>Smart Financial Management</span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                  Master Your Money,
                  <span className="block mt-2 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Build Real Wealth
                  </span>
                </h1>
                
                <p className="text-xl text-gray-400 leading-relaxed">
                  The all-in-one platform to track income streams, manage expenses intelligently, and grow your wealth with AI-powered insights. Perfect for entrepreneurs, investors, and anyone serious about their finances.
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
                
                <div className="flex items-center gap-8 pt-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-gray-400">Bank-Grade Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-400">Real-Time Sync</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 blur-3xl rounded-full"></div>
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&q=80" 
                  alt="Finance Dashboard Analytics"
                  className="relative rounded-2xl shadow-2xl border border-gray-800/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="py-12 px-4 sm:px-6 lg:px-8 bg-black/40 border-y border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-400">10K+</div>
                <div className="text-gray-400 mt-1">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400">$50M+</div>
                <div className="text-gray-400 mt-1">Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400">99.9%</div>
                <div className="text-gray-400 mt-1">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-400">4.9/5</div>
                <div className="text-gray-400 mt-1">User Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">Everything You Need</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Powerful features designed to give you complete control over your financial life
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} hover:border-emerald-500/50 transition group`}>
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <Upload className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Smart Receipt Scanning</h3>
                <p className="text-gray-400 leading-relaxed">
                  Snap a photo of any receipt and our AI instantly extracts amounts, categories, vendors, and dates. No manual entry ever again.
                </p>
              </div>

              <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} hover:border-blue-500/50 transition group`}>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <Briefcase className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Multi-Income Tracking</h3>
                <p className="text-gray-400 leading-relaxed">
                  Track salary, business revenue, real estate income, rental properties, and investments separately with dedicated dashboards for each.
                </p>
              </div>

              <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} hover:border-purple-500/50 transition group`}>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <TrendingUp className="w-7 h-7 text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Investment Analytics</h3>
                <p className="text-gray-400 leading-relaxed">
                  Calculate real returns with inflation-adjusted projections. Make smarter investment decisions with detailed performance metrics.
                </p>
              </div>

              <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} hover:border-orange-500/50 transition group`}>
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <Building className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Real Estate Management</h3>
                <p className="text-gray-400 leading-relaxed">
                  Track property flips, rental income, expenses, and ROI all in one place. Perfect for real estate investors and landlords.
                </p>
              </div>

              <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} hover:border-pink-500/50 transition group`}>
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <BarChart3 className="w-7 h-7 text-pink-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Business Insights</h3>
                <p className="text-gray-400 leading-relaxed">
                  Automated tax calculations, profit/loss tracking, and expense categorization for small and large businesses alike.
                </p>
              </div>

              <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} hover:border-cyan-500/50 transition group`}>
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <Target className="w-7 h-7 text-cyan-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Goal Planning</h3>
                <p className="text-gray-400 leading-relaxed">
                  Set financial goals and track progress with visual indicators. Get personalized recommendations to reach your targets faster.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-black/40">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Get started in minutes and take control of your finances
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection Lines for Desktop */}
              <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 -translate-y-1/2"></div>
              
              <div className="relative">
                <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} text-center`}>
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                    1
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Sign Up Free</h3>
                  <p className="text-gray-400">
                    Create your account in seconds. No credit card required. Select your income sources and get personalized dashboards.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} text-center`}>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                    2
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Add Your Data</h3>
                  <p className="text-gray-400">
                    Upload receipts, connect income sources, and import transactions. Our AI does the heavy lifting for you.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} text-center`}>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                    3
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Watch Your Wealth Grow</h3>
                  <p className="text-gray-400">
                    Get insights, track progress, and make data-driven decisions. Achieve your financial goals faster than ever.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Demo Section */}
        <div className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&h=700&fit=crop&q=80" 
                  alt="Analytics Dashboard Preview"
                  className="rounded-2xl shadow-2xl border border-gray-800/50"
                />
              </div>
              
              <div className="space-y-8 order-1 lg:order-2">
                <div>
                  <h2 className="text-4xl font-bold mb-4">Complete Financial Picture</h2>
                  <p className="text-xl text-gray-400">
                    See all your income sources, expenses, and investments in one unified dashboard with beautiful, real-time visualizations.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Eye className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Real-Time Updates</h4>
                      <p className="text-gray-400">Every transaction syncs instantly across all your devices</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Bank-Level Security</h4>
                      <p className="text-gray-400">256-bit encryption and secure cloud storage</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Lightning Fast</h4>
                      <p className="text-gray-400">Optimized for speed without compromising accuracy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Receipt Scanner Showcase */}
        <div className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-900/20 to-blue-900/20">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-6">
                    <Camera className="w-4 h-4" />
                    <span>AI-Powered Technology</span>
                  </div>
                  <h2 className="text-4xl font-bold mb-4">Never Type Another Receipt</h2>
                  <p className="text-xl text-gray-400">
                    Our advanced OCR technology reads receipts instantly, extracting every detail with 99% accuracy. Just snap, upload, and forget.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Automatic amount detection</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Smart category assignment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Vendor and date extraction</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Tax-ready documentation</span>
                  </div>
                </div>

                <button 
                  onClick={() => setAppPage('auth')}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 rounded-xl font-bold transition flex items-center gap-2 shadow-xl"
                >
                  Try Receipt Scanner <Upload className="w-5 h-5" />
                </button>
              </div>
              
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1554224311-beee-7e9dfedc?w=1000&h=700&fit=crop&q=80" 
                  alt="Receipt Scanning Technology"
                  className="rounded-2xl shadow-2xl border border-gray-800/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Transform Your Finances?</h2>
            <p className="text-2xl mb-10 text-white/90">
              Join thousands who've taken control with FinanceFlow
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setAppPage('auth')}
                className="px-10 py-5 bg-white text-gray-900 hover:bg-gray-100 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 shadow-2xl"
              >
                Start Free Now <ArrowRight className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setAppPage('contact')}
                className="px-10 py-5 bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-xl font-bold text-lg transition"
              >
                Talk to Sales
              </button>
            </div>
            <p className="mt-6 text-white/80">No credit card required • Free forever • Cancel anytime</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-800 bg-black/60">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold">FinanceFlow</span>
                </div>
                <p className="text-gray-400 max-w-md">
                  The all-in-one financial platform for entrepreneurs, investors, and anyone serious about building wealth.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">Product</h4>
                <div className="space-y-3 text-gray-400">
                  <div><a href="#features" className="hover:text-white transition">Features</a></div>
                  <div><a href="#how-it-works" className="hover:text-white transition">How It Works</a></div>
                  <div><button onClick={() => setAppPage('auth')} className="hover:text-white transition">Get Started</button></div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <div className="space-y-3 text-gray-400">
                  <div><button onClick={() => setAppPage('contact')} className="hover:text-white transition">Contact</button></div>
                  <div><button onClick={() => setAppPage('auth')} className="hover:text-white transition">Sign In</button></div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
              <p>&copy; 2024 FinanceFlow. All rights reserved.</p>
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
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-6">
              <Mail className="w-4 h-4" />
              <span>Get In Touch</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">Contact Our Team</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Have questions? We're here to help you succeed with FinanceFlow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className={`${cardBg} p-8 rounded-2xl border ${borderColor}`}>
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${textColor} transition`}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${textColor} transition`}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${textColor} transition`}
                    placeholder="How can we help?"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    rows="6"
                    className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${textColor} transition`}
                    placeholder="Tell us more about your inquiry..."
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 rounded-lg font-semibold transition shadow-lg"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className={`${cardBg} p-8 rounded-2xl border ${borderColor}`}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-7 h-7 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3">Email Us</h3>
                    <p className="text-gray-400 mb-3">For general inquiries and support:</p>
                    <a href="mailto:ryanssareen@gmail.com" className="text-emerald-500 hover:text-emerald-400 block mb-2 font-medium">
                      ryanssareen@gmail.com
                    </a>
                    <a href="mailto:ryansareen6@gmail.com" className="text-emerald-500 hover:text-emerald-400 block font-medium">
                      ryansareen6@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className={`${cardBg} p-8 rounded-2xl border ${borderColor}`}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-7 h-7 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">Business Hours</h3>
                    <div className="space-y-2 text-gray-400">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                      <p>Saturday: 10:00 AM - 2:00 PM EST</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${cardBg} p-8 rounded-2xl border ${borderColor}`}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-7 h-7 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">Quick Response</h3>
                    <p className="text-gray-400">
                      We typically respond to all inquiries within 24 hours during business days. For urgent matters, please mention "Urgent" in your subject line.
                    </p>
                  </div>
                </div>
              </div>

              <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} bg-gradient-to-br from-emerald-500/5 to-blue-500/5`}>
                <h3 className="text-xl font-bold mb-3">Enterprise Solutions?</h3>
                <p className="text-gray-400 mb-4">
                  Looking for custom features or enterprise-level support? Contact us to discuss your specific needs.
                </p>
                <button 
                  onClick={() => setContactForm({...contactForm, subject: 'Enterprise Inquiry'})}
                  className="text-emerald-500 hover:text-emerald-400 font-semibold flex items-center gap-2"
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // AUTH PAGE (Sign In / Sign Up)
  // ============================================
  if (appPage === 'auth') {
    return (
      <div className={`min-h-screen ${bgColor} ${textColor} flex items-center justify-center px-4 sm:px-6 lg:px-8`}>
        <div className={`${cardBg} p-10 rounded-2xl border ${borderColor} w-full max-w-md shadow-2xl`}>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold">FinanceFlow</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {isLogin ? 'Welcome Back!' : 'Create Your Account'}
            </h2>
            <p className="text-gray-400">
              {isLogin ? 'Sign in to continue your financial journey' : 'Start managing your wealth today'}
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${textColor} transition`}
                placeholder="Enter your username"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${textColor} transition`}
                  placeholder="Enter your email"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${textColor} transition`}
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-400">
                  Remember me
                </label>
              </div>
              {isLogin && (
                <button className="text-sm text-emerald-500 hover:text-emerald-400">
                  Forgot password?
                </button>
              )}
            </div>

            <button
              onClick={handleAuth}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 rounded-lg font-bold transition shadow-lg"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
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
              onClick={() => setIsLogin(!isLogin)}
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
  // ONBOARDING - Income Sources Selection
  // ============================================
  if (appPage === 'onboarding') {
    return (
      <div className={`min-h-screen ${bgColor} ${textColor}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold">FinanceFlow</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Welcome, {currentUser?.username}!</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Let's personalize your experience. Select all income sources that apply to you.
            </p>
          </div>

          {/* Income Source Selection */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {incomeSourceOptions.map((source) => {
              const Icon = source.icon;
              const isSelected = selectedIncomeSources.includes(source.id);
              return (
                <button
                  key={source.id}
                  onClick={() => toggleIncomeSource(source.id)}
                  className={`${cardBg} p-8 rounded-2xl border-2 transition ${
                    isSelected 
                      ? `border-${source.color}-500 bg-gradient-to-br from-${source.color}-500/10 to-${source.color}-600/5` 
                      : `${borderColor} hover:border-${source.color}-500/30`
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${source.gradient} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    {isSelected ? (
                      <CheckSquare className={`w-7 h-7 text-${source.color}-500`} />
                    ) : (
                      <Square className="w-7 h-7 text-gray-600" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{source.label}</h3>
                  <p className="text-sm text-gray-400">
                    {source.id === 'realEstateFlipping' && 'Track property flips, renovation costs, and profits'}
                    {source.id === 'realEstateRenting' && 'Manage rental properties, income, and expenses'}
                    {source.id === 'smallBusiness' && 'Monitor revenue, expenses, and business growth'}
                    {source.id === 'bigBusiness' && 'Enterprise-level financial tracking and analytics'}
                    {source.id === 'salary' && 'Track employment income, benefits, and deductions'}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Selected Count */}
          {selectedIncomeSources.length > 0 && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <CheckSquare className="w-5 h-5 text-emerald-500" />
                <span className="text-emerald-400 font-semibold">
                  {selectedIncomeSources.length} source{selectedIncomeSources.length !== 1 ? 's' : ''} selected
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={completeOnboarding}
              disabled={selectedIncomeSources.length === 0}
              className={`px-10 py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 shadow-lg ${
                selectedIncomeSources.length > 0
                  ? 'bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700'
                  : 'bg-gray-700 cursor-not-allowed opacity-50'
              }`}
            >
              Continue to Dashboard <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className={`px-10 py-4 border-2 ${borderColor} ${hoverBg} rounded-xl font-bold text-lg transition`}
            >
              Sign Out
            </button>
          </div>

          {/* Info Card */}
          <div className={`${cardBg} p-6 rounded-xl border ${borderColor} max-w-2xl mx-auto mt-12`}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h4 className="font-bold mb-1">You can always change this later</h4>
                <p className="text-sm text-gray-400">
                  Your income sources can be updated anytime from your settings. We'll create personalized dashboards for each source you select.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // ============================================
  // MAIN APP - Dashboard (WIDER VERSION)
  // ============================================
  if (appPage === 'app') {
    return (
      <div className={`min-h-screen ${bgColor} ${textColor}`}>
        {/* Top Navigation Bar */}
        <nav className={`border-b ${borderColor} ${cardBg} sticky top-0 z-40 backdrop-blur-md`}>
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">FinanceFlow</h1>
                  <p className="text-xs text-gray-400">Welcome, {currentUser?.username}</p>
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-4">
                <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`p-2 ${hoverBg} rounded-lg transition`}>
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                  className={`px-3 py-2 ${inputBg} border ${borderColor} rounded-lg text-sm ${textColor}`}
                >
                  {currencies.map(c => (
                    <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                  ))}
                </select>

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

              {selectedIncomeSources.map((sourceId) => {
                const source = incomeSourceOptions.find(s => s.id === sourceId);
                if (!source) return null;
                const Icon = source.icon;
                return (
                  <button
                    key={sourceId}
                    onClick={() => {
                      setCurrentPage('income-source');
                      setSelectedIncomeSource(sourceId);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                      currentPage === 'income-source' && selectedIncomeSource === sourceId
                        ? `bg-gradient-to-r ${source.gradient} text-white`
                        : `${hoverBg} text-gray-400`
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {source.label}
                    </div>
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage('transactions')}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  currentPage === 'transactions' ? 'bg-blue-600 text-white' : `${hoverBg} text-gray-400`
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Transactions
                </div>
              </button>

              <button
                onClick={() => setCurrentPage('business')}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  currentPage === 'business' ? 'bg-purple-600 text-white' : `${hoverBg} text-gray-400`
                }`}
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Business
                </div>
              </button>

              <button
                onClick={() => setCurrentPage('investments')}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  currentPage === 'investments' ? 'bg-orange-600 text-white' : `${hoverBg} text-gray-400`
                }`}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
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

        {/* Main Content Area - MUCH WIDER */}
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* ========== DASHBOARD PAGE ========== */}
          {currentPage === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-400 text-sm font-medium">Total Income</h3>
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-emerald-500">{currencySymbol}{totalIncome.toFixed(2)}</div>
                </div>

                <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-400 text-sm font-medium">Total Expenses</h3>
                    <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-red-500">{currencySymbol}{totalExpense.toFixed(2)}</div>
                </div>

                <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-400 text-sm font-medium">Net Balance</h3>
                    <div className={`w-10 h-10 ${balance >= 0 ? 'bg-blue-500/10' : 'bg-orange-500/10'} rounded-lg flex items-center justify-center`}>
                      <DollarSign className={`w-5 h-5 ${balance >= 0 ? 'text-blue-500' : 'text-orange-500'}`} />
                    </div>
                  </div>
                  <div className={`text-3xl font-bold ${balance >= 0 ? 'text-blue-500' : 'text-orange-500'}`}>
                    {currencySymbol}{Math.abs(balance).toFixed(2)}
                  </div>
                </div>

                <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-400 text-sm font-medium">Transactions</h3>
                    <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-500" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-purple-500">{transactions.length}</div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Income vs Expenses Pie Chart */}
                <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                  <h3 className="text-xl font-bold mb-4">Income vs Expenses</h3>
                  {totalIncome > 0 || totalExpense > 0 ? (
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
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-400">
                      No data yet. Add some transactions to see your financial overview.
                    </div>
                  )}
                </div>

                {/* Expense Breakdown */}
                <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                  <h3 className="text-xl font-bold mb-4">Expense Breakdown</h3>
                  {essentialExpenses > 0 || nonEssentialExpenses > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={[
                          { category: 'Essential', amount: essentialExpenses },
                          { category: 'Non-Essential', amount: nonEssentialExpenses }
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                        <XAxis dataKey="category" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                        <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                            border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`
                          }}
                        />
                        <Bar dataKey="amount" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-400">
                      No expenses yet. Start tracking to see breakdowns.
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Recent Transactions</h3>
                  <button
                    onClick={() => setCurrentPage('transactions')}
                    className="text-emerald-500 hover:text-emerald-400 text-sm font-medium flex items-center gap-1"
                  >
                    View All <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                
                {transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.slice(-5).reverse().map((t) => (
                      <div key={t.id} className={`flex items-center justify-between p-4 ${inputBg} rounded-lg`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 ${t.type === 'income' ? 'bg-emerald-500/10' : 'bg-red-500/10'} rounded-lg flex items-center justify-center`}>
                            {t.type === 'income' ? (
                              <TrendingUp className={`w-5 h-5 text-emerald-500`} />
                            ) : (
                              <TrendingDown className={`w-5 h-5 text-red-500`} />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold">{t.label}</div>
                            <div className="text-sm text-gray-400">{t.date}</div>
                          </div>
                        </div>
                        <div className={`text-lg font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                          {t.type === 'income' ? '+' : '-'}{currencySymbol}{t.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No transactions yet</p>
                    <button
                      onClick={() => setCurrentPage('transactions')}
                      className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold transition"
                    >
                      Add Your First Transaction
                    </button>
                  </div>
                )}
              </div>

              {/* Income Sources Summary */}
              {selectedIncomeSources.length > 0 && (
                <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                  <h3 className="text-xl font-bold mb-6">Your Income Sources</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedIncomeSources.map((sourceId) => {
                      const source = incomeSourceOptions.find(s => s.id === sourceId);
                      if (!source) return null;
                      const Icon = source.icon;
                      return (
                        <button
                          key={sourceId}
                          onClick={() => {
                            setCurrentPage('income-source');
                            setSelectedIncomeSource(sourceId);
                          }}
                          className={`${inputBg} p-6 rounded-xl border ${borderColor} hover:border-${source.color}-500/50 transition text-left`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${source.gradient} rounded-xl flex items-center justify-center`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="font-bold">{source.label}</div>
                              <div className="text-sm text-gray-400">View Details →</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}


          {/* ========== TRANSACTIONS PAGE ========== */}
          {currentPage === 'transactions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Transactions</h2>
                <button
                  onClick={() => setShowTransactionForm(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 rounded-lg font-semibold transition shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add Transaction
                </button>
              </div>

              {/* Transaction Form Modal */}
              {showTransactionForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold">Add Transaction</h3>
                      <button onClick={() => {
                        setShowTransactionForm(false);
                        setTransactionForm({ 
                          type: 'income', 
                          category: 'essential', 
                          amount: '', 
                          label: '', 
                          date: new Date().toISOString().split('T')[0],
                          receiptData: null,
                          receiptImage: null
                        });
                      }} className={`${hoverBg} p-2 rounded-lg`}>
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-5">
                      {/* Receipt Upload Section */}
                      <div className={`p-6 border-2 border-dashed ${borderColor} rounded-xl`}>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Upload className="w-8 h-8 text-emerald-500" />
                          </div>
                          <h4 className="font-bold mb-2">Upload Receipt (Optional)</h4>
                          <p className="text-sm text-gray-400 mb-4">
                            Snap or upload a receipt and we'll extract the details automatically
                          </p>
                          <label className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold cursor-pointer transition">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleReceiptUpload}
                              className="hidden"
                            />
                            Choose Receipt
                          </label>
                          {transactionForm.receiptImage && (
                            <div className="mt-4">
                              <img src={transactionForm.receiptImage} alt="Receipt" className="max-h-48 mx-auto rounded-lg border border-gray-700" />
                              <p className="text-sm text-emerald-500 mt-2">✓ Receipt uploaded - details extracted!</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium mb-2">Type</label>
                          <select
                            value={transactionForm.type}
                            onChange={(e) => setTransactionForm({ ...transactionForm, type: e.target.value })}
                            className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                          >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Category</label>
                          <select
                            value={transactionForm.category}
                            onChange={(e) => setTransactionForm({ ...transactionForm, category: e.target.value })}
                            className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                            disabled={transactionForm.type === 'income'}
                          >
                            <option value="essential">Essential</option>
                            <option value="nonEssential">Non-Essential</option>
                          </select>
                        </div>
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
                          placeholder="e.g., Grocery shopping"
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
                          onClick={addTransaction}
                          className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 rounded-lg font-semibold transition"
                        >
                          Add Transaction
                        </button>
                        <button
                          onClick={() => {
                            setShowTransactionForm(false);
                            setTransactionForm({ 
                              type: 'income', 
                              category: 'essential', 
                              amount: '', 
                              label: '', 
                              date: new Date().toISOString().split('T')[0],
                              receiptData: null,
                              receiptImage: null
                            });
                          }}
                          className={`px-6 py-3 border ${borderColor} ${hoverBg} rounded-lg font-semibold transition`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Transactions List */}
              <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                {transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.map((t) => (
                      <div key={t.id} className={`flex items-center justify-between p-5 ${inputBg} rounded-lg hover:${hoverBg} transition`}>
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-12 h-12 ${t.type === 'income' ? 'bg-emerald-500/10' : 'bg-red-500/10'} rounded-xl flex items-center justify-center`}>
                            {t.type === 'income' ? (
                              <TrendingUp className="w-6 h-6 text-emerald-500" />
                            ) : (
                              <TrendingDown className="w-6 h-6 text-red-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-lg">{t.label}</div>
                            <div className="text-sm text-gray-400 flex items-center gap-3">
                              <span>{t.date}</span>
                              <span>•</span>
                              <span className="capitalize">{t.category}</span>
                              {t.receiptImage && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1 text-emerald-500">
                                    <Camera className="w-3 h-3" /> Receipt attached
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`text-2xl font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                            {t.type === 'income' ? '+' : '-'}{currencySymbol}{t.amount.toFixed(2)}
                          </div>
                          <button
                            onClick={() => deleteTransaction(t.id)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-400">
                    <FileText className="w-20 h-20 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">No transactions yet</h3>
                    <p className="mb-6">Start tracking your income and expenses</p>
                    <button
                      onClick={() => setShowTransactionForm(true)}
                      className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 rounded-lg font-semibold transition inline-flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add Your First Transaction
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}


          {/* ========== BUSINESS PAGE ========== */}
          {currentPage === 'business' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Business Finances</h2>
                <button
                  onClick={() => setShowBusinessForm(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add Record
                </button>
              </div>

              {/* Business Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                  <h3 className="text-gray-400 text-sm font-medium mb-2">Business Profit</h3>
                  <div className="text-3xl font-bold text-emerald-500">{currencySymbol}{businessProfit.toFixed(2)}</div>
                </div>
                <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                  <h3 className="text-gray-400 text-sm font-medium mb-2">Business Expenses</h3>
                  <div className="text-3xl font-bold text-red-500">{currencySymbol}{businessExpense.toFixed(2)}</div>
                </div>
                <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                  <h3 className="text-gray-400 text-sm font-medium mb-2">Net Business Income</h3>
                  <div className={`text-3xl font-bold ${businessBalance >= 0 ? 'text-blue-500' : 'text-orange-500'}`}>
                    {currencySymbol}{Math.abs(businessBalance).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Business Form Modal */}
              {showBusinessForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} w-full max-w-xl`}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold">Add Business Record</h3>
                      <button onClick={() => setShowBusinessForm(false)} className={`${hoverBg} p-2 rounded-lg`}>
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium mb-2">Type</label>
                        <select
                          value={businessForm.type}
                          onChange={(e) => setBusinessForm({ ...businessForm, type: e.target.value })}
                          className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                        >
                          <option value="profit">Profit/Revenue</option>
                          <option value="expense">Business Expense</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Amount ({currencySymbol})</label>
                        <input
                          type="number"
                          step="0.01"
                          value={businessForm.amount}
                          onChange={(e) => setBusinessForm({ ...businessForm, amount: e.target.value })}
                          className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <input
                          type="text"
                          value={businessForm.label}
                          onChange={(e) => setBusinessForm({ ...businessForm, label: e.target.value })}
                          className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                          placeholder="e.g., Client payment, Equipment purchase"
                        />
                      </div>

                      {businessForm.type === 'profit' && (
                        <div>
                          <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={businessForm.taxRate}
                            onChange={(e) => setBusinessForm({ ...businessForm, taxRate: parseFloat(e.target.value) || 0 })}
                            className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                            placeholder="e.g., 20"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium mb-2">Date</label>
                        <input
                          type="date"
                          value={businessForm.date}
                          onChange={(e) => setBusinessForm({ ...businessForm, date: e.target.value })}
                          className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={addBusinessRecord}
                          className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition"
                        >
                          Add Record
                        </button>
                        <button
                          onClick={() => setShowBusinessForm(false)}
                          className={`px-6 py-3 border ${borderColor} ${hoverBg} rounded-lg font-semibold transition`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Business Records List */}
              <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                <h3 className="text-xl font-bold mb-6">Business Records</h3>
                {businessRecords.length > 0 ? (
                  <div className="space-y-3">
                    {businessRecords.map((record) => (
                      <div key={record.id} className={`p-5 ${inputBg} rounded-lg`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-bold text-lg">{record.label}</div>
                            <div className="text-sm text-gray-400 mt-1">
                              <span>{record.date}</span>
                              {record.type === 'profit' && record.taxRate > 0 && (
                                <span className="ml-3">Tax: {record.taxRate}% ({currencySymbol}{record.taxAmount.toFixed(2)})</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${record.type === 'profit' ? 'text-emerald-500' : 'text-red-500'}`}>
                              {record.type === 'profit' ? '+' : '-'}{currencySymbol}{record.amount.toFixed(2)}
                            </div>
                            {record.type === 'profit' && record.taxAmount > 0 && (
                              <div className="text-sm text-blue-500 mt-1">
                                Net: {currencySymbol}{record.netAmount.toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-400">
                    <Briefcase className="w-20 h-20 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">No business records yet</h3>
                    <p className="mb-6">Track your business revenue and expenses</p>
                    <button
                      onClick={() => setShowBusinessForm(true)}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition inline-flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add First Record
                    </button>
                  </div>
                )}
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
                      <div>
                        <label className="block text-sm font-medium mb-2">Investment Type</label>
                        <select
                          value={investmentForm.type}
                          onChange={(e) => setInvestmentForm({ ...investmentForm, type: e.target.value })}
                          className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                        >
                          <option value="sip">SIP/Recurring</option>
                          <option value="lumpsum">Lump Sum</option>
                          <option value="stocks">Stocks</option>
                          <option value="crypto">Cryptocurrency</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Initial Amount ({currencySymbol})</label>
                        <input
                          type="number"
                          step="0.01"
                          value={investmentForm.amount}
                          onChange={(e) => setInvestmentForm({ ...investmentForm, amount: e.target.value })}
                          className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Investment Name</label>
                        <input
                          type="text"
                          value={investmentForm.label}
                          onChange={(e) => setInvestmentForm({ ...investmentForm, label: e.target.value })}
                          className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                          placeholder="e.g., Index Fund, Bitcoin"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium mb-2">Duration (Months)</label>
                          <input
                            type="number"
                            value={investmentForm.duration}
                            onChange={(e) => setInvestmentForm({ ...investmentForm, duration: parseInt(e.target.value) || 12 })}
                            className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Expected Return (%)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={investmentForm.returnRate}
                            onChange={(e) => setInvestmentForm({ ...investmentForm, returnRate: parseFloat(e.target.value) || 12 })}
                            className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Inflation Rate (%) - Optional</label>
                        <input
                          type="number"
                          step="0.1"
                          value={investmentForm.inflationRate}
                          onChange={(e) => setInvestmentForm({ ...investmentForm, inflationRate: parseFloat(e.target.value) || 6 })}
                          className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                          placeholder="e.g., 6"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={addInvestment}
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
                {investments.length > 0 ? (
                  investments.map((inv) => (
                    <div key={inv.id} className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{inv.label}</h3>
                          <p className="text-sm text-gray-400 capitalize">{inv.type} • {inv.duration} months</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-orange-500" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Principal</div>
                          <div className="text-lg font-bold">{currencySymbol}{inv.amount.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Expected Return</div>
                          <div className="text-lg font-bold text-emerald-500">{inv.returnRate}%</div>
                        </div>
                      </div>

                      <div className={`p-4 ${inputBg} rounded-lg space-y-2`}>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Nominal Gain:</span>
                          <span className="font-bold text-emerald-500">+{currencySymbol}{inv.nominalGain}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Real Gain (Inflation-Adjusted):</span>
                          <span className="font-bold text-blue-500">+{currencySymbol}{inv.realGain}</span>
                        </div>
                        <div className="border-t border-gray-700 pt-2 mt-2"></div>
                        <div className="flex justify-between text-lg">
                          <span className="font-bold">Final Value:</span>
                          <span className="font-bold text-orange-500">{currencySymbol}{inv.nominalReturn}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`${cardBg} p-12 rounded-xl border ${borderColor} col-span-2 text-center text-gray-400`}>
                    <Calculator className="w-20 h-20 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">No investments tracked yet</h3>
                    <p className="mb-6">Calculate returns and track your investment portfolio</p>
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


          {/* ========== INCOME SOURCE SPECIFIC PAGES ========== */}
          {currentPage === 'income-source' && selectedIncomeSource && (
            <div className="space-y-6">
              {(() => {
                const source = incomeSourceOptions.find(s => s.id === selectedIncomeSource);
                if (!source) return null;
                const Icon = source.icon;
                const data = incomeSourceData[selectedIncomeSource];

                return (
                  <>
                    {/* Header */}
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${source.gradient} rounded-2xl flex items-center justify-center`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold">{source.label}</h2>
                        <p className="text-gray-400">Manage your {source.label.toLowerCase()} details</p>
                      </div>
                    </div>

                    {/* Income Source Details Form */}
                    <div className={`${cardBg} p-8 rounded-xl border ${borderColor}`}>
                      <h3 className="text-2xl font-bold mb-6">Income Details</h3>
                      
                      {selectedIncomeSource === 'realEstateFlipping' && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-medium mb-2">Number of Properties</label>
                            <input
                              type="number"
                              value={data.properties}
                              onChange={(e) => updateIncomeSourceData(selectedIncomeSource, 'properties', e.target.value)}
                              className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                              placeholder="e.g., 5"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Average Profit per Flip ({currencySymbol})</label>
                            <input
                              type="number"
                              value={data.avgProfit}
                              onChange={(e) => updateIncomeSourceData(selectedIncomeSource, 'avgProfit', e.target.value)}
                              className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                              placeholder="e.g., 50000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Flips per Year</label>
                            <input
                              type="number"
                              value={data.annualFlips}
                              onChange={(e) => updateIncomeSourceData(selectedIncomeSource, 'annualFlips', e.target.value)}
                              className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                              placeholder="e.g., 4"
                            />
                          </div>
                        </div>
                      )}

                      {selectedIncomeSource === 'realEstateRenting' && (
                        <div className="grid md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-medium mb-2">Number of Properties</label>
                            <input
                              type="number"
                              value={data.properties}
                              onChange={(e) => updateIncomeSourceData(selectedIncomeSource, 'properties', e.target.value)}
                              className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                              placeholder="e.g., 3"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Total Monthly Rent ({currencySymbol})</label>
                            <input
                              type="number"
                              value={data.monthlyRent}
                              onChange={(e) => updateIncomeSourceData(selectedIncomeSource, 'monthlyRent', e.target.value)}
                              className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                              placeholder="e.g., 3000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Monthly Expenses ({currencySymbol})</label>
                            <input
                              type="number"
                              value={data.expenses}
                              onChange={(e) => updateIncomeSourceData(selectedIncomeSource, 'expenses', e.target.value)}
                              className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                              placeholder="e.g., 500"
                            />
                          </div>
                        </div>
                      )}

                      {selectedIncomeSource === 'smallBusiness' && (
                        <div className="grid md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-medium mb-2">Business Name</label>
                            <input
                              type="text"
                              value={data.businessName}
                              onChange={(e) => updateIncomeSourceData(selectedIncomeSource, 'businessName', e.target.value)}
                              className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                              placeholder="e.g., My Consulting LLC"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Monthly Revenue ({currencySymbol})</label>
                            <input
                              type="number"
                              value={data.monthlyRevenue}
                              onChange={(e) => updateIncomeSourceData(selectedIncomeSource, 'monthlyRevenue', e.target.value)}
                              className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                              placeholder="e.g., 10000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Monthly Expenses ({currencySymbol})</label>
                            <input
                              type="number"
                              value={data.monthlyExpenses}
                              onChange={(e) => updateIncomeSourceData(selectedIncomeSource, 'monthlyExpenses', e.target.value)}
                              className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                              placeholder="e.g., 3000"
                            />
                          </div>
                        </div>
                      )}

                      {selectedIncomeSource === 'bigBusiness' && (
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium mb-2">Company Name</label>
                            <input
                              type="text"
                              value={data.companyName}
                              onChange={(e) => updateIncomeSourceData(selectedIncomeSource, 'companyName', e.target.value)}
                              className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                              placeholder="e.g., TechCorp Inc."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Your Role</label>
                            <input
                              type="text"
                              value={data.role}
                              onChange={(e) => updateIncomeSourceData(selectedIncomeSource, 'role', e.target.value)}
                              className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                              placeholder="e.g., CEO, Partner"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Annual Revenue ({currencySymbol})</label>
                            <input
                              type="number"
                              value={data.annualRevenue}
                              onChange={(e) => updateIncomeSourceData(selectedIncomeSource, 'annualRevenue', e.target.value)}
                              className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                              placeholder="e.g., 5000000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Number of Employees</label>
                            <input
                              type="number"
                              value={data.employees}
                              onChange={(e) => updateIncomeSourceData(selectedIncomeSource, 'employees', e.target.value)}
                              className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                              placeholder="e.g., 50"
                            />
                          </div>
                        </div>
                      )}

                      {selectedIncomeSource === 'salary' && (
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium mb-2">Employer</label>
                            <input
                              type="text"
                              value={data.employer}
                              onChange={(e) => updateIncomeSourceData(selectedIncomeSource, 'employer', e.target.value)}
                              className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                              placeholder="e.g., Google Inc."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Position</label>
                            <input
                              type="text"
                              value={data.position}
                              onChange={(e) => updateIncomeSourceData(selectedIncomeSource, 'position', e.target.value)}
                              className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                              placeholder="e.g., Software Engineer"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Monthly Salary ({currencySymbol})</label>
                            <input
                              type="number"
                              value={data.monthlySalary}
                              onChange={(e) => updateIncomeSourceData(selectedIncomeSource, 'monthlySalary', e.target.value)}
                              className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                              placeholder="e.g., 8000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Additional Benefits ({currencySymbol})</label>
                            <input
                              type="number"
                              value={data.benefits}
                              onChange={(e) => updateIncomeSourceData(selectedIncomeSource, 'benefits', e.target.value)}
                              className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}
                              placeholder="e.g., 500"
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Save Button */}
                      <div className="mt-8 flex items-center gap-4">
                        <button
                          onClick={handleSaveIncomeSource}
                          className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 rounded-lg font-bold transition shadow-lg flex items-center gap-2"
                        >
                          <CheckSquare className="w-5 h-5" />
                          Save Changes
                        </button>
                        
                        {showSaveSuccess && (
                          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500">
                            <CheckSquare className="w-5 h-5" />
                            <span className="font-semibold">Saved successfully!</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Analytics for this income source */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {selectedIncomeSource === 'realEstateFlipping' && data.avgProfit && data.annualFlips && (
                        <>
                          <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                            <h4 className="text-gray-400 text-sm mb-2">Estimated Annual Income</h4>
                            <div className="text-2xl font-bold text-emerald-500">
                              {currencySymbol}{(parseFloat(data.avgProfit) * parseFloat(data.annualFlips)).toFixed(2)}
                            </div>
                          </div>
                          <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                            <h4 className="text-gray-400 text-sm mb-2">Average per Property</h4>
                            <div className="text-2xl font-bold text-blue-500">
                              {currencySymbol}{parseFloat(data.avgProfit).toFixed(2)}
                            </div>
                          </div>
                          <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                            <h4 className="text-gray-400 text-sm mb-2">Properties Flipped/Year</h4>
                            <div className="text-2xl font-bold text-purple-500">{data.annualFlips}</div>
                          </div>
                        </>
                      )}

                      {selectedIncomeSource === 'realEstateRenting' && data.monthlyRent && (
                        <>
                          <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                            <h4 className="text-gray-400 text-sm mb-2">Monthly Net Income</h4>
                            <div className="text-2xl font-bold text-emerald-500">
                              {currencySymbol}{(parseFloat(data.monthlyRent) - (parseFloat(data.expenses) || 0)).toFixed(2)}
                            </div>
                          </div>
                          <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                            <h4 className="text-gray-400 text-sm mb-2">Annual Income</h4>
                            <div className="text-2xl font-bold text-blue-500">
                              {currencySymbol}{((parseFloat(data.monthlyRent) - (parseFloat(data.expenses) || 0)) * 12).toFixed(2)}
                            </div>
                          </div>
                          <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                            <h4 className="text-gray-400 text-sm mb-2">Properties Owned</h4>
                            <div className="text-2xl font-bold text-purple-500">{data.properties || 0}</div>
                          </div>
                        </>
                      )}

                      {selectedIncomeSource === 'smallBusiness' && data.monthlyRevenue && (
                        <>
                          <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                            <h4 className="text-gray-400 text-sm mb-2">Monthly Profit</h4>
                            <div className="text-2xl font-bold text-emerald-500">
                              {currencySymbol}{(parseFloat(data.monthlyRevenue) - (parseFloat(data.monthlyExpenses) || 0)).toFixed(2)}
                            </div>
                          </div>
                          <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                            <h4 className="text-gray-400 text-sm mb-2">Annual Profit</h4>
                            <div className="text-2xl font-bold text-blue-500">
                              {currencySymbol}{((parseFloat(data.monthlyRevenue) - (parseFloat(data.monthlyExpenses) || 0)) * 12).toFixed(2)}
                            </div>
                          </div>
                          <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                            <h4 className="text-gray-400 text-sm mb-2">Profit Margin</h4>
                            <div className="text-2xl font-bold text-purple-500">
                              {data.monthlyRevenue ? ((1 - (parseFloat(data.monthlyExpenses) || 0) / parseFloat(data.monthlyRevenue)) * 100).toFixed(1) : 0}%
                            </div>
                          </div>
                        </>
                      )}

                      {selectedIncomeSource === 'bigBusiness' && data.annualRevenue && (
                        <>
                          <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                            <h4 className="text-gray-400 text-sm mb-2">Annual Revenue</h4>
                            <div className="text-2xl font-bold text-emerald-500">
                              {currencySymbol}{parseFloat(data.annualRevenue).toFixed(2)}
                            </div>
                          </div>
                          <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                            <h4 className="text-gray-400 text-sm mb-2">Monthly Average</h4>
                            <div className="text-2xl font-bold text-blue-500">
                              {currencySymbol}{(parseFloat(data.annualRevenue) / 12).toFixed(2)}
                            </div>
                          </div>
                          <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                            <h4 className="text-gray-400 text-sm mb-2">Team Size</h4>
                            <div className="text-2xl font-bold text-purple-500">{data.employees || 0} employees</div>
                          </div>
                        </>
                      )}

                      {selectedIncomeSource === 'salary' && data.monthlySalary && (
                        <>
                          <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                            <h4 className="text-gray-400 text-sm mb-2">Monthly Total Income</h4>
                            <div className="text-2xl font-bold text-emerald-500">
                              {currencySymbol}{(parseFloat(data.monthlySalary) + (parseFloat(data.benefits) || 0)).toFixed(2)}
                            </div>
                          </div>
                          <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                            <h4 className="text-gray-400 text-sm mb-2">Annual Income</h4>
                            <div className="text-2xl font-bold text-blue-500">
                              {currencySymbol}{((parseFloat(data.monthlySalary) + (parseFloat(data.benefits) || 0)) * 12).toFixed(2)}
                            </div>
                          </div>
                          <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                            <h4 className="text-gray-400 text-sm mb-2">Base Salary</h4>
                            <div className="text-2xl font-bold text-purple-500">
                              {currencySymbol}{parseFloat(data.monthlySalary).toFixed(2)}/mo
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* ========== SETTINGS PAGE ========== */}
          {currentPage === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Settings</h2>

              <div className={`${cardBg} p-8 rounded-xl border ${borderColor}`}>
                <h3 className="text-2xl font-bold mb-6">Account Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <div className={`px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}>
                      {currentUser?.username}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <div className={`px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor}`}>
                      {currentUser?.email}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${cardBg} p-8 rounded-xl border ${borderColor}`}>
                <h3 className="text-2xl font-bold mb-6">Income Sources</h3>
                <p className="text-gray-400 mb-6">Manage your income sources. Click to add or remove.</p>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {incomeSourceOptions.map((source) => {
                    const Icon = source.icon;
                    const isSelected = selectedIncomeSources.includes(source.id);
                    return (
                      <button
                        key={source.id}
                        onClick={() => toggleIncomeSource(source.id)}
                        className={`p-6 rounded-xl border-2 transition ${
                          isSelected 
                            ? `border-${source.color}-500 bg-${source.color}-500/10` 
                            : `${borderColor} hover:border-${source.color}-500/30`
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-12 h-12 bg-gradient-to-br ${source.gradient} rounded-xl flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          {isSelected ? (
                            <CheckSquare className={`w-6 h-6 text-${source.color}-500`} />
                          ) : (
                            <Square className="w-6 h-6 text-gray-600" />
                          )}
                        </div>
                        <div className="font-bold text-left">{source.label}</div>
                      </button>
                    );
                  })}
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
                      onChange={(e) => setCurrency(e.target.value)}
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
                <h3 className="text-2xl font-bold mb-4 text-red-500">Danger Zone</h3>
                <p className="text-gray-400 mb-6">Once you sign out, you'll need to sign in again to access your data.</p>
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
