import Logo from '@/components/logo';
import styles from './page.module.css';

export const metadata = {
  title: 'Apsara'
};

export default function HomePage() {
  return (
    <main className={styles.main}>
      <div className={styles.info}>
        <Logo variant='large' />
        <h1>
          The design system <br />
          for the next big thing
        </h1>
        <h3>
          Apsara is an elegant and beautiful re-usable React component library
          built using Radix UI.
        </h3>
      </div>
    </main>
  );
}
