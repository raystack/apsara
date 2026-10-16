export interface DrawerProps {
  /** The direction from which the drawer appears and can be swiped to dismiss. */
  side?: 'top' | 'right' | 'bottom' | 'left';

  /** Boolean to control the default open state. */
  defaultOpen?: boolean;

  /** Controlled open state. */
  open?: boolean;

  /** Callback when open state changes. */
  onOpenChange?: (open: boolean, eventDetails: unknown) => void;

  /** Callback fired after any animations complete when the drawer is opened or closed. */
  onOpenChangeComplete?: (open: boolean) => void;

  /**
   * Determines if the drawer enters a modal state when open.
   * - `true`: focus is trapped, scroll is locked, outside interactions are disabled.
   * - `false`: interaction with the rest of the document is allowed.
   * - `'trap-focus'`: focus is trapped but scroll and outside interactions remain enabled.
   * @default true
   */
  modal?: boolean | 'trap-focus';

  /** Override swipe direction (defaults to matching `side`). */
  swipeDirection?: 'up' | 'down' | 'left' | 'right';
}

export interface DrawerContentProps {
  /** The direction from which the drawer appears. */
  side?: 'top' | 'right' | 'bottom' | 'left';

  /** Whether to show the close button. */
  showCloseButton?: boolean;

  /**
   * Accessible label for the close button. Override for localisation.
   * @default "Close"
   */
  closeLabel?: string;

  /** Props to pass to the backdrop/overlay component. */
  overlayProps?: {
    className?: string;
    style?: React.CSSProperties;
  };

  /** The content to be rendered inside the drawer. */
  children?: React.ReactNode;

  /** Additional CSS class name. */
  className?: string;

  /** Additional inline styles. */
  style?: React.CSSProperties;

  /**
   * Corner radius for this drawer only. Overrides the theme's `radius`.
   * @defaultValue The theme's `radius`
   */
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
}

export interface DrawerSwipeAreaProps {
  /** The swipe direction that opens the drawer. Defaults to the opposite of the root's `swipeDirection`. */
  swipeDirection?: 'up' | 'down' | 'left' | 'right';

  /**
   * Turns off swipe-to-open.
   * @default false
   */
  disabled?: boolean;

  /**
   * Allows rendering as a different element.
   * Accepts a React element or a function that receives props and returns an element.
   *
   * @remarks `ReactElement | function`
   */
  render?: React.ReactElement;

  /** Additional CSS class name. */
  className?: string;
}

export interface DrawerProviderProps {
  /** The app content. A drawer inside it activates the indent parts while open. */
  children?: React.ReactNode;
}

export interface DrawerIndentProps {
  /**
   * Allows rendering as a different element.
   * Accepts a React element or a function that receives props and returns an element.
   *
   * @remarks `ReactElement | function`
   */
  render?: React.ReactElement;

  /** Additional CSS class name. */
  className?: string;
}

export interface DrawerIndentBackgroundProps {
  /**
   * Allows rendering as a different element.
   * Accepts a React element or a function that receives props and returns an element.
   *
   * @remarks `ReactElement | function`
   */
  render?: React.ReactElement;

  /** Additional CSS class name. */
  className?: string;
}
