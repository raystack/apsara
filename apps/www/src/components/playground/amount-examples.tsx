'use client';

import { Amount, Flex, Text } from '@raystack/apsara/v1';
import PlaygroundLayout from './playground-layout';

export function AmountExamples() {
  return (
    <PlaygroundLayout title='Amount'>
      <Flex gap='extra-large' wrap='wrap'>
        <Flex gap='medium' align='center' direction='column'>
          <Text>
            Total: <Amount value={1299} />
          </Text>
          <Text>
            EUR: <Amount value={1299} currency='EUR' locale='fr-FR' />
          </Text>
          <Text>
            No decimals: <Amount value={1299} hideDecimals />
          </Text>
          <Text>
            Code: <Amount value={1299} currencyDisplay='code' />
          </Text>
          <Text>
            Major units: <Amount value={12.99} valueInMinorUnits={false} />
          </Text>
          <Text>
            Grouping: <Amount value={129999999} groupDigits />
          </Text>
        </Flex>
        <Flex gap='medium' align='center' direction='column'>
          <Text>
            JPY: <Amount value={1299} currency='JPY' />
          </Text>
          <Text>
            BHD: <Amount value={1299} currency='BHD' />
          </Text>
          <Text>
            INR: <Amount value={1299} currency='INR' />
          </Text>
          <Text>
            Custom min/max fraction:
            <Amount
              value={1234}
              minimumFractionDigits={3}
              maximumFractionDigits={3}
            />
          </Text>
        </Flex>
      </Flex>
    </PlaygroundLayout>
  );
}
