/**
 * Validates `icons/icon-map.json` against the installed `lucide-react` and the
 * SVG files in `icons/assets/`. Run in CI so a change to the `lucide-react`
 * peer range cannot silently break an icon name.
 *
 * Limit of this check: it finds a name that does not exist. It cannot find a
 * name that exists but is the wrong icon — only the Figma layer name finds
 * that, and that comparison lives in `icons/icon-map.NOTES.md`.
 */

const fs = require('fs');
const path = require('path');

const ICON_FOLDER = path.join(__dirname, '..', 'icons');
const ICON_MAP = path.join(ICON_FOLDER, 'icon-map.json');
const ICON_ASSETS = path.join(ICON_FOLDER, 'assets');

const KEY_PATTERN = /^[A-Z][A-Za-z0-9]*Icon$/;

function main() {
  const map = JSON.parse(fs.readFileSync(ICON_MAP, 'utf8'));
  const lucide = require('lucide-react');
  const lucideVersion = require('lucide-react/package.json').version;

  const errors = [];
  let lucideCount = 0;
  let assetCount = 0;

  // A lucide icon is a component; the package also exports helpers and
  // aliases, so check that the export is renderable rather than merely
  // present.
  const isComponent = value =>
    typeof value === 'function' ||
    (typeof value === 'object' && value !== null);

  for (const [key, value] of Object.entries(map)) {
    if (!KEY_PATTERN.test(key)) {
      errors.push(`${key}: key must be PascalCase and end with "Icon"`);
    }

    if (typeof value === 'string') {
      lucideCount++;
      if (!isComponent(lucide[value])) {
        errors.push(
          `${key}: "${value}" is not an export of lucide-react@${lucideVersion}`
        );
      }
      // `X social` must never resolve to `X` — in lucide `X` is the close
      // cross, not the brand mark. See icon-map.NOTES.md.
      if (key === 'TwitterIcon' && value === 'X') {
        errors.push(
          'TwitterIcon: "X" is the close cross in lucide, not the brand mark'
        );
      }
      continue;
    }

    if (value && typeof value === 'object' && typeof value.asset === 'string') {
      assetCount++;
      if (!fs.existsSync(path.join(ICON_ASSETS, value.asset))) {
        errors.push(`${key}: icons/assets/${value.asset} does not exist`);
      }
      continue;
    }

    errors.push(
      `${key}: value must be a lucide export name or { "asset": "x.svg" }`
    );
  }

  // Two keys may not share one lucide name — the generator would emit two
  // modules for one icon, and `data-icon` would stop identifying the shape.
  const byLucideName = new Map();
  for (const [key, value] of Object.entries(map)) {
    if (typeof value !== 'string') continue;
    const seen = byLucideName.get(value);
    if (seen) errors.push(`${key} and ${seen} both map to "${value}"`);
    else byLucideName.set(value, key);
  }

  if (errors.length) {
    console.error(
      `icon-map.json: ${errors.length} error(s) against lucide-react@${lucideVersion}\n`
    );
    for (const error of errors) console.error(`  ${error}`);
    process.exit(1);
  }

  console.log(
    `icon-map.json is valid against lucide-react@${lucideVersion}: ` +
      `${Object.keys(map).length} keys (${lucideCount} lucide, ${assetCount} in-house SVG)`
  );
}

main();
