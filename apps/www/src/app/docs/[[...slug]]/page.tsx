import DocsNavbar from '@/components/docs/navbar';
import { mdxComponents } from '@/components/mdx';
import { docs } from '@/lib/source';
import { Flex, Headline, Text } from '@raystack/apsara';
import { createRelativeLink } from 'fumadocs-ui/mdx';
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
      <Flex direction='column' gap={6} className={styles.content}>
        <Flex direction='column' gap={3}>
          <Headline size='t4'>{page.data.title}</Headline>
          <Text size='regular' variant='secondary'>
            {page.data.description}
          </Text>
        </Flex>
        <Flex direction='column' className='prose'>
          <MDX
            components={{
              ...mdxComponents,
              // this allows you to link to other pages with relative file paths
              a: createRelativeLink(docs, page)
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
