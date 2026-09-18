/**
 * Whether a demo has to run in react-live's `noInline` mode.
 *
 * Without it, react-live parses the snippet as one expression, so a demo that
 * declares a helper component before the JSX fails to parse. `noInline` runs
 * the snippet as a function body instead, where the result is handed over by
 * calling `render(...)`. The two modes are mutually exclusive: a bare
 * expression renders nothing under `noInline`, so this keys off the `render(`
 * call the mode requires.
 */
export function needsNoInline(code: string | undefined): boolean {
  return /(^|[^.\w])render\s*\(/.test(code ?? '');
}
