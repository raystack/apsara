import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const revalidate = false;

export async function GET() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const filePath = path.resolve(__dirname, 'tokens.md');
  const content = await fs.readFile(filePath, 'utf-8');

  return new Response(content, {
    headers: { 'Content-Type': 'text/markdown' }
  });
}
