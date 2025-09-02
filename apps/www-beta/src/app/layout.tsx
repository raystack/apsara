import Navbar from '@/components/navbar';
import '@/styles.css';
import '@raystack/apsara/normalize.css';
import '@raystack/apsara/style.css';
import { ThemeProvider } from '@raystack/apsara';
import { NextProvider } from 'fumadocs-core/framework/next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin']
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' className={inter.className} suppressHydrationWarning>
      <head>
        <link rel='icon' href='/assets/logo.svg' sizes='any' />
      </head>
      <body
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        <NextProvider>
          <ThemeProvider>
            <Navbar />
            {children}
          </ThemeProvider>
        </NextProvider>
      </body>
    </html>
  );
}
