'use client';
import { Combobox, Flex, Slider } from '@raystack/apsara';

const Page = () => {
  return (
    <Flex
      style={{
        height: '100vh',
        width: '100%',
        backgroundColor: 'var(--rs-color-background-base-primary)',
        padding: '80px'
      }}
      direction='column'
      gap={8}
    >
      <Slider defaultValue={50} thumbSize='small' label='Slider Label' />
    </Flex>
  );
};

export default Page;
