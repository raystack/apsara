import Demo from '@/components/demo';
import DocsNavbar from '@/components/docs/navbar';
import { defaultMdxComponents } from '@/components/mdx';
// import { TypeTable } from 'fumadocs-ui/components/type-table';
import { TypeTable } from '@/components/typetable';
import { docs } from '@/lib/source';
import { Flex, Headline, Text } from '@raystack/apsara';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { createRelativeLink } from 'fumadocs-ui/mdx';
// import defaultMdxComponents, { createRelativeLink } from 'fumadocs-ui/mdx';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import styles from './page.module.css';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = docs.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <Flex
      direction='column'
      justify='center'
      align='center'
      className={styles.container}
    >
      <DocsNavbar
        url={page.url}
        title={page.data.title}
        pageTree={docs.pageTree}
      />
      <Flex direction='column' gap={3} className={styles.content}>
        <Headline size='t4'>{page.data.title}</Headline>
        <Text size='regular' variant='secondary'>
          {page.data.description}
        </Text>
        <Flex direction='column' className={styles.prose}>
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
