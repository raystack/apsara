import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { docs } from "@/lib/source";
import ThemeSwitcher from "@/components/theme-switcher";
import { SidebarItem } from "@/components/docs/sidebar-item";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={docs.pageTree}
      nav={{ component: <></> }}
      disableThemeSwitch={true}
      sidebar={{
        collapsible: false,
        footer: <ThemeSwitcher />,
        hideSearch: true,
        components: {
          Item: SidebarItem,
        },
      }}>
      {children}
    </DocsLayout>
  );
}
