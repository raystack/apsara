# Composition Patterns

Use this when assembling multi-part Apsara components (overlays, menus, selects, tabs, forms) so the structure and props are correct. Apsara wraps Base UI, so its composition model follows Base UI conventions.

## The compound dot-notation pattern

Apsara exports **one name per component** and hangs every sub-part off it as a property. Import the single root; reach sub-parts with dots:

```tsx
import { Dialog, Button } from "@raystack/apsara";

<Dialog>
  <Dialog.Trigger render={<Button />}>Open</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Title</Dialog.Title>
    </Dialog.Header>
    <Dialog.Body>
      <Dialog.Description>Body copy</Dialog.Description>
    </Dialog.Body>
    <Dialog.Footer>
      <Dialog.Close render={<Button variant="outline" color="neutral">Cancel</Button>} />
      <Button>OK</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>
```

There is **no** `DialogContent`, `SelectTrigger`, etc. as flat exports. If migrating from shadcn/Radix/coss, convert flat names to dot-notation (`DialogContent` → `Dialog.Content`).

## Composing a custom element into a part: `render` (not `asChild`)

Base UI uses a `render` prop to merge a part's behavior/props onto your element. Use it on triggers, closes, and any part you want to render as a different element.

```tsx
// Render the dialog trigger AS an Apsara Button:
<Dialog.Trigger render={<Button variant="outline" />}>Open</Dialog.Trigger>

// Close button rendered as a Button:
<Dialog.Close render={<Button color="neutral">Cancel</Button>} />
```

- `render` replaces the old Radix/shadcn `asChild` mental model. Don't pass `asChild`.
- `render` can also take a function for full control: `render={(props) => <a {...props} />}`.

## Trigger + content overlays (Dialog, Popover, Tooltip, Menu, …)

Common shape: a `Root` holds a `Trigger` and a portaled content part. The trigger must live inside the root.

```tsx
import { Popover, Button } from "@raystack/apsara";

<Popover>
  <Popover.Trigger render={<Button variant="outline" />}>Details</Popover.Trigger>
  <Popover.Content>…</Popover.Content>
</Popover>
```

Controlled state (for cross-component flows — e.g. a menu item opening a dialog) uses `open` + `onOpenChange`:

```tsx
const [open, setOpen] = useState(false);
<Dialog open={open} onOpenChange={setOpen}>
  <Dialog.Content>…</Dialog.Content>
</Dialog>
```

Several overlay roots (`Dialog`, `Menu`, `Popover`, `Tooltip`) also expose `createHandle` for advanced imperative open/close from outside the subtree — use only when a trigger can't live in the same tree.

## Select

`Select.Value` (with `placeholder`) goes inside `Select.Trigger`; options are `Select.Item` children inside `Select.Content`. Items are children-based — no items array required.

```tsx
import { Select } from "@raystack/apsara";

<Select>
  <Select.Trigger width={200}>
    <Select.Value placeholder="Select a fruit" />
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.Label>Fruits</Select.Label>
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="banana">Banana</Select.Item>
    </Select.Group>
  </Select.Content>
</Select>
```

- Put `placeholder` on `Select.Value`, not the trigger.
- `Select.Item` supports `leadingIcon`; `disabled` marks unavailable rows.
- Sub-parts: `Select.Trigger`, `Select.Value`, `Select.Content`, `Select.Item`, `Select.Group`, `Select.Label`, `Select.Separator`, `Select.List`.

## Menu / ContextMenu

```tsx
import { Menu, Button } from "@raystack/apsara";

<Menu>
  <Menu.Trigger render={<Button variant="outline" />}>Actions</Menu.Trigger>
  <Menu.Content>
    <Menu.Item onClick={onEdit}>Edit</Menu.Item>
    <Menu.Separator />
    <Menu.Submenu>
      <Menu.SubmenuTrigger>More</Menu.SubmenuTrigger>
      <Menu.SubmenuContent>
        <Menu.Item onClick={onArchive}>Archive</Menu.Item>
      </Menu.SubmenuContent>
    </Menu.Submenu>
  </Menu.Content>
</Menu>
```

- Menu actions use `onClick` (not Radix's `onSelect`).
- Sub-parts: `Menu.Trigger`, `Menu.Content`, `Menu.Item`, `Menu.Group`, `Menu.Label`, `Menu.Separator`, `Menu.EmptyState`, `Menu.Submenu`, `Menu.SubmenuTrigger`, `Menu.SubmenuContent`.

## Tabs

```tsx
import { Tabs } from "@raystack/apsara";

<Tabs defaultValue="overview">
  <Tabs.List>
    <Tabs.Tab value="overview">Overview</Tabs.Tab>
    <Tabs.Tab value="activity">Activity</Tabs.Tab>
  </Tabs.List>
  <Tabs.Content value="overview">…</Tabs.Content>
  <Tabs.Content value="activity">…</Tabs.Content>
</Tabs>
```

## Forms (`Form` + `Field`)

Wrap form-bound controls in `Field` so label, description, and error stay wired and accessible. `Form` handles submission/validation.

```tsx
import { Form, Field, Input, Button } from "@raystack/apsara";

<Form onSubmit={handleSubmit}>
  <Field>
    <Field.Label>Email</Field.Label>
    <Input type="email" name="email" />
    <Field.Error />
  </Field>
  <Button type="submit">Save</Button>
</Form>
```

- Always set `type` on inputs (`type="email"`) and buttons (`submit`/`button`/`reset`).
- Provide a visible label or `aria-label` for every control.
- Fetch `form.mdx` / `field.mdx` from the docs for the exact sub-parts and validation props.

## Composition rules & anti-patterns

- **Do** use dot-notation sub-parts exactly as exported; **don't** invent flat names.
- **Do** compose custom elements with `render`; **don't** use `asChild`.
- **Do** keep required structural parts (title/description in dialogs, value in select triggers) for accessibility.
- **Don't** mix one component's API onto another (e.g. Select patterns inside Menu).
- **Don't** assume a shadcn/Radix prop exists — verify against the component's `.mdx` page (`https://apsara.raystack.org/docs/components/<name>.mdx`).
