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

  /**
   * Visual style variant
   * @defaultValue "soft"
   */
  variant?: 'solid' | 'soft';

  /**
   * Border radius style
   * @defaultValue "small"
   */
  radius?: 'small' | 'full';

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
