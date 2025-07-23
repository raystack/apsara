import { promises as fs } from 'fs';
import path from 'path';
import { docs } from '@/lib/source';
import type { InferPageType } from 'fumadocs-core/source';
import { remarkAutoTypeTable } from 'fumadocs-typescript';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import { remarkTypeTableToMd } from './remark';

const processor = remark()
  .use(remarkMdx)
  .use(remarkGfm)
  .use(remarkAutoTypeTable)
  .use(remarkTypeTableToMd);

const REGEX = {
  FRONTMATTER: /\*{3}\n\ntitle: .*?\ndescription: .*?(?:\ntag: .*?)?\n-+\n?/,
  IMPORT: /import\s*{[^}]*}\s*from\s*["'][^"']+["'];?\n?/g,
  DEMO: /export const (\w+)\s*=\s*{[\s\S]*?code:/g,
  PLAYGROUND: /export const playground\s*=\s*{/g
};

// Inline the demo examples into the content
function inlineDemoComponents(content: string, demo: string): string {
  const demoMap: Record<string, string[]> = {};
  const formattedDemo = removePlaygroundExportBlock(demo);

  // Match each export const <name> = ...code:
  let match: RegExpExecArray | null;

  while ((match = REGEX.DEMO.exec(formattedDemo)) !== null) {
    const [_, name] = match;

    // Find the full block by slicing from the start of this match to the next export or end of string
    const startIdx = match.index;
    const endIdx = formattedDemo.indexOf('export const', startIdx + 1);
    const block = formattedDemo.slice(
      startIdx,
      endIdx === -1 ? undefined : endIdx
    );

    // Find all `code: `...`` blocks inside this export block
    const codeBlocks: string[] = [];
    const codeRegex = /code:\s*`([\s\S]*?)`/g;
    let codeMatch: RegExpExecArray | null;

    while ((codeMatch = codeRegex.exec(block)) !== null) {
      codeBlocks.push(codeMatch[1].trim());
    }

    demoMap[name] = codeBlocks;
  }

  // Replace <Demo data={xyz} /> in file1 with code block(s)
  const result = content.replace(/<Demo data={(.*?)}\s*\/>/g, (_, rawName) => {
    const name = rawName.trim();
    const blocks = demoMap[name];

    if (name === 'playground') return '';

    if (!blocks || blocks.length === 0) {
      return `<!-- Demo not found or empty: ${name} -->`;
    }

    return blocks.map(code => `\n\`\`\`tsx\n${code}\n\`\`\`\n`).join('\n');
  });

  return result;
}

// Remove the playground export block from the demo file
function removePlaygroundExportBlock(content: string): string {
  const match = REGEX.PLAYGROUND.exec(content);

  if (!match) return content; // nothing to remove

  const start = match.index;
  let i = REGEX.PLAYGROUND.lastIndex - 1; // start at opening `{`
  let braceCount = 1;

  while (i < content.length && braceCount > 0) {
    i++;
    const char = content[i];
    if (char === '{') braceCount++;
    else if (char === '}') braceCount--;
  }

  // Include trailing semicolon and possible newlines
  const end =
    content.indexOf(';', i) !== -1 ? content.indexOf(';', i) + 1 : i + 1;

  return content.slice(0, start) + content.slice(end).trimStart();
}

// Remove the frontmatter, import statements, and code blocks from the content
function formatContent(content: string) {
  // remove frontmatter values
  let processedContent = content.replace(REGEX.FRONTMATTER, '');

  // remove import statements outside of code blocks
  const parts = processedContent.split(/```/g);
  processedContent = parts
    .map((part, i) => {
      return i % 2 === 0 ? part.replace(REGEX.IMPORT, '') : part;
    })
    .join('```');

  return processedContent;
}

export async function getLLMText(page: InferPageType<typeof docs>) {
  const filePath = page.data._file.absolutePath;
  const file = await fs.readFile(filePath, 'utf-8');
  const demoPath = path.join(path.dirname(filePath), 'demo.ts');

  const demoExists = await fs
    .stat(demoPath)
    .then(() => true)
    .catch(() => false);
  const demo = demoExists ? await fs.readFile(demoPath, 'utf-8') : null;

  const processed = await processor.process({
    path: filePath,
    value: file
  });
  const content = formatContent(processed.value.toString());

  const output = demo ? inlineDemoComponents(content, demo) : content;

  return `# ${page.data.title}\nURL: ${page.url}\n> ${page.data.description}\n${output}`;
}
