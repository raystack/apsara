import { Button } from '@raystack/apsara';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { GitHubIcon } from '@/assets/github';
import Logo from '@/components/logo';
import { ThemeToggle } from '@/components/theme-switcher';
import { GITHUB_URL, NAV_LINKS } from './data';
import styles from './landing.module.css';
import { VERSION } from './version';

export default function LandingHeader() {
  return (
    <header className={`${styles.band} ${styles.header}`}>
      <div className={`${styles.col} ${styles.headerInner}`}>
        <Link href='/' className={styles.logoLink} aria-label='Apsara home'>
          <Logo />
        </Link>
        <nav className={styles.nav} aria-label='Primary'>
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
              {link.external && <ArrowUpRight size={12} strokeWidth={1.5} />}
            </Link>
          ))}
        </nav>
        <div className={styles.headerActions}>
          <Link href={GITHUB_URL} target='_blank' rel='noreferrer'>
            <Button
              variant='outline'
              color='neutral'
              size='small'
              leadingIcon={<GitHubIcon width={12} height={12} />}
            >
              GitHub
            </Button>
          </Link>
          <ThemeToggle />
          <span className={styles.versionTag}>{VERSION}</span>
        </div>
      </div>
    </header>
  );
}
