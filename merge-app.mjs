#!/usr/bin/env node

/**
 * Script to combine App-firebase parts into one complete App.jsx
 * Run with: node merge-app.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Start with part 1 (all imports and state)
let combined = content1;

// Add part 2 content (pages)
combined += '\n' + content2;

// Add part 3 content (remaining pages and modals)
combined += '\n' + content3;

console.log('💾 Writing combined App.jsx...');
fs.writeFileSync(output, combined, 'utf8');

console.log('\n✅ Success! App.jsx has been created!');
console.log('\n📋 Next steps:');
console.log('   1. Review src/App.jsx to make sure it looks good');
console.log('   2. Run: npm run dev');
console.log('   3. Test your app!\n');
console.log('💡 If there are any issues, your old App.jsx is backed up as App-OLD-BACKUP.jsx\n');
