'use client';

import { cx } from 'class-variance-authority';
import { Highlight } from 'prism-react-renderer';
import { Language } from 'prism-react-renderer';
import { HTMLAttributes, forwardRef, memo } from 'react';
import { useIsomorphicLayoutEffect } from '~/hooks/useIsomorphicLayoutEffect';
import { useCodeBlockContext } from './code-block-root';
import styles from './code-block.module.css';
import code from './code.module.css';

export interface CodeBlockCodeProps extends HTMLAttributes<HTMLDivElement> {
  children: string;
  language: Language;
  value?: string;
  className?: string;
}

const emptyTheme = { plain: {}, styles: [] };

export const CodeBlockCode = forwardRef<HTMLDivElement, CodeBlockCodeProps>(
  ({ children, language, className, value, ...props }, ref) => {
    const { value: contextValue, setCode, setValue } = useCodeBlockContext();
    const computedValue = value ?? language;
    const isContextValueDefined = !!contextValue;
    const shouldRender =
      !isContextValueDefined || contextValue === computedValue;
    const content = children.trim();

    useIsomorphicLayoutEffect(() => {
      // if value is not defined, set the value
      if (!isContextValueDefined) setValue(language);
      // if should render, store the code
      if (shouldRender) setCode(content);
    }, [
      content,
      setCode,
      shouldRender,
      setValue,
      language,
      isContextValueDefined
    ]);

    if (!shouldRender) return null;

    return (
      <div ref={ref} className={cx(styles.codeContent, className)} {...props}>
        <CodeHighlight content={content} language={language} />
      </div>
    );
  }
);

CodeBlockCode.displayName = 'CodeBlockCode';

const CodeHighlight = memo(
  ({ content, language }: { content: string; language: Language }) => {
    const { hideLineNumbers, maxLines, collapsed } = useCodeBlockContext();
    const canCollapse = maxLines && maxLines > 0;
    return (
      <Highlight theme={emptyTheme} code={content} language={language}>
        {({
          className: highlightClassName,
          style,
          tokens,
          getLineProps,
          getTokenProps
        }) => {
          const renderedTokens =
            canCollapse && collapsed ? tokens.slice(0, maxLines) : tokens;
          return (
            <pre
              className={cx(code.theme, styles.pre, highlightClassName)}
              style={style}
            >
              {renderedTokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {!hideLineNumbers && (
                    <span className={styles.lineNumber}>{i + 1}</span>
                  )}
                  <span className={styles.lineContent}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          );
        }}
      </Highlight>
    );
  }
);
