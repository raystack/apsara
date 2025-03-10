import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { docs } from "@/lib/source";
import Logo from "@/components/logo";

function Footer() {
  return <div>asd</div>;
}
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={docs.pageTree}
      nav={{
        title: (
          <>
            <Logo />
            Apsara
          </>
        ),
      }}
      sidebar={{
        collapsible: false,
        footer: <Footer />,
      }}
      disableThemeSwitch={true}>
      {children}
    </DocsLayout>
  );
}
