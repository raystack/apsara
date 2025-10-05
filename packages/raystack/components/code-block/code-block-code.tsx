import { Highlight, themes } from 'prism-react-renderer';
import { Language } from 'prism-react-renderer';
import { HTMLAttributes, forwardRef, useEffect } from 'react';
import { useCodeBlockContext } from './code-block-root';
import styles from './code-block.module.css';

export interface CodeBlockCodeProps extends HTMLAttributes<HTMLDivElement> {
  children: string;
  className?: string;
}

const CodeBlockCode = forwardRef<HTMLDivElement, CodeBlockCodeProps>(
  ({ children, className, ...props }, ref) => {
    const { language, hideLineNumbers, setCode } = useCodeBlockContext();

    useEffect(() => {
      setCode(children);
    }, [children, setCode]);

    return (
      <div
        ref={ref}
        className={`${styles.codeContent} ${className || ''}`}
        {...props}
      >
        <Highlight
          theme={themes.vsDark}
          code={children}
          language={language as Language}
        >
          {({
            className: highlightClassName,
            style,
            tokens,
            getLineProps,
            getTokenProps
          }) => (
            <pre
              className={`${styles.pre} ${highlightClassName}`}
              style={{
                ...style
                // maxHeight: maxHeight || 'none',
                // overflow: maxHeight ? 'auto' : 'visible'
              }}
            >
              {tokens.map((line, i) => (
                <div
                  key={i}
                  {...getLineProps({ line })}
                  className={styles.line}
                >
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
          )}
        </Highlight>
      </div>
    );
  }
);

CodeBlockCode.displayName = 'CodeBlockCode';

export { CodeBlockCode };
