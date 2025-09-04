'use client';

import GitHubIcon from '@/assets/github';
import { Search, Text, ThemeSwitcher } from '@raystack/apsara';
import { cx } from 'class-variance-authority';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Kbd } from '../kbd';
import Logo from '../logo';
import styles from './navbar.module.css';

const LINKS = [
  {
    name: 'Documentation',
    url: '/docs'
  },
  {
    name: 'Playground',
    url: '/playground'
  },
  {
    name: 'Icons',
    url: '/icons'
  }
];
export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className={styles.navbar}>
      <div className={styles.linksContainer}>
        <Link href='/' className={styles.item}>
          <Logo monogram={false} />
        </Link>
        <div className={styles.links}>
          {LINKS.map(link => (
            <Link href={link.url} key={link.name}>
              <Text
                as='span'
                variant='secondary'
                size='small'
                weight='medium'
                className={cx(
                  styles.item,
                  pathname.startsWith(link.url) && styles.active
                )}
              >
                {link.name}
              </Text>
            </Link>
          ))}
        </div>
      </div>
      <div className={styles.actionsContainer}>
        <Search
          placeholder='Quick search'
          trailingIcon={
            <div className={styles.kbd}>
              <Kbd mode='combination'>⌘ K</Kbd>
            </div>
          }
          className={styles.search}
        />
        <div className={styles.actions}>
          <Link
            href='https://github.com/raystack/apsara'
            target='_blank'
            className={styles.item}
          >
            <GitHubIcon width={20} height={20} />
          </Link>
          {/* @ts-ignore */}
          <ThemeSwitcher size={20} className={styles.item} />
        </div>
      </div>
    </header>
  );
}
