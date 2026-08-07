'use client';

export const basicDemo = {
  type: 'code',
  code: `<Flex gap={5} align="center">
  <SearchIcon />
  <ChevronDownIcon />
  <CircleCheckIcon />
  <TriangleAlertIcon />
  <CoPilotIcon />
</Flex>`
};

export const sizeDemo = {
  type: 'code',
  code: `<Flex gap={5} align="center">
  <SearchIcon />
  <SearchIcon width={20} height={20} />
  <SearchIcon width={24} height={24} />
  <SearchIcon width={32} height={32} strokeWidth={2} />
</Flex>`
};

export const colorDemo = {
  type: 'code',
  code: `<Flex gap={5} align="center">
  <SearchIcon />
  <SearchIcon style={{ color: "var(--rs-color-foreground-accent-primary)" }} />
  <SearchIcon style={{ color: "var(--rs-color-foreground-danger-primary)" }} />
  <SearchIcon style={{ color: "var(--rs-color-foreground-success-primary)" }} />
</Flex>`
};

export const overrideDemo = {
  type: 'code',
  code: `// A double chevron stands in for every ChevronDownIcon below.
const MyChevron = props => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="m7 6 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="m7 13 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

render(
  <Flex gap={7} align="center">
    <Flex direction="column" gap={3} align="center">
      <Select defaultValue="apple">
        <Select.Trigger style={{ width: 140 }}>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="apple">Apple</Select.Item>
        </Select.Content>
      </Select>
      <Text size="micro" variant="secondary">default</Text>
    </Flex>

    <Theme icons={{ ChevronDownIcon: MyChevron }}>
      <Flex direction="column" gap={3} align="center">
        <Select defaultValue="apple">
          <Select.Trigger style={{ width: 140 }}>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="apple">Apple</Select.Item>
          </Select.Content>
        </Select>
        <Text size="micro" variant="secondary">overridden</Text>
      </Flex>
    </Theme>
  </Flex>
)`
};

export const iconPropsDemo = {
  type: 'code',
  code: `<Flex gap={7} align="center">
  <Flex gap={4} align="center">
    <SearchIcon />
    <ChevronDownIcon />
    <XIcon />
  </Flex>

  <Theme iconProps={{ strokeWidth: 1.5 }}>
    <Flex gap={4} align="center">
      <SearchIcon />
      <ChevronDownIcon />
      <XIcon />
    </Flex>
  </Theme>
</Flex>`
};

export const nestedDemo = {
  type: 'code',
  code: `const Square = props => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <rect x="5" y="5" width="14" height="14" rx="2" />
  </svg>
);

const Circle = props => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <circle cx="12" cy="12" r="7" />
  </svg>
);

render(
  <Theme icons={{ XIcon: Square, CheckIcon: Circle }}>
    <Flex gap={7} align="center">
      <Flex gap={4} align="center">
        <XIcon />
        <CheckIcon />
      </Flex>

      {/* Names only XIcon, so CheckIcon keeps the outer Circle. */}
      <Theme icons={{ XIcon: Circle }}>
        <Flex gap={4} align="center">
          <XIcon />
          <CheckIcon />
        </Flex>
      </Theme>
    </Flex>
  </Theme>
)`
};
