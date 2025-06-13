'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
  console.log('props:', props);
  return `<Amount${getPropsString(props)}/>`;
};

export const playground = {
  type: 'playground',
  controls: {
    value: {
      type: 'number',
      initialValue: 1299
    },
    currency: {
      type: 'text',
      defaultValue: 'USD'
    },
    valueInMinorUnits: {
      type: 'checkbox',
      defaultValue: true
    },
    locale: {
      type: 'text',
      defaultValue: 'en-US'
    },
    hideDecimals: {
      type: 'checkbox',
      defaultValue: false
    },
    currencyDisplay: {
      type: 'select',
      options: ['symbol', 'code', 'name'],
      defaultValue: 'symbol'
    },
    minimumFractionDigits: {
      type: 'number',
      defaultValue: undefined
    },
    maximumFractionDigits: {
      type: 'number',
      defaultValue: undefined
    },
    useGrouping: {
      type: 'checkbox',
      defaultValue: true
    }
  },
  getCode
};

export const basicDemo = {
  type: 'code',
  code: `
  <Flex gap={4}>
    <Amount value={1299} />
    <Amount value={1299} currency="EUR" locale="fr-FR" />
    <Amount value={1299} hideDecimals />
    <Amount value={1299} currencyDisplay="code" />
    <Amount value={12.99} valueInMinorUnits={false} />
    <Amount value={129999999} useGrouping />
  </Flex>
  `
};

export const currencyDemo = {
  type: 'code',
  code: `
  <Flex gap={4}>
    <Amount value={1299} currency="JPY" />
    <Amount value={1299} currency="BHD" />
    <Amount value={1299} currency="INR" />
    <Amount value={1234} minimumFractionDigits={3} maximumFractionDigits={3} />
  </Flex>
  `
};

export const valueInMinorUnitsDemo = {
  type: 'code',
  code: `
  <Flex gap={4}>
    <Amount value={1299} valueInMinorUnits /> {/* $12.99 */}
    <Amount value={12.99} valueInMinorUnits={false} /> {/* $12.99 */}
  </Flex>
  `
};

export const localeDemo = {
  type: 'code',
  code: `
  <Flex gap={4}>
    <Amount value={1299} locale="en-US" /> {/* $12.99 */}
    <Amount value={1299} currency="EUR" locale="de-DE" /> {/* 12,99 € */}
    <Amount value={1299} currency="JPY" locale="ja-JP" /> {/* ￥1,299 */}
  </Flex>
  `
};

export const hideDecimalsDemo = {
  type: 'code',
  code: `
  <Flex gap={4}>
    <Amount value={1299} hideDecimals /> {/* $12 */}
    <Amount value={1234} hideDecimals /> {/* $12 */}
  </Flex>
  `
};

export const currencyDisplayDemo = {
  type: 'code',
  code: `
  <Flex gap={4}>
    <Amount value={1299} currencyDisplay="symbol" /> {/* $12.99 */}
    <Amount value={1299} currencyDisplay="code" /> {/* USD 12.99 */}
    <Amount value={1299} currencyDisplay="name" /> {/* 12.99 US dollars */}
  </Flex>
  `
};

export const useGroupingDemo = {
  type: 'code',
  code: `
  <Flex gap={4}>
    <Amount value={123456789} useGrouping /> {/* $1,234,567.89 */}
    <Amount value={123456789} useGrouping={false} /> {/* $1234567.89 */}
  </Flex>
  `
};

export const withTextDemo = {
  type: 'code',
  code: `
  <Flex gap={4}>
    <Text>
      Total: <Amount value={1299} />
    </Text>
    <Text>
      Discount: <Amount value={-299} />
    </Text>
    <Text>
      Tax: <Amount value={199} />
    </Text>
  </Flex>
  `
};
