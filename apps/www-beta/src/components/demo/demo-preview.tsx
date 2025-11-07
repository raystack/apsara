'use client';

import { cx } from 'class-variance-authority';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { useState } from 'react';
import { LiveProvider } from 'react-live';
import Editor from '../editor';
import Preview from '../preview';
import styles from './styles.module.css';
import { DemoPreviewProps } from './types';

export default function DemoPreview({
  code,
  tabs,
  scope,
  codePreview
}: DemoPreviewProps) {
  const [activeTab, setActiveTab] = useState(0);
  const activeCode = ((tabs ? tabs[activeTab].code : code) ?? '').trim();

  const previewCode =
    typeof codePreview === 'string' ? codePreview : activeCode;
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
                  index === activeTab && styles.activeTab
                )}
                onClick={() => setActiveTab(index)}
              >
                {tab.name}
              </button>
            ))}
          </div>
        )}
        <div className={styles.preview}>
          <Preview />
        </div>
        {Array.isArray(codePreview) ? (
          <Tabs
            items={codePreview.map(tab => tab.label)}
            className={styles.codeTabGroup}
          >
            {codePreview.map(tab => (
              <Tab className={styles.codeTab} value={tab.label} key={tab.label}>
                <Editor code={tab.code} />
              </Tab>
            ))}
          </Tabs>
        ) : (
          <Editor code={previewCode} />
        )}
      </div>
    </LiveProvider>
  );
}
