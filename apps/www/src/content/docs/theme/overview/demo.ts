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
      <ThemePreview
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
      </ThemePreview>
    ))}
  </Flex>`
};

export const accentDemo = {
  type: 'code',
  code: `
  <Flex gap={5} align="start">
    {["indigo", "orange", "mint"].map(accent => (
      <ThemePreview
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
      </ThemePreview>
    ))}
  </Flex>`
};

export const radiusDemo = {
  type: 'code',
  code: `
  <Flex gap={5} align="start">
    {["none", "small", "medium", "large", "full"].map(radius => (
      <ThemePreview
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
      </ThemePreview>
    ))}
  </Flex>`
};

export const scalingDemo = {
  type: 'code',
  code: `
  <Flex gap={5} align="start">
    {["0.9", "1", "1.1"].map(scaling => (
      <ThemePreview
        key={scaling}
        isRoot={false}
        defaultValue={{ scaling }}
        hasBackground={false}
      >
        <Flex direction="column" gap={3} align="start">
          <Text>{scaling}x</Text>
          <Button>Primary</Button>
        </Flex>
      </ThemePreview>
    ))}
  </Flex>`
};

export const panelBackgroundDemo = {
  type: 'code',
  code: `
  <Flex
    gap={5}
    align="start"
    style={{
      width: "100%",
      minHeight: "240px",
      padding: "var(--rs-space-7)",
      borderRadius: "var(--rs-radius-4)",
      background:
        "radial-gradient(70% 90% at 10% 10%, var(--rs-color-background-accent-emphasis), transparent 60%), radial-gradient(65% 85% at 95% 20%, var(--rs-color-background-danger-emphasis), transparent 60%), radial-gradient(90% 90% at 55% 110%, var(--rs-color-background-attention-emphasis), transparent 65%), var(--rs-color-background-accent-emphasis-hover)"
    }}
  >
    {["solid", "translucent"].map(panelBackground => (
      <ThemePreview
        key={panelBackground}
        isRoot={false}
        defaultValue={{ panelBackground }}
        hasBackground={false}
        style={{ flex: 1 }}
      >
        {/* The same two tokens every overlay surface uses */}
        <Flex
          direction="column"
          gap={3}
          align="start"
          style={{
            padding: "var(--rs-space-5)",
            borderRadius: "var(--rs-radius-4)",
            background: "var(--rs-color-panel)",
            backdropFilter: "var(--rs-panel-backdrop-filter)"
          }}
        >
          <Text weight="medium">{panelBackground}</Text>
          <Popover>
            <Popover.Trigger render={<Button variant="outline">Open popover</Button>} />
            <Popover.Content>
              <Text size="small">The popup uses the same surface.</Text>
            </Popover.Content>
          </Popover>
        </Flex>
      </ThemePreview>
    ))}
  </Flex>`
};

export const nestingDemo = {
  type: 'code',
  code: `
  <ThemePreview
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
      <ThemePreview
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
          <ThemePreview
            defaultValue={{ accentColor: "orange" }}
            style={{ padding: "var(--rs-space-5)", borderRadius: "var(--rs-radius-4)", border: "1px dashed var(--rs-color-border-base-secondary)" }}
          >
            <Flex gap={3} align="center">
              <Text size="small" variant="secondary" style={{ width: 200 }}>orange, inherited full</Text>
              <Button>Button</Button>
              <Switch defaultChecked />
            </Flex>
          </ThemePreview>
        </Flex>
      </ThemePreview>
    </Flex>
  </ThemePreview>`
};

export const layoutDemo = {
  type: 'code',
  code: `
  <ThemePreview
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
      <ThemePreview
        defaultValue={{ appearance: "dark" }}
        style={{ width: 200, padding: "var(--rs-space-4)" }}
      >
        <Flex direction="column" gap={1} align="stretch">
          <Button variant="ghost">Inbox</Button>
          <Button variant="ghost">Projects</Button>
          <Button variant="ghost">Settings</Button>
        </Flex>
      </ThemePreview>

      <Flex direction="column" gap={4} align="start" style={{ flex: 1, padding: "var(--rs-space-6)" }}>
        <Text size="large" weight="medium">Inbox</Text>
        <Input placeholder="Search messages" />
        <Flex gap={3}>
          <Button>Compose</Button>
          <Button variant="outline">Archive</Button>
        </Flex>
      </Flex>
    </Flex>
  </ThemePreview>`
};

export const portalDemo = {
  type: 'code',
  code: `
  <ThemePreview
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
  </ThemePreview>`
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

      <ThemePreview
        isRoot={false}
        value={{ appearance: dark ? "dark" : "light" }}
        style={{ padding: "var(--rs-space-5)", borderRadius: "var(--rs-radius-4)" }}
      >
        <Flex gap={3} align="center">
          <Text>Controlled by the switch</Text>
          <Button>Button</Button>
        </Flex>
      </ThemePreview>
    </Flex>
  );
}`
};

export const componentRadiusDemo = {
  type: 'code',
  code: `
  <ThemePreview isRoot={false} defaultValue={{ radius: "large" }} hasBackground={false}>
    <Flex gap={3} align="center">
      <Button>Large</Button>
      {/* Overrides the theme without compounding */}
      <Button radius="none">None</Button>
      <Button radius="small">Small</Button>
      <Button radius="full">Full</Button>
    </Flex>
  </ThemePreview>`
};

export const switcherDemo = {
  type: 'code',
  code: `
  <ThemePreview
    isRoot={false}
    defaultValue={{ appearance: "light" }}
    style={{ padding: "var(--rs-space-5)", borderRadius: "var(--rs-radius-4)" }}
  >
    <Flex gap={3} align="center">
      <ThemePreviewSwitcher />
      <Text size="small" variant="secondary">Flips this scope</Text>
    </Flex>
  </ThemePreview>`
};
