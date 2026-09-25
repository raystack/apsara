# Repository guidelines

Apsara (`@raystack/apsara`) is an open-source React 19 component library. It is built on Base UI primitives and styled with CSS Modules and `--rs-*` design tokens. The repo is a pnpm and Turborepo monorepo.

This file has the rules. For everything else, read:

- [DEVELOPMENT.md](./DEVELOPMENT.md): setup, scripts, project structure, and package exports.
- [CONTRIBUTING.md](./CONTRIBUTING.md): branches, commits, pull requests, and releases.

`CLAUDE.md` is a symlink to this file.

## Agent skills

Skills are in `.agents/skills/`. `.claude/skills` is a symlink to that folder, so each skill exists once. A skill holds the steps for one task. Do not repeat the rules from this file in a skill.

- `add-new-component`: every step to add a component, from source to docs.
- `apsara-review`: reviews a diff for bugs, tests, simplifications, and docs. Run it only when someone asks for it by name (`/apsara-review` or `$apsara-review`). Do not run it for a general review request or after you finish a change.
- `apsara`: for apps that use the library. It is not for work in this repo.
- `design-review`: reviews the design of a PR, a branch, or an existing module: API surface, maintenance cost, and whether the machinery fits the problem. Run it only when someone asks for it by name (`/design-review` or `$design-review`).

## Code

- Each component is in `packages/raystack/components/<name>/`. Its `index.tsx` only re-exports.
- Export new components from `packages/raystack/index.tsx`, in alphabetical order.
- Wrap Base UI primitives, for example `import { Tabs as TabsPrimitive } from '@base-ui/react'`. Do not rebuild behavior that Base UI already has.
- For plain elements, use `useRender` and `mergeProps` so the `render` prop works.
- Pass `ref` as a normal prop (React 19). Do not use `forwardRef`.
- Use `cva` for variants and `cx` to merge class names. Both come from `class-variance-authority`.
- For compound components, use `Object.assign(Root, { List, Tab })`. Set `displayName` on each part, for example `'Tabs.List'`.
- Every rendered part has a `data-slot` attribute in kebab case, prefixed with the component name, for example `tabs-list`. Slot names are public API. List them in the Slots table on the docs page, and test them in `__tests__/data-slots.test.tsx` with the helpers in `~/test-utils/data-slots`.
- Do not use `any`. Use a specific type, `unknown`, or a generic.

## Styling

- Use CSS Modules only. Do not use Tailwind, CSS-in-JS, or static inline styles. Inline `style` is fine for values computed at runtime, for example Grid templates.
- Use `--rs-*` tokens for colors, spacing, radius, and font sizes instead of hardcoded values.
- Use `~/shared/gap` for gap props. Do not add new spacing classes.
- Name variant classes `<prop>-<value>`, for example `direction-row` or `size-small`.

## Docs

- When you change props, variants, or behavior, update the docs page.
- `props.ts` is written by hand, not generated, and `<auto-type-table>` renders it. Check each prop name and value against the component. The two often get out of sync.
- `demo.ts` exports demo objects: `{ type: 'code', code }` for examples and `{ type: 'playground', controls, getCode }` for the playground. The code strings render live with the library in scope.
- Set `defaultValue` on playground controls. The generated code then leaves out props that are at their default.

## Lint, types, and format

- Use `pnpm`. Do not use `npm` or `yarn`. If a command fails because dependencies are missing, for example in a new worktree, run `pnpm install` and try again.
- Biome lints and formats the code. The pre-commit hook runs `pnpm format` on staged files.
- Run `pnpm lint` before you push. Fix the issues instead of suppressing them.
- Run `pnpm exec tsc --noEmit` in `packages/raystack` to check types. Do not add new errors.

## Tests

- Tests use Vitest and Testing Library in jsdom. Import from `vitest`, not `jest`.
- To test one component, run `pnpm test -- components/<name>` in `packages/raystack`, for example `pnpm test -- components/flex`. To run all tests from the root, run `pnpm test:apsara`.
- Check class names through the imported CSS module, for example `styles['direction-row']`. Do not hardcode class strings.
- Base UI popups do not behave like a browser in jsdom:
  - To select a portaled item, call `fireEvent.pointerDown` and then `fireEvent.click`. See `combobox.test.tsx`.
  - Select needs a microtask flush after render and after open. See `flushMicrotasks` in `select.test.tsx`.
- Test the behavior you changed. Do not add tests for unrelated code.

## Commits and pull requests

Read [Commit convention](./CONTRIBUTING.md#commit-convention) and [Sending a pull request](./CONTRIBUTING.md#sending-a-pull-request) in CONTRIBUTING.md before you commit or open a PR. In short:

- Commit subjects and PR titles use `<type>: [<component>] <summary>`, for example `feat: [grid] introduce css modules`. `<type>` is `feat`, `fix`, `refactor`, `test`, or `chore`. No `!` and no `(scope)`. CI fails PRs whose title does not match.
- Branches are `<type>/<name>`, for example `feat/flex-inline`.
- The PR body follows `.github/PULL_REQUEST_TEMPLATE.md`: a `## Summary` of up to 5 bullets, `Closes #<issue>`, and the ticked checkbox.
- This is a public repo. Do not put internal tracker IDs, tracker links, or internal names in branches, commits, or PRs.

Rules for agents:

- Write the PR description from the full branch (`git log main..HEAD` and `git diff main...HEAD --stat`), not from the last commit.
- Only claim what you checked. Do not say tests pass or a browser was checked unless you did it.
- Do not add AI attribution, watermarks, or "Generated with" footers.

## Writing style

These rules apply to code comments, JSDoc, docs, commit messages, PRs, and review replies. Write simple technical English. Say what is true in as few words as you need. If a sentence tells the reader nothing that the code or diff does not already show, delete it.

### Words

- Use plain words: "is", not "serves as"; "has", not "features" or "boasts"; "can", not "has the ability to"; "use", not "leverage" or "utilize"; "to", not "in order to".
- Do not use: additionally, comprehensive, crucial, delve, enhance, foster, pivotal, robust, seamless, showcase, streamline, underscore, vital.
- Do not praise the code ("powerful", "elegant", "effortless"). Describe what it does.
- Delete filler: "It is important to note that", "Note that", "Basically", "Simply".
- Do not hedge ("might potentially", "should hopefully"). State the fact, or leave it out.
- Use one name for one thing. Do not switch between synonyms like "prop", "option", and "setting" for the same thing.

### Sentences

- Keep sentences short, with one idea each.
- Use active voice with a clear subject: "The hook reads the value", not "The value is read". Write "You do not need a config file", not "No config file needed".
- Do not add an "-ing" phrase to the end of a sentence to add meaning, as in "..., ensuring a consistent layout". Write a second sentence or delete it.
- Avoid "not X, but Y" and "not just X, it's Y". Avoid short fragments at the end of a sentence, such as "no guessing".
- Do not group items in threes to sound complete. List only what is real.
- Do not announce what comes next ("Here's what changed:", "Let's look at"). Say it.
- Do not end with a summary or a positive line ("This makes Flex more flexible."). End on the last fact.

### Formatting

- Do not use em dashes or en dashes. Use a period, comma, colon, or parentheses.
- Use straight quotes (`"` and `'`), not curly quotes.
- Do not use emojis.
- Use bold rarely. Do not start list items with a bold label and a colon.

### Comments and JSDoc

- Use comments sparingly. The default is no comment.
- Add a comment only when the code cannot explain itself, for example a browser workaround or a non-obvious constraint. The comment says why, not what.
- Describe the code as it is now. Do not describe the change ("now uses", "was changed to", "previously"). That belongs in the commit message.
- JSDoc for a prop is one line, plus `@default` if the prop has a default. Usage guidance goes in the `.mdx` page.

  ```ts
  /**
   * Renders as `inline-flex` instead of `flex`.
   * @default false
   */
  inline?: boolean;
  ```

### Review replies

- Start with the result (fixed, won't fix, or a question), then give one line of reason.
- Do not use chat phrases: "I hope this helps", "Let me know if", "Great catch!", "You're absolutely right".
