export const getPropsString = (
  props: any,
  hasLeadingWhiteSpace: boolean = true,
) => {
  const str = Object.entries(props)
    .filter(([key, value]) => value !== "")
    .map(([key, value]) => {
      if (
        typeof value === "string" &&
        value.startsWith("<") &&
        value.endsWith("/>")
      )
        return `${key}={${value}}`;
      if (typeof value === "boolean" && value) return `${key}`;
      if (typeof value === "boolean" || typeof value === "number")
        return `${key}={${value}}`;
      return `${key}="${value}"`;
    })
    .join(" ");
  if (hasLeadingWhiteSpace && str.length) return " " + str;
  return str;
};

export function isActiveUrl(
  url: string,
  pathname: string,
  nested = true,
): boolean {
  if (url.endsWith("/")) url = url.slice(0, -1);
  if (pathname.endsWith("/")) pathname = pathname.slice(0, -1);

  return url === pathname || (nested && pathname.startsWith(`${url}/`));
}
