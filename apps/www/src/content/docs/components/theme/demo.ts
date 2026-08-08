'use client';

export const preview = {
  type: 'code',
  code: `<ThemeSwitcher />`
};

export const switcherSizeDemo = {
  type: 'code',
  code: `
  <Flex gap={5} align="center">
    <ThemeSwitcher size={24} />
    <ThemeSwitcher size={30} />
    <ThemeSwitcher size={40} />
  </Flex>`
};

export const scopedDemo = {
  type: 'code',
  code: `
  <Flex gap={5}>
    <Theme forcedTheme="light">
      <Callout type="normal">Always light</Callout>
    </Theme>
    <Theme forcedTheme="dark">
      <Callout type="normal">Always dark</Callout>
    </Theme>
  </Flex>`
};
