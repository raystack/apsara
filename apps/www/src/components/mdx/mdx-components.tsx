import { Headline, Tabs, Text } from '@raystack/apsara';
import { cx } from 'class-variance-authority';
import { Image as FrameworkImage } from 'fumadocs-core/framework';
import Link from 'fumadocs-core/link';
import type {
  AnchorHTMLAttributes,
  ComponentPropsWithoutRef,
  FC,
  HTMLAttributes,
  ImgHTMLAttributes,
  TableHTMLAttributes
} from 'react';
import Demo from '../demo';
import { TokenTable } from '../tokentable';
import { TypeTable } from '../typetable';
import { Code } from './code';
import styles from './mdx-components.module.css';
import { PreContextProvider } from './pre-context';

function Image(
  props: ImgHTMLAttributes<HTMLImageElement> & {
    sizes?: string;
  }
) {
  return (
    <FrameworkImage
      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px'
      {...props}
      src={props.src as unknown as string}
      className={props.className}
    />
  );
}

function Table(props: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className='relative overflow-auto prose-no-margin'>
      <table
        {...props}
        className={cx(styles['prose-table'], props.className)}
      />
    </div>
  );
}

const mdxComponents = {
  CodeBlockTabsTrigger: (
    props: ComponentPropsWithoutRef<typeof Tabs.Trigger>
  ) => <Tabs.Trigger {...props} />,
  CodeBlockTabs: (props: HTMLAttributes<HTMLDivElement>) => (
    <Tabs defaultValue='npm' className={props.className}>
      {props.children}
    </Tabs>
  ),
  CodeBlockTabsList: (props: HTMLAttributes<HTMLDivElement>) => (
    <Tabs.List {...props} />
  ),
  CodeBlockTab: (props: ComponentPropsWithoutRef<typeof Tabs.Content>) => (
    <Tabs.Content {...props} />
  ),
  code: Code,
  pre: (props: HTMLAttributes<HTMLPreElement>) => (
    <PreContextProvider hasPreParent>{props.children}</PreContextProvider>
  ),
  a: Link as FC<AnchorHTMLAttributes<HTMLAnchorElement>>,
  img: Image,
  h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Headline
      as='h1'
      size='t4'
      {...props}
      className={cx(styles['prose-h1'], props.className)}
    />
  ),
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Headline
      as='h2'
      size='t3'
      {...props}
      className={cx(styles['prose-h2'], props.className)}
    />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Headline
      as='h3'
      size='t2'
      {...props}
      className={cx(styles['prose-h3'], props.className)}
    />
  ),
  h4: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Headline
      as='h4'
      size='t1'
      {...props}
      className={cx(styles['prose-h4'], props.className)}
    />
  ),
  h5: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Text
      //@ts-expect-error - Text component type doesn't support h5 element
      as='h5'
      size='large'
      {...props}
      className={cx(styles['prose-h5'], props.className)}
    />
  ),
  h6: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Text
      // @ts-expect-error - Text component type doesn't support h6 element
      as='h6'
      size='regular'
      {...props}
      className={cx(styles['prose-h6'], props.className)}
    />
  ),
  table: Table,
  TypeTable: (props: ComponentPropsWithoutRef<typeof TypeTable>) => (
    <TypeTable
      {...props}
      className={cx(styles['prose-type-table'], props.className)}
    />
  ),
  TokenTable: (props: ComponentPropsWithoutRef<typeof TokenTable>) => (
    <TokenTable {...props} />
  ),
  Demo
};

// export const createRelativeLink: typeof import('./mdx.server').createRelativeLink =
//   () => {
//     throw new Error(
//       '`createRelativeLink` is only supported in Node.js environment',
//     );
//   };

export { mdxComponents };
