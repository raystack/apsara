import { ThemeProvider } from "@raystack/apsara";
import "@raystack/apsara/index.css";
import "react-loading-skeleton/dist/skeleton.css";
import type { AppProps } from "next/app";
import { Inter, Roboto_Mono } from "next/font/google";
import { Navbar } from "~/components/Navbar";
import "~/styles/styles.css";

const inter = Inter({
  style: ["normal"],
  subsets: ["latin"],
});
const roboto = Roboto_Mono({
  style: ["normal"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <main className={`${inter.className} ${roboto.variable}`}>
        <Navbar />
        <div style={{ width: "100%" }}>
          <Component {...pageProps} />
        </div>
      </main>
    </ThemeProvider>
  );
}
