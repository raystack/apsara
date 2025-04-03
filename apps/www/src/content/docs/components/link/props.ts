export interface LinkProps {
  /** The URL that the link points to. (Required) */
  href: string;

  /** Whether the link should open in a new tab. */
  external?: boolean;

  /** Whether the link should be downloadable or a string for the filename. */
  download?: boolean | string;

  /** Additional CSS class names. */
  className?: string;
}
