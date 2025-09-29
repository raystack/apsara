const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

const CONFIG_FILE = path.join(__dirname, '..', 'figma.config.json');

// Read Figma URL from environment
const figmaUrl = process.env.FIGMA_FILE_URL;

if (!figmaUrl) {
  console.error('Error: FIGMA_FILE_URL environment variable is not set');
  process.exit(1);
}

// Read current config
const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));

// Update documentUrlSubstitutions by appending figmaUrl to each value
for (const [key, value] of Object.entries(
  config.codeConnect.documentUrlSubstitutions
)) {
  if (value.startsWith('node-id='))
    config.codeConnect.documentUrlSubstitutions[key] = `${figmaUrl}?${value}`;
}

// Write updated config
fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));

console.log('Updated figma.config.json');
