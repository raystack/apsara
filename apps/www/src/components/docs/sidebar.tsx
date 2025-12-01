'use client';

import { isActiveUrl } from '@/lib/utils';
import { Flex, Sidebar } from '@raystack/apsara';
import { cx } from 'class-variance-authority';
import { Node, Root } from 'fumadocs-core/page-tree';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import Logo from '../logo';
import { ThemeToggle } from '../theme-switcher';
import DocsSearch from './search';
import styles from './sidebar.module.css';

type Props = {
  pageTree: Root;
  className?: string;
};

function renderNode(node: Node, pathname: string): ReactNode {
  // Handle folders with both children and index
  if (
    node.type === 'folder' &&
    node.index &&
    node.children &&
    node.children.length > 0
  ) {
    return (
      <Sidebar.Group
        label={node.name as string}
        key={node?.$id}
        leadingIcon={node?.icon}
      >
        {/* Render index item first */}
        {renderNode(node.index, pathname)}
        {/* Recursively render all children */}
        {node.children.map(child => renderNode(child, pathname))}
      </Sidebar.Group>
    );
  }

  // Handle folders with index but no children
  if (
    node.type === 'folder' &&
    node.index &&
    (!node.children || node.children.length === 0)
  ) {
    return renderNode(node.index, pathname);
  }

  // Handle folders normally
  if (node.type === 'folder') {
    return (
      <Sidebar.Group
        label={node.name as string}
        key={node?.$id}
        leadingIcon={node?.icon}
      >
        {node.children.map(child => renderNode(child, pathname))}
      </Sidebar.Group>
    );
  }

  // Handle page items
  if (node.type === 'page') {
    return (
      <Sidebar.Item
        key={node?.$id}
        leadingIcon={node?.icon}
        as={<Link href={node.url} />}
        active={isActiveUrl(node.url, pathname, false)}
      >
        {node.name as string}
      </Sidebar.Item>
    );
  }

  // Handle separators (if needed)
  if (node.type === 'separator') {
    return null;
  }

  return null;
}

export default function DocsSidebar({ pageTree, className }: Props) {
  const pathname = usePathname();
  return (
    <Sidebar open collapsible={false} className={cx(className, styles.sidebar)}>
      <Sidebar.Header className={styles.header}>
        <Flex align='center' gap={3} justify='between' width='full'>
          <Link href='/'>
            <Logo onlyWordmark />
          </Link>
          <Flex align='center' gap={3}>
            <DocsSearch pageTree={pageTree} />
            <ThemeToggle />
          </Flex>
        </Flex>
      </Sidebar.Header>
      <Sidebar.Main>
        {pageTree.children.map(item => renderNode(item, pathname))}
      </Sidebar.Main>
    </Sidebar>
  );
}
