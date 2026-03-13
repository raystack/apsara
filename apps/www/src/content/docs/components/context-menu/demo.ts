'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
  const contentProps = props.autocomplete
    ? ' searchPlaceholder="Search..."'
    : '';
  return `
  <ContextMenu${getPropsString(props)}>
    <ContextMenu.Trigger style={{ padding: "2em 4em", border: "1px dashed var(--rs-color-border-base-primary)", borderRadius: "var(--rs-radius-2)" }}>
      <Text>Right click here</Text>
    </ContextMenu.Trigger>
    <ContextMenu.Content${contentProps}>
      <ContextMenu.Group>
        <ContextMenu.Item>Assign member...</ContextMenu.Item>
        <ContextMenu.Item>Subscribe...</ContextMenu.Item>
        <ContextMenu.Item>Rename...</ContextMenu.Item>
      </ContextMenu.Group>
      <ContextMenu.Separator />
      <ContextMenu.Group>
      <ContextMenu.Label>Actions</ContextMenu.Label>
      <ContextMenu.Submenu>
        <ContextMenu.SubmenuTrigger>
          Export
        </ContextMenu.SubmenuTrigger>
        <ContextMenu.SubmenuContent>
          <ContextMenu.Item>CSV</ContextMenu.Item>
          <ContextMenu.Item>PDF</ContextMenu.Item>
        </ContextMenu.SubmenuContent>
      </ContextMenu.Submenu>
      <ContextMenu.Item disabled>Copy</ContextMenu.Item>
      <ContextMenu.Item
        trailingIcon={
          <Text size="micro" variant="secondary">
            ⌘⇧D
          </Text>
        }>
        Delete...
      </ContextMenu.Item>
      </ContextMenu.Group>
    </ContextMenu.Content>
    </ContextMenu>`;
};

export const playground = {
  type: 'playground',
  controls: {
    autocomplete: {
      type: 'checkbox',
      defaultValue: false
    }
  },
  getCode
};

export const basicDemo = {
  type: 'code',
  code: `
  <ContextMenu>
    <ContextMenu.Trigger style={{ padding: "2em 4em", border: "1px dashed var(--rs-color-border-base-primary)", borderRadius: "var(--rs-radius-2)" }}>
      <Text>Right click here</Text>
    </ContextMenu.Trigger>
    <ContextMenu.Content>
      <ContextMenu.Item>Profile</ContextMenu.Item>
      <ContextMenu.Item>Settings</ContextMenu.Item>
      <ContextMenu.Separator />
      <ContextMenu.Item>Logout</ContextMenu.Item>
    </ContextMenu.Content>
  </ContextMenu>`
};

export const iconsDemo = {
  type: 'code',
  code: `
  <ContextMenu>
    <ContextMenu.Trigger style={{ padding: "2em 4em", border: "1px dashed var(--rs-color-border-base-primary)", borderRadius: "var(--rs-radius-2)" }}>
      <Text>Right click here</Text>
    </ContextMenu.Trigger>
    <ContextMenu.Content>
      <ContextMenu.Item leadingIcon={<>📝</>}>Edit</ContextMenu.Item>
      <ContextMenu.Item leadingIcon={<>📋</>} trailingIcon={<>⌘C</>}>Copy</ContextMenu.Item>
      <ContextMenu.Separator />
      <ContextMenu.Item leadingIcon={<>🗑️</>}>Delete</ContextMenu.Item>
    </ContextMenu.Content>
  </ContextMenu>`
};

export const customDemo = {
  type: 'code',
  code: `
  <ContextMenu>
    <ContextMenu.Trigger style={{ padding: "2em 4em", border: "1px dashed var(--rs-color-border-base-primary)", borderRadius: "var(--rs-radius-2)" }}>
      <Text>Right click here</Text>
    </ContextMenu.Trigger>
    <ContextMenu.Content>
      <ContextMenu.Group>
        <ContextMenu.Label>Actions</ContextMenu.Label>
        <ContextMenu.Item>New File</ContextMenu.Item>
        <ContextMenu.Item>New Folder</ContextMenu.Item>
      </ContextMenu.Group>
      <ContextMenu.Separator />
      <ContextMenu.Group>
        <ContextMenu.Label>Sort By</ContextMenu.Label>
        <ContextMenu.Item>Name</ContextMenu.Item>
        <ContextMenu.Item>Date</ContextMenu.Item>
      </ContextMenu.Group>
    </ContextMenu.Content>
  </ContextMenu>`
};

export const submenuDemo = {
  type: 'code',
  code: `
  <ContextMenu>
    <ContextMenu.Trigger style={{ padding: "2em 4em", border: "1px dashed var(--rs-color-border-base-primary)", borderRadius: "var(--rs-radius-2)" }}>
      <Text>Right click here</Text>
    </ContextMenu.Trigger>
    <ContextMenu.Content>
      <ContextMenu.Item>Profile</ContextMenu.Item>
      <ContextMenu.Item>Settings</ContextMenu.Item>
      <ContextMenu.Separator />
      <ContextMenu.Item>Logout</ContextMenu.Item>
      <ContextMenu.Submenu>
        <ContextMenu.SubmenuTrigger>Sub Menu</ContextMenu.SubmenuTrigger>
        <ContextMenu.SubmenuContent>
          <ContextMenu.Item>Sub Menu Item 1</ContextMenu.Item>
          <ContextMenu.Item>Sub Menu Item 2</ContextMenu.Item>
          <ContextMenu.Item>Sub Menu Item 3</ContextMenu.Item>
        </ContextMenu.SubmenuContent>
      </ContextMenu.Submenu>
    </ContextMenu.Content>
  </ContextMenu>`
};

export const autocompleteDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Default Autocomplete',
      code: `
      <ContextMenu autocomplete>
      <ContextMenu.Trigger style={{ padding: "2em 4em", border: "1px dashed var(--rs-color-border-base-primary)", borderRadius: "var(--rs-radius-2)" }}>
        <Text>Right click here</Text>
      </ContextMenu.Trigger>
      <ContextMenu.Content searchPlaceholder="Search">
        <ContextMenu.Group>
          <ContextMenu.Label>Heading</ContextMenu.Label>
          <ContextMenu.Item>Assign member...</ContextMenu.Item>
          <ContextMenu.Item>Subscribe...</ContextMenu.Item>
          <ContextMenu.Item>Rename...</ContextMenu.Item>
        </ContextMenu.Group>
        <ContextMenu.Separator />
        <ContextMenu.Group>
        <ContextMenu.Label>Actions</ContextMenu.Label>
        <ContextMenu.Submenu>
          <ContextMenu.SubmenuTrigger>Export</ContextMenu.SubmenuTrigger>
          <ContextMenu.SubmenuContent>
            <ContextMenu.Item>All (.zip)</ContextMenu.Item>
            <ContextMenu.Submenu>
              <ContextMenu.SubmenuTrigger>CSV</ContextMenu.SubmenuTrigger>
              <ContextMenu.SubmenuContent>
                <ContextMenu.Item>All</ContextMenu.Item>
                <ContextMenu.Item>3 Months</ContextMenu.Item>
                <ContextMenu.Item>6 Months</ContextMenu.Item>
              </ContextMenu.SubmenuContent>
            </ContextMenu.Submenu>
            <ContextMenu.Submenu>
              <ContextMenu.SubmenuTrigger>PDF</ContextMenu.SubmenuTrigger>
              <ContextMenu.SubmenuContent>
                <ContextMenu.Item>All</ContextMenu.Item>
                <ContextMenu.Item>3 Months</ContextMenu.Item>
                <ContextMenu.Item>6 Months</ContextMenu.Item>
              </ContextMenu.SubmenuContent>
            </ContextMenu.Submenu>
          </ContextMenu.SubmenuContent>
        </ContextMenu.Submenu>
        <ContextMenu.Item><span>Custom Label</span></ContextMenu.Item>
        <ContextMenu.Item
          value="remove"
          trailingIcon={
            <Text size="micro" variant="secondary">
              ⌘⇧D
            </Text>
          }>
          Delete...
        </ContextMenu.Item>
        </ContextMenu.Group>
      </ContextMenu.Content>
    </ContextMenu>`
    },
    {
      name: 'Searchable Submenu',
      code: `
      <ContextMenu autocomplete>
      <ContextMenu.Trigger style={{ padding: "2em 4em", border: "1px dashed var(--rs-color-border-base-primary)", borderRadius: "var(--rs-radius-2)" }}>
        <Text>Right click here</Text>
      </ContextMenu.Trigger>
      <ContextMenu.Content searchPlaceholder="Search actions...">
        <ContextMenu.Item>Copy</ContextMenu.Item>
        <ContextMenu.Item value="remove">Delete...</ContextMenu.Item>
        <ContextMenu.Submenu autocomplete>
          <ContextMenu.SubmenuTrigger>Sub Menu</ContextMenu.SubmenuTrigger>
          <ContextMenu.SubmenuContent>
            <ContextMenu.Item>Sub Menu Item 1</ContextMenu.Item>
            <ContextMenu.Item>Sub Menu Item 2</ContextMenu.Item>
            <ContextMenu.Item>Sub Menu Item 3</ContextMenu.Item>
          </ContextMenu.SubmenuContent>
        </ContextMenu.Submenu>
      </ContextMenu.Content>
    </ContextMenu>`
    }
  ]
};
