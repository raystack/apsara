import { getFormattedCode } from '@/lib/prettier';
import { CodeBlock } from '@raystack/apsara';
import { useMemo } from 'react';
import styles from './editor.module.css';

type props = {
  code?: string;
};

export default function Editor({ code = '' }: props) {
  const formattedCode = useMemo(() => getFormattedCode(code), [code]);

  return (
    <div className={styles.editor} suppressHydrationWarning>
      <CodeBlock maxLines={25}>
        <CodeBlock.Content>
          <CodeBlock.Code language='tsx' className={styles.code}>
            {formattedCode}
          </CodeBlock.Code>
          <CodeBlock.CopyButton variant='floating' />
          <CodeBlock.CollapseTrigger />
        </CodeBlock.Content>
      </CodeBlock>
    </div>
  );
}
