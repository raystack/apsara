'use client';

export const scopeDemo = {
  type: 'code',
  code: `
  <Flex gap={5} align="start">
    <ThemePreview isRoot={false} defaultValue={{ appearance: "light" }} style={{ padding: 16, borderRadius: 8 }}>
      <Flex direction="column" gap={3}>
        <Text>Light scope</Text>
        <Button>Primary</Button>
      </Flex>
    </ThemePreview>

    <ThemePreview isRoot={false} defaultValue={{ appearance: "dark" }} style={{ padding: 16, borderRadius: 8 }}>
      <Flex direction="column" gap={3}>
        <Text>Dark scope</Text>
        <Button>Primary</Button>
      </Flex>
    </ThemePreview>
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

export const componentRadiusDemo = {
  type: 'code',
  code: `
  <ThemePreview isRoot={false} defaultValue={{ radius: "large" }} hasBackground={false}>
    <Flex gap={3} align="center">
      {/* Follows the theme */}
      <Button>Large</Button>
      {/* Overrides it, without compounding */}
      <Button radius="none">None</Button>
      <Button radius="small">Small</Button>
      <Button radius="full">Full</Button>
    </Flex>
  </ThemePreview>`
};

export const switcherDemo = {
  type: 'code',
  code: `<ThemePreviewSwitcher />`
};

export const panelDemo = {
  type: 'code',
  code: `<ThemePanelDemo />`
};
