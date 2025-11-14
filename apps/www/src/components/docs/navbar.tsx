'use client';

import { Breadcrumb, Button } from '@raystack/apsara';
import { useMemo } from 'react';
import styles from './navbar.module.css';

interface DocsNavbarProps {
  url: string;
  title: string;
}

/**
 * Converts a slug string to a capitalized title string.
 * Example: "test-slug" -> "Test Slug"
 */
function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function buildBreadcrumbsFromUrl(url: string, pageTitle: string): string[] {
  const slugs = url
    .replace('/docs/', '')
    .split('/')
    .filter(Boolean)
    .slice(0, -1)
    .map(slug => slugToTitle(slug));

  // If no slugs, assume it's overview
  if (!slugs || slugs.length === 0) {
    slugs.push('Overview');
  }

  slugs.push(pageTitle);

  return slugs;
}

export default function DocsNavbar({ url, title }: DocsNavbarProps) {
  const breadcrumbs = useMemo(
    () => buildBreadcrumbsFromUrl(url, title),
    [url, title]
  );

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
        {breadcrumbs.length > 0 && (
          <Breadcrumb size='small'>
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <>
                  <Breadcrumb.Item key={`item-${index}`} current={isLast}>
                    {item}
                  </Breadcrumb.Item>
                  {!isLast && (
                    <Breadcrumb.Separator
                      key={`sep-${index}`}
                      className={styles['breadcrumb-separator']}
                    />
                  )}
                </>
              );
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
