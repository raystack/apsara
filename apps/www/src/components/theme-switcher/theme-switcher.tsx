import ThemeToggle from "./theme-toggle";
import AccentToggle from "./accent-toggle";
import styles from "./theme-switcher.module.css";

export default function ThemeSwitcher() {
  return (
    <div className={styles.container}>
      <ThemeToggle />
      <AccentToggle />
    </div>
  );
}
