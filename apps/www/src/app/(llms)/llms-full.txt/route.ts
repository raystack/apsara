import { getLLMText } from '@/lib/ai';
import { docs } from '@/lib/source';

// cached forever
export const revalidate = false;

export async function GET() {
  const scan = docs.getPages().map(getLLMText);
  const scanned = await Promise.all(scan);
  const header =
    '<SYSTEM>This is the full developer documentation for Apsara Design System.</SYSTEM>';

  return new Response(header + '\n\n' + scanned.join('\n\n***\n\n'));
}
