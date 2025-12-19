const { client } = require('@figma/code-connect');
const fs = require('fs');
const path = require('path');
const icons = require('@radix-ui/react-icons');

require('dotenv').config();

// Read Figma URL from environment
const figmaUrl = process.env.FIGMA_ICONS_FILE_URL;

if (!figmaUrl) {
  console.error('Error: FIGMA_ICONS_FILE_URL environment variable is not set');
  process.exit(1);
}

async function generateIcons() {
  // fetch components from a figma file. If the `node-id` query parameter is used,
  // only components within those frames will be included. This is useful if your
  // file is very large, as this will speed up the query by a lot
  let components = await client.getComponents(figmaUrl);
  // Converts icon names from e.g `icon-32-list` to `Icon32List`
  components = components
    .map(component => ({
      ...component,
      name:
        component.name
          .split(/[\s.-]/g)
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join('') + 'Icon'
    }))
    .filter(c => c.name in icons);

  const uniqueNames = new Set([...components.map(c => c.name)]);

  fs.writeFileSync(
    path.join(__dirname, '..', 'figma', 'icons.figma.tsx'),
    `\
  import figma from '@figma/code-connect'

  import {
  ${Array.from(uniqueNames)
    .map(iconName => `  ${iconName},`)
    .join('\n')}
  } from '@radix-ui/react-icons'

  ${components.map(c => `figma.connect(${c.name}, '${c.figmaUrl}')`).join('\n')}
  `
  );
}

generateIcons();
