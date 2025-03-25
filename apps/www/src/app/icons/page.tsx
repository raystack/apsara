"use client";
import { useState } from "react";
import * as Icons from "@raystack/apsara/icons";
import { Search, Tabs } from "@raystack/apsara/v1";
import style from "./styles.module.css";
import { cx } from "class-variance-authority";

// export const metadata = {
//   title: "Apsara Icons",
// };
type TabType = "normal" | "filled";

const FILTERS: Record<TabType, (data: any) => Boolean> = {
  normal: ([name]) => !name.includes("Filled"),
  filled: ([name]) => name.includes("Filled"),
};

const Page = () => {
  const [tab, setTab] = useState<TabType>("normal");
  const [search, setSearch] = useState("");
  return (
    <main className={style.container}>
      <div className={style.content}>
        <div className={cx(style.info, "prose")}>
          <h1>Apsara Icons</h1>
          <p>
            A search input component with built-in search icon and optional
            clear button.
          </p>
        </div>
        <div className={style.controls}>
          <Tabs.Root
            value={tab}
            onValueChange={value => setTab(value as TabType)}>
            <Tabs.List>
              <Tabs.Trigger value="normal">Normal</Tabs.Trigger>
              <Tabs.Trigger value="filled">Filled</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
          <div className={style.spacer} />
          <Search
            placeholder="Search..."
            showClearButton
            value={search}
            onChange={e => setSearch(e.target.value)}
            onClear={() => setSearch("")}
          />
        </div>
        <div className={style.icons}>
          {Object.entries(Icons)
            .filter(FILTERS[tab])
            .filter(([name]) =>
              name.toLowerCase().includes(search.toLowerCase()),
            )
            .map(([name, Icon]) => (
              <div key={name} className={style.icon}>
                <div className={style.iconImage}>
                  <Icon width={16} height={16} />
                </div>
                <p className={style.iconText}>{name}</p>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
};

export default Page;
