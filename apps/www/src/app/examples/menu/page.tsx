'use client';
import { Button, Flex, Menu } from '@raystack/apsara';

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
      <Button>Hello</Button>
      <Menu autocomplete>
        <Menu.Trigger render={<Button />}>Open Menu</Menu.Trigger>
        <Menu.Content>
          <Menu.Item>Item 1</Menu.Item>
          <Menu.Item>Item 2</Menu.Item>
          <Menu.Item>Item 3</Menu.Item>
        </Menu.Content>
      </Menu>
    </Flex>
  );
};

export default Page;
