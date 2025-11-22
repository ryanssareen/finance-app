import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DollarSign, TrendingUp, Briefcase, Settings, LogOut, Plus, Moon, Sun, Globe, ArrowRight, AlertTriangle, Mail, Phone, MapPin, Upload, Camera, FileText, Home, Building, Building2, Wallet, Users, CheckSquare, Square, X, Menu, Shield, BarChart3, PieChart as PieChartIcon, Zap, Target, TrendingDown, Calculator } from 'lucide-react';

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
  { id: 'realEstateFlipping', label: 'Real Estate Flipping', icon: Home },
  { id: 'realEstateRenting', label: 'Real Estate Renting', icon: Building },
  { id: 'smallBusiness', label: 'Small Business', icon: Briefcase },
  { id: 'bigBusiness', label: 'Big Business', icon: Building2 },
  { id: 'salary', label: 'Salary/Employment', icon: Wallet }
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
        label: file.name.includes('grocery') ? 'Grocery Shopping' : 
               file.name.includes('restaurant') ? 'Restaurant' :
               file.name.includes('gas') ? 'Gas Station' :
               'Receipt Item',
        date: new Date().toISOString().split('T')[0],
        category: file.name.includes('grocery') || file.name.includes('restaurant') ? 'essential' : 'nonEssential'
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
  // LANDING PAGE
  // ============================================
  if (appPage === 'landing') {
    return (
      <div className={`min-h-screen ${bgColor} ${textColor}`}>
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <DollarSign className="w-8 h-8 text-emerald-500" />
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                  FinanceFlow
                </span>
              </div>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-6">
                <button onClick={() => setAppPage('contact')} className="text-gray-300 hover:text-white transition">
                  Contact
                </button>
                <button onClick={() => setAppPage('auth')} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold transition">
                  Get Started
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 space-y-3">
                <button 
                  onClick={() => { setAppPage('contact'); setMobileMenuOpen(false); }} 
                  className="block w-full text-left text-gray-300 hover:text-white transition py-2"
                >
                  Contact
                </button>
                <button 
                  onClick={() => { setAppPage('auth'); setMobileMenuOpen(false); }} 
                  className="block w-full px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold transition text-center"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <div className="pt-24 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Master Your Money,
                  <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent"> Amplify Your Wealth</span>
                </h1>
                <p className="text-xl text-gray-400">
                  Track all your income streams, manage expenses intelligently, and build lasting wealth with AI-powered insights.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setAppPage('auth')}
                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold text-lg transition flex items-center gap-2"
                  >
                    Start Free <ArrowRight className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setAppPage('contact')}
                    className="px-8 py-4 border border-gray-700 hover:border-gray-600 rounded-lg font-semibold text-lg transition"
                  >
                    Contact Us
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop" 
                  alt="Finance Dashboard"
                  className="rounded-2xl shadow-2xl border border-gray-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 px-6 bg-black/40">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Why FinanceFlow?</h2>
            <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
              We believe financial freedom starts with clarity. Track everything in one place with intelligent automation.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className={`${cardBg} p-8 rounded-xl border ${borderColor}`}>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Receipt Scanning</h3>
                <p className="text-gray-400">
                  Upload receipts and let AI automatically extract amounts, categories, and details. No manual entry needed.
                </p>
              </div>

              <div className={`${cardBg} p-8 rounded-xl border ${borderColor}`}>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Multi-Income Management</h3>
                <p className="text-gray-400">
                  Track salary, business revenue, real estate income, and investments separately with dedicated dashboards.
                </p>
              </div>

              <div className={`${cardBg} p-8 rounded-xl border ${borderColor}`}>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Investment Analytics</h3>
                <p className="text-gray-400">
                  Calculate real returns with inflation-adjusted projections and make smarter investment decisions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop" 
                alt="Analytics Dashboard"
                className="rounded-2xl shadow-2xl border border-gray-800"
              />
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl font-bold mb-2">Complete Financial Picture</h3>
                  <p className="text-gray-400">
                    See all your income sources, expenses, and investments in one unified dashboard with beautiful visualizations.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                    <Shield className="w-8 h-8 text-emerald-500 mb-2" />
                    <div className="text-2xl font-bold">Bank-Grade</div>
                    <div className="text-gray-400">Security</div>
                  </div>
                  
                  <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                    <Zap className="w-8 h-8 text-blue-500 mb-2" />
                    <div className="text-2xl font-bold">Real-Time</div>
                    <div className="text-gray-400">Updates</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 px-6 bg-gradient-to-r from-emerald-600 to-blue-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Take Control?</h2>
            <p className="text-xl mb-8 text-emerald-50">
              Join thousands who've transformed their financial lives with FinanceFlow
            </p>
            <button 
              onClick={() => setAppPage('auth')}
              className="px-10 py-4 bg-white text-emerald-600 hover:bg-gray-100 rounded-lg font-bold text-lg transition flex items-center gap-2 mx-auto"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-gray-800">
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
        <nav className="border-b ${borderColor} p-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setAppPage('landing')}>
              <DollarSign className="w-8 h-8 text-emerald-500" />
              <span className="text-2xl font-bold">FinanceFlow</span>
            </div>
            <button 
              onClick={() => setAppPage('landing')}
              className="text-gray-400 hover:text-white transition"
            >
              Back to Home
            </button>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Get In Touch</h1>
            <p className="text-xl text-gray-400">
              Have questions? We're here to help!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className={`${cardBg} p-8 rounded-2xl border ${borderColor}`}>
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${textColor}`}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${textColor}`}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${textColor}`}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    rows="5"
                    className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${textColor}`}
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold transition"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className={`${cardBg} p-8 rounded-2xl border ${borderColor}`}>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Email Us</h3>
                    <p className="text-gray-400 mb-2">For general inquiries:</p>
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
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Business Hours</h3>
                    <p className="text-gray-400">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-400">Saturday - Sunday: Closed</p>
                  </div>
                </div>
              </div>

              <div className={`${cardBg} p-8 rounded-2xl border ${borderColor}`}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Response Time</h3>
                    <p className="text-gray-400">We typically respond within 24 hours during business days.</p>
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
  // AUTH PAGE (Sign In / Sign Up)
  // ============================================
  if (appPage === 'auth') {
    return (
      <div className={`min-h-screen ${bgColor} ${textColor} flex items-center justify-center px-6`}>
        <div className={`${cardBg} p-10 rounded-2xl border ${borderColor} w-full max-w-md`}>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <DollarSign className="w-10 h-10 text-emerald-500" />
              <span className="text-3xl font-bold">FinanceFlow</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-400">
              {isLogin ? 'Sign in to your account' : 'Start your financial journey'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${textColor}`}
                placeholder="Enter username"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${textColor}`}
                  placeholder="Enter email"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${textColor}`}
                placeholder="Enter password"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm">
                Remember me
              </label>
            </div>

            <button
              onClick={handleAuth}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold transition"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>

            <div className="text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-emerald-500 hover:text-emerald-400 text-sm"
              >
                {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
              </button>
            </div>

            <button
              onClick={() => setAppPage('landing')}
              className="w-full py-3 border ${borderColor} hover:bg-gray-800/30 rounded-lg font-semibold transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // ONBOARDING - Income Sources Selection
  // ============================================
