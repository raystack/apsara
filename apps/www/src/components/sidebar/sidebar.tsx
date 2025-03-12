"use client";

import { Fragment, ReactNode } from "react";
import type { PageTree } from "fumadocs-core/server";
import { Sidebar as ApsaraSidebar } from "@raystack/apsara/v1";
import { LargeSearchToggle } from "./search-toggle";
import Logo from "../logo";
import styles from "./sidebar.module.css";
import SidebarItem from "./sidebar-item";
import { ThemeToggle } from "./theme-toggle";

type Props = {
  tree: PageTree.Root;
};

function renderSidebarTree(items: PageTree.Node[], level: number): ReactNode[] {
  return items.map((item, i) => {
    if (item.type === "separator" && typeof item.name === "string") {
      return (
        <ApsaraSidebar.Group
          name={item.name}
          key={item.name}
          className={styles.group}
        />
      );
    } else if (item.type === "page")
      return (
        <SidebarItem key={item.url} href={item.url} icon={item.icon}>
          {item.name}
        </SidebarItem>
      );
    return null;
  });
}

export default function Sidebar({ tree }: Props) {
  return (
    <ApsaraSidebar open={true} className={styles.root}>
      <ApsaraSidebar.Header
        logo={<Logo />}
        title="Apsara"
        className={styles.heading}
      />
      <LargeSearchToggle className="rounded-lg max-md:hidden" />
      <ApsaraSidebar.Main>
        <Fragment key={tree.$id}>
          {renderSidebarTree(tree.children, 1)}
        </Fragment>
      </ApsaraSidebar.Main>
      <ApsaraSidebar.Footer>
        <div className={styles.footer}>
          <ThemeToggle />
        </div>
      </ApsaraSidebar.Footer>
    </ApsaraSidebar>
  );
}
