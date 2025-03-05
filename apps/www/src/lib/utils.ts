export const getPropsString = (
  props: any,
  hasLeadingWhiteSpace: boolean = true,
) => {
  const str = Object.entries(props)
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
