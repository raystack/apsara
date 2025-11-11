import Demo from '@/components/demo';
import DocsNavbar from '@/components/docs/navbar';
import { docs } from '@/lib/source';
import { Flex, Headline, Text } from '@raystack/apsara';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import defaultMdxComponents, { createRelativeLink } from 'fumadocs-ui/mdx';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = docs.getPage(params.slug);
  if (!page) notFound();

  console.log('page >> ', page);

  const MDX = page.data.body;
  const pageFilePath =
    'info' in page.data && 'fullPath' in page.data.info
      ? (page.data.info.fullPath as string)
      : undefined;

  return (
    <Flex direction='column'>
      <DocsNavbar pageTree={docs.pageTree} pageFilePath={pageFilePath} />
      <Flex direction='column' gap={2} style={{ padding: 'var(--rs-space-6)' }}>
        <Headline>{page.data.title}</Headline>
        <Text>{page.data.description}</Text>
        <Flex direction='column' gap={2}>
          <MDX
            components={{
              ...defaultMdxComponents,
              // this allows you to link to other pages with relative file paths
              a: createRelativeLink(docs, page),
              TypeTable,
              Tab,
              Tabs,
              Demo
            }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}

export async function generateStaticParams() {
  return docs.generateParams();
}

export async function generateMetadata(
  props: PageProps<'/docs/[[...slug]]'>
): Promise<Metadata> {
  const params = await props.params;
  const page = docs.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description
  };
}
