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
   * Border radius style
   * @deafult none
   */
  radius?: 'none' | 'small' | 'medium' | 'full';

  /** URL of fallback image to show on error */
  fallback?: string;

  /** Width of the image */
  width?: string | number;

  /** Height of the image */
  height?: string | number;

  /** Additional CSS class names */
  className?: string;
}
