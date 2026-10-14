import { Button } from '@raystack/apsara';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import AppFrame from '@/components/landing/app-frame';
import CodeSection from '@/components/landing/code-section';
import LandingFooter from '@/components/landing/footer';
import LandingHeader from '@/components/landing/header';
import LandingHero from '@/components/landing/hero';
import styles from '@/components/landing/landing.module.css';
import Specimens from '@/components/landing/specimens';
import Stats from '@/components/landing/stats';
import ThemeLab from '@/components/landing/theme-lab';

export const metadata = {
  title: 'Apsara — a design system for data-heavy React interfaces',
  description:
    'Apsara is an open-source React component library built on Base UI. Accessible, themeable, written in TypeScript, styled with plain CSS tokens.'
};

export default function HomePage() {
  return (
    <div className={styles.page}>
      <LandingHeader />

      <main>
        <LandingHero />

        {/* The drawing: a page composed from the parts catalogued below. */}
        <section className={styles.band} aria-labelledby='drawing-title'>
          <div className={`${styles.col} ${styles.drawing}`}>
            <div className={`${styles.dim} ${styles.drawingTop}`} aria-hidden>
              <span className={styles.dimTick} />
              fig. 01 — customers, composed from 14 parts
              <span className={styles.dimTick} />
            </div>
            <div className={styles.drawingCorner} aria-hidden />
            <div className={styles.paper}>
              <h2 id='drawing-title' hidden>
                Example application
              </h2>
              <AppFrame />
            </div>
            <div className={`${styles.dim} ${styles.drawingSide}`} aria-hidden>
              <span className={styles.dimTick} />
              460
              <span className={styles.dimTick} />
            </div>
          </div>
        </section>

        <section className={styles.band} aria-label='At a glance'>
          <div className={styles.col}>
            <Stats />
          </div>
        </section>

        <section className={styles.band} aria-labelledby='specimens-title'>
          <div className={styles.col}>
            <div className={styles.sectionHead}>
              <div>
                <span className={styles.label}>Specimens · 01–15</span>
                <h2 id='specimens-title' className={styles.sectionTitle}>
                  Every part, live on the sheet.
                </h2>
              </div>
              <p className={styles.sectionLede}>
                Nothing on this page is an image. Each cell is the real
                component, rendered with its defaults and wired up, so what you
                see is what you ship. Hover a cell for its documentation.
              </p>
            </div>
            <Specimens />
            <div className={styles.specimensFoot}>
              <span className={styles.label}>
                15 of 80+ shown · DataTable, Command, Sidebar, Chat and more in
                the docs
              </span>
              <Link href='/docs/components/accordion'>
                <Button
                  variant='outline'
                  color='neutral'
                  size='small'
                  trailingIcon={<ArrowRight size={12} strokeWidth={1.5} />}
                >
                  All components
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.band} aria-labelledby='lab-title'>
          <div className={styles.col}>
            <div className={styles.sectionHead}>
              <div>
                <span className={styles.label}>Theme lab</span>
                <h2 id='lab-title' className={styles.sectionTitle}>
                  Change your mind. The sheet re-inks itself.
                </h2>
              </div>
              <p className={styles.sectionLede}>
                Three accents, three grays, two radius styles and both modes,
                all from one provider. These controls are live: they retheme
                this page, hero drawing included.
              </p>
            </div>
            <ThemeLab />
          </div>
        </section>

        <section className={styles.band} aria-label='Usage'>
          <div className={styles.col}>
            <CodeSection />
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
