import AccentToggle from './accent-toggle';
import styles from './theme-switcher.module.css';
import ThemeToggle from './theme-toggle';

export default function ThemeSwitcher() {
  return (
    <div className={styles.container}>
      <ThemeToggle />
      <AccentToggle />
    </div>
  );
}
