export interface TabsRootProps {
  /** The initial active tab value. If not provided, no tab will be selected by default. */
  defaultValue?: string;

  /** The controlled active tab value. */
  value?: string;

  /** Callback function triggered when the active tab changes. */
  onValueChange?: (value: string) => void;

  /** Additional CSS class names. */
  className?: string;
}

export interface TabsListProps {
  /** Additional CSS class names. */
  className?: string;
}

export interface TabsTriggerProps {
  /** Unique identifier for the tab. */
  value: string;

  /** Optional icon element to display. */
  icon?: React.ReactNode;

  /** Whether the tab is disabled. */
  disabled?: boolean;

  /** Additional CSS class names. */
  className?: string;
}

export interface TabsContentProps {
  /** Matching identifier for the tab. */
  value: string;

  /** Additional CSS class names. */
  className?: string;
}
