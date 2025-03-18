import Link from "next/link";
import { Button, Flex } from "@raystack/apsara/v1";
import Logo from "@/components/logo";
import { ThemeProvider } from "@/components/theme";

export const metadata = {
  title: "My App",
};

export default function HomePage() {
  return (
    <ThemeProvider>
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          gap: 32,
          width: "100%",
          height: "100vh",
        }}>
        <Logo variant="large" />
        <Flex gap="medium">
          <Link href="/docs">
            <Button>Checkout Docs</Button>
          </Link>
          <Link href="/playground">
            <Button>Playground</Button>
          </Link>
        </Flex>
      </main>
    </ThemeProvider>
  );
}
