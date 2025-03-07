export interface LinkProps {
  /** The URL that the link points to. (Required) */
  href: string;

  /**
   * Visual style variant.
   * @default "accent"
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
   * Text size from 1 to 10.
   * @default 2
   */
  size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

  /**
   * Font weight of the link text.
   * @default 400
   */
  weight?: "normal" | "bold" | "bolder" | number;

  /** Whether to show underline decoration. */
  underline?: boolean;

  /** Whether the link should open in a new tab. */
  external?: boolean;

  /** Whether the link should be downloadable or a string for the filename. */
  download?: boolean | string;

  /** Additional CSS class names. */
  className?: string;
}
