# Component Registry

Index of everything exported from `@raystack/apsara`, grouped by purpose. Use it to pick the right component, then fetch its live docs page for exact props/variants:

`https://apsara.raystack.org/docs/components/<slug>.mdx`

All components import from the root: `import { Button, Dialog } from "@raystack/apsara"`. Sub-parts are dot-notation (`Dialog.Content`) — see `composition.md`.

## Layout

| Component | Purpose | slug |
|---|---|---|
| `Box` | Generic layout primitive (display/spacing props) | — |
| `Flex` | Flexbox container (`direction`, `gap`, `align`, `justify`) | `flex` |
| `Grid` | CSS grid container | `grid` |
| `Container` | Width-constrained responsive wrapper | `container` |
| `Separator` | Visual/semantic divider | `separator` |
| `ScrollArea` | Styled custom scroll container | `scroll-area` |

## Typography

| Component | Purpose | slug |
|---|---|---|
| `Text` | Body text with `size`/`weight` token mapping | `text` |
| `Headline` | Display/heading text | `headline` |
| `Label` | Accessible form label | `label` |
| `Link` | Styled anchor | `link` |
| `CodeBlock` | Syntax-highlighted code block | `code-block` |

## Actions

| Component | Purpose | slug |
|---|---|---|
| `Button` | Primary action trigger (`variant`, `color`, `size`, `loading`, leading/trailing icons) | `button` |
| `IconButton` | Icon-only button (needs `aria-label`) | `icon-button` |
| `CopyButton` | Copy-to-clipboard button | `copy-button` |
| `Toggle` | Two-state pressable button | `toggle` |
| `FloatingActions` | Floating action cluster | `floating-actions` |

## Forms & inputs

| Component | Purpose | slug |
|---|---|---|
| `Form` | Form submission/validation wrapper | `form` |
| `Field` | Label + description + error wiring | `field` |
| `Fieldset` | Grouped controls with legend | `fieldset` |
| `Input` | Single-line text input | `input` |
| `TextArea` | Multi-line text input | `textarea` |
| `Select` | Single/multi choice from a list | `select` |
| `Combobox` | Searchable selection | `combobox` |
| `Search` | Search input | `search` |
| `Checkbox` | Boolean checkbox | `checkbox` |
| `Radio` | Mutually exclusive choice group | `radio` |
| `Switch` | On/off toggle | `switch` |
| `Slider` | Numeric range control | `slider` |
| `NumberField` | Numeric input with steppers | `number-field` |
| `OTPField` | Segmented one-time-passcode input | `otp-field` |
| `Calendar` / `DatePicker` / `RangePicker` | Date & range selection | `calendar` |
| `ColorPicker` (`* from color-picker`) | Color selection | `color-picker` |

## Overlays & popups

| Component | Purpose | slug |
|---|---|---|
| `Dialog` | Centered modal | `dialog` |
| `AlertDialog` | Confirmation modal (no outside-click close) | `alert-dialog` |
| `Drawer` | Edge drawer with swipe-to-dismiss | `drawer` |
| `SidePanel` | Side panel surface | `sidepanel` |
| `Popover` | Anchored non-modal floating content | `popover` |
| `Tooltip` | Hover/focus hint | `tooltip` |
| `PreviewCard` | Hover-triggered rich preview | `preview-card` |
| `Menu` | Dropdown action menu (groups, submenus) | `menu` |
| `Menubar` | Horizontal app menu bar | `menubar` |
| `ContextMenu` | Right-click context menu | `context-menu` |
| `Command` | Command palette | `command` |

## Navigation

| Component | Purpose | slug |
|---|---|---|
| `Sidebar` | App-shell navigation panel | `sidebar` |
| `Navbar` | Top navigation bar | `navbar` |
| `Tabs` | Tabbed panels | `tabs` |
| `Breadcrumb` | Hierarchical trail | `breadcrumb` |
| `Toolbar` | Grouped command strip | `toolbar` |

## Data display

| Component | Purpose | slug |
|---|---|---|
| `DataTable` (+ `useDataTable`) | Full-featured data table (sort/filter/virtualize, TanStack-based) | `datatable` |
| `DataView` (+ `useDataView`) | Unified table/list data view | `dataview` |
| `Table` | Primitive table markup | `table` |
| `List` | Structured list | `list` |
| `Avatar` / `AvatarGroup` (+ `getAvatarColor`) | User/entity avatars | `avatar` |
| `Badge` | Status label | `badge` |
| `Chip` | Compact token/tag | `chip` |
| `Amount` | Formatted monetary value | `amount` |
| `Image` | Image with handling | `image` |
| `EmptyState` | Empty-state placeholder | `empty-state` |

## Feedback & status

| Component | Purpose | slug |
|---|---|---|
| `Toast` (+ `toastManager`, `useToastManager`) | Transient notifications (imperative `toastManager`) | `toast` |
| `Callout` | Inline attention message | `callout` |
| `Indicator` | Status dot/indicator | `indicator` |
| `Progress` | Determinate/indeterminate progress bar | `progress` |
| `Meter` | Bounded scalar measurement | `meter` |
| `Spinner` | Indeterminate loading spinner | `spinner` |
| `Skeleton` | Loading placeholder | `skeleton` |
| `AnnouncementBar` | Page-level announcement banner | `announcement-bar` |

## Disclosure

| Component | Purpose | slug |
|---|---|---|
| `Accordion` | Stacked collapsible sections | `accordion` |
| `Collapsible` | Single expand/collapse region | `collapsible` |

## Filtering

| Component | Purpose | slug |
|---|---|---|
| `FilterChip` | Filter token with value/edit affordance | `filter-chip` |

## Theming (not visual components)

| Export | Purpose |
|---|---|
| `Theme` (alias `ThemeProvider`, deprecated) | Theme provider — wrap the app. See `theming.md`. |
| `ThemeSwitcher` | Prebuilt light/dark toggle button |
| `useTheme` | Hook to read/set theme (also at `@raystack/apsara/hooks`) |

## Notes

- A `—` slug means there's no standalone docs page (e.g. `Box`); use the component's TypeScript types.
- `DataTable` and `DataView` are large, opinionated components — always fetch their `.mdx` (and the `useDataTable`/`useDataView` hooks) before wiring data, sorting, filtering, or virtualization.
- Icons import from `@raystack/apsara/icons`, not the root.
