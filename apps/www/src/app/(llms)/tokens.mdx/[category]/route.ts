import { promises as fs } from 'fs';
import { notFound } from 'next/navigation';
import path from 'path';

const STYLES_DIR = path.resolve(
  process.cwd(),
  '../../packages/raystack/styles'
);

export const revalidate = false;

function stripVar(value: string) {
  return value.replace(/var\((--[\w-]+)\)/g, '$1');
}

function parseCSSFile(content: string) {
  const sections: {
    selector: string;
    comment: string | null;
    tokens: { name: string; value: string }[];
  }[] = [];
  let currentSelector: string | null = null;
  let currentComment: string | null = null;
  let tokens: { name: string; value: string }[] = [];

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

function toMarkdown(
  category: string,
  sections: ReturnType<typeof parseCSSFile>
) {
  const title = category.charAt(0).toUpperCase() + category.slice(1);
  let output = `# ${title} Tokens\n`;

  for (const section of sections) {
    const prefix =
      section.selector === ':root' ? title : `${title} (${section.selector})`;
    const heading = section.comment ? `${prefix} - ${section.comment}` : prefix;

    output += `\n## ${heading}\n`;
    for (const t of section.tokens) {
      output += `${t.name}: ${t.value}\n`;
    }
  }

  return output;
}

const CATEGORIES = ['colors', 'effects', 'radius', 'spacing', 'typography'];

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;

  if (!CATEGORIES.includes(category)) notFound();

  const filePath = path.join(STYLES_DIR, `${category}.css`);
  const exists = await fs.stat(filePath).then(
    () => true,
    () => false
  );
  if (!exists) notFound();

  const content = await fs.readFile(filePath, 'utf-8');

  const sections = parseCSSFile(content);
  return new Response(toMarkdown(category, sections), {
    headers: { 'Content-Type': 'text/markdown' }
  });
}

export function generateStaticParams() {
  return CATEGORIES.map(category => ({ category }));
}
