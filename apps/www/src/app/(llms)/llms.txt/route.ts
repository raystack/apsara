import { docs } from '@/lib/source';

// cached forever
export const revalidate = false;

export async function GET() {
  const scanned: string[] = [];
  scanned.push('# Apsara Design System Documentation for LLMs');
  const map = new Map<string, string[]>();

  for (const page of docs.getPages()) {
    const dir = page.slugs[0] ?? 'root';
    const list = map.get(dir) ?? [];
    list.push(`- [${page.data.title}](${page.url}): ${page.data.description}`);
    map.set(dir, list);
  }

  for (const [key, value] of map) {
    scanned.push(`## ${key}`);
    scanned.push(value.join('\n'));
  }

  return new Response(scanned.join('\n\n'));
}
