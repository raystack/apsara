'use client';

import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './label.module.css';

export interface LabelProps extends useRender.ComponentProps<'label'> {
  /**
   * Whether the labelled control is required. When `false`, an `(optional)`
   * indicator is rendered next to the label.
   */
  required?: boolean;
  optionalText?: string;
}

export function Label({
  className,
  required,
  render,
  ref,
  children,
  optionalText = '(optional)',
  ...props
}: LabelProps) {
  const content = (
    <>
      {children}
      {required === false && (
        <span className={styles.optional}>{optionalText}</span>
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
