'use client';

export const preview = {
  type: 'code',
  code: `
  <Menubar>
    <Menu>
      <Menu.Trigger>File</Menu.Trigger>
      <Menu.Content>
        <Menu.Item>New Tab</Menu.Item>
        <Menu.Item>New Window</Menu.Item>
        <Menu.Separator />
        <Menu.Submenu>
          <Menu.SubmenuTrigger>Share</Menu.SubmenuTrigger>
          <Menu.SubmenuContent>
            <Menu.Item>Email Link</Menu.Item>
            <Menu.Item>Messages</Menu.Item>
          </Menu.SubmenuContent>
        </Menu.Submenu>
        <Menu.Separator />
        <Menu.Item>Print</Menu.Item>
      </Menu.Content>
    </Menu>
    <Menu>
      <Menu.Trigger>Edit Action</Menu.Trigger>
      <Menu.Content>
        <Menu.Item>Undo Action</Menu.Item>
        <Menu.Item>Redo Action</Menu.Item>
        <Menu.Separator />
        <Menu.Item>Cut</Menu.Item>
        <Menu.Item>Copy</Menu.Item>
        <Menu.Item>Paste</Menu.Item>
      </Menu.Content>
    </Menu>
    <Menu>
      <Menu.Trigger>View</Menu.Trigger>
      <Menu.Content>
        <Menu.Item>Zoom In</Menu.Item>
        <Menu.Item>Zoom Out</Menu.Item>
        <Menu.Separator />
        <Menu.Item>Fullscreen</Menu.Item>
      </Menu.Content>
    </Menu>
  </Menubar>`
};

export const verticalDemo = {
  type: 'code',
  code: `
  <Menubar orientation="vertical">
    <Menu>
      <Menu.Trigger>File</Menu.Trigger>
      <Menu.Content side="right">
        <Menu.Item>New</Menu.Item>
        <Menu.Item>Open</Menu.Item>
        <Menu.Item>Save</Menu.Item>
      </Menu.Content>
    </Menu>
    <Menu>
      <Menu.Trigger>Edit</Menu.Trigger>
      <Menu.Content side="right">
        <Menu.Item>Undo</Menu.Item>
        <Menu.Item>Redo</Menu.Item>
      </Menu.Content>
    </Menu>
  </Menubar>`
};

export const autocompleteDemo = {
  type: 'code',
  code: `
  <Menubar>
    <Menu>
      <Menu.Trigger>Settings</Menu.Trigger>
      <Menu.Content>
        <Menu.Item>Preferences</Menu.Item>
        <Menu.Item>Themes</Menu.Item>
      </Menu.Content>
    </Menu>
    <Menu autocomplete>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Content searchPlaceholder="Search actions...">
        <Menu.Group>
          <Menu.Label>General</Menu.Label>
          <Menu.Item>Assign member...</Menu.Item>
          <Menu.Item>Subscribe...</Menu.Item>
          <Menu.Item>Rename...</Menu.Item>
        </Menu.Group>
        <Menu.Separator />
        <Menu.Group>
          <Menu.Label>Editing</Menu.Label>
          <Menu.Item>Copy</Menu.Item>
          <Menu.Item value="remove">Delete...</Menu.Item>
        </Menu.Group>
      </Menu.Content>
    </Menu>
  </Menubar>`
};
