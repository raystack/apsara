import StyleDictionary from 'style-dictionary';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runStyleDictionary() {
  const configPath = path.resolve(__dirname, './config.mjs');
  const config = await import(configPath);
  StyleDictionary.extend(config.default).buildAllPlatforms();
}

runStyleDictionary();