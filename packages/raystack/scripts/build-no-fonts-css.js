/** Emits `dist/style-no-fonts.css`: `dist/style.css` minus the Google Fonts imports. */

const fs = require('node:fs');
const path = require('node:path');

const DIST = path.join(__dirname, '..', 'dist');
const SOURCE = path.join(DIST, 'style.css');
const TARGET = path.join(DIST, 'style-no-fonts.css');

/** Matches `@import url("https://fonts.googleapis.com/…");` in any quoting. */
const FONT_IMPORT =
  /@import\s+url\(\s*(['"]?)https:\/\/fonts\.googleapis\.com\/[^)'"]*\1\s*\)\s*;?/g;

function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error(
      `[style-no-fonts] ${SOURCE} not found. Run the CSS build first.`
    );
    process.exit(1);
  }

  const source = fs.readFileSync(SOURCE, 'utf8');
  const removed = (source.match(FONT_IMPORT) ?? []).length;
  if (removed === 0) {
    console.error(
      `[style-no-fonts] no Google Fonts @import found in ${SOURCE}; refusing to write an identical copy.`
    );
    process.exit(1);
  }

  fs.writeFileSync(TARGET, source.replace(FONT_IMPORT, ''), 'utf8');
  console.log(
    `[style-no-fonts] wrote ${path.relative(process.cwd(), TARGET)} (${removed} font import${removed === 1 ? '' : 's'} stripped)`
  );
}

main();
