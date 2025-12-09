'use client';

import { cx } from 'class-variance-authority';
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
  const [activeCodePreviewTab, setActiveCodePreviewTab] = useState(0);
  const activeCode = ((tabs ? tabs[activeTab].code : code) ?? '').trim();

  const previewCode =
    typeof codePreview === 'string' ? codePreview : activeCode;
  return (
    <LiveProvider code={activeCode} scope={scope} disabled>
      <div className={styles.container} data-demo>
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
          <div className={styles.codeTabGroup}>
            <div className={styles.tabs}>
              {codePreview.map((tab, index) => (
                <button
                  key={tab.label}
                  className={cx(
                    styles.tab,
                    index === activeCodePreviewTab && styles.activeTab
                  )}
                  onClick={() => setActiveCodePreviewTab(index)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <Editor
              code={codePreview[activeCodePreviewTab].code}
              key={activeCodePreviewTab}
            />
          </div>
        ) : (
          <Editor code={previewCode} />
        )}
      </div>
    </LiveProvider>
  );
}
{
  /* // {Array.isArray(codePreview) ? ( */
}
//   <Tabs
//     items={codePreview.map(tab => tab.label)}
//     className={styles.codeTabGroup}
//   >
//     {codePreview.map(tab => (
//       <Tab className={styles.codeTab} value={tab.label} key={tab.label}>
//         <Editor code={tab.code} />
//       </Tab>
//     ))}
//   </Tabs>
// ) : (
//   <Editor code={previewCode} />
// )}
