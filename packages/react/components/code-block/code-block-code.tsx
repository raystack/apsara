'use client';

import { cx } from 'class-variance-authority';
import { Highlight, Language } from 'prism-react-renderer';
import { ComponentProps, memo } from 'react';
import { useIsomorphicLayoutEffect } from '~/hooks';
import code from './code.module.css';
import styles from './code-block.module.css';
import { useCodeBlockContext } from './code-block-root';

export interface CodeBlockCodeProps extends ComponentProps<'div'> {
  children: string;
  language: Language;
  value?: string;
  className?: string;
}

const emptyTheme = { plain: {}, styles: [] };

export const CodeBlockCode = ({
  children,
  language,
  className,
  value,
  ...props
}: CodeBlockCodeProps) => {
  const { value: contextValue, setCode, setValue } = useCodeBlockContext();
  const computedValue = value ?? language;
  const isContextValueDefined = !!contextValue;
  const shouldRender = !isContextValueDefined || contextValue === computedValue;
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
    <div
      className={cx(styles.codeContent, className)}
      data-slot='code-block-code'
      {...props}
    >
      <CodeHighlight content={content} language={language} />
    </div>
  );
};

CodeBlockCode.displayName = 'CodeBlock.Code';

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
              data-slot='code-block-pre'
            >
              {renderedTokens.map((line, i) => (
                <div
                  key={i}
                  data-slot='code-block-line'
                  {...getLineProps({ line })}
                >
                  {!hideLineNumbers && (
                    <span
                      className={styles.lineNumber}
                      data-slot='code-block-line-number'
                    >
                      {i + 1}
                    </span>
                  )}
                  <span
                    className={styles.lineContent}
                    data-slot='code-block-line-content'
                  >
                    {line.map((token, key) => (
                      <span
                        key={key}
                        data-slot='code-block-token'
                        {...getTokenProps({ token })}
                      />
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
