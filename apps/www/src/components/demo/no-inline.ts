/**
 * Whether a demo has to run in react-live's `noInline` mode, which runs the
 * snippet as a function body so it can declare helpers before the JSX. The two
 * modes are mutually exclusive, so this keys off the `render(` call `noInline`
 * requires.
 */
export function needsNoInline(code: string | undefined): boolean {
  return /(^|[^.\w])render\s*\(/.test(code ?? '');
}
