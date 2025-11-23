import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Test Firebase setup in development
if (import.meta.env.DEV) {
  import('./testFirebase.js').then(module => {
    module.testFirebaseSetup();
  });
  
  // Load password reset tester
  import('./testPasswordReset.js');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
