#!/bin/bash

# Quick fix script for currency conversion and features button

APP_FILE="/Users/ryan/Documents/finance-app/src/App.jsx"

echo "🔧 Applying fixes to App.jsx..."

# Create backup
cp "$APP_FILE" "${APP_FILE}.backup"

# The file needs manual editing. Here's what to do:

cat << 'EOF'

📝 MANUAL FIXES NEEDED:

===========================================
FIX 1: Currency Conversion (Settings Page)
===========================================

1. Open App.jsx in nano or VS Code
2. Search for: "Settings PAGE" (around line 1100)
3. Find this section:

  <select
    value={currency}
    onChange={(e) => setCurrency(e.target.value)}

4. REPLACE the onChange with:

  <select
    value={currency}
    onChange={async (e) => {
      const newCurrency = e.target.value;
      const oldCurrency = currency;
      
      if (confirm(`Convert all amounts from ${oldCurrency} to ${newCurrency}?`)) {
        const convertedTx = convertAllTransactions(transactions, oldCurrency, newCurrency);
        setTransactions(convertedTx);
        
        const convertedInv = convertAllInvestments(investments, oldCurrency, newCurrency);
        setInvestments(convertedInv);
        
        setCurrency(newCurrency);
        await updateUserData(currentUser.uid, { currency: newCurrency });
        
        alert(`Converted from ${oldCurrency} to ${newCurrency}!`);
      }
    }}

===========================================
FIX 2: Features Button (Landing Page)
===========================================

1. Search for: "<button className={`${textColor} ${hoverBg} px-4 py-2 rounded-lg transition`}>Features</button>"

2. Change it to add onClick:

  <button 
    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
    className={`${textColor} ${hoverBg} px-4 py-2 rounded-lg transition`}
  >
    Features
  </button>

3. Do the same for the mobile menu Features button

===========================================

EOF

echo ""
echo "✅ Backup created: ${APP_FILE}.backup"
echo ""
echo "Do you want me to create the complete corrected file for you? (y/n)"

EOF
