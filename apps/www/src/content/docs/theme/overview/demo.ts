'use client';

export const panelDemo = {
  type: 'code',
  code: `<ThemePanelDemo />`
};

export const appearanceDemo = {
  type: 'code',
  code: `
  <Flex gap={5} align="start">
    {["light", "dark"].map(appearance => (
      <Theme
        key={appearance}
        isRoot={false}
        defaultValue={{ appearance }}
        style={{ padding: "var(--rs-space-5)", borderRadius: "var(--rs-radius-4)" }}
      >
        <Flex direction="column" gap={3} align="start">
          <Text>{appearance}</Text>
          <Button>Primary</Button>
          <Input placeholder="Input" />
        </Flex>
      </Theme>
    ))}
  </Flex>`
};

export const accentDemo = {
  type: 'code',
  code: `
  <Flex gap={5} align="start">
    {["indigo", "orange", "mint"].map(accent => (
      <Theme
        key={accent}
        isRoot={false}
        defaultValue={{ accentColor: accent }}
        hasBackground={false}
      >
        <Flex direction="column" gap={3} align="start">
          <Text>{accent}</Text>
          <Button>Primary</Button>
          <Badge>Badge</Badge>
        </Flex>
      </Theme>
    ))}
  </Flex>`
};

export const radiusDemo = {
  type: 'code',
  code: `
  <Flex gap={5} align="start">
    {["none", "small", "medium", "large", "full"].map(radius => (
      <Theme
        key={radius}
        isRoot={false}
        defaultValue={{ radius }}
        hasBackground={false}
      >
        <Flex direction="column" gap={3} align="start">
          <Text>{radius}</Text>
          <Button>Primary</Button>
          <Switch defaultChecked />
        </Flex>
      </Theme>
    ))}
  </Flex>`
};

export const scalingDemo = {
  type: 'code',
  code: `
  <Flex gap={5} align="start">
    {["0.9", "1", "1.1"].map(scaling => (
      <Theme
        key={scaling}
        isRoot={false}
        defaultValue={{ scaling }}
        hasBackground={false}
      >
        <Flex direction="column" gap={3} align="start">
          <Text>{scaling}x</Text>
          <Button>Primary</Button>
        </Flex>
      </Theme>
    ))}
  </Flex>`
};

export const panelBackgroundDemo = {
  type: 'code',
  code: `
  <Flex gap={7} align="start" style={{ width: "100%" }}>
    {["solid", "translucent"].map(panelBackground => (
      <Theme
        key={panelBackground}
        isRoot={false}
        defaultValue={{ panelBackground }}
        hasBackground={false}
        style={{ flex: 1, minWidth: 0 }}
      >
        <Flex direction="column" gap={4} align="start">
          <Popover>
            <Popover.Trigger render={<Button variant="outline">{panelBackground}</Button>} />
            <Popover.Content>
              <Text size="small">The popup paints --rs-color-panel.</Text>
            </Popover.Content>
          </Popover>
          <Text size="small" variant="secondary">
            Open the popup: it covers this paragraph. On solid it hides the
            words behind it, on translucent it blurs them and lets them tint
            the surface.
          </Text>
        </Flex>
      </Theme>
    ))}
  </Flex>`
};

export const nestingDemo = {
  type: 'code',
  code: `
  <Theme
    isRoot={false}
    defaultValue={{ appearance: "light", accentColor: "indigo" }}
    style={{ width: "100%", padding: "var(--rs-space-5)", borderRadius: "var(--rs-radius-4)" }}
  >
    <Flex direction="column" gap={4}>
      <Flex gap={3} align="center">
        <Text size="small" variant="secondary" style={{ width: 200 }}>indigo, medium</Text>
        <Button>Button</Button>
        <Switch defaultChecked />
      </Flex>

      {/* Sets accent and radius; inherits appearance */}
      <Theme
        defaultValue={{ accentColor: "mint", radius: "full" }}
        style={{ padding: "var(--rs-space-5)", borderRadius: "var(--rs-radius-4)", border: "1px dashed var(--rs-color-border-base-secondary)" }}
      >
        <Flex direction="column" gap={4}>
          <Flex gap={3} align="center">
            <Text size="small" variant="secondary" style={{ width: 200 }}>mint, full</Text>
            <Button>Button</Button>
            <Switch defaultChecked />
          </Flex>

          {/* Sets only the accent; inherits the full radius */}
          <Theme
            defaultValue={{ accentColor: "orange" }}
            style={{ padding: "var(--rs-space-5)", borderRadius: "var(--rs-radius-4)", border: "1px dashed var(--rs-color-border-base-secondary)" }}
          >
            <Flex gap={3} align="center">
              <Text size="small" variant="secondary" style={{ width: 200 }}>orange, inherited full</Text>
              <Button>Button</Button>
              <Switch defaultChecked />
            </Flex>
          </Theme>
        </Flex>
      </Theme>
    </Flex>
  </Theme>`
};

export const layoutDemo = {
  type: 'code',
  code: `
  <Theme
    isRoot={false}
    defaultValue={{ appearance: "light" }}
    style={{
      width: "100%",
      borderRadius: "var(--rs-radius-4)",
      border: "1px solid var(--rs-color-border-base-primary)",
      overflow: "hidden"
    }}
  >
    <Flex align="stretch">
      {/* A dark scope paints its own background */}
      <Theme
        defaultValue={{ appearance: "dark" }}
        style={{ width: 200, padding: "var(--rs-space-4)" }}
      >
        <Flex direction="column" gap={1} align="stretch">
          <Button variant="ghost">Inbox</Button>
          <Button variant="ghost">Projects</Button>
          <Button variant="ghost">Settings</Button>
        </Flex>
      </Theme>

      <Flex direction="column" gap={4} align="start" style={{ flex: 1, padding: "var(--rs-space-6)" }}>
        <Text size="large" weight="medium">Inbox</Text>
        <Input placeholder="Search messages" />
        <Flex gap={3}>
          <Button>Compose</Button>
          <Button variant="outline">Archive</Button>
        </Flex>
      </Flex>
    </Flex>
  </Theme>`
};

export const portalDemo = {
  type: 'code',
  code: `
  <Theme
    isRoot={false}
    defaultValue={{ appearance: "dark", accentColor: "mint" }}
    style={{ padding: "var(--rs-space-6)", borderRadius: "var(--rs-radius-4)" }}
  >
    <Flex gap={3} align="center">
      <Popover>
        <Popover.Trigger render={<Button variant="outline">Popover</Button>} />
        <Popover.Content>
          <Text size="small">Rendered in a portal, themed by the scope.</Text>
        </Popover.Content>
      </Popover>

      <Select defaultValue="mint">
        <Select.Trigger style={{ width: 140 }}>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="indigo">Indigo</Select.Item>
          <Select.Item value="orange">Orange</Select.Item>
          <Select.Item value="mint">Mint</Select.Item>
        </Select.Content>
      </Select>

      <Tooltip>
        <Tooltip.Trigger render={<Button variant="outline">Tooltip</Button>} />
        <Tooltip.Content>Dark, like its trigger</Tooltip.Content>
      </Tooltip>
    </Flex>
  </Theme>`
};

export const controlledDemo = {
  type: 'code',
  code: `
function ControlledScope() {
  const [dark, setDark] = React.useState(false);

  return (
    <Flex direction="column" gap={4} align="start">
      <Flex gap={3} align="center">
        <Switch checked={dark} onCheckedChange={setDark} />
        <Text size="small">Dark</Text>
      </Flex>

      <Theme
        isRoot={false}
        value={{ appearance: dark ? "dark" : "light" }}
        style={{ padding: "var(--rs-space-5)", borderRadius: "var(--rs-radius-4)" }}
      >
        <Flex gap={3} align="center">
          <Text>Controlled by the switch</Text>
          <Button>Button</Button>
        </Flex>
      </Theme>
    </Flex>
  );
}`
};

export const componentRadiusDemo = {
  type: 'code',
  code: `
  <Theme isRoot={false} defaultValue={{ radius: "large" }} hasBackground={false}>
    <Flex gap={3} align="center">
      <Button>Large</Button>
      {/* Overrides the theme without compounding */}
      <Button radius="none">None</Button>
      <Button radius="small">Small</Button>
      <Button radius="full">Full</Button>
    </Flex>
  </Theme>`
};

export const switcherDemo = {
  type: 'code',
  code: `
  <Theme
    isRoot={false}
    defaultValue={{ appearance: "light" }}
    style={{ padding: "var(--rs-space-5)", borderRadius: "var(--rs-radius-4)" }}
  >
    <Flex gap={3} align="center">
      <ThemeSwitcher />
      <Text size="small" variant="secondary">Flips this scope</Text>
    </Flex>
  </Theme>`
};
