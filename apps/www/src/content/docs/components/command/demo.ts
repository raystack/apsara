'use client';

const wrapInDialog = (body: string, extraState = '') => `
  function CommandDialogExample() {
    const [open, setOpen] = React.useState(false);${extraState}

    return (
      <Command.Dialog open={open} onOpenChange={setOpen}>
        <Command.DialogTrigger render={<Button variant="outline" />}>
          Open Command Menu
        </Command.DialogTrigger>
        <Command.DialogContent>
          <Command>
${body}
          </Command>
        </Command.DialogContent>
      </Command.Dialog>
    );
  }`;

export const preview = {
  type: 'code',
  code: wrapInDialog(`            <Command.Input placeholder="Search..." />
            <Command.Content>
              <Command.Empty>No results found.</Command.Empty>
              <Command.Group>
                <Command.Label>Actions</Command.Label>
                <Command.Item
                  leadingIcon={<TransformIcon />}
                  trailingIcon={<Command.Shortcut>⌘ ⇧ A</Command.Shortcut>}
                  onClick={() => setOpen(false)}
                >
                  Create AOI...
                </Command.Item>
                <Command.Item
                  leadingIcon={<Share2Icon />}
                  trailingIcon={<Command.Shortcut>⌘ ⇧ W</Command.Shortcut>}
                  onClick={() => setOpen(false)}
                >
                  Run workflow...
                </Command.Item>
                <Command.Item
                  leadingIcon={<FileIcon />}
                  trailingIcon={<OpenInNewWindowIcon />}
                  onClick={() => setOpen(false)}
                >
                  View documentation
                </Command.Item>
              </Command.Group>
              <Command.Group>
                <Command.Label>Foundations</Command.Label>
                <Command.Item leadingIcon={<FontFamilyIcon />} onClick={() => setOpen(false)}>
                  Typography
                </Command.Item>
                <Command.Item leadingIcon={<Component1Icon />} onClick={() => setOpen(false)}>
                  Design Tokens
                </Command.Item>
                <Command.Item leadingIcon={<LayersIcon />} onClick={() => setOpen(false)}>
                  Styles
                </Command.Item>
                <Command.Item leadingIcon={<ColorWheelIcon />} onClick={() => setOpen(false)}>
                  Colors
                </Command.Item>
                <Command.Item leadingIcon={<SpaceBetweenHorizontallyIcon />} onClick={() => setOpen(false)}>
                  Spacing
                </Command.Item>
                <Command.Item leadingIcon={<BorderSolidIcon />} onClick={() => setOpen(false)}>
                  Borders
                </Command.Item>
                <Command.Item leadingIcon={<ShadowIcon />} onClick={() => setOpen(false)}>
                  Shadows
                </Command.Item>
              </Command.Group>
            </Command.Content>`)
};

export const inlineDemo = {
  type: 'code',
  code: `
  <Flex style={{ width: 420 }}>
    <Command>
      <Command.Input placeholder="Search..." autoFocus={false} />
      <Command.Content>
        <Command.Empty>No results found.</Command.Empty>
        <Command.Item>Calendar</Command.Item>
        <Command.Item>Search Emoji</Command.Item>
        <Command.Item>Calculator</Command.Item>
        <Command.Item>Profile</Command.Item>
        <Command.Item>Billing</Command.Item>
        <Command.Item>Settings</Command.Item>
      </Command.Content>
    </Command>
  </Flex>`
};

export const groupedDemo = {
  type: 'code',
  code: wrapInDialog(`            <Command.Input placeholder="Type a command or search..." />
            <Command.Content>
              <Command.Empty>No results found.</Command.Empty>
              <Command.Group>
                <Command.Label>Suggestions</Command.Label>
                <Command.Item onClick={() => setOpen(false)}>Calendar</Command.Item>
                <Command.Item onClick={() => setOpen(false)}>Search Emoji</Command.Item>
                <Command.Item onClick={() => setOpen(false)}>Calculator</Command.Item>
              </Command.Group>
              <Command.Group>
                <Command.Label>Settings</Command.Label>
                <Command.Item onClick={() => setOpen(false)}>Profile</Command.Item>
                <Command.Item onClick={() => setOpen(false)}>Billing</Command.Item>
                <Command.Item onClick={() => setOpen(false)}>Settings</Command.Item>
              </Command.Group>
            </Command.Content>`)
};

export const withIconsDemo = {
  type: 'code',
  code: wrapInDialog(`            <Command.Input placeholder="Search..." />
            <Command.Content>
              <Command.Empty>No results found.</Command.Empty>
              <Command.Item leadingIcon={<Home />} onClick={() => setOpen(false)}>Home</Command.Item>
              <Command.Item leadingIcon={<BellIcon />} onClick={() => setOpen(false)}>Notifications</Command.Item>
              <Command.Item leadingIcon={<FilterIcon />} onClick={() => setOpen(false)}>Filters</Command.Item>
              <Command.Item leadingIcon={<OrganizationIcon />} onClick={() => setOpen(false)}>Organization</Command.Item>
              <Command.Item leadingIcon={<ShoppingBagFilledIcon />} onClick={() => setOpen(false)}>Orders</Command.Item>
              <Command.Item leadingIcon={<SidebarIcon />} onClick={() => setOpen(false)}>Layout</Command.Item>
            </Command.Content>`)
};

export const shortcutDemo = {
  type: 'code',
  code: wrapInDialog(
    `            <Command.Input placeholder="Type a command or search..." />
            <Command.Content>
              <Command.Empty>No results found.</Command.Empty>
              <Command.Group>
                <Command.Label>Suggestions</Command.Label>
                <Command.Item
                  trailingIcon={<Command.Shortcut>⌘ P</Command.Shortcut>}
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Command.Item>
                <Command.Item
                  trailingIcon={<Command.Shortcut>⌘ B</Command.Shortcut>}
                  onClick={() => setOpen(false)}
                >
                  Billing
                </Command.Item>
                <Command.Item
                  trailingIcon={<Command.Shortcut>⌘ S</Command.Shortcut>}
                  onClick={() => setOpen(false)}
                >
                  Settings
                </Command.Item>
              </Command.Group>
            </Command.Content>`,
    `

    React.useEffect(() => {
      const handler = (event) => {
        if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          setOpen(prev => !prev);
        }
      };
      document.addEventListener('keydown', handler, true);
      return () => document.removeEventListener('keydown', handler, true);
    }, []);`
  )
};

export const itemsDemo = {
  type: 'code',
  code: `
  function ItemsCommand() {
    const [open, setOpen] = React.useState(false);
    const items = [
      'Calendar',
      'Search Emoji',
      'Calculator',
      'Profile',
      'Billing',
      'Settings'
    ];

    return (
      <Command.Dialog open={open} onOpenChange={setOpen}>
        <Command.DialogTrigger render={<Button variant="outline" />}>
          Open Command Menu
        </Command.DialogTrigger>
        <Command.DialogContent>
          <Command items={items}>
            <Command.Input placeholder="Search..." />
            <Command.Content>
              {(item) => (
                <Command.Item
                  key={item}
                  value={item}
                  onClick={() => setOpen(false)}
                >
                  {item}
                </Command.Item>
              )}
            </Command.Content>
          </Command>
        </Command.DialogContent>
      </Command.Dialog>
    );
  }`
};

export const controlledDemo = {
  type: 'code',
  code: `
  function ControlledCommand() {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('');

    return (
      <Command.Dialog open={open} onOpenChange={setOpen}>
        <Command.DialogTrigger render={<Button variant="outline" />}>
          Open Command Menu
        </Command.DialogTrigger>
        <Command.DialogContent>
          <Command value={value} onValueChange={setValue}>
            <Command.Input placeholder="Search..." />
            <Command.Content>
              <Command.Empty>No results found.</Command.Empty>
              <Command.Item onClick={() => setOpen(false)}>Calendar</Command.Item>
              <Command.Item onClick={() => setOpen(false)}>Search Emoji</Command.Item>
              <Command.Item onClick={() => setOpen(false)}>Calculator</Command.Item>
            </Command.Content>
          </Command>
        </Command.DialogContent>
      </Command.Dialog>
    );
  }`
};
