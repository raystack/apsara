'use client';

import { CodeBlock } from '@raystack/apsara';
import { cx } from 'class-variance-authority';
import { HTMLAttributes } from 'react';
import styles from './default-components.module.css';
import { usePreContext } from './pre-context';

export const Code = ({ children, className }: HTMLAttributes<HTMLElement>) => {
  const { hasPreParent } = usePreContext();

  const code = String(children).trim();
  if (!hasPreParent)
    return <code className={styles['code-inline']}>{code}</code>;

  const language = className?.split('-')?.[1] || 'ts';
  const codeLines = code.split('\n').length;

  return (
    <CodeBlock>
      <CodeBlock.Content className={styles['code-block-content']}>
        <CodeBlock.Code
          language={language}
          className={styles['code-block-content-code']}
        >
          {code}
        </CodeBlock.Code>
        <CodeBlock.CopyButton
          variant='floating'
          className={cx(
            codeLines === 1 && styles['code-block-content-copy-btn-fix']
          )}
        />
      </CodeBlock.Content>
    </CodeBlock>
  );
};
