#!/usr/bin/env python3
"""
Script to update App.jsx with all frontend changes
"""

import re
from datetime import datetime

# Read the current App.jsx
with open('/Users/ryan/Documents/finance-app/src/App.jsx', 'r') as f:
    content = f.read()

# Create backup
backup_name = f'/Users/ryan/Documents/finance-app/src/App-backup-{datetime.now().strftime("%Y%m%d-%H%M%S")}.jsx'
with open(backup_name, 'w') as f:
    f.write(content)
print(f"✅ Backup created: {backup_name}")

# Change 1: Add currency converter import
old_import = "} from './firebaseHelpers';"
new_import = """} from './firebaseHelpers';

// Import Currency Converter
import { 
  convertCurrency, 
  convertAllTransactions, 
  convertAllInvestments,
  getConversionRate 
} from './currencyConverter';"""

content = content.replace(old_import, new_import, 1)
print("✅ Added currency converter import")

# Change 2: Add previousCurrency state
old_currency_state = "const [currency, setCurrency] = useState('USD');"
new_currency_state = """const [currency, setCurrency] = useState('USD');
  const [previousCurrency, setPreviousCurrency] = useState('USD');"""

content = content.replace(old_currency_state, new_currency_state, 1)
print("✅ Added previousCurrency state")

# Change 3: Replace DollarSign icons with cash emoji
content = content.replace(
    '<DollarSign className="w-8 h-8 text-emerald-500" />',
    '<span className="text-4xl">💰</span>'
)
print("✅ Changed logo to 💰 emoji")

# Change 4: Update contact email
content = content.replace(
    'support@financeflow.com',
    'ryanssareen@gmail.com'
)
print("✅ Updated contact email")

# Change 5: Update phone number  
content = content.replace(
    '+1 (555) 123-4567',
    '+91 7428769797'
)
print("✅ Updated phone number")

# Change 6: Update address
content = content.replace(
    '123 Finance Street, NY 10001',
    'India'
)
print("✅ Updated location")

# Save the updated file
with open('/Users/ryan/Documents/finance-app/src/App.jsx', 'w') as f:
    f.write(content)

print("\n🎉 All basic changes applied!")
print("\n⚠️  Still need to manually add:")
print("1. Charts to dashboard (complex JSX)")
print("2. Currency conversion handler in Settings")
print("3. Updated landing page features")
print("\nThese require more complex replacements. Creating detailed instructions...")
