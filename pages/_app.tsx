import type { AppProps } from "next/app";
import { ApsaraThemeProvider } from "~/components/themeprovider";
import "~/styles/styles.css";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ApsaraThemeProvider>
            <Component {...pageProps} />
        </ApsaraThemeProvider>
    );
}
