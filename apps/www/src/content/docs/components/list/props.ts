export interface ListRootProps {
  /** Additional CSS class names. */
  className?: string;
}

export interface ListHeaderProps {
  /** Content to be displayed in the header. */
  children?: React.ReactNode;

  /**
   * Heading level set as `aria-level` on the underlying heading element.
   * @default 3
   */
  'aria-level'?: 1 | 2 | 3 | 4 | 5 | 6;

  /** Additional CSS class names. */
  className?: string;
}

export interface ListItemProps {
  /**
   * Alignment of the item content.
   * @default "start"
   */
  align?: 'start' | 'center' | 'end';

  /** Content to be displayed in the item. */
  children?: React.ReactNode;

  /** Additional CSS class names. */
  className?: string;
}

export interface ListLabelProps {
  /** Content to be displayed in the label. */
  children?: React.ReactNode;

  /** Additional CSS class names. */
  className?: string;
}

export interface ListValueProps {
  /** Content to be displayed in the value. */
  children?: React.ReactNode;

  /** Additional CSS class names. */
  className?: string;
}
