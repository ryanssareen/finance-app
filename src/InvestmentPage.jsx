import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp, Briefcase, Plus, Trash2, Sparkles } from 'lucide-react';

export const InvestmentPage = ({
  investments,
  showInvestmentForm,
  setShowInvestmentForm,
  currencySymbol,
  theme,
  textColor,
  cardBg,
  borderColor,
  inputBg,
  hoverBg,
  t,
  onAIAdvice,
  analyzeInvestmentDiversification
}) => {
  const analysis = analyzeInvestmentDiversification(investments);
  
  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
  
  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold ${textColor}`}>{t('investments')}</h1>
        <div className="flex gap-2">
          <button
            onClick={onAIAdvice}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Analysis</span>
          </button>
          <button
            onClick={() => setShowInvestmentForm(true)}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Investment</span>
          </button>
        </div>
      </div>
      
      {/* Diversification Analysis */}
      <div className={`${cardBg} border ${borderColor} rounded-2xl p-6`}>
        <h2 className={`text-xl font-bold mb-4 ${textColor}`}>{t('diversificationAnalysis')}</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Score & Metrics */}
          <div>
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Diversification Score</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-bold ${getScoreColor(analysis.diversificationScore)}`}>
                  {analysis.diversificationScore.toFixed(0)}
                </span>
                <span className="text-2xl text-gray-500">/100</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full ${
                    analysis.diversificationScore >= 75 ? 'bg-green-500' :
                    analysis.diversificationScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${analysis.diversificationScore}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className={`p-4 ${inputBg} rounded-lg`}>
                <p className="text-sm text-gray-500">Total Investment</p>
                <p className={`text-2xl font-bold ${textColor}`}>
                  {currencySymbol}{analysis.total.toFixed(2)}
                </p>
              </div>
              
              <div className={`p-4 ${inputBg} rounded-lg`}>
                <p className="text-sm text-gray-500">Asset Types</p>
                <p className={`text-2xl font-bold ${textColor}`}>
                  {Object.keys(analysis.byType).length}
                </p>
              </div>
            </div>
            
            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div className={`mt-4 p-4 border-l-4 border-yellow-500 ${inputBg} rounded`}>
                <p className={`font-semibold mb-2 ${textColor}`}>Recommendations:</p>
                <ul className="space-y-1">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-gray-400">• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Allocation Chart */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${textColor}`}>{t('currentAllocation')}</h3>
            {analysis.total > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(analysis.byType).map(([type, amount]) => ({
                      name: type.toUpperCase(),
                      value: amount
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(1)}%`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {Object.keys(analysis.byType).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
            ) : (
              <p className="text-center py-20 text-gray-500">No investments yet</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Investment List */}
      <div className={`${cardBg} border ${borderColor} rounded-2xl p-6`}>
        <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Your Investments</h2>
        {investments.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No investments yet. Add your first investment to get started!</p>
        ) : (
          <div className="space-y-3">
            {investments.map(inv => (
              <div key={inv.id} className={`flex justify-between items-center p-4 ${inputBg} rounded-lg`}>
                <div>
                  <p className={`font-semibold ${textColor}`}>{inv.label}</p>
                  <p className="text-sm text-gray-500">
                    {inv.type.toUpperCase()} • {inv.duration || 'N/A'} months • {inv.returnRate || 0}% return
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${textColor}`}>
                    {currencySymbol}{inv.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {((inv.amount / analysis.total) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
