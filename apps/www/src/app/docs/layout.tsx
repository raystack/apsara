import type { ReactNode } from "react";
import { DocsLayout, LinkItemType } from "fumadocs-ui/layouts/docs";
import { docs } from "@/lib/source";
import Logo from "@/components/logo";
import { Github } from "lucide-react";
import ThemeSwitcher from "@/components/theme-switcher";

const LINKS: LinkItemType[] = [
  {
    text: "Github",
    external: true,
    url: "https://github.com/raystack/apsara",
    icon: <Github />,
  },
];

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={docs.pageTree}
      links={LINKS}
      nav={{
        title: (
          <>
            <Logo />
            Apsara
          </>
        ),
      }}
      disableThemeSwitch={true}
      sidebar={{
        collapsible: false,
        footer: <ThemeSwitcher />,
      }}>
      {children}
    </DocsLayout>
  );
}
