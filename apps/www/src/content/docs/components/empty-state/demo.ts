"use client";

import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  return `<EmptyState
  ${getPropsString(props)}
      primaryAction={<Button>Primary Action</Button>}
      secondaryAction={<Button variant="text">Secondary Action</Button>}
    />`;
};
export const playground = {
  type: "playground",
  controls: {
    heading: { type: "text", initialValue: "No Data Available" },
    subHeading: { type: "text", initialValue: "Try adjusting your filters." },
    icon: { type: "icon", initialValue: "<X size={16} />" },
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
