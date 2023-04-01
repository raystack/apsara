import { ApsaraThemeProvider } from "@odpf/apsara";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

import { useRouter } from "next/router";
import { PrimitivePage } from "~/components/primitive-page";
import "~/styles/styles.css";

const inter = Inter({
    style: ["normal"],
    subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const isPrimitivesDocs = router.pathname.includes("/docs/primitives");

    return (
        <ApsaraThemeProvider>
            <main className={inter.className}>
                {isPrimitivesDocs ? (
                    <PrimitivePage>
                        <Component {...pageProps} />
                    </PrimitivePage>
                ) : (
                    <Component {...pageProps} />
                )}
            </main>
        </ApsaraThemeProvider>
    );
}
