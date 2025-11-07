import { getFormattedCode } from '@/lib/prettier';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { useMemo } from 'react';
import styles from './editor.module.css';

type props = {
  code?: string;
};

export default function Editor({ code = '' }: props) {
  const formattedCode = useMemo(() => getFormattedCode(code), [code]);

  return (
    <div className={styles.editor} suppressHydrationWarning>
      <DynamicCodeBlock lang='tsx' code={formattedCode} />
    </div>
  );
}
