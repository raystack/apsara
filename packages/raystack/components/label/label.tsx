'use client';

import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './label.module.css';

export interface LabelProps extends useRender.ComponentProps<'label'> {
  /**
   * Whether the labelled control is required. When `false`, an `(optional)`
   * indicator is rendered next to the label. When `true`, a `(required)`
   * indicator is rendered (visually-styled but available to screen readers).
   */
  required?: boolean;
  optionalText?: string;
  requiredText?: string;
  /** Show the `(required)` indicator when `required` is true. Defaults to false. */
  showRequiredIndicator?: boolean;
}

export function Label({
  className,
  required,
  render,
  ref,
  children,
  optionalText = '(optional)',
  requiredText = '(required)',
  showRequiredIndicator = false,
  ...props
}: LabelProps) {
  const content = (
    <>
      {children}
      {required === false && (
        <span className={styles.optional}>{optionalText}</span>
      )}
      {required === true && showRequiredIndicator && (
        <span className={styles.optional}>{requiredText}</span>
      )}
    </>
  );

  const element = useRender({
    defaultTagName: 'label',
    ref,
    render,
    props: mergeProps<'label'>(
      { className: cx(styles.label, className), children: content },
      props
    )
  });

  return element;
}

Label.displayName = 'Label';
