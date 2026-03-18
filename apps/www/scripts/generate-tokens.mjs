import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STYLES_DIR = path.resolve(__dirname, '../../../packages/raystack/styles');
const OUTPUT_DIR = path.resolve(
  __dirname,
  '../src/app/(llms)/tokens.mdx/[category]'
);

const FILES = [
  'colors.css',
  'effects.css',
  'radius.css',
  'spacing.css',
  'typography.css'
];

function stripVar(value) {
  return value.replace(/var\((--[\w-]+)\)/g, '$1');
}

function parseCSSFile(content) {
  const sections = [];
  let currentSelector = null;
  let currentComment = null;
  let tokens = [];

  for (const line of content.split('\n')) {
    const trimmed = line.trim();

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

    const commentMatch = trimmed.match(/^\/\*\s*(.+?)\s*\*\/$/);
    if (commentMatch && currentSelector) {
      if (tokens.length) {
        sections.push({
          selector: currentSelector,
          comment: currentComment,
          tokens: [...tokens]
        });
        tokens = [];
      }
      currentComment = commentMatch[1];
      if (currentComment.startsWith('Example usage:')) currentComment = null;
      continue;
    }

    const varMatch = trimmed.match(
      /^(--[\w-]+)\s*:\s*(.+?)\s*;(?:\s*\/\*\s*(.+?)\s*\*\/)?$/
    );
    if (varMatch && currentSelector) {
      tokens.push({ name: varMatch[1], value: stripVar(varMatch[2]) });
    }
  }

  return sections;
}

function buildCategory(fileName, sections) {
  const name =
    fileName.replace('.css', '').charAt(0).toUpperCase() +
    fileName.replace('.css', '').slice(1);

  const groups = new Map();

  for (const section of sections) {
    const prefix =
      section.selector === ':root' ? name : `${name} (${section.selector})`;
    const heading = section.comment ? `${prefix} - ${section.comment}` : prefix;

    const existing = groups.get(heading) || [];
    existing.push(...section.tokens);
    groups.set(heading, existing);
  }

  return groups;
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  for (const file of FILES) {
    const content = await fs.readFile(path.join(STYLES_DIR, file), 'utf-8');
    const sections = parseCSSFile(content);
    if (!sections.length) continue;

    const name = file.replace('.css', '');
    const title = name.charAt(0).toUpperCase() + name.slice(1);
    let output = `# ${title} Tokens\n`;

    const groups = buildCategory(file, sections);
    for (const [heading, tokens] of groups) {
      output += `\n## ${heading}\n`;
      for (const t of tokens) {
        output += `${t.name}: ${t.value}\n`;
      }
    }

    const outPath = path.join(OUTPUT_DIR, `${name}.md`);
    await fs.writeFile(outPath, output);
    console.log(`Generated ${outPath}`);
  }
}

main();
