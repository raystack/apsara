import { Button, CopyButton } from '@raystack/apsara';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { GitHubIcon } from '@/assets/github';
import { GITHUB_URL, INSTALL_COMMAND } from './data';
import styles from './landing.module.css';
import { VERSION } from './version';

const SPEC: Array<{ key: string; value: string }> = [
  { key: 'Built on', value: 'Base UI primitives' },
  { key: 'Runtime', value: 'React 19 · TypeScript' },
  { key: 'Styling', value: 'Plain CSS, semantic tokens, no CSS-in-JS' },
  { key: 'Theming', value: 'Light and dark, 3 accents, 3 grays, 2 radii' },
  { key: 'License', value: 'Apache 2.0' }
];

export default function LandingHero() {
  return (
    <section className={`${styles.band} ${styles.heroBand}`}>
      <div className={`${styles.col} ${styles.hero}`}>
        <div className={styles.heroCopy}>
          <p className={`${styles.label} ${styles.eyebrow}`}>
            <span className={styles.eyebrowDot} aria-hidden />
            Apsara {VERSION} · Design system by Raystack
          </p>
          <h1 className={styles.heroTitle}>
            A design system for <u>data-heavy</u> interfaces.
          </h1>
          <p className={styles.heroLede}>
            Apsara is an open-source component library built on Base UI:
            accessible by default, styled with plain CSS tokens, and made for
            the tables, forms and consoles real products are built from.
          </p>
          <div className={styles.heroActions}>
            <div className={styles.heroButtons}>
              <Link href='/docs/getting-started'>
                <Button
                  trailingIcon={<ArrowRight size={14} strokeWidth={1.5} />}
                >
                  Get started
                </Button>
              </Link>
              <Link href={GITHUB_URL} target='_blank' rel='noreferrer'>
                <Button
                  variant='outline'
                  color='neutral'
                  leadingIcon={<GitHubIcon width={14} height={14} />}
                >
                  Star on GitHub
                </Button>
              </Link>
            </div>
            <div className={styles.install}>
              <span className={styles.prompt} aria-hidden>
                $
              </span>
              <code>{INSTALL_COMMAND}</code>
              <CopyButton
                text={INSTALL_COMMAND}
                aria-label='Copy install command'
              />
            </div>
          </div>
        </div>

        <dl className={styles.spec}>
          {SPEC.map(row => (
            <div key={row.key} className={styles.specRow}>
              <dt className={styles.specKey}>{row.key}</dt>
              <dd className={styles.specVal}>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
