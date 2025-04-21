"use client";

import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  return `
  <DropdownMenu${getPropsString(props)}>
    <DropdownMenu.Trigger asChild>
      <Button color="neutral">Dropdown button</Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Group>
        <DropdownMenu.Item>Assign member...</DropdownMenu.Item>
        <DropdownMenu.Item>Subscribe...</DropdownMenu.Item>
        <DropdownMenu.Item>Rename...</DropdownMenu.Item>
      </DropdownMenu.Group>
      <DropdownMenu.Separator />
      <DropdownMenu.Label>Actions</DropdownMenu.Label>
      <DropdownMenu>
        <DropdownMenu.TriggerItem>
          Export
        </DropdownMenu.TriggerItem>
        <DropdownMenu.Content>
          <DropdownMenu>
            <DropdownMenu.Item>All (.zip)</DropdownMenu.Item>
            <DropdownMenu.TriggerItem>
              CSV
            </DropdownMenu.TriggerItem>
            <DropdownMenu.Content>
              <DropdownMenu.Item>All</DropdownMenu.Item>
              <DropdownMenu.Item>3 Months</DropdownMenu.Item>
              <DropdownMenu.Item>6 Months</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenu.TriggerItem>
              PDF
            </DropdownMenu.TriggerItem>
            <DropdownMenu.Content>
              <DropdownMenu.Item>All</DropdownMenu.Item>
              <DropdownMenu.Item>3 Months</DropdownMenu.Item>
              <DropdownMenu.Item>6 Months</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </DropdownMenu.Content>
      </DropdownMenu>
      <DropdownMenu.Item disabled>Copy</DropdownMenu.Item>
      <DropdownMenu.Item
        trailingIcon={
          <Text size="micro" variant="secondary">
            ⌘⇧D
          </Text>
        }>
        Delete...
      </DropdownMenu.Item>
    </DropdownMenu.Content>
    </DropdownMenu>`;
};

export const playground = {
  type: "playground",
  controls: {
    autocomplete: {
      type: "checkbox",
      defaultValue: false,
    },
  },
  getCode,
};

export const basicDemo = {
  type: "code",
  code: `
  <DropdownMenu>
    <DropdownMenu.Trigger asChild>
      <Button color="neutral">Open Menu</Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Item>Profile</DropdownMenu.Item>
      <DropdownMenu.Item>Settings</DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.Item>Logout</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu>`,
};
export const iconsDemo = {
  type: "code",
  code: `
  <DropdownMenu>
    <DropdownMenu.Trigger asChild>
      <Button color="neutral">Actions</Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Item leadingIcon={<>📝</>}>Edit</DropdownMenu.Item>
      <DropdownMenu.Item leadingIcon={<>📋</>} trailingIcon={<>⌘C</>}>Copy</DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.Item leadingIcon={<>🗑️</>}>Delete</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu>`,
};

export const customDemo = {
  type: "code",
  code: `
  <DropdownMenu>
    <DropdownMenu.Trigger asChild>
      <Button color="neutral">More</Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Label>Actions</DropdownMenu.Label>
      <DropdownMenu.Group>
        <DropdownMenu.Item>New File</DropdownMenu.Item>
        <DropdownMenu.Item>New Folder</DropdownMenu.Item>
      </DropdownMenu.Group>
      <DropdownMenu.Separator />
      <DropdownMenu.Label>Sort By</DropdownMenu.Label>
      <DropdownMenu.Group>
        <DropdownMenu.Item>Name</DropdownMenu.Item>
        <DropdownMenu.Item>Date</DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu>`,
};
