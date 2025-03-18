import { type ReactNode } from "react";
import styles from "./layout.module.css";
import ThemeCustomizer from "@/components/theme-customiser";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>{children}</main>
      <aside className={styles.aside}>
        <ThemeCustomizer />
      </aside>
    </div>
  );
}
