'use client';

import { Flex, Indicator, Sidebar } from '@raystack/apsara';
import { cx } from 'class-variance-authority';
import { Item, Node, Root } from 'fumadocs-core/page-tree';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useMemo } from 'react';
import { docs } from '@/lib/source';
import { isActiveUrl } from '@/lib/utils';
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
        classNames={{
          items: styles.items,
          label: styles.label
        }}
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
        classNames={{
          items: styles.items,
          label: styles.label
        }}
      >
        {node.children.map(child => renderNode(child, pathname))}
      </Sidebar.Group>
    );
  }

  // Handle page items
  if (node.type === 'page') {
    return <SidebarItem item={node} pathname={pathname} />;
  }

  // Handle separators (if needed)
  if (node.type === 'separator') {
    return null;
  }

  return null;
}

function SidebarItem({ item, pathname }: { item: Item; pathname: string }) {
  return (
    <Sidebar.Item
      key={item?.$id}
      leadingIcon={item?.icon}
      as={<Link href={item.url} />}
      active={isActiveUrl(item.url, pathname, false)}
      classNames={{
        text: styles.itemText
      }}
    >
      <Flex align='center' gap={3}>
        {item.name as string}
        {item?.tag ? <span className={styles.indicator} /> : null}
      </Flex>
    </Sidebar.Item>
  );
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
      <Sidebar.Main className={styles.main}>
        {pageTree.children.map(item => renderNode(item, pathname))}
      </Sidebar.Main>
    </Sidebar>
  );
}
