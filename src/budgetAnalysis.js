// Budget Analysis Helper Functions

/**
 * Calculate actual spending per category for a given time period
 * @param {Array} transactions - Array of transaction objects
 * @param {string} startDate - ISO date string for period start
 * @param {string} endDate - ISO date string for period end
 * @returns {Object} Category-to-amount mapping
 */
export const calculateActualSpending = (transactions, startDate, endDate) => {
  const spending = {};
  
  transactions
    .filter(t => t.type === 'expense')
    .filter(t => {
      const txDate = new Date(t.date);
      return txDate >= new Date(startDate) && txDate <= new Date(endDate);
    })
    .forEach(t => {
      spending[t.category] = (spending[t.category] || 0) + t.amount;
    });
  
  return spending;
};

/**
 * Compare actual spending against budget goals
 * @param {Object} actualSpending - Category-to-amount mapping of actual spending
 * @param {Object} budgetGoals - Category-to-amount mapping of budget goals
 * @returns {Object} Analysis results with status for each category
 */
export const analyzeBudget = (actualSpending, budgetGoals) => {
  const analysis = {};
  
  // Analyze each budgeted category
  Object.keys(budgetGoals).forEach(category => {
    const budgeted = budgetGoals[category];
    const actual = actualSpending[category] || 0;
    const difference = budgeted - actual;
    const percentageUsed = budgeted > 0 ? (actual / budgeted) * 100 : 0;
    
    analysis[category] = {
      budgeted,
      actual,
      difference,
      percentageUsed,
      status: difference >= 0 ? 'under' : 'over'
    };
  });
  
  // Include unbudgeted categories that have spending
  Object.keys(actualSpending).forEach(category => {
    if (!budgetGoals[category]) {
      analysis[category] = {
        budgeted: 0,
        actual: actualSpending[category],
        difference: -actualSpending[category],
        percentageUsed: Infinity,
        status: 'unbudgeted'
      };
    }
  });
  
  return analysis;
};

/**
 * Get current month's date range
 * @returns {Object} Start and end dates for current month
 */
export const getCurrentMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0]
  };
};

/**
 * Analyze investment portfolio diversification
 * @param {Array} investments - Array of investment objects
 * @returns {Object} Portfolio analysis with recommendations
 */
export const analyzeInvestmentDiversification = (investments) => {
  const totalValue = investments.reduce((sum, inv) => sum + inv.amount, 0);
  
  if (totalValue === 0) {
    return {
      allocation: {},
      recommendations: ['Start investing to build wealth over time'],
      diversificationScore: 0
    };
  }
  
  // Calculate allocation by type
  const allocation = {};
  investments.forEach(inv => {
    const type = inv.type;
    allocation[type] = (allocation[type] || 0) + inv.amount;
  });
  
  // Convert to percentages
  const allocationPercentages = {};
  Object.keys(allocation).forEach(type => {
    allocationPercentages[type] = (allocation[type] / totalValue) * 100;
  });
  
  // Ideal allocation (example target)
  const idealAllocation = {
    stocks: 60,
    bonds: 30,
    cash: 10
  };
  
  // Generate recommendations
  const recommendations = [];
  const missingTypes = Object.keys(idealAllocation).filter(
    type => !allocationPercentages[type]
  );
  
  if (missingTypes.length > 0) {
    recommendations.push(
      `Consider diversifying into: ${missingTypes.join(', ')}`
    );
  }
  
  // Check for over-concentration
  Object.keys(allocationPercentages).forEach(type => {
    if (allocationPercentages[type] > 70) {
      recommendations.push(
        `${type} allocation (${allocationPercentages[type].toFixed(1)}%) is high. Consider rebalancing.`
      );
    }
  });
  
  // Calculate diversification score (0-100)
  const numTypes = Object.keys(allocationPercentages).length;
  const diversificationScore = Math.min(100, (numTypes / 5) * 100);
  
  return {
    allocation: allocationPercentages,
    totalValue,
    recommendations,
    diversificationScore
  };
};

/**
 * Generate AI prompt for personalized investment advice
 * @param {Object} portfolioAnalysis - Results from analyzeInvestmentDiversification
 * @param {Object} userContext - User's financial context
 * @returns {string} Prompt for AI model
 */
export const generateInvestmentAIPrompt = (portfolioAnalysis, userContext) => {
  const { allocation, totalValue, diversificationScore } = portfolioAnalysis;
  const { totalIncome, totalExpense, balance, currency } = userContext;
  
  return `As a financial advisor, analyze this investment portfolio and provide personalized recommendations:

Portfolio:
- Total Value: ${currency}${totalValue.toFixed(2)}
- Asset Allocation: ${JSON.stringify(allocation, null, 2)}
- Diversification Score: ${diversificationScore}/100

Financial Context:
- Monthly Income: ${currency}${totalIncome.toFixed(2)}
- Monthly Expenses: ${currency}${totalExpense.toFixed(2)}
- Available Balance: ${currency}${balance.toFixed(2)}

Please provide:
1. Assessment of current portfolio diversification
2. Specific recommendations for asset allocation adjustments
3. Suggested percentage splits (stocks/bonds/real estate/cash)
4. Risk considerations based on the financial profile
5. Action steps to improve portfolio balance

Keep advice practical and specific.`;
};
