export interface TextProps {
  /**
   * Text element to render as.
   * @default "span"
   */
  as?: "span" | "p" | "div" | "label";

  /**
   * The visual style variant.
   * @default "primary"
   */
  variant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "emphasis"
    | "accent"
    | "attention"
    | "danger"
    | "success";

  /**
   * The text size.
   * @default "regular"
   */
  size?: "micro" | "mini" | "small" | "regular" | "large";

  /**
   * The text weight.
   * @default "regular"
   */
  weight?: "regular" | "medium";

  /**
   * Text transform property
   */
  transform?: "capitalize" | "uppercase" | "lowercase";

  /**
   * Text align.
   */
  align?: "center" | "start" | "end" | "justify";

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
