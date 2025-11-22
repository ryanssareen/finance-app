import React from 'react';
import { ArrowRight, Shield, BarChart3, Zap, Target, TrendingUp, Users, DollarSign, CheckCircle, Star } from 'lucide-react';

export default function MarketingLanding({ onNavigate, theme }) {
  const isDark = theme === 'dark';
  
  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <nav className="flex justify-between items-center mb-20">
          <div className="flex items-center gap-2">
            <DollarSign className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>FinanceFlow</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => onNavigate('contact')}
              className={`px-6 py-2 rounded-lg transition-all ${
                isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Contact
            </button>
            <button
              onClick={() => onNavigate('auth')}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
          <div>
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Master Your
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Financial Future
              </span>
            </h1>
            <p className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-lg`}>
              Take control of your money with intelligent tracking, automated insights, and personalized strategies for every income source.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => onNavigate('auth')}
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 text-lg font-semibold"
              >
                Start Free Today
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className={`px-8 py-4 rounded-lg border-2 transition-all ${
                  isDark 
                    ? 'border-gray-600 text-white hover:border-blue-400 hover:bg-gray-800' 
                    : 'border-gray-300 text-gray-900 hover:border-blue-600 hover:bg-gray-50'
                }`}
              >
                Learn More
              </button>
            </div>
            <div className="flex flex-wrap gap-4 mt-8">
              <div className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Setup in 2 minutes</span>
              </div>
              <div className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Bank-level security</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className={`rounded-2xl overflow-hidden shadow-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <img 
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop" 
                alt="Financial Dashboard"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            {/* Floating Stats Cards */}
            <div className={`absolute -bottom-6 -left-6 p-4 rounded-xl shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monthly Savings</p>
                  <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>+32%</p>
                </div>
              </div>
            </div>
            <div className={`absolute -top-6 -right-6 p-4 rounded-xl shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Users</p>
                  <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>10K+</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Everything You Need to Succeed
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Powerful features designed for real people with real financial goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Bank-Level Security',
                description: 'Your data is encrypted and protected with industry-leading security standards',
                color: 'blue'
              },
              {
                icon: BarChart3,
                title: 'Smart Analytics',
                description: 'Get personalized insights and recommendations based on your spending patterns',
                color: 'purple'
              },
              {
                icon: Zap,
                title: 'Receipt Scanning',
                description: 'Upload receipts and let AI automatically categorize and track your expenses',
                color: 'yellow'
              },
              {
                icon: Target,
                title: 'Multi-Source Income',
                description: 'Track salary, business income, real estate, and investments all in one place',
                color: 'green'
              },
              {
                icon: TrendingUp,
                title: 'Growth Tracking',
                description: 'Monitor your net worth and financial growth over time with beautiful charts',
                color: 'red'
              },
              {
                icon: DollarSign,
                title: 'Tax Optimization',
                description: 'Automatically calculate and track tax obligations for your business income',
                color: 'indigo'
              }
            ].map((feature, index) => (
              <div key={index} className={`p-6 rounded-2xl transition-all hover:scale-105 ${
                isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-xl'
              }`}>
                <div className={`w-12 h-12 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Income Sources Section */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Built for Every Income Source
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Whether you're a freelancer, business owner, or investor, we've got you covered
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { label: 'Real Estate Flipping', emoji: '🏠', color: 'from-orange-500 to-red-500' },
              { label: 'Rental Properties', emoji: '🏢', color: 'from-blue-500 to-cyan-500' },
              { label: 'Small Business', emoji: '💼', color: 'from-purple-500 to-pink-500' },
              { label: 'Enterprise', emoji: '🏦', color: 'from-green-500 to-emerald-500' },
              { label: 'Salary', emoji: '💰', color: 'from-yellow-500 to-orange-500' }
            ].map((source, index) => (
              <div key={index} className={`p-6 rounded-2xl bg-gradient-to-br ${source.color} text-white text-center hover:scale-105 transition-all cursor-pointer`}>
                <div className="text-4xl mb-3">{source.emoji}</div>
                <div className="font-semibold">{source.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Loved by Thousands
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Real Estate Investor',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
                text: 'FinanceFlow helped me track my rental properties and flipping projects effortlessly. My net worth increased 40% this year!'
              },
              {
                name: 'Michael Chen',
                role: 'Small Business Owner',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
                text: 'The receipt scanning feature saves me hours every week. Tax season is no longer a nightmare!'
              },
              {
                name: 'Emily Rodriguez',
                role: 'Software Engineer',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
                text: 'Finally, a finance app that understands multiple income streams. Perfect for my freelance work and investments.'
              }
            ].map((testimonial, index) => (
              <div key={index} className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'} italic`}>
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {testimonial.name}
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className={`rounded-3xl p-12 text-center bg-gradient-to-r from-blue-600 to-purple-600`}>
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Finances?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of people who have taken control of their financial future with FinanceFlow
          </p>
          <button
            onClick={() => onNavigate('auth')}
            className="px-8 py-4 rounded-lg bg-white text-blue-600 hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl text-lg font-semibold inline-flex items-center gap-2"
          >
            Start Your Free Account
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className={`border-t ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'} py-12`}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>FinanceFlow</span>
              </div>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Empowering financial freedom through intelligent money management
              </p>
            </div>
            <div>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Product</h3>
              <ul className="space-y-2">
                <li><button onClick={() => onNavigate('auth')} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Features</button></li>
                <li><button onClick={() => onNavigate('auth')} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Pricing</button></li>
                <li><button onClick={() => onNavigate('auth')} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Security</button></li>
              </ul>
            </div>
            <div>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Company</h3>
              <ul className="space-y-2">
                <li><button onClick={() => onNavigate('contact')} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>About</button></li>
                <li><button onClick={() => onNavigate('contact')} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Contact</button></li>
              </ul>
            </div>
            <div>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Support</h3>
              <ul className="space-y-2">
                <li><button onClick={() => onNavigate('contact')} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Help Center</button></li>
                <li><button onClick={() => onNavigate('contact')} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Contact Us</button></li>
              </ul>
            </div>
          </div>
          <div className={`pt-8 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>&copy; 2024 FinanceFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
