'use client';
import { SourceType } from '@/lib/types';
import { Breadcrumb, Button } from '@raystack/apsara';
import { useBreadcrumb } from 'fumadocs-core/breadcrumb';
import { Root } from 'fumadocs-core/page-tree';
import { usePathname } from 'next/navigation';
import { Fragment, useState } from 'react';
import styles from './navbar.module.css';

const cache = new Map<string, string>();

interface DocsNavbarProps {
  url: string;
  title: string;
  pageTree: Root;
  source: SourceType;
}

export default function DocsNavbar({
  url,
  title,
  pageTree,
  source
}: DocsNavbarProps) {
  const pathname = usePathname();
  const items = useBreadcrumb(pathname, pageTree);
  const breadcrumbItems = items.length > 0 ? items : [{ name: 'Overview' }];

  const [isLoading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const markdownUrl = `${url}.mdx`;

  const handleCopyMarkdown = async () => {
    const cached = cache.get(markdownUrl);
    if (cached) {
      await navigator.clipboard.writeText(cached);
      setChecked(true);
      setTimeout(() => setChecked(false), 2000);
      return;
    }

    setLoading(true);

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': fetch(markdownUrl).then(async res => {
            const content = await res.text();
            cache.set(markdownUrl, content);
            return content;
          })
        })
      ]);

      setChecked(true);
      setTimeout(() => setChecked(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSource = () => {
    // Construct GitHub URL or source viewer URL
    // Adjust based on your repository structure
    if (source) window.open(source, '_blank');
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
          disabled={isLoading}
          onClick={handleCopyMarkdown}
        >
          Copy markdown
        </Button>
        {source && (
          <Button
            variant='outline'
            color='neutral'
            size='small'
            onClick={handleViewSource}
          >
            View source
          </Button>
        )}
      </div>
    </header>
  );
}
