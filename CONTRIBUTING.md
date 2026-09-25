# Contributing to Apsara

Thanks for contributing. This guide covers how to send a change and how releases work.

- Setup, scripts, and the project layout are in [DEVELOPMENT.md](./DEVELOPMENT.md).
- Code, styling, docs, test, and writing rules are in [AGENTS.md](./AGENTS.md). They apply to people and AI agents.

## Contents

- [Sending a pull request](#sending-a-pull-request)
  - [Title](#title)
  - [Description](#description)
  - [Open-source-friendly names](#open-source-friendly-names)
  - [Before you open it](#before-you-open-it)
  - [CI checks](#ci-checks)
- [Commit convention](#commit-convention)
- [Releases](#releases)
  - [Canary releases](#canary-releases)
- [Project docs](#project-docs)
- [Getting help](#getting-help)
- [Code of conduct](#code-of-conduct)

## Sending a pull request

Pull requests are welcome. For a large change, open an issue first to discuss it with the maintainers.

Keep pull requests small, with one feature or fix in each. Two small PRs are easier to review than one big one.

1. Fork the repository.

2. Clone your fork and add the upstream remote:

   ```bash
   git clone https://github.com/<your-username>/apsara.git
   cd apsara
   git remote add upstream https://github.com/raystack/apsara.git
   ```

3. Sync your local `main` with upstream:

   ```bash
   git checkout main
   git pull upstream main
   ```

4. Install the dependencies with pnpm (npm and yarn are not supported):

   ```bash
   pnpm install
   ```

5. Create a branch named `<type>/<name>`, using the types from the [commit convention](#commit-convention):

   ```bash
   git checkout -b feat/flex-inline
   ```

6. Make your changes, commit, and push to your fork:

   ```bash
   git push -u origin HEAD
   ```

7. Open a pull request against `main` on [the repository](https://github.com/raystack/apsara).

A maintainer reviews the PR, then merges it, asks for changes, or closes it with an explanation. PRs are squash-merged, so the PR title becomes the commit message on `main`.

### Title

Use the [commit convention](#commit-convention): `<type>: [<component>] <summary>`, for example `feat: [flex] add inline prop for inline-flex`. The title describes the whole change, not the last commit.

### Description

- Write a `## Summary` with up to 5 bullets. Each bullet says what changed and why.
- Link the issue with `Closes #<issue>`, so it closes when the PR merges.
- Add screenshots or a short video for visual changes.
- Do not add a test plan, a checklist, a list of changed files, or empty sections. Add another section only when a reviewer needs it, for example a migration note for a breaking change.

```md
## Summary
- Add `inline` prop to `Flex` that renders `display: inline-flex` (off by default).
- Fix documented `wrap` values to match the component (`noWrap`, `wrapReverse`).

Closes #617
```

### Open-source-friendly names

Apsara is a public repo. Anyone can read PR titles, descriptions, branch names, and commit messages, so they must make sense to someone outside your team.

- Do not include internal tracker IDs (such as `ABC-123`), tracker links, or tracker-generated branch names.
- Do not mention internal projects, customers, private URLs, or internal chat threads.
- Link GitHub issues only.
- Choose the branch name before the first push. A closed PR keeps its branch name, and preview deployment comments include it.

### Before you open it

- Tests pass: `pnpm test:apsara`.
- Lint passes: `pnpm lint`. CI does not run lint, so check it locally.
- The change adds no type errors: `pnpm exec tsc --noEmit` in `packages/raystack`. CI does not run this either.
- The library builds: `pnpm build:apsara`.
- New or changed behavior has tests.
- The docs page is up to date: `index.mdx`, `demo.ts`, and `props.ts` in `apps/www/src/content/docs/components/<name>/`.
- The branch is up to date with `main`.

Do not worry if you miss a step. CI and the maintainers will help.

### CI checks

- PR Title: checks that the title follows the [commit convention](#commit-convention). It runs again when you edit the title.
- Tests: runs the Vitest suite and builds the library on Node 22 and 24. To reproduce it, run `pnpm test:apsara` and `pnpm build:apsara`.
- Canary Release: publishes a preview build to [pkg.pr.new](https://pkg.pr.new) and comments the install command on the PR. See [Canary releases](#canary-releases).
- Vercel: deploys a preview of the docs site with your changes.

## Commit convention

Commit subjects and PR titles use `<type>: [<component>] <summary>`:

- `feat:` for new features
- `fix:` for bug fixes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

`[<component>]` names the component or resource the change is about. Docs changes use `[docs]`, for example `fix: [docs] correct flex wrap values`. List two or three components as `[select, combobox]`. Leave it out for changes across most of the library.

Write the summary in lowercase and in the imperative mood, and keep the subject under 70 characters. Do not use `!` (`feat!:`) or a parenthesized scope (`feat(grid):`). Describe breaking changes in the PR description.

```bash
git commit -m "feat: [button] add new variant"
git commit -m "fix: [tooltip] resolve positioning issue"
git commit -m "chore: [deps] support lucide 1.x"
git commit -m "feat: integrate react 19"
```

## Releases

Maintainers release by pushing a version tag. The tag must be on `main` or a `release/*` branch.

| Tag | Workflow | npm tag |
| --- | --- | --- |
| `v1.2.3` | `release.yaml` | `latest` |
| `v1.2.3-rc.1` | `release-rc.yaml` | `next` |

```bash
git checkout main
git pull origin main
git tag v1.2.3
git push origin v1.2.3
```

The workflow installs dependencies, builds the library, sets the package versions from the tag, publishes `@raystack/apsara` and `@raystack/tools-config` to npm, and creates a GitHub release with generated notes. It does not run the tests, so make sure `main` is green first.

### Canary releases

Every push to a pull request or to `main` publishes a preview build to [pkg.pr.new](https://pkg.pr.new) (`canary.yaml`). On a PR, pkg.pr.new comments with the install command:

```bash
pnpm add https://pkg.pr.new/raystack/apsara/@raystack/apsara@<pr-number>
```

For a commit on `main`, use the commit SHA instead of the PR number.

## Project docs

- [Migration guide](./docs/V1-migration.md): how to move from the Radix-based release to the Base UI-based version.
- [RFCs](./docs/rfcs/): design proposals for major features.

## Getting help

Search the [GitHub issues](https://github.com/raystack/apsara/issues) and the [documentation site](https://apsara.raystack.org). If you do not find an answer, open an issue.

## Code of conduct

Be respectful, inclusive, and collaborative in all interactions.
