'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

export const getCode = (props: ComponentPropsType) => {
  return `<Search${getPropsString(props)}/>`;
};

export const playground = {
  type: 'playground',
  controls: {
    size: {
      type: 'select',
      options: ['small', 'large'],
      defaultValue: 'large'
    },
    placeholder: { type: 'text', initialValue: 'Search...' },
    disabled: { type: 'checkbox', defaultValue: false },
    showClearButton: { type: 'checkbox', defaultValue: false }
  },
  getCode
};

export const sizeDemo = {
  type: 'code',
  code: `
  <Flex direction="column" gap={5} align="center">
    <Search placeholder="Large size search..." />
    <Search size="small" placeholder="Small size search..." />
  </Flex>`
};

export const clearDemo = {
  type: 'code',
  code: `
  <Flex direction="column" gap={5} align="center">
    <Search placeholder="Type to search..." value="Searchable text" showClearButton />
    <Search placeholder="Basic search..." />
  </Flex>`
};

export const onValueChangeDemo = {
  type: 'code',
  code: `function SearchValueChangeExample() {
  const [query, setQuery] = React.useState("");

  return (
    <Flex direction="column" gap={5} style={{ width: 400 }}>
      <Search
        placeholder="Search items..."
        value={query}
        onValueChange={setQuery}
        showClearButton
        onClear={() => setQuery("")}
      />
      <Text size="small">Query: {query || "(empty)"}</Text>
    </Flex>
  );
}`
};
