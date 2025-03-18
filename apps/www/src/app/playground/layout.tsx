"use client";

import { useState, type ReactNode } from "react";
import { ThemeProvider } from "@raystack/apsara/v1";
import styles from "./layout.module.css";
import ThemeCustomizer, { ThemeOptions } from "@/components/theme-customiser";

export default function Layout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeOptions>({
    style: "modern",
    accentColor: "indigo",
    grayColor: "gray",
  });

  const handleThemeChange = (updatedTheme: ThemeOptions) => {
    setTheme(_theme => ({ ..._theme, ...updatedTheme }));
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <ThemeProvider
          key={JSON.stringify(theme)}
          accentColor={theme.accentColor}
          grayColor={theme.grayColor}
          style={theme.style}>
          {children}
        </ThemeProvider>
      </main>
      <aside className={styles.aside}>
        <ThemeCustomizer onThemeChange={handleThemeChange} theme={theme} />
      </aside>
    </div>
  );
}
