'use client';

export const preview = {
  type: 'code',
  code: `
  <Box
    style={{
      padding: "var(--rs-space-5)",
      background: "var(--rs-color-background-base-primary)",
      border: "1px solid var(--rs-color-border-base-primary)",
      borderRadius: "var(--rs-radius-2)"
    }}
  >
    <Text>Box renders a plain div.</Text>
  </Box>`
};

export const basicDemo = {
  type: 'code',
  code: `
  <Box
    style={{
      width: 240,
      padding: "var(--rs-space-4)",
      background: "var(--rs-color-background-base-primary)",
      border: "1px solid var(--rs-color-border-base-primary)",
      borderRadius: "var(--rs-radius-2)"
    }}
  >
    <Text size="small">A simple container with custom styles.</Text>
  </Box>`
};

export const nestedDemo = {
  type: 'code',
  code: `
  <Box
    style={{
      padding: "var(--rs-space-5)",
      background: "var(--rs-color-background-base-secondary)",
      borderRadius: "var(--rs-radius-3)"
    }}
  >
    <Flex direction="column" gap={3}>
      <Text weight="medium">Prefer Flex for layout</Text>
      <Text size="small">
        Box adds no layout behavior — combine it with Flex or Grid when you
        need alignment, gaps, or columns.
      </Text>
    </Flex>
  </Box>`
};
