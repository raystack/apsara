# `icon-map.json` — provenance and design feedback

Generated from the 11 mapping tables of the Figma file
`figma.com/design/9oxYTRoRAw92LaCgDmmSCf/Icons`.

Every value was read from the **icon layer name**, not the cell text, and then validated
against the real export list of `lucide-react` 0.548.0.

## Source tables

| Table | Rows | Mapped | No lucide icon |
| --- | --- | --- | --- |
| Abstract | 44 | 42 | 2 |
| Alignment | 16 | 16 | 0 |
| Arrows | 34 | 25 | 9 |
| Borders and corners | 15 | 1 | 14 |
| Components | 28 | 24 | 4 |
| Design | 40 | 25 | 15 |
| Logos | 13 | 6 | 7 |
| Music | 12 | 12 | 0 |
| Objects | 80 | 66 | 14 |
| Radix Custom | 16 | 7 | 9 |
| Typography | 28 | 21 | 7 |
| **Total** | **326** | **245** | **81** |

`icon-map.json` itself is the authority on what Apsara ships: **243 keys — 239 lucide names
and 4 in-house SVGs.** `pnpm check:icon-map` prints the same split.

Two figures above do not reconcile with that, and neither can be settled from this repo —
both need a pass over the Figma file:

1. **Design is either 25/15 or 27/13.** The table says 15 rows have no lucide icon; the list
   at the bottom of this file names 13. One of the two is wrong, and the totals move with
   it (81 versus 79 unmapped, 245 versus 247 mapped).
2. **245 mapped rows, 243 keys.** The likeliest cause is two rows resolving to one lucide
   name — `check-icon-map.js` rejects a duplicate, so the second would have been dropped
   when the map was written. There is at least one known collapse of this kind: the old
   `BuildingsFilledIcon` and `OrganizationIcon` both land on `Building2Icon`. Whether that
   accounts for the whole gap is unconfirmed.

## Errors in the Figma file — please correct at source

The cell text disagrees with the icon actually placed in **21 rows**. The icon
is right and the text is wrong in every case. Anyone reading this file from a screenshot, a
PNG, or a PDF would copy the wrong name, because those show only the text.

| Table | Row | Radix icon | The text says | The icon really is |
| --- | --- | --- | --- | --- |
| Abstract | 37 | View Grid | `grid-2*2` | `grid-2x2` |
| Alignment | 3 | Stretch Vertically | `align-verically-justify-center` | `align-vertical-justify-center` |
| Alignment | 12 | Pin Left | `align-horizontally-distribute-start` | `align-horizontal-distribute-start` |
| Alignment | 13 | Pin Right | `align-horizontally-distribute-end` | `align-horizontal-distribute-end` |
| Alignment | 14 | Pin Top | `align-vertically-distribute-start` | `align-vertical-distribute-start` |
| Alignment | 15 | Pin Bottom | `align-vertically-distribute-end` | `align-vertical-distribute-end` |
| Borders and corners | 14 | Corners | `align-vertically-distribute-start` | `scan` |
| Components | 5 | Grid | `grid-2*2` | `grid-2x2` |
| Components | 20 | Video | `Youtube` | `youtube` |
| Design | 3 | Stack | `arrow-down` | `layers-2` |
| Design | 6 | Component 2 | `grid-2*2` | `grid-2x2` |
| Design | 28 | Dimensions | `ruler-dimention-line` | `ruler-dimension-line` |
| Design | 39 | Transform | `vector-square (icon missing)` | `vector-square` |
| Objects | 1 |  | `crop` | `settings` |
| Objects | 25 |  | `flag-tiangle-right` | `flag-triangle-right` |
| Objects | 35 |  | `text-cursor` | `file-plus` |
| Objects | 36 |  | `unfold-horizontal` | `file-minus` |
| Objects | 64 |  | `ruler-dimention-line` | `ruler-dimension-line` |
| Radix Custom | 14 | Collapse | `minimise-2` | `minimize-2` |
| Typography | 19 | Line Height | `list-chevrons-up-down` | `pencil` |
| Typography | 22 | Text Align Center | `align-centre` | `align-center` |

## Names that lucide has since renamed

The Figma file was written against an older lucide. The build resolves these by an explicit
alias list; nothing is broken, but the Figma file is out of date.

| Figma name | lucide 0.548.0 |
| --- | --- |
| `circle-help` | `CircleQuestionMark` |
| `align-left` | `TextAlignStart` |
| `align-center` | `TextAlignCenter` |
| `align-right` | `TextAlignEnd` |
| `align-justify` | `TextAlignJustify` |
| `wrap-text` | `TextWrap` |
| `X social` | `Twitter` |

`X social` must never be converted to `X`. In lucide, `X` is the close cross, not the brand
mark. `notion` has no glyph in lucide 0.548.0, so the Notion logo has no key.

## Naming rule: a key freezes at adoption

Every key is the lucide export name in Pascal case plus `Icon` — `Search` becomes
`SearchIcon`. That is how a key is *chosen*. It is not a rule the key keeps following.

**When lucide renames an icon, the value changes and the key does not.** If lucide renames
`Rocket` to `RocketShip`, the entry becomes `"RocketIcon": "RocketShip"`. It does not become
`RocketShipIcon`.

The keys are the public API of `@raystack/apsara/icons`. Tracking lucide's renames forward
would hand our consumers a breaking change every time lucide tidies its own naming, on
lucide's release schedule rather than ours — which is the exact coupling this registry exists
to remove. A key drifting away from its lucide name over time is the design working, not a
mistake to correct.

The seven names in the table above were adopted at lucide 0.548.0, so they read as lucide's
current names today. They are frozen from here.

## Open questions for design

1. **`Line Height` maps to `pencil`.** Neither the layer name nor the cell text reads as a
   line-height icon. Which icon is intended?
2. **`AI Chat`** is the only row whose Fallback column is filled in — it reads "Need to
   custom create". Apsara does not use it today, so no SVG is needed yet.
3. **`square-dashed` has two meanings** in the file: a real lucide icon, and the placeholder
   for "no equivalent". Today the cell text separates them (`--` versus the literal
   `square-dashed`). Please use a distinct placeholder glyph instead.

## Rows with no lucide icon (79 named below, 81 per the table)

These are absent from the map on purpose. Almost all are Figma editor icons that Apsara has
no use for. The Design entry names 13 rows where the table counts 15 — see the note under
the table.

- **Abstract** (2): View None, Open in New Window
- **Arrows** (9): Triangle Left, Triangle Right, Triangle Up, Triangle Down, Caret Left, Caret Right, Caret Up, Caret Down, All Sides
- **Borders and corners** (14): Border All, Border Split, Border None, Border Bottom, Border Right, Border Style, Border Solid, Border Dashed, Border Dotted, Border Width, Corner Top Left, Corner Top Right, Corner Bottom Left, Corner Bottom Right
- **Components** (4): Radiobutton, Badge, Divider Horizontal, Divider Vertical
- **Design** (13): Component None, Component Boolean, Opacity, Blending Mode, Mask On, Mask Off, Shadow, Shadow None, Shadow Inner, Shadow Outer, Transparency Grid, Margin, Padding
- **Logos** (7): Modulz logo, Sketch Logo, Stitches Logo, IconJar Logo, Vercel Logo, CodeSandbox Logo, Discord Logo
- **Objects** (14): row 17, row 18, row 22, row 24, row 26, row 29, row 37, row 39, row 40, row 43, row 53, row 54, row 68, row 70
- **Radix Custom** (9): Order ID, Copy ID, Bandset, Minus Circle Filled, Progress, Exclamation Circle, Caret Right small, Caret Down small, AI Chat
- **Typography** (7): Font Style, Font Family, Overline, Text None, Text align top, Text Align Middle, Text align bottom
