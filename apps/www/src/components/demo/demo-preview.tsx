"use client";

import { useState } from "react";
import { LiveProvider } from "react-live";
import Preview from "../preview";
import Editor from "../editor";
import styles from "./styles.module.css";
import { DemoPreviewProps } from "./types";
import { cx } from "class-variance-authority";

export default function DemoPreview({ code, tabs, scope }: DemoPreviewProps) {
  const [activeTab, setActiveTab] = useState(0);
  const activeCode = tabs ? tabs[activeTab].code : code || "";
  return (
    <LiveProvider code={activeCode} scope={scope} disabled>
      <div className={styles.container}>
        {tabs && (
          <div className={styles.tabs}>
            {tabs.map((tab, index) => (
              <button
                key={tab.name}
                className={cx(
                  styles.tab,
                  index === activeTab && styles.activeTab,
                )}
                onClick={() => setActiveTab(index)}>
                {tab.name}
              </button>
            ))}
          </div>
        )}
        <div className={styles.preview}>
          <Preview />
        </div>
        <Editor />
      </div>
    </LiveProvider>
  );
}
