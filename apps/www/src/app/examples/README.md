# Examples

A manual-QA harness for trying Apsara components in a full-page context. These
routes are for testers and maintainers — they are **not** linked from the
public docs site.

## When to use this

Use `/examples` when you need to see a component in a real layout with real
data and interactions — something the small doc demos under
`src/content/docs/components/*/demo.ts` can't show. Common cases: a full app
shell (sidebar + navbar + table), server-driven data flows, or a new component
you are still building.

## How to add an example

1. Create a route folder next to this file: `app/examples/<name>/page.tsx`.
2. Build whatever you need to test. Import components from `@raystack/apsara`.
3. Open it at `http://localhost:3000/examples/<name>`.

Keep each example self-contained in its own folder. If two examples need the
same fixture data, put the shared data in a sibling file and import it from both.
