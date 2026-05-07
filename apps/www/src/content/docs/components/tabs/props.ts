export interface TabsRootProps {
  /** The initial active tab value. */
  defaultValue?: any;

  /** The controlled active tab value. */
  value?: any;

  /** Callback function triggered when the active tab changes. */
  onValueChange?: (value: any) => void;

  /** The orientation of the tabs. */
  orientation?: 'horizontal' | 'vertical';

  /** Visual variant for how tabs are rendered. */
  variant?: 'segmented' | 'standalone' | 'plain';

  /**
   * Size variant applied to all tab triggers.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /** Additional CSS class names. */
  className?: string;
}

export interface TabsListProps {
  /** Additional CSS class names. */
  className?: string;
}

export interface TabsTabProps {
  /** Unique identifier for the tab. */
  value: any;

  /** Optional icon element to display before the label. Rendered in a wrapper with aria-hidden so it is not announced by screen readers (decorative). */
  leadingIcon?: React.ReactNode;

  /** Whether the tab is disabled. */
  disabled?: boolean;

  /** Additional CSS class names. */
  className?: string;
}

export interface TabsContentProps {
  /** Matching identifier for the tab. */
  value: any;

  /** Whether to keep the panel in the DOM while hidden. */
  keepMounted?: boolean;

  /** Additional CSS class names. */
  className?: string;
}
