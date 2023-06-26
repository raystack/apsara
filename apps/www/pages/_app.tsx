import { ApsaraThemeProvider } from "@raystack/ui";
import "@raystack/ui/index.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Navbar } from "~/components/Navbar";
import "~/styles/styles.css";

const inter = Inter({
  style: ["normal"],
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApsaraThemeProvider>
      <main className={inter.className}>
        <Navbar />
        <div style={{ width: "100%" }}>
          <Component {...pageProps} />
        </div>
      </main>
    </ApsaraThemeProvider>
  );
}
