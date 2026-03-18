import { promises as fs } from 'fs';
import path from 'path';

// cached forever
export const revalidate = false;

export async function GET() {
  const colorsFilePath = path.resolve(
    '../../packages/raystack/styles/colors.css'
  );

  const file = await fs.readFile(colorsFilePath, 'utf-8');
  console.log('file >>', file);
  const scanned: string[] = ['#TOKENS'];
  scanned.push('## COLORS');
  scanned.push(file);
  return new Response(scanned.join('\n\n'));
}
