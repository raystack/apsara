const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);

const SCHEME = /^([a-z][a-z\d+.-]*:)/i;

/**
 * Allows `http`, `https`, `mailto` and relative URLs. Blocks every other
 * scheme, such as `javascript:` and `data:`. Browsers ignore whitespace and
 * control characters inside a scheme, so they are removed before the check.
 */
export function isSafeHref(href: string): boolean {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: the control characters are what is being removed
  const compact = href.replace(/[\u0000- \u007f]/g, '');
  const scheme = compact.match(SCHEME);
  if (!scheme) return true;
  return SAFE_PROTOCOLS.has(scheme[1].toLowerCase());
}

/** Adds `https://` to a bare domain, so `example.com` does not become a relative link. */
export function normalizeHref(input: string): string {
  const href = input.trim();
  if (!href) return href;
  if (SCHEME.test(href) || /^[/#?.]/.test(href)) return href;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(href)) return `mailto:${href}`;
  return `https://${href}`;
}
