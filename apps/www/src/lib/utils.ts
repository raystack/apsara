export const getPropsString = (
  props: any,
  hasLeadingWhiteSpace: boolean = true
) => {
  const str = Object.entries(props)
    .filter(([key, value]) => value !== '')
    .map(([key, value]) => {
      if (
        typeof value === 'string' &&
        value.startsWith('<') &&
        value.endsWith('/>')
      )
        return `${key}={${value}}`;
      if (typeof value === 'boolean' && value) return `${key}`;
      if (typeof value === 'boolean' || typeof value === 'number')
        return `${key}={${value}}`;
      return `${key}="${value}"`;
    })
    .join(' ');
  if (hasLeadingWhiteSpace && str.length) return ' ' + str;
  return str;
};

export function isActiveUrl(
  url: string,
  pathname: string,
  nested = true
): boolean {
  if (url.endsWith('/')) url = url.slice(0, -1);
  if (pathname.endsWith('/')) pathname = pathname.slice(0, -1);

  return url === pathname || (nested && pathname.startsWith(`${url}/`));
}

/**
 * Given a docs URL, extract the folder name.
 * Format: /docs/folder-name/file-name or docs/folder-name/file-name
 */
export const getFolderFromUrl = (url: string): string => {
  // Remove leading slash if present and split by "/"
  const parts = url.replace(/^\//, '').split('/').filter(Boolean);

  // Expected structure: ["docs", folderName?, fileName]
  // If we have 3+ parts (docs / folder / file), return the folder (index 1)
  if (parts.length >= 3) {
    return parts[1];
  }

  // Otherwise it's a top-level doc (docs / file), default to "Overview"
  return 'Overview';
};

/**
 * Given a docs URL, extract the file name.
 * Format: /docs/folder-name/file-name or docs/folder-name/file-name
 */
export const getFileFromUrl = (url: string): string => {
  const parts = url.replace(/^\//, '').split('/').filter(Boolean);
  return (parts.pop() ?? '').split('#')[0] ?? '';
};

export function camelCaseToWords(input: string) {
  const result = input.replace(/([A-Z])/g, ' $1');
  return (result.charAt(0).toUpperCase() + result.slice(1)).trim();
}
