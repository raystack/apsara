import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import Navbar from "@/components/navbar";
import "fumadocs-ui/style.css";
import "@raystack/apsara/style.css";
import "@/styles.css";
import { ThemeProvider } from "@/components/theme";

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assets/logo.svg" sizes="any" />
      </head>
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}>
        <RootProvider>
          <ThemeProvider>
            <Navbar />
            {children}
          </ThemeProvider>
        </RootProvider>
      </body>
    </html>
  );
}
