export interface FlexProps {
  /** Sets the gutter space between row and columns */
  gap?: 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large';

  /** Sets whether flex items are forced onto one line or can wrap onto multiple lines */
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';

  /** Defines how the browser distributes space between and around content items along the main axis */
  justify?: 'start' | 'end' | 'center' | 'between';

  /** Controls the alignment of items on the cross axis */
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';

  /** Sets how flex items are placed in the flex container defining the main axis and the direction (normal or reversed) */
  direction?: 'row' | 'rowReverse' | 'column' | 'columnReverse';

  /**
   * Sets the width of the flex container.
   */
  width?: 'full';

  /**
   * Allows rendering the flex container as a different element.
   * Accepts a React element or a function that receives props and returns an element.
   *
   * @remarks `ReactElement | function`
   */
  render?:
    | React.ReactElement
    | ((props: React.HTMLAttributes<HTMLDivElement>) => React.ReactElement);

  /** Custom CSS class names */
  className?: string;
}
