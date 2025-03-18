import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { docs } from "@/lib/source";
import ThemeSwitcher from "@/components/theme-switcher";
import { ThemeProvider } from "@/components/theme";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <DocsLayout
        tree={docs.pageTree}
        nav={{ component: <></> }}
        disableThemeSwitch={true}
        sidebar={{
          collapsible: false,
          footer: <ThemeSwitcher />,
          hideSearch: true,
        }}>
        {children}
      </DocsLayout>
    </ThemeProvider>
  );
}
