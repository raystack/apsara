'use client';

export const switcherDemo = {
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
