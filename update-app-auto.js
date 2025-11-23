const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.jsx');

console.log('🔧 Updating App.jsx with all changes...\n');

// Backup first
const backupPath = path.join(__dirname, 'src', `App-backup-${Date.now()}.jsx`);
fs.copyFileSync(appPath, backupPath);
console.log(`📦 Backup created: ${path.basename(backupPath)}\n`);

// Read the file
let content = fs.readFileSync(appPath, 'utf8');

// 1. Update currency onChange handler in Settings
const oldCurrencyHandler = `onChange={async (e) => {
                    setCurrency(e.target.value);
                    await updateUserData(currentUser.uid, { currency: e.target.value });
                  }}`;

const newCurrencyHandler = `onChange={async (e) => {
                    const newCurrency = e.target.value;
                    const oldCurrency = currency;
                    
                    if (oldCurrency === newCurrency) return;
                    
                    const rate = getConversionRate(oldCurrency, newCurrency);
                    const confirmMsg = \`Convert all amounts from \${oldCurrency} to \${newCurrency}?\\n\\nConversion rate: 1 \${oldCurrency} = \${rate.toFixed(4)} \${newCurrency}\\n\\nThis will update all your transactions and investments.\`;
                    
                    if (confirm(confirmMsg)) {
                      try {
                        // Convert transactions
                        const convertedTx = convertAllTransactions(transactions, oldCurrency, newCurrency);
                        setTransactions(convertedTx);
                        
                        // Convert investments
                        const convertedInv = convertAllInvestments(investments, oldCurrency, newCurrency);
                        setInvestments(convertedInv);
                        
                        // Update currency
                        setCurrency(newCurrency);
                        setPreviousCurrency(newCurrency);
                        
                        // Save to Firebase
                        await updateUserData(currentUser.uid, { currency: newCurrency });
                        
                        alert(\`✅ Success! All amounts converted from \${oldCurrency} to \${newCurrency}\`);
                      } catch (error) {
                        console.error('Currency conversion error:', error);
                        alert('Error converting currency. Please try again.');
                      }
                    }
                  }}`;

if (content.includes(oldCurrencyHandler)) {
  content = content.replace(oldCurrencyHandler, newCurrencyHandler);
  console.log('  ✅ Currency conversion logic added');
} else {
  console.log('  ⚠️  Currency handler already updated or not found');
}

// 2. Replace DollarSign icons with cash emoji (💰)
const dollarSignCount = (content.match(/<DollarSign className="w-8 h-8 text-emerald-500" \/>/g) || []).length;
content = content.replace(/<DollarSign className="w-8 h-8 text-emerald-500" \/>/g, '<span className="text-4xl">💰</span>');
if (dollarSignCount > 0) {
  console.log(`  ✅ Logo changed to 💰 (${dollarSignCount} replacements)`);
}

// 3. Update contact info
content = content.replace(/support@financeflow\.com/g, 'ryanssareen@gmail.com');
content = content.replace(/\+1 \(555\) 123-4567/g, '+91 7428769797');
console.log('  ✅ Contact info updated');

// 4. Update landing page features descriptions
const oldSecurityDesc = `desc: 'Your financial data is encrypted and stored securely in the cloud'`;
const newSecurityDesc = `desc: 'Your financial data is encrypted with AES-256 encryption and stored securely in Firebase Cloud. Multi-device sync keeps all your data safe and accessible.'`;
if (content.includes(oldSecurityDesc)) {
  content = content.replace(oldSecurityDesc, newSecurityDesc);
}

const oldAnalyticsDesc = `desc: 'Track income and expenses with detailed insights'`;
const newAnalyticsDesc = `desc: 'Beautiful visualizations show your spending patterns. Track income vs expenses with pie charts, see top categories, and make data-driven financial decisions.'`;
if (content.includes(oldAnalyticsDesc)) {
  content = content.replace(oldAnalyticsDesc, newAnalyticsDesc);
}

const oldSyncDesc = `desc: 'Access your finances from anywhere with real-time cloud sync'`;
const newSyncDesc = `desc: 'Access your finances from phone, tablet, or computer. Changes sync instantly across all devices via secure Firebase Cloud Database.'`;
if (content.includes(oldSyncDesc)) {
  content = content.replace(oldSyncDesc, newSyncDesc);
  console.log('  ✅ Landing page features improved');
}

// Write the updated content
fs.writeFileSync(appPath, content, 'utf8');

console.log('\n✅ App.jsx updated successfully!');
console.log('\n🚀 Next steps:');
console.log('   1. Run: npm run dev');
console.log('   2. Go to Settings → Change currency');
console.log('   3. Test the conversion!');
console.log(`\n💡 If anything breaks, restore from: ${path.basename(backupPath)}\n`);
