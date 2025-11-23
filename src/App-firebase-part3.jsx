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
                    setCurrency(e.target.value);
                    await updateUserData(currentUser.uid, { currency: e.target.value });
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
    </div>
  );
}