'use client';

import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './label.module.css';

export interface LabelProps extends useRender.ComponentProps<'label'> {
  /**
   * Whether the labelled control is required. When `false`, an `(optional)`
   * indicator (see `optionalText`) is rendered next to the label.
   */
  required?: boolean;
  /**
   * Text rendered next to the label when `required={false}`.
   * @default "(optional)"
   */
  optionalText?: string;
  /**
   * Text rendered next to the label when `required={true}`. No indicator is
   * rendered if this is omitted — preserving apsara's existing behaviour of
   * not surfacing a required marker by default. Pass any non-empty string
   * (`"(required)"`, `"*"`, etc.) to opt in.
   */
  requiredText?: string;
}

export function Label({
  className,
  required,
  render,
  ref,
  children,
  optionalText = '(optional)',
  requiredText,
  ...props
}: LabelProps) {
  const content = (
    <>
      {children}
      {required === false && (
        <span className={styles.optional}>{optionalText}</span>
      )}
      {required === true && requiredText && (
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
