import { ApsaraThemeProvider } from "@odpf/apsara";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import "~/styles/styles.css";

const inter = Inter({
    style: ["normal"],
    subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ApsaraThemeProvider>
            <main className={inter.className}>
                <Component {...pageProps} />
            </main>
        </ApsaraThemeProvider>
    );
}
