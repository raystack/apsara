import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { Button, Flex, Link } from '@raystack/apsara';
import { findNeighbour } from 'fumadocs-core/page-tree';
import { docs } from '@/lib/source';

type DocsFooterProps = {
  url: string;
};

export default function DocsFooter({ url }: DocsFooterProps) {
  const neighbours = findNeighbour(docs.pageTree, url);
  return (
    <Flex width='full' justify='between'>
      {neighbours.previous ? (
        <Link href={neighbours.previous.url}>
          <Button
            variant='outline'
            color='neutral'
            size='normal'
            leadingIcon={<ArrowLeftIcon />}
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
            trailingIcon={<ArrowRightIcon />}
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
