export interface TextProps {
  /**
   * Custom render element or function. Accepts a JSX element (e.g. `<p />`)
   * or a render function for full control.
   * @default "span"
   */
  render?:
    | React.ReactElement
    | ((props: React.ComponentPropsWithRef<'span'>) => React.ReactElement);

  /**
   * The visual style variant.
   * @default "primary"
   */
  variant?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'emphasis'
    | 'accent'
    | 'attention'
    | 'danger'
    | 'success';

  /**
   * The text size.
   * @default "regular"
   */
  size?: 'micro' | 'mini' | 'small' | 'regular' | 'large';

  /**
   * The text weight.
   * @default "regular"
   */
  weight?: 'regular' | 'medium';

  /**
   * Text transform property
   */
  transform?: 'capitalize' | 'uppercase' | 'lowercase';

  /**
   * Text align.
   */
  align?: 'center' | 'start' | 'end' | 'justify';

  /**
   * Should clamp line.
   */
  lineClamp?: 1 | 2 | 3 | 4 | 5;

  /**
   * Show underlined text.
   */
  underline?: boolean;

  /**
   * Show strikethrough text.
   */
  strikeThrough?: boolean;

  /**
   * Show italic text.
   */
  italic?: boolean;

  /** Additional CSS class names. */
  className?: string;
}
