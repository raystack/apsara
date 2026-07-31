'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

export const getCode = (props: ComponentPropsType) => {
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
      options: ['symbol', 'narrowSymbol', 'code', 'name'],
      defaultValue: 'symbol'
    },
    notation: {
      type: 'select',
      options: ['standard', 'compact'],
      defaultValue: 'standard'
    },
    signDisplay: {
      type: 'select',
      options: ['auto', 'always', 'exceptZero', 'never'],
      defaultValue: 'auto'
    },
    minimumFractionDigits: {
      type: 'number',
      defaultValue: undefined
    },
    maximumFractionDigits: {
      type: 'number',
      defaultValue: undefined
    },
    groupDigits: {
      type: 'checkbox',
      defaultValue: true
    },
    hideCurrency: {
      type: 'checkbox',
      defaultValue: false
    },
    tabularNums: {
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
    <Amount value={129999999} groupDigits />
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

export const notationDemo = {
  type: 'code',
  code: `
  <Flex gap={4}>
    <Amount value={120000000} notation="compact" /> {/* $1.2M */}
    <Amount value={1300000} notation="compact" /> {/* $13K */}
    <Amount value={120000000} /> {/* $1,200,000.00 */}
  </Flex>
  `
};

export const signDisplayDemo = {
  type: 'code',
  code: `
  <Flex gap={4}>
    <Amount value={1299} signDisplay="always" /> {/* +$12.99 */}
    <Amount value={-1299} signDisplay="always" /> {/* -$12.99 */}
    <Amount value={0} signDisplay="exceptZero" /> {/* $0.00 */}
    <Amount value={-1299} signDisplay="never" /> {/* $12.99 */}
  </Flex>
  `
};

export const tabularNumsDemo = {
  type: 'code',
  code: `
  <Flex direction="column" gap={2}>
    {/* Tabular figures (default) keep digits aligned across rows */}
    <Amount value={111111} />
    <Amount value={909090} />
    {/* Proportional figures read better in running text */}
    <Text>
      You saved <Amount value={1299} tabularNums={false} /> today
    </Text>
  </Flex>
  `
};

export const hideCurrencyDemo = {
  type: 'code',
  code: `
  <Flex gap={4}>
    <Amount value={1299} hideCurrency /> {/* 12.99 */}
    <Amount value={1299} currency="JPY" hideCurrency /> {/* 1,299 */}
    <Amount value={1299} hideCurrency currencyDisplay="code" />{/* 12.99 — currencyDisplay is ignored */}
  </Flex>
  `
};

export const groupDigitsDemo = {
  type: 'code',
  code: `
  <Flex gap={4}>
    <Amount value={123456789} groupDigits /> {/* $1,234,567.89 */}
    <Amount value={123456789} groupDigits={false} /> {/* $1234567.89 */}
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

export const largeNumbersDemo = {
  type: 'code',
  code: `
  <Flex direction='column' gap={4}>
    {/* 
    For large numbers, use string (supports decimals) or bigint (integer-only)
    to maintain precision 
  */}
    <Amount value="999999999999999" /> {/* $9,999,999,999,999.99 */}
    <Amount value="10000100091636935" 
    valueInMinorUnits={false} hideDecimals />{/* $10,000,100,091,636,935 */}

    {/*
    BigInt is always treated as major units — valueInMinorUnits is ignored
  */}
    <Amount value={BigInt("9999999999999999999")} />{/* $9,999,999,999,999,999,999.00 */}

    {/* 
    Numbers exceeding safe integer limit will show warning in console 
  */}
    <Amount value={99999999999999999} />{/* Exceeds Number.MAX_SAFE_INTEGER (~9 × 10^15) — logs a console warning */}
  </Flex>
  `
};
