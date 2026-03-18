import { promises as fs } from 'fs';
import { notFound } from 'next/navigation';
import path from 'path';
import { fileURLToPath } from 'url';

const CATEGORIES = ['colors', 'effects', 'radius', 'spacing', 'typography'];

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;

  if (!CATEGORIES.includes(category)) notFound();

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const filePath = path.resolve(__dirname, `${category}.md`);
  const content = await fs.readFile(filePath, 'utf-8');

  return new Response(content, {
    headers: { 'Content-Type': 'text/markdown' }
  });
}

export function generateStaticParams() {
  return CATEGORIES.map(category => ({ category }));
}
