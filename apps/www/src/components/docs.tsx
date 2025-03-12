import type { PageTree } from "fumadocs-core/server";
import { type ReactNode, type HTMLAttributes } from "react";
import Link from "next/link";
import { ChevronRight, Languages } from "lucide-react";
import { cn } from "../lib/cn";
import { buttonVariants } from "./ui/button";
import {
  CollapsibleSidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarCollapseTrigger,
  SidebarViewport,
  SidebarPageTree,
} from "./docs/sidebar";
import Sidebar from "./sidebar";
import { replaceOrDefault } from "./shared";
import { type LinkItemType, BaseLinkItem } from "./links";
import { RootToggle } from "./layout/root-toggle";
import { type BaseLayoutProps, getLinks } from "./shared";
import { LanguageToggle, LanguageToggleText } from "./layout/language-toggle";
import { Navbar, NavbarSidebarTrigger } from "./docs.client";
import { TreeContextProvider } from "fumadocs-ui/provider";
import { NavProvider, Title } from "./layout/nav";
import { ThemeToggle } from "./layout/theme-toggle";
import { LargeSearchToggle, SearchToggle } from "./layout/search-toggle";
import {
  checkPageTree,
  getSidebarTabsFromOptions,
  layoutVariables,
  SidebarLinkItem,
  type SidebarOptions,
} from "./docs/shared";
import { type PageStyles, StylesProvider } from "fumadocs-ui/provider";

export interface DocsLayoutProps extends BaseLayoutProps {
  tree: PageTree.Root;

  sidebar?: Partial<SidebarOptions>;

  containerProps?: HTMLAttributes<HTMLDivElement>;
}

export function DocsLayout({
  nav: {
    enabled: navEnabled = true,
    component: navReplace,
    transparentMode,
    ...nav
  } = {},
  sidebar: {
    enabled: sidebarEnabled = true,
    collapsible = true,
    component: sidebarReplace,
    tabs: tabOptions,
    banner: sidebarBanner,
    footer: sidebarFooter,
    components: sidebarComponents,
    hideSearch: sidebarHideSearch,
    ...sidebar
  } = {},
  i18n = false,
  children,
  ...props
}: DocsLayoutProps): ReactNode {
  checkPageTree(props.tree);
  const links = getLinks(props.links ?? [], props.githubUrl);
  const Aside = collapsible ? CollapsibleSidebar : Sidebar;

  const tabs = getSidebarTabsFromOptions(tabOptions, props.tree) ?? [];
  const variables = cn(
    "[--fd-tocnav-height:36px] md:[--fd-sidebar-width:268px] lg:[--fd-sidebar-width:286px] xl:[--fd-toc-width:286px] xl:[--fd-tocnav-height:0px]",
    !navReplace && navEnabled
      ? "[--fd-nav-height:calc(var(--spacing)*14)] md:[--fd-nav-height:0px]"
      : undefined,
  );

  const pageStyles: PageStyles = {
    tocNav: cn("xl:hidden"),
    toc: cn("max-xl:hidden"),
  };

  return (
    <TreeContextProvider tree={props.tree}>
      {/* <NavProvider transparentMode={transparentMode}> */}
      {/* {replaceOrDefault(
          { enabled: navEnabled, component: navReplace },
          <Navbar className="md:hidden">
            <Title url={nav.url} title={nav.title} />
            <div className="flex flex-1 flex-row items-center gap-1">
              {nav.children}
            </div>
            <SearchToggle hideIfDisabled />
            <NavbarSidebarTrigger className="-me-2 md:hidden" />
          </Navbar>,
          nav,
        )} */}
      <main
        id="nd-docs-layout"
        {...props.containerProps}
        className={cn(
          "flex flex-1 flex-row pe-(--fd-layout-offset)",
          variables,
          props.containerProps?.className,
        )}
        style={{
          ...layoutVariables,
          ...props.containerProps?.style,
        }}>
        <Sidebar tree={props.tree} />
        <div style={{ display: "flex", flex: 1 }}>{children}</div>
      </main>
      {/* </NavProvider> */}
    </TreeContextProvider>
  );
}

function SidebarFooterItems({
  i18n,
  disableThemeSwitch,
  links,
}: {
  i18n: boolean;
  links: LinkItemType[];
  disableThemeSwitch: boolean;
}) {
  const iconItems = links.filter(v => v.type === "icon");

  // empty footer items
  if (links.length === 0 && !i18n && disableThemeSwitch) return null;

  return (
    <div className="flex flex-row items-center">
      {iconItems.map((item, i) => (
        <BaseLinkItem
          key={i}
          item={item}
          className={cn(
            buttonVariants({ size: "icon", color: "ghost" }),
            "text-fd-muted-foreground md:[&_svg]:size-4.5",
          )}
          aria-label={item.label}>
          {item.icon}
        </BaseLinkItem>
      ))}
      <div role="separator" className="flex-1" />
      {i18n ? (
        <LanguageToggle className="me-1.5">
          <Languages className="size-4.5" />
          <LanguageToggleText className="md:hidden" />
        </LanguageToggle>
      ) : null}
      {!disableThemeSwitch ? <ThemeToggle className="p-0" /> : null}
    </div>
  );
}

export { getSidebarTabsFromOptions, type TabOptions } from "./docs/shared";
export { type LinkItemType };
