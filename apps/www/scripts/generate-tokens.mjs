import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STYLES_DIR = path.resolve(__dirname, '../../../packages/raystack/styles');
const OUTPUT = path.resolve(
  __dirname,
  '../src/app/(llms)/tokens.mdx/tokens.md'
);

const FILES = [
  'colors.css',
  'effects.css',
  'radius.css',
  'spacing.css',
  'typography.css'
];

function parseCSSFile(content) {
  const sections = [];
  let currentSelector = null;
  let currentComment = null;
  let tokens = [];

  for (const line of content.split('\n')) {
    const trimmed = line.trim();

    // Match selector like :root, [data-theme="dark"], [data-style="modern"]
    const selectorMatch = trimmed.match(/^(:root|\[[\w-]+="[\w-]+"\])\s*\{/);
    if (selectorMatch) {
      currentSelector = selectorMatch[1];
      continue;
    }

    if (trimmed === '}') {
      if (currentSelector && tokens.length) {
        sections.push({
          selector: currentSelector,
          comment: currentComment,
          tokens: [...tokens]
        });
      }
      currentSelector = null;
      tokens = [];
      currentComment = null;
      continue;
    }

    // Match comment like /* Base Foreground Colors */
    const commentMatch = trimmed.match(/^\/\*\s*(.+?)\s*\*\/$/);
    if (commentMatch && currentSelector) {
      // Flush previous group
      if (tokens.length) {
        sections.push({
          selector: currentSelector,
          comment: currentComment,
          tokens: [...tokens]
        });
        tokens = [];
      }
      currentComment = commentMatch[1];
      // Skip "Example usage:" comments
      if (currentComment.startsWith('Example usage:')) currentComment = null;
      continue;
    }

    // Match CSS variable
    const varMatch = trimmed.match(
      /^(--[\w-]+)\s*:\s*(.+?)\s*;(?:\s*\/\*\s*(.+?)\s*\*\/)?$/
    );
    if (varMatch && currentSelector) {
      tokens.push({
        name: varMatch[1],
        value: varMatch[2],
        note: varMatch[3] || ''
      });
    }
  }

  return sections;
}

function sectionsToMarkdown(fileName, sections) {
  const name =
    fileName.replace('.css', '').charAt(0).toUpperCase() +
    fileName.replace('.css', '').slice(1);
  let md = `## ${name}\n\n`;

  let lastSelector = null;
  for (const section of sections) {
    if (section.selector !== lastSelector) {
      md += `### ${section.selector}\n\n`;
      lastSelector = section.selector;
    }
    if (section.comment) {
      md += `#### ${section.comment}\n\n`;
    }
    md += '| Token | Value |\n|-------|-------|\n';
    for (const t of section.tokens) {
      const val = t.note ? `${t.value} (${t.note})` : t.value;
      md += `| \`${t.name}\` | \`${val}\` |\n`;
    }
    md += '\n';
  }

  return md;
}

async function main() {
  let output = '# Apsara Design Tokens\n\n';
  output +=
    '> Complete list of CSS custom property tokens from @raystack/apsara.\n\n';

  for (const file of FILES) {
    const content = await fs.readFile(path.join(STYLES_DIR, file), 'utf-8');
    const sections = parseCSSFile(content);
    if (sections.length) {
      output += sectionsToMarkdown(file, sections);
    }
  }

  await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
  await fs.writeFile(OUTPUT, output);
  console.log(`Generated ${OUTPUT}`);
}

main();
