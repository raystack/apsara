const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(__dirname, '..', 'figma.config.json');

// Check if figma.config.json contains figma.com links
function checkFigmaConfig() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      console.log('✅ figma.config.json not found, skipping check');
      return;
    }

    const configContent = fs.readFileSync(CONFIG_FILE, 'utf8');
    const config = JSON.parse(configContent);

    // Check documentUrlSubstitutions for figma.com links
    const substitutions = config.codeConnect?.documentUrlSubstitutions || {};
    const figmaLinks = [];

    for (const [key, value] of Object.entries(substitutions)) {
      if (value.includes('figma.com')) {
        figmaLinks.push(`${key}: ${value}`);
      }
    }

    if (figmaLinks.length > 0) {
      console.error('❌ Error: figma.config.json contains figma.com links:');
      figmaLinks.forEach(link => console.error(`  ${link}`));
      console.error('\nPlease remove the file url from the figma.config.json');
      process.exit(1);
    }

    console.log('✅ figma.config.json validation passed');
  } catch (error) {
    console.error('❌ Error checking figma config:', error.message);
    process.exit(1);
  }
}

checkFigmaConfig();
