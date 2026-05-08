import type { ReactElement } from 'react';

export interface LinkProps {
  /** The URL that the link points to. */
  href?: string;

  /** Whether the link should open in a new tab. */
  external?: boolean;

  /** Whether the link should be downloadable or a string for the filename. */
  download?: boolean | string;

  /**
   * Custom element used to render the Link.
   *
   * All props are forwarded to the specified element. Useful for integrating
   * with router libraries (e.g. `<NextLink />`, `<RouterLink />`).
   *
   * @default "<a />"
   */
  render?: ReactElement;

  /** Additional CSS class names. */
  className?: string;
}
