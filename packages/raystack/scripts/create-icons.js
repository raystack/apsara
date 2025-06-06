const fs = require("fs/promises");
const path = require("path");

const ICON_FOLDER = path.join(__dirname, "..", "v1", "icons");
const ICON_ASSETS = path.join(ICON_FOLDER, "assets");

const FILE_INITIAL_CONTENT = `// This file is automatically generated by "npm run build:icons"
// Do not edit this file manually
`;

const getIconName = (filename) => {
  // Remove .svg extension
  const nameWithoutExt = path.basename(filename, '.svg');

  // Convert kebab-case or snake_case to camelCase
  const camelCase = nameWithoutExt
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (_, char) => char.toLowerCase());

  // Capitalize first letter and add Icon suffix
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1) + 'Icon';
};

async function createIcons() {
  try {
    const icons = await fs.readdir(ICON_ASSETS);
    const indexContent = icons.reduce((acc, icon) => {
      const iconName = getIconName(icon);
      return `${acc}\nexport { ReactComponent as ${iconName} } from "./assets/${icon}";`;
    }, FILE_INITIAL_CONTENT);
    await fs.writeFile(path.join(ICON_FOLDER, "index.tsx"), indexContent);
  } catch (error) {
    console.error("Error creating icons:", error);
  }
}

createIcons();
