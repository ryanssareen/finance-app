import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Briefcase, Settings, LogOut, Plus, Moon, Sun, ArrowRight, Mail, Phone, MapPin, Upload, FileText, Home, Building, Building2, Wallet, CheckSquare, Square, X, Menu, Shield, Zap, TrendingDown } from 'lucide-react';

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
  const [appPage, setAppPage] = useState('landing');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedIncomeSource, setSelectedIncomeSource] = useState(null);
  
  // User & Auth States
  const [currentUser, setCurrentUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Onboarding States
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
        
        const savedIncomeSources = localStorage.getItem(`incomeSources_${username}`);
        if (!savedIncomeSources || JSON.parse(savedIncomeSources).length === 0) {
          setAppPage('onboarding');
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
