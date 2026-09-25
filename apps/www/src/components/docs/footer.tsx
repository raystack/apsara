import { Button, Flex, Link } from '@raystack/apsara';
import { findNeighbour } from 'fumadocs-core/page-tree';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { docs } from '@/lib/source';

type DocsFooterProps = {
  url: string;
};

export default function DocsFooter({ url }: DocsFooterProps) {
  const neighbours = findNeighbour(docs.pageTree, url);
  return (
    <Flex style={{ width: '100%' }} justify='between'>
      {neighbours.previous ? (
        <Link href={neighbours.previous.url}>
          <Button
            variant='outline'
            color='neutral'
            size='normal'
            leadingIcon={<ArrowLeft size={16} strokeWidth={1.5} />}
          >
            {neighbours.previous.name}
          </Button>
        </Link>
      ) : (
        <span />
      )}
      {neighbours.next ? (
        <Link href={neighbours.next.url}>
          <Button
            variant='outline'
            color='neutral'
            size='normal'
            trailingIcon={<ArrowRight size={16} strokeWidth={1.5} />}
          >
            {neighbours.next.name}
          </Button>
        </Link>
      ) : (
        <span />
      )}
    </Flex>
  );
}
