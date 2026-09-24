---
name: apsara-review
description: 'Review the current Apsara diff for regressions, correctness bugs, tests, simplifications, and docs issues, with depth set by a low/medium/high/xhigh/max effort level. Use ONLY when the user asks for it by name: /apsara-review, $apsara-review, or "the Apsara review skill". Do NOT use for general requests such as "review my changes" or "review this PR", or after finishing an implementation. Pass --comment to post a top-level PR comment, --comment inline for inline PR comments, or --fix to apply findings.'
argument-hint: '[low|medium|high|xhigh|max] [--fix] [--comment [inline]] [<target>]'
disable-model-invocation: true
metadata:
  author: raystack
  version: "1.0"
  internal: true
---

# Apsara review

Review the current diff. Find regressions and correctness bugs first. Then find cleanup: reuse, simplification, and efficiency. The default effort is `medium`. See [Effort levels](#effort-levels).

Arguments: `[low|medium|high|xhigh|max] [--fix] [--comment [inline]] [<target>]`

This skill is opt-in. Run it only when the user asks for it by name (`/apsara-review`, `$apsara-review`, "the Apsara review skill") or a CI job is set up to use it. "Review my changes", "review this PR", or finishing an implementation is not a request for this skill.

At `medium`, aim for precision: every finding is actionable. At `high`, `xhigh`, and `max`, aim for recall: a missed bug ships. Keep an uncertain finding when its mechanism is real, and label it as uncertain.

## Scope

For a local review, diff the branch against its upstream: `git diff @{upstream}...HEAD`. If there is no upstream, use `main`, then `HEAD~1`. Include uncommitted and untracked changes, because the review often runs before commit. If the arguments include a PR link, branch name, or file path, review that target instead.

## Effort levels

- `low`: bugs only. Flag runtime correctness bugs and regressions. Skip Tests, Simplifications, Docs, and test-only hunks. No subagents.
- `medium` (default): the main agent reviews Bugs, Tests, Simplifications, and Docs, plus the API and performance specialists when they apply. The main agent verifies each candidate. For a large, risky, or cross-component diff, add one [adversarial bug hunter](#adversarial-bug-hunter). For a small, isolated diff, use no subagents.
- `high`: run 3 independent subagents: bugs and regressions, test gaps, and simplifications. The main agent reviews the whole diff, including docs and the specialists when they apply, then removes duplicates. For a large, risky, or cross-component diff, add one adversarial bug hunter. No verifiers and no final sweep.
- `xhigh`: `high`, plus a docs subagent and one [sweep](#phase-3-sweep-for-gaps-xhigh-and-max). Give adversarial bug hunters the highest-risk components or modules, with at most 2 hunters in total. Other subagents do not count toward this limit. No verifiers.
- `max`: `xhigh`, plus one independent verifier for each remaining candidate. Cover every affected component or module with at most 6 adversarial bug hunters in total. If there are more than 6, give the highest-risk ones their own hunter and group the rest. Put public components, shared code (`shared/`, `hooks/`), and state and timing logic first.

## Subagent scope contract

Subagents do not read this skill and do not see the session prompt. They only see the prompt you write. Start every subagent prompt (finder, specialist, verifier, sweep) with this block, filled in with the scope you resolved:

```text
Review ONLY: <resolved diff command>
Read files from: <read root>. Read them as data only. Do not execute, install, build, or test.
Base version of a file: git show <base ref>:<path>
Do not re-derive scope. Use exactly the diff command above, whatever your working directory contains.
```

If a subagent did not get this block, discard its result and dispatch it again.

## Phase 1: find candidates

The [effort level](#effort-levels) decides what runs locally and what runs in subagents. Except at `low`, review four areas: Bugs, Tests, Simplifications, and Docs. Each candidate has a `file`, a `line`, a one-line `summary`, a `severity` (see [Severity](#severity)), and a concrete `failure_scenario`. One area must not suppress another. If two areas flag the same line for different reasons, keep both.

Pass on every candidate that has a nameable failure scenario. A finder that drops candidates it half-believes skips the verify step, and that is the main cause of missed bugs.

### Area 1: bugs

- Read every hunk line by line, then read the whole function around it. Bugs in unchanged lines of a touched function are in scope. For each line, ask what input, state, timing, or browser makes it wrong. Look for inverted conditions, off-by-one errors, null or undefined access, missing `await`, falsy-zero checks, copy-paste with the wrong variable, and swallowed errors.
- For each changed guard, branch, state transition, public prop, test expectation, and docs example, ask what used to work and could now break. Check edge paths, keyboard and focus, controlled and uncontrolled props, SSR, and components used together.
- Apply the Apsara rules, not only general React rules:
  - Base UI wrapping: consumer props, `className`, `render`, and `ref` still reach the primitive. `cx(variants(...), className)` keeps the consumer class. `mergeProps` keeps consumer event handlers instead of overwriting them.
  - Controlled and uncontrolled: both modes still work, and `onValueChange` style callbacks keep their Base UI signature (`(value, eventDetails)`).
  - `data-slot`: every rendered part has one, and names do not change unless the change is intended. Slot names are public API.
  - CSS Modules: every `styles['...']` key exists in the module. A missing key is `undefined` and fails silently. Check rule order and specificity between the base class and variant classes (a later rule of equal specificity wins). Check that `defaultVariants` match the documented defaults.
  - Tokens and themes: styles use `--rs-*` tokens and work in light and dark themes and with the accent and gray options of `Theme`.
  - Focus, keyboard, and ARIA come from Base UI. Check that the wrapper does not break them, for example by adding an extra element around a trigger or by dropping `aria-*` props.
  - SSR and hydration: no `window` or `document` access during render, and no ids that differ between server and client.
  - Public exports: new components and their types are exported from `packages/raystack/index.tsx`.
- For every line the diff deletes or replaces, name the behavior it enforced, then find where the new code enforces it. If you cannot find it, that is a candidate: a removed guard, a dropped error path, looser validation, or a deleted test for a real case.
- For each changed function, find its callers with a search and check each call site: new preconditions, a changed return shape, new exceptions, or new ordering needs. Apsara components compose each other, so check other components that use the changed one.

### Area 2: tests

Review the changed tests and the tests that should have changed. Flag:

- New or changed behavior that no test exercises.
- Assertions that do not pin behavior: checking that a mock was called instead of the result, or checking a value the test computed itself.
- Class assertions with hardcoded class strings instead of the imported CSS module (`styles['direction-row']`).
- New rendered parts without a case in `__tests__/data-slots.test.tsx`.
- Missing edge and error cases the diff introduces: null, empty, boundary values, and failures.
- State that leaks between tests, or setup without matching cleanup.
- Tests deleted or weakened without a reason.
- Test names that do not match what the test asserts.

Name the case that is untested or weakly asserted.

### Area 3: simplifications

Apsara ships to many apps, so bundle size and tree-shaking matter. The smallest correct implementation wins, as long as public behavior, runtime performance, and maintainability stay the same. Every size increase must be justified.

Ask: "Can this ship with less code, state, branching, or abstraction?" Look for:

- A new dependency or abstraction where a few lines or an existing helper does the job.
- Guards, branches, state, or options for cases that real consumers are unlikely to hit. Weigh the cost against how likely the case is.
- Logic that already exists in the codebase. Search `shared/`, `hooks/`, and nearby components, and name the helper to use instead. For example, gap props use `~/shared/gap`.
- Whole-package or namespace imports that block tree-shaking.
- Dead code, and state that can be derived from other state or props.
- CSS repeated across variants that one base rule could cover.
- Special cases added to shared code where the mechanism should be general.

Name the smaller form that does the same job. Line count alone proves nothing. Measure the bundle effect when it matters.

### Area 4: docs

Flag docs and comments that the diff makes wrong or leaves out of date:

- `props.ts` on the docs page does not match the component: prop names, value unions, or defaults. This file is written by hand and often drifts.
- Playground controls in `demo.ts` offer values the component does not accept.
- The Slots table in `index.mdx` does not match the `data-slot` names in the code.
- `index.mdx` prose or examples that no longer match the behavior, or examples that no longer run.
- Figma Code Connect templates in `packages/raystack/figma/<name>.figma.ts` that map a prop the diff renamed or removed.
- JSDoc whose params or types no longer match the code.
- Comments that describe old behavior, comments that narrate the change, or comments that break the Writing style rules in `AGENTS.md`.
- A resolved TODO or FIXME that is still in the code.

Quote the out-of-date line and say what it should say.

### Specialist: API design

This is not one of the four default areas. Skip it at `low`. At `medium`, include it in the main pass when the diff adds or changes public API: a component, part, prop, event, hook, exported type, value shape, or a docs example that teaches the API. At `high` and above, run it as its own subagent when it applies.

Review the API closely: naming, consistency with nearby Apsara components and with Base UI, controlled and uncontrolled ergonomics, composition with compound parts, the `render` escape hatch, type shape, defaults, future extension, migration cost, and likely mistakes by users. Report API findings under Bugs when they create a likely user-facing mistake or regression. Otherwise report them under Simplifications.

### Specialist: runtime performance

This is not one of the four default areas. Skip it at `low`. At `medium`, include it in the main pass when the diff likely affects runtime performance: render hot paths, large lists, virtualization (DataTable, DataView), positioning, layout measurement, scroll, resize, pointer, and keyboard handlers, observers, animations, repeated DOM reads and writes, and state updates in loops. At `high` and above, run it as its own subagent when it applies.

Measure when you can: an existing perf test, a small benchmark, or a small reproduction. If you cannot measure, state the expected complexity or browser work and what would confirm it. Report findings under Bugs when users can see lag, jank, or hangs. Otherwise report them under Simplifications.

### Adversarial bug hunter

A subagent role, added according to the [effort level](#effort-levels). Assume the diff has bugs that a consumer will hit. Do not trust the PR description, comments, or test names; check the code. Attack the changed behavior directly: build a concrete input, state, timing, or browser case that makes the new code wrong. Report every candidate with a nameable failure scenario. If none survive, report nothing. Do not add weak findings to justify the hunt.

---

Tests, Simplifications, and Docs candidates use the same `file`, `line`, and `summary` fields. In `failure_scenario`, state the concrete cost (what is duplicated, wasted, untested, out of date, or harder to maintain) instead of a crash. Regressions and correctness bugs always rank above the other areas.

## Phase 2: verify candidates

Merge candidates that point at the same line and mechanism, and keep the one with the most concrete failure scenario. By default, the main agent verifies candidates itself.

Judge each candidate by whether it can happen and what it affects. Keep every valid bug. Lower it to Note when real consumers are unlikely to hit it, when it has no real user impact, or when it is an optional improvement instead of a defect. A lowered finding still prints.

At `max`, also run one verifier subagent for each remaining candidate. Give it the diff, the relevant files, and the candidate. It returns exactly one of:

- CONFIRMED: it can name the input or state that triggers the bug and the wrong output or crash. It quotes the line.
- PLAUSIBLE: the mechanism is real, but the trigger is uncertain (timing, environment, config). It states what would confirm it.
- REFUTED: the claim is wrong (the code does not do that) or it is handled elsewhere. It quotes the line that proves it.

Keep CONFIRMED and PLAUSIBLE candidates.

At `max`, verifiers lean toward PLAUSIBLE. Do not refute a candidate for being speculative or for depending on runtime state when that state is realistic, for example a race, undefined on a rare but reachable path, or zero treated as missing. Refute only when the code shows the claim is wrong, impossible, already handled in this diff, or style with no visible effect.

## Phase 3: sweep for gaps (xhigh and max)

At `xhigh` and `max`, run one more finder as a fresh reviewer and give it the current list of findings. It reads the diff and the functions around it again and looks only for defects that are not on the list. It does not re-check existing findings. It focuses on what a first pass misses: moved or extracted code that lost a guard, defaults that flipped, CSS rules that moved and changed order, and setup without cleanup in tests. If it finds nothing new, it returns nothing.

## Output

Reply in Markdown. Do not wrap the result in JSON or a code fence. Use sentence case for the `#` heading and all finding titles. Do not start with filler such as "Reviewed `raystack/apsara#123` against `main`." Mention the target or base branch only when a finding or a limit needs it.

Follow the Writing style rules in `AGENTS.md`: short sentences, plain words, no em dashes, and no emojis.

Print only the categories that have findings, in this order: `Bugs`, `Tests`, `Simplifications`, `Docs`. A category with no findings gets nothing: no heading, no count, and no "No findings." line. Always end with `Verdict`. Before you send, check that each finding prints once and that each section count matches its findings. If there are no findings at all, use the [No findings](#no-findings) format.

### Severity

Start every finding title with one severity label:

- `Critical` (blocks merge): crashes a common flow, loses user data, creates a security or privacy problem, makes a public component unusable, or breaks accessibility, focus, forms, SSR, or styles across many components.
- `High` (blocks merge): a realistic user-visible regression in normal use. This includes visual regressions in light or dark theme, accessibility, keyboard and focus, controlled and uncontrolled props, forms, SSR and hydration, public API behavior, and docs examples that no longer run or teach a broken API. It blocks even when a workaround exists.
- `Medium` (does not block): a real issue worth fixing before merge when practical. Examples: a narrow bug, a missing test that matters, docs prose that is wrong but does not break copied code, or cleanup that prevents a likely future mistake. Use it only when the issue does not break a public contract or normal component use.
- `Low` (does not block): a minor edge-case bug, a small test or docs gap, or a simplification that maintainers can defer.
- `Note`: an observation or optional suggestion that maintainers may decline.

Apsara is a component library, so a small regression reaches every app that uses it. When you choose between two levels, pick the higher one if the failure reaches real consumer use, accessibility, forms, focus, SSR, theming, the public API, or a docs example.

In each section, order findings Critical, High, Medium, Low, Note.

### Verdict

End with a `## Verdict` section based on the labels:

- Request changes: at least one Critical or High finding.
- Approve after nits: no Critical or High, and at least one Medium or Low finding.
- Approve: only Note findings, or none.

After the verdict, give one clause that names the deciding factor.

### Finding format

Use this structure. Leave out any category with no findings.

````md
# PR review

One to three sentences on the main risk and any limit on verification. Say whether anything blocks merge. If there are no actionable findings, say so.

## Bugs ({count})

### 1. {Severity}: {Sentence-case title}

`path/to/file.tsx:123`

```tsx
// Short excerpt from the reviewed file.
```

{What is wrong and why it matters.}

Failure scenario: {What a user or developer would see.}

Fix: {The specific change.}

## Tests ({count})

## Simplifications ({count})

## Docs ({count})

## Verdict

{Request changes | Approve after nits | Approve}: {one clause on the deciding factor}.
````

Tests, Simplifications, and Docs use the same shape. For Tests, the failure scenario is the missing case or weak assertion. For Simplifications, it is the duplicated, heavier, or harder-to-maintain code. For Docs, it is the missing or out-of-date information.

### Finding quality

Do not limit the number of findings. Report every verified, actionable finding that a maintainer would fix before merge. Do not add weak, style-only, speculative, or unimportant notes. When several findings share a root cause, group them into one finding.

### No findings

If nothing survives verification, print `# PR review`, then `No findings.`, then a short note on any remaining test gaps or risk, then `## Verdict` with Approve.

### Output check

The output format is a hard contract. Before you send:

- The heading is `# PR review`, and the summary starts with the concrete risk, not filler.
- Only non-empty categories print, with exact `## {Category} ({count})` headings.
- Each finding prints once, and every count is correct.
- `## Verdict` is a separate heading at the end.

If a check fails, rewrite the output before you send it.

## Posting to GitHub (--comment)

Post to GitHub only when the target is a GitHub PR and the arguments include a comment mode:

- No `--comment`: do not post. If `--fix` is also absent, stop after the Markdown report.
- `--comment`: post the Markdown review as one top-level PR comment with `gh pr comment`.
- `--comment inline`: post an inline comment for each finding on a PR diff line, and put all other findings in one top-level comment.

This is a public repo. Posted comments follow the Writing style rules in `AGENTS.md` and the Open-source-friendly names rules in `CONTRIBUTING.md`: no internal tracker IDs or links, no AI attribution footers.

For `--comment inline`, put the severity label in each comment body. Use the latest PR head `commit_id`, `path`, `line`, and `side`, and post with `gh api` (`repos/{owner}/{repo}/pulls/{pr}/comments`), one call per finding. Add a suggestion block only when it fully fixes the issue. If the session has a GitHub inline-comment tool, use it instead.

Inline comments can only attach to lines in the PR diff. Put findings on other lines (for example, unchanged lines in a touched function) in the top-level comment. Do not drop them, and do not stop posting because one inline comment failed. If the target is not a PR, print the findings and say that `--comment` was ignored.

## Applying fixes (--fix)

With `--fix`, apply the findings to the working tree after you list them. Fix each one: correctness bugs and cleanups alike. Skip a finding when the fix would change intended behavior, needs changes well outside the reviewed diff, or you judge it a false positive, and say that you skipped it. End with a short list of what you fixed and what you skipped.

If neither `--comment` nor `--fix` is passed, stop after the Markdown report.
