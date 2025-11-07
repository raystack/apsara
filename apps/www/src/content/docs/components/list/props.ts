export interface ListRootProps {
  /** Maximum width of the list container. */
  maxWidth?: string | number;

  /** Additional CSS class names. */
  className?: string;
}

export interface ListHeaderProps {
  /** Content to be displayed in the header. */
  children?: React.ReactNode;

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
  /** Minimum width of the label. */
  minWidth?: string;

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
