export interface TextProps {
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
   * @default 2
   */
  size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

  /**
   * The font weight.
   * @default 400
   */
  weight?:
    | "bold"
    | "bolder"
    | "normal"
    | "lighter"
    | 100
    | 200
    | 300
    | 400
    | 500
    | 600
    | 700
    | 800
    | 900;

  /** Additional CSS class names. */
  className?: string;
}
