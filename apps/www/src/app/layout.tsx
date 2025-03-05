import { RootProvider } from "fumadocs-ui/provider";
import "fumadocs-ui/style.css";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme";
import "@raystack/apsara/style.css";
import "@/styles.css";

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}>
        <RootProvider>
          <ThemeProvider accentColor="indigo">{children}</ThemeProvider>
        </RootProvider>
      </body>
    </html>
  );
}
