'use client';
import {
  ComponentBooleanIcon,
  CopyIcon,
  GitHubLogoIcon
} from '@radix-ui/react-icons';
import { Breadcrumb, Button } from '@raystack/apsara';
import { useBreadcrumb } from 'fumadocs-core/breadcrumb';
import { Root } from 'fumadocs-core/page-tree';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useState } from 'react';
import { SourceType } from '@/lib/types';
import { useDemoContext } from '../demo/demo-context';
import styles from './navbar.module.css';

const cache = new Map<string, string>();
const GITHUB_BASE_URL = 'https://github.com/raystack/apsara/blob/main';

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
  const { setOpenPlayground, hasPlayground } = useDemoContext();

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
        {hasPlayground && (
          <Button
            variant='outline'
            color='neutral'
            size='small'
            disabled={isLoading}
            onClick={() => setOpenPlayground(true)}
            leadingIcon={
              <ComponentBooleanIcon
                height={12}
                width={12}
                className={styles.icon}
              />
            }
          >
            Playground
          </Button>
        )}
        <Button
          variant='outline'
          color='neutral'
          size='small'
          disabled={isLoading}
          onClick={handleCopyMarkdown}
          leadingIcon={
            <CopyIcon height={12} width={12} className={styles.icon} />
          }
        >
          Copy markdown
        </Button>
        {source && (
          <Link href={`${GITHUB_BASE_URL}/${source}`} target='_blank'>
            <Button
              variant='outline'
              color='neutral'
              size='small'
              leadingIcon={
                <GitHubLogoIcon
                  height={12}
                  width={12}
                  className={styles.icon}
                />
              }
            >
              View source
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
