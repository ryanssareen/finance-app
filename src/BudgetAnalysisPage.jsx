import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import { calculateActualSpending, analyzeBudget } from './budgetHelpers';

export const BudgetAnalysisPage = ({ 
  transactions, 
  budgetGoals, 
  setBudgetGoals,
  currencySymbol,
  theme,
  textColor,
  cardBg,
  borderColor,
  inputBg,
  hoverBg,
  t
}) => {
  const [editing, setEditing] = useState(false);
  const [tempGoals, setTempGoals] = useState(budgetGoals);
  
  const actual = calculateActualSpending(transactions);
  const analysis = analyzeBudget(actual, budgetGoals, actual.income);
  
  const handleSaveGoals = () => {
    setBudgetGoals(tempGoals);
    setEditing(false);
  };
  
  const getStatusColor = (difference) => {
    if (Math.abs(difference) < actual.income * 0.05) return 'text-green-500'; // Within 5%
    if (difference > 0) return 'text-red-500'; // Over budget
    return 'text-yellow-500'; // Under budget
  };
  
  const getStatusIcon = (difference) => {
    if (Math.abs(difference) < actual.income * 0.05) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <AlertCircle className="w-5 h-5 text-yellow-500" />;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold ${textColor}`}>{t('budgetAnalysis')}</h1>
      </div>
      
      {/* Budget Goals Setup */}
      <div className={`${cardBg} border ${borderColor} rounded-2xl p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${textColor}`}>{t('budgetGoals')}</h2>
          <button
            onClick={() => editing ? handleSaveGoals() : setEditing(true)}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition"
          >
            {editing ? t('save') : t('edit')}
          </button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className={`block mb-2 ${textColor}`}>{t('needs')} (%)</label>
            <input
              type="number"
              value={editing ? tempGoals.needs : budgetGoals.needs}
              onChange={(e) => setTempGoals({...tempGoals, needs: parseFloat(e.target.value)})}
              disabled={!editing}
              className={`w-full ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-2`}
            />
          </div>
          <div>
            <label className={`block mb-2 ${textColor}`}>{t('wants')} (%)</label>
            <input
              type="number"
              value={editing ? tempGoals.wants : budgetGoals.wants}
              onChange={(e) => setTempGoals({...tempGoals, wants: parseFloat(e.target.value)})}
              disabled={!editing}
              className={`w-full ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-2`}
            />
          </div>
          <div>
            <label className={`block mb-2 ${textColor}`}>{t('savings')} (%)</label>
            <input
              type="number"
              value={editing ? tempGoals.savings : budgetGoals.savings}
              onChange={(e) => setTempGoals({...tempGoals, savings: parseFloat(e.target.value)})}
              disabled={!editing}
              className={`w-full ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-2`}
            />
          </div>
        </div>
        
        {editing && (
          <p className="text-sm text-gray-500 mt-2">
            Total: {tempGoals.needs + tempGoals.wants + tempGoals.savings}% (should equal 100%)
          </p>
        )}
      </div>
      
      {/* Current Month Analysis */}
      <div className={`${cardBg} border ${borderColor} rounded-2xl p-6`}>
        <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Current Month Analysis</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Expected vs Actual Comparison */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${textColor}`}>Expected vs Actual</h3>
            <div className="space-y-4">
              {['needs', 'wants', 'savings'].map(category => (
                <div key={category} className={`p-4 ${inputBg} rounded-lg`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-semibold capitalize ${textColor}`}>{t(category)}</span>
                    {getStatusIcon(analysis[category].difference)}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Expected</p>
                      <p className={textColor}>{currencySymbol}{analysis[category].expected.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Actual</p>
                      <p className={textColor}>{currencySymbol}{analysis[category].actual.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className={`text-sm font-semibold ${getStatusColor(analysis[category].difference)}`}>
                      {analysis[category].difference > 0 ? '+' : ''}
                      {currencySymbol}{Math.abs(analysis[category].difference).toFixed(2)}
                      {analysis[category].difference > 0 ? ' over' : ' under'} budget
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Visual Chart */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${textColor}`}>Budget Allocation</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: t('needs'), value: analysis.needs.actual, fill: '#3b82f6' },
                    { name: t('wants'), value: analysis.wants.actual, fill: '#8b5cf6' },
                    { name: t('savings'), value: analysis.savings.actual, fill: '#10b981' }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {[0, 1, 2].map((entry, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `${currencySymbol}${value.toFixed(2)}`}
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Category Breakdown */}
      <div className={`${cardBg} border ${borderColor} rounded-2xl p-6`}>
        <h2 className={`text-xl font-bold mb-4 ${textColor}`}>{t('expenditureBreakdown')}</h2>
        {Object.keys(actual.categorySpending).length > 0 ? (
          <div className="space-y-3">
            {Object.entries(actual.categorySpending)
              .sort(([,a], [,b]) => b - a)
              .map(([category, amount]) => (
                <div key={category} className={`flex justify-between items-center p-3 ${inputBg} rounded-lg`}>
                  <span className={textColor}>{category}</span>
                  <div className="text-right">
                    <p className={`font-bold ${textColor}`}>{currencySymbol}{amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">
                      {((amount / actual.totalExpenses) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No expenses this month</p>
        )}
      </div>
    </div>
  );
};
