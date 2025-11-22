#!/bin/bash

echo "🚀 Finance Manager - Quick Deployment Script"
echo "============================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Please run this script from the finance-app directory"
    exit 1
fi

echo "📦 Step 1: Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Installation failed"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

echo "🏗️  Step 2: Building production version..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"
echo ""

echo "📝 Step 3: Git operations..."
git add .
git status

echo ""
echo "Do you want to commit and push? (y/n)"
read answer

if [ "$answer" = "y" ]; then
    echo "Enter commit message:"
    read commit_message
    
    git commit -m "$commit_message"
    git push origin main
    
    echo "✅ Pushed to GitHub"
    echo ""
    echo "🌐 Netlify will automatically rebuild your site"
    echo "Check your Netlify dashboard for deployment status"
else
    echo "Skipping git operations"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Wait for Netlify to rebuild (if you pushed)"
echo "2. Visit your Netlify URL to see the deployed site"
echo "3. If issues persist, check DEPLOYMENT.md for troubleshooting"
