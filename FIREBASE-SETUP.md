# 🔥 Firebase Setup Guide

## Step 1: Create Firebase Project (IN CHROME NOW!)

1. In the Firebase Console (already open in Chrome):
   - Click **"Add project"** or **"Create a project"**
   - Name: **finance-app** (or your choice)
   - Click **Continue**
   - Disable Google Analytics (optional)
   - Click **Create project**
   - Wait for setup to complete

## Step 2: Enable Authentication

1. In Firebase Console, click **"Authentication"** in left sidebar
2. Click **"Get started"**
3. Click **"Email/Password"** under Sign-in method
4. Toggle **Enable** to ON
5. Click **Save**

## Step 3: Enable Firestore Database

1. Click **"Firestore Database"** in left sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll secure it later)
4. Select your region (closest to users)
5. Click **Enable**

## Step 4: Get Firebase Config

1. Click the **Gear icon** ⚙️ next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon (</>)** 
5. Register app name: **finance-app-web**
6. Click **Register app**
7. **COPY** the firebaseConfig code that appears:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Step 5: Update src/firebase.js

1. Open: `/Users/ryan/Documents/finance-app/src/firebase.js`
2. Replace the placeholder config with YOUR config
3. Save the file

## Step 6: Enable Password Reset Emails

Firebase automatically sends password reset emails! But let's customize:

1. In Firebase Console → **Authentication**
2. Click **"Templates"** tab at top
3. Click **"Password reset"** template
4. Customize the email if you want
5. Save

## ✅ That's It!

Once you've updated `src/firebase.js` with your config, run:

```bash
cd /Users/ryan/Documents/finance-app
npm run dev
```

Firebase will now handle:
- ✅ Secure password encryption
- ✅ Multi-device login
- ✅ Password reset emails
- ✅ Cloud data sync
- ✅ User authentication

---

## 🔒 Security Rules (Do This Later)

After testing, update Firestore security rules:

1. Firestore Database → **Rules** tab
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

---

**Need help?** Let me know if you need help with any step!
