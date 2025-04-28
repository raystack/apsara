const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

let version = packageJson.version;

// Check if version already has -rc
if (version.includes('-rc.')) {
  // Increment the rc number
  const [main, rc] = version.split('-rc.');
  const nextRc = parseInt(rc, 10) + 1;
  version = `${main}-rc.${nextRc}`;
} else {
  // Start rc from .0
  version = `${version}-rc.0`;
}

packageJson.version = version;

// Write back the updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

console.log(`Bumped version to ${version}`);
