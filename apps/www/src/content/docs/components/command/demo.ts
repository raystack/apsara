'use client';

export const preview = {
  type: 'code',
  code: `
  <Flex style={{ width: 400 }}>
    <Command>
      <Command.Panel>
        <Command.Input placeholder="Search..." />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group>
            <Command.Label>Actions</Command.Label>
            <Command.Item leadingIcon={<TransformIcon />}>
              Create AOI...
              <Command.Shortcut>
                <span>⌘</span>
                <span>⇧</span>
                <span>A</span>
              </Command.Shortcut>
            </Command.Item>
            <Command.Item leadingIcon={<Share2Icon />}>
              Run workflow...
              <Command.Shortcut>
                <span>⌘</span>
                <span>⇧</span>
                <span>W</span>
              </Command.Shortcut>
            </Command.Item>
            <Command.Item leadingIcon={<FileIcon />}>
              View documentation
              <Command.Shortcut>
                <OpenInNewWindowIcon />
              </Command.Shortcut>
            </Command.Item>
          </Command.Group>
          <Command.Group>
            <Command.Label>Foundations</Command.Label>
            <Command.Item leadingIcon={<FontFamilyIcon />}>
              Typography
            </Command.Item>
            <Command.Item leadingIcon={<Component1Icon />}>
              Design Tokens
            </Command.Item>
            <Command.Item leadingIcon={<LayersIcon />}>
              Styles
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command.Panel>
    </Command>
  </Flex>`
};

export const basicDemo = {
  type: 'code',
  code: `
  <Flex style={{ width: 420 }}>
    <Command>
      <Command.Panel>
        <Command.Input placeholder="Search..." />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Item>Calendar</Command.Item>
          <Command.Item>Search Emoji</Command.Item>
          <Command.Item>Calculator</Command.Item>
          <Command.Item>Profile</Command.Item>
          <Command.Item>Billing</Command.Item>
          <Command.Item>Settings</Command.Item>
        </Command.List>
      </Command.Panel>
    </Command>
  </Flex>`
};

export const groupedDemo = {
  type: 'code',
  code: `
  <Flex style={{ width: 420 }}>
    <Command>
      <Command.Panel>
        <Command.Input placeholder="Type a command or search..." />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group>
            <Command.Label>Suggestions</Command.Label>
            <Command.Item>Calendar</Command.Item>
            <Command.Item>Search Emoji</Command.Item>
            <Command.Item>Calculator</Command.Item>
          </Command.Group>
          <Command.Separator />
          <Command.Group>
            <Command.Label>Settings</Command.Label>
            <Command.Item>Profile</Command.Item>
            <Command.Item>Billing</Command.Item>
            <Command.Item>Settings</Command.Item>
          </Command.Group>
        </Command.List>
      </Command.Panel>
    </Command>
  </Flex>`
};

export const withIconsDemo = {
  type: 'code',
  code: `
  <Flex style={{ width: 420 }}>
    <Command>
      <Command.Panel>
        <Command.Input placeholder="Search..." />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Item leadingIcon={<Calendar size={16} />}>Calendar</Command.Item>
          <Command.Item leadingIcon={<Smile size={16} />}>Search Emoji</Command.Item>
          <Command.Item leadingIcon={<Calculator size={16} />}>Calculator</Command.Item>
          <Command.Item leadingIcon={<User size={16} />}>Profile</Command.Item>
          <Command.Item leadingIcon={<CreditCard size={16} />}>Billing</Command.Item>
          <Command.Item leadingIcon={<Settings size={16} />}>Settings</Command.Item>
        </Command.List>
      </Command.Panel>
    </Command>
  </Flex>`
};

export const withShortcutsDemo = {
  type: 'code',
  code: `
  <Flex style={{ width: 420 }}>
    <Command>
      <Command.Panel>
        <Command.Input placeholder="Search..." />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Item>
            Profile <Command.Shortcut>⌘P</Command.Shortcut>
          </Command.Item>
          <Command.Item>
            Billing <Command.Shortcut>⌘B</Command.Shortcut>
          </Command.Item>
          <Command.Item>
            Settings <Command.Shortcut>⌘S</Command.Shortcut>
          </Command.Item>
        </Command.List>
        <Command.Footer>
          <span>Press <Command.Shortcut>↵</Command.Shortcut> to select</span>
          <span><Command.Shortcut>ESC</Command.Shortcut> to close</span>
        </Command.Footer>
      </Command.Panel>
    </Command>
  </Flex>`
};

export const dialogDemo = {
  type: 'code',
  code: `
  function CommandDialogExample() {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
      const handler = (event) => {
        if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
          event.preventDefault();
          setOpen(prev => !prev);
        }
      };
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    }, []);

    return (
      <Flex direction="column" gap="medium" align="center">
        <Text>
          Press <Command.Shortcut>⌘K</Command.Shortcut> to open the command menu
        </Text>
        <Command.Dialog open={open} onOpenChange={setOpen}>
          <Command.Dialog.Trigger render={<Button variant="outline" />}>
            Open Command Menu
          </Command.Dialog.Trigger>
          <Command.Dialog.Content>
            <Command>
              <Command.Input placeholder="Type a command or search..." />
              <Command.List>
                <Command.Empty>No results found.</Command.Empty>
                <Command.Group>
                  <Command.Label>Suggestions</Command.Label>
                  <Command.Item onClick={() => setOpen(false)}>Calendar</Command.Item>
                  <Command.Item onClick={() => setOpen(false)}>Search Emoji</Command.Item>
                  <Command.Item onClick={() => setOpen(false)}>Calculator</Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </Command.Dialog.Content>
        </Command.Dialog>
      </Flex>
    );
  }`
};

export const controlledDemo = {
  type: 'code',
  code: `
  function ControlledCommand() {
    const [value, setValue] = React.useState('');

    return (
      <Flex direction="column" gap="medium" style={{ width: 420 }}>
        <Text>Query: {value || '(empty)'}</Text>
        <Command value={value} onValueChange={setValue}>
          <Command.Panel>
            <Command.Input placeholder="Search..." />
            <Command.List>
              <Command.Empty>No results found.</Command.Empty>
              <Command.Item>Calendar</Command.Item>
              <Command.Item>Search Emoji</Command.Item>
              <Command.Item>Calculator</Command.Item>
            </Command.List>
          </Command.Panel>
        </Command>
      </Flex>
    );
  }`
};
