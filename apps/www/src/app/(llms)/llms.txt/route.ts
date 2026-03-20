import { docs } from '@/lib/source';

// cached forever
export const revalidate = false;

export async function GET() {
  const scanned: string[] = [];
  scanned.push('# Apsara Design System Documentation for LLMs');
  scanned.push('## tokens');
  scanned.push(
    [
      '- [Color Tokens](/tokens/colors.mdx): CSS variables for foreground, background, border, and overlay colors',
      '- [Spacing Tokens](/tokens/spacing.mdx): CSS variables for spacing scale',
      '- [Typography Tokens](/tokens/typography.mdx): CSS variables for fonts, sizes, line heights, and letter spacing',
      '- [Effects Tokens](/tokens/effects.mdx): CSS variables for shadows and blurs',
      '- [Radius Tokens](/tokens/radius.mdx): CSS variables for border radius'
    ].join('\n')
  );
  const map = new Map<string, string[]>();

  for (const page of docs.getPages()) {
    const dir = page.slugs[0] ?? 'root';
    const list = map.get(dir) ?? [];
    list.push(
      `- [${page.data.title}](${page.url}.mdx): ${page.data.description}`
    );
    map.set(dir, list);
  }

  for (const [key, value] of map) {
    scanned.push(`## ${key}`);
    scanned.push(value.join('\n'));
  }

  return new Response(scanned.join('\n\n'), {
    headers: { 'Content-Type': 'text/markdown' }
  });
}
