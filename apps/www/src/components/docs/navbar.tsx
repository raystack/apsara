'use client';

import { Breadcrumb, Button } from '@raystack/apsara';
import { Node, Root } from 'fumadocs-core/page-tree';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import styles from './navbar.module.css';

type Props = {
  pageTree: Root;
  pageFilePath?: string;
};

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

function findPageInTree(
  tree: Root,
  pathname: string,
  path: Node[] = []
): Node[] | null {
  for (const node of tree.children) {
    const currentPath = [...path, node];

    // Check if this node matches the pathname
    if (node.type === 'page' && node.url === pathname) {
      return currentPath;
    }

    // If it's a folder, check its children
    if (node.type === 'folder' && node.children) {
      const found = findPageInTree(
        { children: node.children } as Root,
        pathname,
        currentPath
      );
      if (found) return found;
    }

    // Check if folder has an index that matches
    if (node.type === 'folder' && node.index) {
      if (node.index.url === pathname) {
        return currentPath;
      }
    }
  }

  return null;
}

function buildBreadcrumbs(
  path: Node[] | null,
  pathname: string
): BreadcrumbItem[] {
  if (!path || path.length === 0) {
    // Fallback: build from pathname segments
    const segments = pathname.replace('/docs', '').split('/').filter(Boolean);
    if (segments.length === 0) return [];

    return segments.map((segment, index) => {
      const href =
        index === segments.length - 1
          ? undefined
          : `/docs/${segments.slice(0, index + 1).join('/')}`;
      return {
        label:
          segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        href,
        current: index === segments.length - 1
      };
    });
  }

  const items: BreadcrumbItem[] = [];

  for (let i = 0; i < path.length; i++) {
    const node = path[i];
    const isLast = i === path.length - 1;

    if (node.type === 'folder') {
      // For folders, use the folder name
      // If folder has an index, use that URL, otherwise no link
      const folderUrl = node.index?.url;
      items.push({
        label: (node.name as string) || 'Untitled',
        href: isLast ? undefined : folderUrl,
        current: isLast
      });
    } else if (node.type === 'page') {
      // For pages, use the page name or title
      items.push({
        label: (node.name as string) || 'Untitled',
        href: isLast ? undefined : node.url,
        current: isLast
      });
    }
  }

  return items;
}

export default function DocsNavbar({ pageTree, pageFilePath }: Props) {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const path = findPageInTree(pageTree, pathname);
    return buildBreadcrumbs(path, pathname);
  }, [pageTree, pathname]);

  const handleCopyMarkdown = async () => {
    if (!pageFilePath) {
      console.error('Page file path not available');
      return;
    }

    try {
      // Construct markdown URL - adjust based on your setup
      const markdownUrl = `/api/markdown?path=${encodeURIComponent(pageFilePath)}`;
      const response = await fetch(markdownUrl);
      const text = await response.text();
      await navigator.clipboard.writeText(text);
      // TODO: Add toast notification
    } catch (error) {
      console.error('Failed to copy markdown:', error);
    }
  };

  const handleViewSource = () => {
    if (!pageFilePath) {
      console.error('Page file path not available');
      return;
    }

    // Construct GitHub URL or source viewer URL
    // Adjust based on your repository structure
    const githubUrl = `https://github.com/raystack/apsara/blob/main/apps/www/src/content/docs/${pageFilePath}`;
    window.open(githubUrl, '_blank');
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        {breadcrumbs.length > 0 && (
          <Breadcrumb size='small'>
            {breadcrumbs.flatMap((item, index) => {
              const elements = [];
              if (index > 0) {
                elements.push(<Breadcrumb.Separator key={`sep-${index}`} />);
              }
              elements.push(
                <Breadcrumb.Item
                  key={`item-${index}`}
                  href={item.href}
                  current={item.current}
                  as={item.href ? <Link href={item.href} /> : undefined}
                >
                  {item.label}
                </Breadcrumb.Item>
              );
              return elements;
            })}
          </Breadcrumb>
        )}
      </div>
      <div className={styles.actions}>
        <Button
          variant='outline'
          color='neutral'
          size='small'
          onClick={handleCopyMarkdown}
        >
          Copy markdown
        </Button>
        <Button
          variant='outline'
          color='neutral'
          size='small'
          onClick={handleViewSource}
        >
          View source
        </Button>
      </div>
    </header>
  );
}
