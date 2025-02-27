import Link from "next/link";
import { Button } from "@raystack/apsara/v1";
import Logo from "@/components/logo";

export const metadata = {
  title: "My App",
};

export default function HomePage() {
  return (
    <main
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        width: "100%",
        height: "100vh",
      }}>
      <Logo variant="large" />
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "1rem",
        }}>
        Apsara
      </h1>
      <Link href="/docs">
        <Button>Checkout Docs</Button>
      </Link>
    </main>
  );
}
