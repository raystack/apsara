import { NextProvider } from 'fumadocs-core/framework/next';
import { Geist_Mono, Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { DocsTheme } from '@/components/theme';
import '@raystack/apsara/normalize.css';
import '@raystack/apsara/style.css';
import '@/styles/base.css';
import '@/styles/typeset.css';
import '@/styles/surfaces.css';
import styles from './layout.module.css';

const inter = Inter({
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--docs-font-mono'
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang='en'
      className={`${inter.className} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel='icon' href='/assets/logo.svg' sizes='any' />
      </head>
      <body className={styles.body}>
        <NextProvider>
          <DocsTheme>{children}</DocsTheme>
        </NextProvider>
      </body>
    </html>
  );
}
