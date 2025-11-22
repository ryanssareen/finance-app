# Finance Manager App

A comprehensive personal finance management application built with React, featuring transaction tracking, business accounting, investment calculations, and beautiful data visualizations.

## Features

- **Personal Transactions**: Track income and expenses with custom labels
- **Business Accounting**: Manage business profits and expenses with tax calculations
- **Investment Portfolio**: Calculate SIP, stocks, and fixed deposit returns with inflation adjustments
- **Beautiful Dashboard**: Interactive charts and real-time financial summaries
- **Theme Support**: Dark and light mode with persistent preferences
- **Multi-language**: Support for multiple languages
- **Local Data Storage**: All data stored securely in browser localStorage

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Locally

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## Deployment to Netlify

### Option 1: Through GitHub (Recommended)

1. **Push to GitHub**:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Connect to Netlify**:
   - Go to [Netlify](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account
   - Select your repository
   - Netlify will automatically detect the settings from `netlify.toml`
   - Click "Deploy site"

### Option 2: Manual Deploy

```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```

## Project Structure

```
finance-app/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles with Tailwind
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── netlify.toml         # Netlify deployment settings
└── README.md            # This file
```

## Technologies Used

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Data visualization library
- **Lucide React**: Icon library
- **localStorage**: Client-side data persistence

## Build Configuration

The `netlify.toml` file contains deployment settings:
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18
- SPA redirect rule configured

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers supported

## Data Storage

All financial data is stored locally in your browser using localStorage. Each user's data is isolated and persists across sessions. No server-side storage is used.

## License

MIT License - Free to use and modify
