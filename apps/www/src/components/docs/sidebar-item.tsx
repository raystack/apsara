"use client";

import { docs } from "@/lib/source";
import { isActiveUrl } from "@/lib/utils";
import { PageTree } from "fumadocs-core/server";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import Tag from "../tag";
import styles from "./sidebar-item.module.css";

export function SidebarItem({ item }: { item: PageTree.Item }) {
  const tag = useMemo(
    () => docs.getNodePage(item)?.data?.tag ?? "",
    [item.url],
  );

  const pathname = usePathname();
  const active =
    item.url !== undefined && isActiveUrl(item.url, pathname, false);

  return (
    <Link
      data-active={active}
      className={`${styles.item} ${active ? styles.active : ""}`}
      href={item.url}>
      {item.name} <Tag value={tag} />
    </Link>
  );
}
