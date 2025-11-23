  // LANDING PAGE
  if (appPage === 'landing') {
    return (
      <div className={`min-h-screen ${bgColor} ${textColor}`}>
        <nav className={`${cardBg} border-b ${borderColor} sticky top-0 z-50 backdrop-blur-lg bg-opacity-90`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-8 h-8 text-emerald-500" />
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                  FinanceFlow
                </span>
              </div>
              <div className="hidden md:flex space-x-8">
                <button className={`${textColor} ${hoverBg} px-4 py-2 rounded-lg transition`}>Features</button>
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
              <button className={`${textColor} ${hoverBg} w-full text-left px-4 py-2 rounded-lg`}>Features</button>
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
            <button onClick={() => setAppPage('auth')} className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transition transform hover:scale-105">
              Start Free Today <ArrowRight className="inline ml-2" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {[
              { icon: Shield, title: 'Secure & Private', desc: 'Your financial data is encrypted and stored securely in the cloud' },
              { icon: TrendingUp, title: 'Smart Analytics', desc: 'Track income and expenses with detailed insights' },
              { icon: Zap, title: 'Multi-Device Sync', desc: 'Access your finances from anywhere with real-time cloud sync' }
            ].map((feature, i) => (
              <div key={i} className={`${cardBg} border ${borderColor} p-8 rounded-2xl hover:shadow-xl transition transform hover:scale-105`}>
                <feature.icon className="w-12 h-12 text-emerald-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{feature.desc}</p>
              </div>
            ))}
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
                <DollarSign className="w-8 h-8 text-emerald-500" />
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

          <div className="grid md:grid-cols-2 gap-8">
            <div className={`${cardBg} border ${borderColor} p-8 rounded-2xl`}>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="block mb-2 font-medium">Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    className={`w-full ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none`}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className={`w-full ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none`}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Subject</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    className={`w-full ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none`}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Message</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    className={`w-full ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none`}
                    rows="4"
                    required
                  />
                </div>
                <button type="submit" className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition font-semibold">
                  Send Message
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className={`${cardBg} border ${borderColor} p-6 rounded-2xl flex items-start space-x-4`}>
                <Mail className="w-6 h-6 text-emerald-500 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>support@financeflow.com</p>
                </div>
              </div>
              <div className={`${cardBg} border ${borderColor} p-6 rounded-2xl flex items-start space-x-4`}>
                <Phone className="w-6 h-6 text-emerald-500 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>+1 (555) 123-4567</p>
                </div>
              </div>
              <div className={`${cardBg} border ${borderColor} p-6 rounded-2xl flex items-start space-x-4`}>
                <MapPin className="w-6 h-6 text-emerald-500 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Address</h3>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>123 Finance Street, NY 10001</p>
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
              <DollarSign className="w-8 h-8 text-emerald-500" />
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
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: DollarSign },
              { id: 'income', label: 'Income', icon: TrendingUp },
              { id: 'expense', label: 'Expense', icon: TrendingDown },
              { id: 'investments', label: 'Investments', icon: Briefcase },
              { id: 'settings', label: 'Settings', icon: Settings }
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
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
