import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { docs } from "@/lib/source";
import Logo from "@/components/logo";
import ThemeSwitcher from "@/components/playground/theme-switcher";

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
        footer: <ThemeSwitcher />,
      }}
      // disableThemeSwitch={true}
    >
      {children}
    </DocsLayout>
  );
}
