import { notFound } from 'next/navigation';
import { type NextRequest, NextResponse } from 'next/server';
import { getLLMText } from '@/lib/ai';
import { docs } from '@/lib/source';

// cached forever
export const revalidate = false;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params;
  const page = docs.getPage(slug);

  if (!page) notFound();

  return new NextResponse(await getLLMText(page), {
    headers: { 'Content-Type': 'text/markdown' }
  });
}

export function generateStaticParams() {
  return docs.generateParams();
}
