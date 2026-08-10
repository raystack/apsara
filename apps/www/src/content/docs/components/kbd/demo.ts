'use client';

export const preview = {
  type: 'code',
  code: `<Kbd.Group>
    <Kbd>⌘</Kbd>
    <Kbd>K</Kbd>
  </Kbd.Group>`
};

export const singleDemo = {
  type: 'code',
  code: `<Flex gap={5} align="center">
    <Kbd>Esc</Kbd>
    <Kbd>⌘</Kbd>
    <Kbd>⇧</Kbd>
    <Kbd>↵</Kbd>
    <Kbd>Tab</Kbd>
  </Flex>`
};

export const groupDemo = {
  type: 'code',
  code: `<Flex gap={7} align="center">
    <Kbd.Group>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </Kbd.Group>
    <Kbd.Group>
      <Kbd>⌘</Kbd>
      <Kbd>⇧</Kbd>
      <Kbd>P</Kbd>
    </Kbd.Group>
  </Flex>`
};

export const separatorDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Plus',
      code: `<Kbd.Group>
        <Kbd>⌘</Kbd>
        +
        <Kbd>K</Kbd>
      </Kbd.Group>`
    },
    {
      name: 'Then',
      code: `<Kbd.Group>
        <Kbd>G</Kbd>
        then
        <Kbd>P</Kbd>
      </Kbd.Group>`
    }
  ]
};

export const withTextDemo = {
  type: 'code',
  code: `<Flex gap={3} align="center">
    <Text size="small" variant="secondary">Press</Text>
    <Kbd.Group>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </Kbd.Group>
    <Text size="small" variant="secondary">to open the command palette</Text>
  </Flex>`
};

export const withTooltipDemo = {
  type: 'code',
  code: `<Tooltip>
    <Tooltip.Trigger render={<Button variant="outline" />}>
      Search
    </Tooltip.Trigger>
    <Tooltip.Content>
      <Flex gap={3} align="center">
        Open search
        <Kbd.Group>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </Kbd.Group>
      </Flex>
    </Tooltip.Content>
  </Tooltip>`
};
