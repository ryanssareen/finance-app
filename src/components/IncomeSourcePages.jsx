import React from 'react';
import { Home, Building, Briefcase, Building2, Wallet, TrendingUp, DollarSign, BarChart3, Calendar, Target } from 'lucide-react';

const RealEstateFlippingPage = ({ data, isDark, currencySymbol }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
          <Home className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Real Estate Flipping
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Track your property flips and profits
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Active Properties</span>
            <Home className="w-5 h-5 text-orange-600" />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {data?.properties || 0}
          </p>
        </div>

        <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Avg Profit/Flip</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {currencySymbol}{data?.avgProfit || 0}
          </p>
        </div>

        <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Annual Flips</span>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {data?.annualFlips || 0}
          </p>
        </div>
      </div>

      <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Flipping Tips & Insights
        </h3>
        <ul className="space-y-3">
          <li className={`flex items-start gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <Target className="w-5 h-5 text-orange-600 mt-0.5" />
            <span>Track renovation costs separately to calculate true ROI</span>
          </li>
          <li className={`flex items-start gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <Target className="w-5 h-5 text-orange-600 mt-0.5" />
            <span>Monitor market trends to identify optimal buying and selling times</span>
          </li>
          <li className={`flex items-start gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <Target className="w-5 h-5 text-orange-600 mt-0.5" />
            <span>Build a network of reliable contractors to reduce renovation costs</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const RealEstateRentingPage = ({ data, isDark, currencySymbol }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
          <Building className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Rental Properties
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Manage your rental income and expenses
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Properties</span>
            <Building className="w-5 h-5 text-blue-600" />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {data?.properties || 0}
          </p>
        </div>

        <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Monthly Income</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {currencySymbol}{data?.monthlyRent || 0}
          </p>
        </div>

        <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Monthly Expenses</span>
            <BarChart3 className="w-5 h-5 text-red-600" />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {currencySymbol}{data?.expenses || 0}
          </p>
        </div>
      </div>

      <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Rental Management Tips
        </h3>
        <ul className="space-y-3">
          <li className={`flex items-start gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <Target className="w-5 h-5 text-blue-600 mt-0.5" />
            <span>Keep 1-2 months rent as emergency maintenance fund</span>
          </li>
          <li className={`flex items-start gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <Target className="w-5 h-5 text-blue-600 mt-0.5" />
            <span>Screen tenants thoroughly to reduce turnover costs</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const SmallBusinessPage = ({ data, isDark, currencySymbol }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
          <Briefcase className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Small Business
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Track your business finances
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Business Name</span>
            <Briefcase className="w-5 h-5 text-purple-600" />
          </div>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {data?.businessName || 'N/A'}
          </p>
        </div>

        <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Monthly Revenue</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {currencySymbol}{data?.monthlyRevenue || 0}
          </p>
        </div>

        <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Monthly Expenses</span>
            <BarChart3 className="w-5 h-5 text-red-600" />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {currencySymbol}{data?.monthlyExpenses || 0}
          </p>
        </div>
      </div>

      <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Business Growth Tips
        </h3>
        <ul className="space-y-3">
          <li className={`flex items-start gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <Target className="w-5 h-5 text-purple-600 mt-0.5" />
            <span>Maintain detailed records for tax deductions</span>
          </li>
          <li className={`flex items-start gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <Target className="w-5 h-5 text-purple-600 mt-0.5" />
            <span>Set aside 25-30% of revenue for taxes</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const BigBusinessPage = ({ data, isDark, currencySymbol }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
