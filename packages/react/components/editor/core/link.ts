const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);

const SCHEME = /^([a-z][a-z\d+.-]*:)/i;

/** A host and port with no scheme, such as `localhost:3000` or `example.com:8080`. */
const HOST_AND_PORT = /^(?:localhost|[\w-]+(?:\.[\w-]+)+):\d+(?:[/?#]|$)/i;

const NAMED_REFERENCES: Record<string, string> = {
  colon: ':',
  tab: '\t',
  newline: '\n'
};

/** Decodes the character references a renderer would decode in an `href`. */
function decodeReferences(href: string): string {
  return href.replace(
    /&(?:#x([\da-f]+)|#(\d+)|(colon|tab|newline));?/gi,
    (_match, hex: string, decimal: string, name: string) => {
      if (name) return NAMED_REFERENCES[name.toLowerCase()];
      const code = hex
        ? Number.parseInt(hex, 16)
        : Number.parseInt(decimal, 10);
      return code > 0x10ffff ? '' : String.fromCodePoint(code);
    }
  );
}

/**
 * Allows `http`, `https`, `mailto` and relative URLs. Blocks every other
 * scheme, such as `javascript:` and `data:`. Browsers ignore whitespace and
 * control characters inside a scheme, and a Markdown or HTML renderer decodes
 * character references, so both are handled before the check.
 */
export function isSafeHref(href: string): boolean {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: the control characters are what is being removed
  const compact = decodeReferences(href).replace(/[\u0000- \u007f]/g, '');
  const scheme = compact.match(SCHEME);
  if (!scheme) return true;
  return SAFE_PROTOCOLS.has(scheme[1].toLowerCase());
}

/** Removes control characters, which no valid `href` holds. */
export function stripControlCharacters(href: string): string {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: the control characters are what is being removed
  return href.replace(/[\u0000-\u001f\u007f]/g, '');
}

/** Adds `https://` to a bare domain, so `example.com` does not become a relative link. */
export function normalizeHref(input: string): string {
  const href = stripControlCharacters(input).trim();
  if (!href) return href;
  if (HOST_AND_PORT.test(href)) return `https://${href}`;
  if (SCHEME.test(href) || /^[/#?.]/.test(href)) return href;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(href)) return `mailto:${href}`;
  return `https://${href}`;
}
