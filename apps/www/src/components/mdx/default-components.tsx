import { Headline, Tabs } from '@raystack/apsara';
// import { Card, Cards } from '@/components/card';
// import {
//   Callout,
//   CalloutContainer,
//   CalloutDescription,
//   CalloutTitle,
// } from '@/components/callout';
// import { Heading } from '@/components/heading';
// import { cn } from '@/utils/cn';
// import {
//   CodeBlock,
//   CodeBlockTab,
//   CodeBlockTabs,
//   CodeBlockTabsList,
//   CodeBlockTabsTrigger,
//   Pre,
// } from '@/components/codeblock';
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
import { Code } from './code';
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
    <div className='relative overflow-auto prose-no-margin my-6'>
      <table {...props} />
    </div>
  );
}

const defaultMdxComponents = {
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
    <Headline as='h1' size='t1' {...props} />
  ),
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Headline as='h2' size='t3' {...props} />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Headline as='h3' size='t3' {...props} />
  ),
  h4: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Headline as='h4' size='t3' {...props} />
  ),
  h5: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Headline as='h5' size='t4' {...props} />
  ),
  h6: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Headline as='h6' size='t4' {...props} />
  ),
  table: Table
  // Callout,
  // CalloutContainer,
  // CalloutTitle,
  // CalloutDescription,
};

// export const createRelativeLink: typeof import('./mdx.server').createRelativeLink =
//   () => {
//     throw new Error(
//       '`createRelativeLink` is only supported in Node.js environment',
//     );
//   };

export { defaultMdxComponents };
