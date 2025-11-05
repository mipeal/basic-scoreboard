#!/usr/bin/env node
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get URL from command line argument
const ctfdUrl = process.argv[2];

if (!ctfdUrl) {
  console.error('Usage: node update-proxy.js <CTFD_URL>');
  process.exit(1);
}

// Update .env file
const envPath = join(__dirname, '.env');
const envContent = `# CTFd URL for proxy\nVITE_CTFD_URL=${ctfdUrl}\n`;

try {
  writeFileSync(envPath, envContent);
  console.log(`✅ Proxy target updated to: ${ctfdUrl}`);
  console.log('⚠️  Please restart your dev server for changes to take effect');
} catch (error) {
  console.error('❌ Failed to update proxy configuration:', error.message);
  process.exit(1);
}
