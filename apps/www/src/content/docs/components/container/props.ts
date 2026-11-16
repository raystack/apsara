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
   * Controls the horizontal alignment of the container. `start` and `end` follow the text direction.
   * @defaultValue "center"
   */
  align?: 'start' | 'center' | 'end';

  /**
   * Renders the container as a different element.
   *
   * @remarks `ReactElement | function`
   */
  render?:
    | React.ReactElement
    | ((props: React.HTMLAttributes<HTMLDivElement>) => React.ReactElement);

  /** Additional CSS class names */
  className?: string;

  /** Accessible label for the container region */
  'aria-label'?: string;

  /** ID of element that labels this container region */
  'aria-labelledby'?: string;
}
