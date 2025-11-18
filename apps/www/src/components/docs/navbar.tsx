'use client';
import { Breadcrumb, Button } from '@raystack/apsara';
import { useBreadcrumb } from 'fumadocs-core/breadcrumb';
import { Root } from 'fumadocs-core/page-tree';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import styles from './navbar.module.css';

interface DocsNavbarProps {
  url: string;
  title: string;
  pageTree: Root;
}

export default function DocsNavbar({ url, title, pageTree }: DocsNavbarProps) {
  const pathname = usePathname();
  const items = useBreadcrumb(pathname, pageTree);
  const breadcrumbItems = items.length > 0 ? items : [{ name: 'Overview' }];

  const handleCopyMarkdown = async () => {
    try {
      // Construct markdown URL - adjust based on your setup
      const markdownUrl = `/api/markdown?path=${encodeURIComponent(url)}`;
      const response = await fetch(markdownUrl);
      const text = await response.text();
      await navigator.clipboard.writeText(text);
      // TODO: Add toast notification
    } catch (error) {
      console.error('Failed to copy markdown:', error);
    }
  };

  const handleViewSource = () => {
    // Construct GitHub URL or source viewer URL
    // Adjust based on your repository structure
    const githubUrl = `https://github.com/raystack/apsara/blob/main/apps/www/src/content/docs/${url}`;
    window.open(githubUrl, '_blank');
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        {breadcrumbItems.length > 0 && (
          <Breadcrumb size='small'>
            {breadcrumbItems.map((item, index) => (
              <Fragment key={`item-${index}`}>
                <Breadcrumb.Item>{item.name}</Breadcrumb.Item>
                <Breadcrumb.Separator
                  className={styles['breadcrumb-separator']}
                />
              </Fragment>
            ))}
            <Breadcrumb.Item current>{title}</Breadcrumb.Item>
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
