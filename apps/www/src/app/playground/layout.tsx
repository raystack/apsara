import { type ReactNode } from "react";
import styles from "./layout.module.css";
import ThemeCustomizer from "@/components/theme-customiser";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* <ThemeProvider
          key={JSON.stringify(theme)}
          accentColor={theme.accentColor}
          grayColor={theme.grayColor}
          style={theme.style}> */}
        {children}
        {/* </ThemeProvider> */}
      </main>
      <aside className={styles.aside}>
        <ThemeCustomizer />
      </aside>
    </div>
  );
}
