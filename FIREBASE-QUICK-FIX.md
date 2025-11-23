# 🚨 FIREBASE SETUP - QUICK FIX

## The Problem

You're getting `auth/configuration-not-found` because **Firebase Authentication and Firestore haven't been enabled yet** in your Firebase Console.

## ✅ QUICK FIX (5 minutes)

### Step 1: Enable Authentication

1. Go to: https://console.firebase.google.com
2. Click on your project: **finance-app-c2cd5**
3. In the left sidebar, click **"Authentication"**
4. Click **"Get started"** button
5. Click on **"Email/Password"** in the sign-in providers list
6. Toggle the **first switch** to **Enabled** (Email/Password, NOT Email link)
7. Click **"Save"**

✅ You should see "Email/Password" with a green checkmark now!

---

### Step 2: Enable Firestore Database

1. Still in Firebase Console, in the left sidebar, click **"Firestore Database"**
2. Click **"Create database"** button
3. Select **"Start in test mode"** (for development)
4. Click **"Next"**
5. Choose a location (e.g., **us-central** or closest to you)
6. Click **"Enable"**
7. Wait for it to be created (takes ~30 seconds)

✅ You should now see the Firestore Database interface!

---

### Step 3: Set Firestore Security Rules

1. In Firestore, click the **"Rules"** tab at the top
2. You'll see some rules already there
3. Replace ALL the text with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```

4. Click **"Publish"**

✅ Rules are now published and will allow read/write until end of 2025!

---

## 🧪 Test Your Setup

After completing the above steps:

1. Go back to your app: http://localhost:5173
2. Try to sign up with a new account
3. It should work now! 🎉

---

## 🐛 Still Having Issues?

### Error: "auth/configuration-not-found"
- Make sure you clicked **"Get started"** in Authentication
- Make sure **Email/Password** is toggled **ON** (green switch)
- Try refreshing your Firebase Console page

### Error: "Missing or insufficient permissions"
- Go to Firestore → Rules
- Make sure you published the rules above
- The rules should end with `timestamp.date(2025, 12, 31)`

### Error: "Failed to get document"
- Make sure Firestore Database was created
- Go to Firestore → Data tab → You should see it's ready to use

---

## 📸 What Success Looks Like

After setup, you should be able to:
1. ✅ Sign up with email/password
2. ✅ See your user in Firebase Console → Authentication → Users
3. ✅ See your data in Firebase Console → Firestore → Data
4. ✅ Log out and log back in
5. ✅ Reset your password

---

## ⏱️ This Should Take 5 Minutes Max

If you follow the 3 steps above, your app will work immediately!

**Let me know when you've completed these steps and I'll help test it!**
