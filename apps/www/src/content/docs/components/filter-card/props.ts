export interface FilterCardProps {
  /** Content of the filter card */
  children?: React.ReactNode;

  /** Additional CSS class names */
  className?: string;
}

export interface FilterCardSectionProps {
  /** Optional title for the section */
  title?: string;

  /** Content of the section */
  children?: React.ReactNode;

  /** Additional CSS class names */
  className?: string;

  /**
   * Flex direction
   * @defaultValue "column"
   */
  direction?: 'row' | 'column' | 'rowReverse' | 'columnReverse';

  /** Flex align items */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';

  /** Flex justify content */
  justify?: 'start' | 'center' | 'end' | 'between';

  /** Flex wrap */
  wrap?: 'noWrap' | 'wrap' | 'wrapReverse';

  /** Flex gap */
  gap?:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 'extra-small'
    | 'small'
    | 'medium'
    | 'large'
    | 'extra-large';
}

export interface FilterCardItemProps {
  /** Label text displayed on the left */
  label: string;

  /** Action content displayed on the right */
  children?: React.ReactNode;

  /** Additional CSS class names */
  className?: string;
}
