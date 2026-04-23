'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
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
  <Flex direction="column" gap="medium" align="center">
    <Search placeholder="Large size search..." />
    <Search size="small" placeholder="Small size search..." />
  </Flex>`
};

export const clearDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Uncontrolled',
      code: `
      <Flex direction="column" gap="medium" align="center">
        <Search placeholder="Type to search..." showClearButton />
      </Flex>`
    },
    {
      name: 'Controlled',
      code: `
      function ControlledSearch() {
        const [value, setValue] = React.useState("Searchable text");

        return (
          <Flex direction="column" gap="medium" align="center">
            <Search
              placeholder="Type to search..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              showClearButton
              onClear={() => setValue("")}
            />
          </Flex>
        );
      }`
    }
  ]
};
