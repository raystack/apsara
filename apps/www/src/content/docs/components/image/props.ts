export interface ImageProps {
  /** The URL of the image to display */
  src: string;

  /** Alternative text description (required) */
  alt: string;

  /**
   * Object-fit property
   * @default cover
   */
  fit?: 'contain' | 'cover' | 'fill';

  /**
   * Corner radius for this image only. Overrides the theme's `radius`.
   * @defaultValue "none"
   */
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';

  /** URL of fallback image to show on error */
  fallback?: string;

  /** Width of the image */
  width?: string | number;

  /** Height of the image */
  height?: string | number;

  /** Additional CSS class names */
  className?: string;
}
