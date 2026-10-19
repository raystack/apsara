import Link from 'next/link';
import Logo from '@/components/logo';
import { FOOTER_LINKS } from './data';
import styles from './landing.module.css';

export default function LandingFooter() {
  return (
    <footer className={styles.band}>
      <div className={`${styles.col} ${styles.footer}`}>
        <div className={styles.headerActions}>
          <Logo />
          <span className={styles.versionTag}>Apache 2.0 · Raystack</span>
        </div>
        <nav className={styles.footerLinks} aria-label='Footer'>
          {FOOTER_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noreferrer' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
