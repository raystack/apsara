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

  // Emit a Code Connect batch file: every entry is published with the shared
  // icons.figma.batch.ts template (entry fields are exposed as `figma.batch`).
  const seen = new Set();
  const entries = [];
  for (const c of components) {
    if (seen.has(c.figmaUrl)) continue;
    seen.add(c.figmaUrl);
    entries.push({ url: c.figmaUrl, component: c.name });
  }

  const batch = {
    templateFile: './icons.figma.batch.ts',
    components: entries
  };

  fs.writeFileSync(
    path.join(__dirname, '..', 'figma', 'icons.figma.batch.json'),
    JSON.stringify(batch, null, 2)
  );
  console.log(`Wrote figma/icons.figma.batch.json (${entries.length} icons)`);
}

generateIcons();
