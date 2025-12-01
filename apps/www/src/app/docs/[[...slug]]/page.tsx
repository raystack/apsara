import DocsNavbar from '@/components/docs/navbar';
import { mdxComponents } from '@/components/mdx';
import TableOfContents from '@/components/toc/toc';
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

  console.log('page', page);

  return (
    <Flex
      direction='column'
      justify='center'
      align='center'
      className={styles.container}
      data-article-content
    >
      <DocsNavbar
        url={page.url}
        title={page.data.title}
        pageTree={docs.pageTree}
        source={page.data.source}
      />
      <Flex width='full'>
        <Flex direction='column' align='center' justify='center' width='full'>
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
        <aside
          style={{
            width: '300px',
            height: 'calc(100vh - 50px)',
            position: 'sticky',
            top: '50.5px',
            padding: '40px 0'
          }}
        >
          <TableOfContents headings={page.data.toc} />
        </aside>
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
