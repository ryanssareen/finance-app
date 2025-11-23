#!/usr/bin/env node

/**
 * Script to combine App-firebase parts into one complete App.jsx
 * Run with: node merge-app.js
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const part1 = path.join(srcDir, 'App-firebase.jsx');
const part2 = path.join(srcDir, 'App-firebase-part2.jsx');
const part3 = path.join(srcDir, 'App-firebase-part3.jsx');
const output = path.join(srcDir, 'App.jsx');
const backup = path.join(srcDir, 'App-OLD-BACKUP.jsx');

console.log('🔧 Combining Firebase App files...\n');

// Check if all parts exist
if (!fs.existsSync(part1)) {
  console.error('❌ Error: App-firebase.jsx not found');
  process.exit(1);
}
if (!fs.existsSync(part2)) {
  console.error('❌ Error: App-firebase-part2.jsx not found');
  process.exit(1);
}
if (!fs.existsSync(part3)) {
  console.error('❌ Error: App-firebase-part3.jsx not found');
  process.exit(1);
}

// Backup existing App.jsx if it exists
if (fs.existsSync(output)) {
  console.log('📦 Backing up existing App.jsx to App-OLD-BACKUP.jsx...');
  fs.copyFileSync(output, backup);
}

console.log('📝 Reading parts...');
const content1 = fs.readFileSync(part1, 'utf8');
const content2 = fs.readFileSync(part2, 'utf8');
const content3 = fs.readFileSync(part3, 'utf8');

console.log('🔨 Combining files...');

// Combine: Full part 1 + part 2 (without imports) + part 3 (without imports)
let combined = content1;

// Add part 2 content (skip any imports at the beginning)
const part2Lines = content2.split('\n');
let part2Start = 0;
for (let i = 0; i < part2Lines.length; i++) {
  if (part2Lines[i].trim().startsWith('//') && part2Lines[i].includes('LANDING PAGE')) {
    part2Start = i;
    break;
  }
}
if (part2Start > 0) {
  combined += '\n' + part2Lines.slice(part2Start).join('\n');
}

// Add part 3 content (skip any imports at the beginning)
const part3Lines = content3.split('\n');
let part3Start = 0;
for (let i = 0; i < part3Lines.length; i++) {
  if (part3Lines[i].trim().startsWith('//') || part3Lines[i].trim().startsWith('{')) {
    part3Start = i;
    break;
  }
}
if (part3Start >= 0) {
  combined += '\n' + part3Lines.slice(part3Start).join('\n');
}

console.log('💾 Writing combined App.jsx...');
fs.writeFileSync(output, combined, 'utf8');

console.log('\n✅ Success! App.jsx has been created!');
console.log('\n📋 Next steps:');
console.log('   1. Review src/App.jsx to make sure it looks good');
console.log('   2. Run: npm run dev');
console.log('   3. Test your app!\n');
console.log('💡 If there are any issues, your old App.jsx is backed up as App-OLD-BACKUP.jsx\n');
