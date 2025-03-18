import Logo from "@/components/logo";
import { Card } from "fumadocs-ui/components/card";
import { Notebook, Paintbrush } from "lucide-react";
import styles from "./page.module.css";

export const metadata = {
  title: "Apsara",
};

export default function HomePage() {
  return (
    <main className={styles.main}>
      <div className={styles.info}>
        <Logo variant="large" />
        <h1>
          The design system <br />
          for the next big thing
        </h1>
        <h3>
          Apsara is an elegant and beautiful re-usable React component library
          built using Radix UI.
        </h3>
      </div>
      <div className={styles.links}>
        <Card
          title="Documentation"
          description="API docs, and examples for Apsara components."
          icon={<Notebook />}
          href="/docs"
          className={styles.card}
        />
        <Card
          title="Playground"
          description="Try out Apsara components and see them in action."
          icon={<Paintbrush />}
          href="/playground"
          className={styles.card}
        />
      </div>
    </main>
  );
}
