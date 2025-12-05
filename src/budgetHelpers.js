// Budget Analysis Helper Functions

export const getCurrentMonthRange = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    start: firstDay.toISOString().split('T')[0],
    end: lastDay.toISOString().split('T')[0]
  };
};

export const calculateActualSpending = (transactions) => {
  const { start, end } = getCurrentMonthRange();
  
  const monthTransactions = transactions.filter(t => {
    return t.date >= start && t.date <= end;
  });
  
  const income = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Categorize expenses
  const categorySpending = {};
  monthTransactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    });
  
  return {
    income,
    totalExpenses: expenses,
    categorySpending,
    monthTransactions
  };
};

export const analyzeBudget = (actual, budgetGoals, income) => {
  // Calculate expected amounts based on budget percentages
  const expectedNeeds = (income * budgetGoals.needs) / 100;
  const expectedWants = (income * budgetGoals.wants) / 100;
  const expectedSavings = (income * budgetGoals.savings) / 100;
  
  // Calculate actual spending (simplified categorization)
  // In real app, categorize transactions as needs/wants
  const actualExpenses = actual.totalExpenses;
  const actualSavings = income - actualExpenses;
  
  // For now, estimate needs/wants split (60/40 of total expenses)
  const actualNeeds = actualExpenses * 0.6;
  const actualWants = actualExpenses * 0.4;
  
  return {
    needs: {
      expected: expectedNeeds,
      actual: actualNeeds,
      difference: actualNeeds - expectedNeeds,
      percentage: (actualNeeds / income) * 100
    },
    wants: {
      expected: expectedWants,
      actual: actualWants,
      difference: actualWants - expectedWants,
      percentage: (actualWants / income) * 100
    },
    savings: {
      expected: expectedSavings,
      actual: actualSavings,
      difference: actualSavings - expectedSavings,
      percentage: (actualSavings / income) * 100
    }
  };
};

export const analyzeInvestmentDiversification = (investments) => {
  if (investments.length === 0) {
    return {
      total: 0,
      byType: {},
      diversificationScore: 0,
      recommendations: []
    };
  }
  
  const total = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const byType = {};
  
  investments.forEach(inv => {
    byType[inv.type] = (byType[inv.type] || 0) + inv.amount;
  });
  
  // Calculate diversification score (0-100)
  const types = Object.keys(byType).length;
  const idealTypes = 3; // stocks, bonds, alternative
  const diversificationScore = Math.min(100, (types / idealTypes) * 100);
  
  // Generate recommendations
  const recommendations = [];
  if (types < 2) {
    recommendations.push('Consider diversifying across multiple asset types');
  }
  if (!byType.sip && !byType.stocks) {
    recommendations.push('Consider adding equity investments for growth');
  }
  if (!byType.fd) {
    recommendations.push('Consider fixed deposits for stability');
  }
  
  return {
    total,
    byType,
    diversificationScore,
    recommendations
  };
};

export const generateInvestmentAIPrompt = (analysis, context) => {
  return `Analyze my investment portfolio:

Total Investment: ${context.currency}${analysis.total.toFixed(2)}

Current Allocation:
${Object.entries(analysis.byType).map(([type, amount]) => 
  `- ${type}: ${context.currency}${amount.toFixed(2)} (${((amount/analysis.total)*100).toFixed(1)}%)`
).join('\n')}

Diversification Score: ${analysis.diversification Score.toFixed(0)}/100

Financial Context:
- Monthly Income: ${context.currency}${context.totalIncome.toFixed(2)}
- Monthly Expenses: ${context.currency}${context.totalExpense.toFixed(2)}
- Available Balance: ${context.currency}${context.balance.toFixed(2)}

Please provide:
1. Assessment of current diversification
2. Recommended allocation percentages
3. Specific suggestions for rebalancing
4. Risk considerations`;
};
