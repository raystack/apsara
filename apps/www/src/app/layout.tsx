import { NextProvider } from 'fumadocs-core/framework/next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme';
import '@/styles.css';
import '@raystack/apsara/normalize.css';
import '@raystack/apsara/style.css';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import styles from './layout.module.css';

const inter = Inter({
  subsets: ['latin']
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' className={inter.className} suppressHydrationWarning>
      <head>
        <link rel='icon' href='/assets/logo.svg' sizes='any' />
      </head>
      <body className={styles.body}>
        <NextProvider>
          <NextThemeProvider disableTransitionOnChange>
            <ThemeProvider>{children}</ThemeProvider>
          </NextThemeProvider>
        </NextProvider>
      </body>
    </html>
  );
}
