#!/bin/bash

echo "🔍 Checking if updates have been applied to App.jsx..."
echo ""

APP_FILE="/Users/ryan/Documents/finance-app/src/App.jsx"

if [ ! -f "$APP_FILE" ]; then
    echo "❌ App.jsx not found!"
    exit 1
fi

echo "✅ App.jsx found"
echo ""

# Check for currency converter import
if grep -q "from './currencyConverter'" "$APP_FILE"; then
    echo "✅ Currency converter imported"
else
    echo "❌ Currency converter NOT imported yet"
fi

# Check for previousCurrency state
if grep -q "previousCurrency" "$APP_FILE"; then
    echo "✅ Previous currency state added"
else
    echo "❌ Previous currency state NOT added yet"
fi

# Check for cash emoji
if grep -q "💰" "$APP_FILE"; then
    echo "✅ Cash emoji (💰) found"
else
    echo "❌ Cash emoji NOT added yet (still using 💵)"
fi

# Check for updated contact
if grep -q "ryanssareen@gmail.com" "$APP_FILE"; then
    echo "✅ Contact info updated"
else
    echo "❌ Contact info NOT updated yet"
fi

# Check for charts
if grep -q "Top Expense Categories" "$APP_FILE"; then
    echo "✅ Charts added to dashboard"
else
    echo "❌ Charts NOT added yet"
fi

echo ""
echo "📖 See MANUAL-UPDATE-STEPS.md for detailed instructions!"
