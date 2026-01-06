'use client';
import { Combobox, Flex } from '@raystack/apsara';

const Page = () => {
  return (
    <Flex
      style={{
        height: '100vh',
        width: '100%',
        backgroundColor: 'var(--rs-color-background-base-primary)',
        padding: '32px'
      }}
      direction='column'
      gap={8}
    >
      <Combobox>
        <Combobox.Input />
        <Combobox.Content>
          <Combobox.Item value='item-1'>Item 1</Combobox.Item>
          <Combobox.Item value='item-2'>Item 2</Combobox.Item>
          <Combobox.Item value='item-3'>Item 3</Combobox.Item>
        </Combobox.Content>
      </Combobox>
    </Flex>
  );
};

export default Page;
