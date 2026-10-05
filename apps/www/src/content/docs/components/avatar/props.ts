export interface AvatarProps {
  /**
   * Specifies the size of the avatar (1-13)
   * @defaultValue 3
   */
  size?: number;

  /** The URL of the image to display */
  src?: string;

  /** Alternative text description for the image */
  alt?: string;

  /** Content to display when image fails to load or while loading */
  fallback?: React.ReactNode;

  /** Milliseconds to wait before showing the fallback */
  fallbackDelay?: number;

  /** Called when the image loading status changes */
  onLoadingStatusChange?: (
    status: 'idle' | 'loading' | 'loaded' | 'error'
  ) => void;

  /**
   * Visual style variant
   * @defaultValue "soft"
   */
  variant?: 'solid' | 'soft';

  /**
   * Color theme for the avatar
   */
  color?:
    | 'indigo'
    | 'orange'
    | 'mint'
    | 'neutral'
    | 'sky'
    | 'lime'
    | 'grass'
    | 'cyan'
    | 'iris'
    | 'purple'
    | 'pink'
    | 'crimson'
    | 'gold';

  /**
   * Allows you to replace the component's HTML element with a different tag,
   * or compose it with another component. Accepts a ReactElement or a function
   * that returns the element to render.
   *
   * @remarks `ReactElement | function`
   */
  render?: React.ReactElement;

  /** Additional CSS class names */
  className?: string;

  /**
   * Corner radius for this avatar only. Overrides the theme's `radius`.
   * @defaultValue The theme's `radius`
   */
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
}

export interface AvatarGroupProps {
  /**
   * Array of Avatar components to display
   */
  children: React.ReactNode;

  /** Maximum number of avatars to show before displaying a count */
  max?: number;

  /** Additional CSS class names */
  className?: string;
}

export interface GetAvatarColorOptions {
  /** Mixed into the hash so the same string can map to a different color. A number and its string form give the same color. */
  seed?: string | number;

  /**
   * Restricts the result to these colors. Order matters. Duplicates and unknown colors are ignored. If none remain, all colors are used.
   * @defaultValue `AVATAR_COLOR_PALETTE`
   */
  palette?: Array<
    | 'indigo'
    | 'orange'
    | 'mint'
    | 'neutral'
    | 'sky'
    | 'lime'
    | 'grass'
    | 'cyan'
    | 'iris'
    | 'purple'
    | 'pink'
    | 'crimson'
    | 'gold'
  >;
}
