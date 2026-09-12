---
name: design-review
description: Review the design of a change or a codebase — architecture, API surface, and whether the machinery fits the problem — rather than code quality. Use to analyse a PR's design, self-review your own branch before opening a PR, or audit an existing module or package. For bug-hunting line review use /review or /code-review instead.
---

# Design Review

Review a design: what it exposes, what it costs to maintain, and
whether the machinery fits the size of the problem. The same questions
apply whether you are reviewing someone else's PR, your own work before
you open one, or a module that already shipped. Only the input and the
output change.

## Phase 0 — Pick the mode

- **Reviewer mode**: the target is a PR. Output is a proposal comment
  on the PR.
- **Author mode**: the target is your own branch or working tree,
  before the PR exists. Output is fixes applied now, plus material for
  the PR description. Cheapest time to run this review — every cliff
  found here is one no reviewer has to argue about.
- **Audit mode**: the target is an existing module, package, or public
  API. Output is a written report with ranked proposals.

## Phase 1 — Understand, then explain simply

Get the real code, not a description of it:

- Reviewer: `gh pr view <n> --json title,body,files,additions,deletions`
  and `git fetch origin pull/<n>/head:pr-<n>`.
- Author: diff against the merge base
  (`git diff $(git merge-base HEAD main)...HEAD`).
- Audit: start from the entry points — `package.json` `exports`, the
  barrel files, the README.

Before any judgment, explain in plain terms: what problem does this
solve, and what is the approach? If you cannot explain it simply, you
do not understand it yet. In author mode, write this explanation down —
it becomes the PR description's opening.

## Phase 2 — Verify every quantitative claim

Claims come from the PR description, the design doc, the README — or,
in author mode, from your own head. All get checked against the code
(`git show`, `git grep` on the target ref).

The key split: what does the code use internally vs what does it
export for consumers? The gap between those two numbers is usually
where the design question lives.

## Phase 3 — Interrogate the API surface

For each public export ask:

- Who needs this, and what breaks for them if it goes away?
- What is the maintenance contract? Every exported name is API to keep
  stable forever.
- **Find the cliff**: what happens to the user who needs one more thing
  than the curated set provides? Check the escape hatch actually exists
  — is the factory/helper exported? Are the types open or a closed
  union? Read the entry-point file, not the docs.

## Phase 4 — The value question

What does this layer add over the underlying dependency? If a consumer
bypassed it and used the dependency directly, what would they lose?
If the answer is "consistency and a stable contract", say exactly that
— do not inflate it into capability the layer doesn't have.

## Phase 5 — Right-size the machinery

Does implementation complexity match problem size? Any supporting
machinery — extra build steps, generated files, custom tooling or
checks — earns its keep at scale N; ask what N actually is here. A
plain, committed artifact that existing tooling (compiler, tests) can
check often replaces all of it. Rule of thumb: machinery that exists
to avoid writing K lines by hand is only justified when K is large.

## Phase 6 — Stress-test the alternative against the roadmap

Before proposing something simpler, check it still supports the known
future directions — ask the user what those are; in author mode, list
them yourself. A simplification that blocks the roadmap is not a
simplification. Prefer designs where the future feature "falls out for
free" from the same mechanism. Typing rule: narrow types can widen
later without breaking; wide types can never narrow back. When unsure,
ship narrow.

## Phase 7 — Ripple effects

If the proposal changes the design, follow it through docs, migration
guides, and tests. Ask: does the docs structure still match the new
center of gravity? (A smaller surface usually means less
documentation to maintain, not just less code.)

## Phase 8 — Deliver

**Reviewer mode** — a proposal comment on the PR. Draft in the
scratchpad and keep the file; the comment will be updated several
times via
`gh api repos/<owner>/<repo>/issues/comments/<id> -X PATCH -F body=@file`.

Structure:

1. Lead with the question ("Do we need to export all of this?") — no
   praise preamble, no throat-clearing.
2. The proposal, numbered, with a short code sample showing the
   user-facing result.
3. Implementation consequences (what machinery gets deleted).
4. Where this goes later (roadmap fit).
5. An honest "What we give up" close — every proposal costs something;
   name it yourself before a reviewer does.

Show the draft to the user before posting; post only on approval. As
discussion continues, PATCH the same comment rather than posting new
ones — one coherent proposal, not a thread of fragments. Keep new
sections in reading order (insert before the trade-offs close, not
appended after it).

**Author mode** — apply what you agree with now, while it's cheap.
What you decide *not* to change goes into the PR description with its
reasoning: state the cliff and its escape hatch, the machinery
trade-off, and the "what we give up" yourself. A PR that answers the
design questions before they're asked reviews faster.

**Audit mode** — a report (markdown file or artifact) with the same
structure as the reviewer comment, but with proposals ranked by
value-for-effort, since nothing is gated on a merge.

## Phase 9 — Record

Save a memory note: the target, the proposal summary, links (comment
URL or report path), and status (awaiting author / accepted /
rejected / applied). Update it as things evolve.
