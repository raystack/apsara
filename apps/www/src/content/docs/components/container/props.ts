export interface ContainerProps {
  /**
   * Controls the max-width of the container
   * - "small": 430px
   * - "medium": 715px
   * - "large": 1145px
   * - "none": no max-width
   * @defaultValue "none"
   */
  size?: 'small' | 'medium' | 'large' | 'none';

  /**
   * Controls the horizontal alignment of the container
   * @defaultValue "center"
   */
  align?: 'left' | 'center' | 'right';

  /** Additional CSS class names */
  className?: string;

  /** Accessible label for the container region */
  ariaLabel?: string;

  /** ID of element that labels this container region */
  ariaLabelledby?: string;
}
