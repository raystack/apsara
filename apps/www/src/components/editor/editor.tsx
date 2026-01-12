import { CodeBlock } from '@raystack/apsara';
import { cx } from 'class-variance-authority';
import { ComponentPropsWithoutRef, useMemo } from 'react';
import { getFormattedCode } from '@/lib/prettier';
import styles from './editor.module.css';

interface EditorProps extends ComponentPropsWithoutRef<typeof CodeBlock> {
  code?: string;
  className?: string;
}

export default function Editor({
  code = '',
  className,
  ...props
}: EditorProps) {
  const formattedCode = useMemo(() => getFormattedCode(code), [code]);

  return (
    <div className={cx(styles.editor, className)} suppressHydrationWarning>
      <CodeBlock maxLines={14} {...props}>
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
