# How to Run the New Revamped Version

## Option 1: Replace the current App.jsx

1. Backup your current App.jsx:
```bash
cd /Users/ryan/Documents/finance-app
cp src/App.jsx src/App-old-backup.jsx
```

2. Replace with new version:
```bash
cp src/App-revamped-v2.jsx src/App.jsx
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser to the URL shown (usually http://localhost:5173)

## Option 2: Test Side-by-Side

1. Temporarily edit `src/main.jsx` to import the new version:

Change:
```javascript
import App from './App.jsx'
```

To:
```javascript
import App from './App-revamped-v2.jsx'
```

2. Run the dev server:
```bash
npm run dev
```

## What to Test:

### Landing Page:
- ✅ Beautiful hero section with images
- ✅ Navigation menu (desktop & mobile)
- ✅ Features section
- ✅ "How It Works" section  
- ✅ Contact button → leads to contact page
- ✅ Get Started button → leads to sign up

### Contact Page:
- ✅ Contact form
- ✅ Email addresses displayed
- ✅ Business hours
- ✅ Back to home button

### Sign Up Flow:
- ✅ Create account
- ✅ Onboarding: Select income sources (can select multiple)
- ✅ Takes you to dashboard after completion

### Dashboard (WIDER!):
- ✅ Max width 1800px (much wider)
- ✅ Income/Expense/Balance stats
- ✅ Charts for visualization
- ✅ Recent transactions
- ✅ Navigation tabs for each income source

### Income Source Pages:
1. Click on any income source tab
2. Fill in the details specific to that source
3. See auto-calculated analytics

### Receipt Scanner:
1. Go to Transactions → Add Transaction
2. Click "Choose Receipt"
3. Upload any image
4. Watch it auto-fill the form!

### Transactions:
- ✅ Add income/expense
- ✅ Receipt upload with OCR
- ✅ View all transactions
- ✅ Delete transactions

### Business & Investments:
- ✅ Track business profit/expenses with tax calculations
- ✅ Add investments with return calculations
- ✅ Inflation-adjusted returns

### Settings:
- ✅ View account info
- ✅ Manage income sources
- ✅ Change theme (dark/light)
- ✅ Change currency
- ✅ Sign out

## Key Improvements:

1. **Much Wider Layout**: max-w-[1800px] instead of max-w-7xl
2. **Better Images**: Professional Unsplash photos
3. **Receipt Scanner**: Upload & auto-extract receipt data
4. **Income Source Pages**: Dedicated pages for each income type
5. **Better UX**: Smoother flows, better navigation
6. **Modern Design**: Gradients, better spacing, professional look

Enjoy your revamped finance app! 🎉
