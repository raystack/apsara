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
      <Menu>
        <Menu.Trigger render={<Button color='neutral' />}>
          Basic Menu
        </Menu.Trigger>
        <Menu.Content name='menu'>
          <Menu.Item>Profile</Menu.Item>
          <Menu.Item>Settings</Menu.Item>
          <Menu.Separator />
          <Menu.Item>Logout</Menu.Item>
          <Menu.SubMenu>
            <Menu.SubTrigger>Sub Menu</Menu.SubTrigger>
            <Menu.SubContent name='sub-menu'>
              <Menu.Item>Sub Menu Item 1</Menu.Item>
              <Menu.Item>Sub Menu Item 2</Menu.Item>
              <Menu.Item>Sub Menu Item 3</Menu.Item>
            </Menu.SubContent>
          </Menu.SubMenu>
        </Menu.Content>
      </Menu>

      <Menu autocomplete>
        <Menu.Trigger render={<Button color='neutral' />}>
          Searchable Menu
        </Menu.Trigger>
        <Menu.Content searchPlaceholder='Search actions...' name='menu'>
          <Menu.Item>Copy</Menu.Item>
          <Menu.Item value='remove'>Delete...</Menu.Item>
          <Menu.SubMenu>
            <Menu.SubTrigger>Sub Menu</Menu.SubTrigger>
            <Menu.SubContent name='sub-menu'>
              <Menu.Item>Sub Menu Item 1</Menu.Item>
              <Menu.Item>Sub Menu Item 2</Menu.Item>
              <Menu.Item>Sub Menu Item 3</Menu.Item>
            </Menu.SubContent>
          </Menu.SubMenu>
          <Menu.Item value='remove'>Delete...</Menu.Item>
        </Menu.Content>
      </Menu>
      <Menu autocomplete>
        <Menu.Trigger render={<Button color='neutral' />}>
          Searchable Menu
        </Menu.Trigger>
        <Menu.Content searchPlaceholder='Search actions...' name='menu'>
          <Menu.Item>Copy</Menu.Item>
          <Menu.Item value='remove'>Delete...</Menu.Item>
          <Menu.SubMenu autocomplete>
            <Menu.SubTrigger>Sub Menu</Menu.SubTrigger>
            <Menu.SubContent name='sub-menu'>
              <Menu.Item>Sub Menu Item 1</Menu.Item>
              <Menu.Item>Sub Menu Item 2</Menu.Item>
              <Menu.Item>Sub Menu Item 3</Menu.Item>
            </Menu.SubContent>
          </Menu.SubMenu>
          <Menu.Item value='remove'>Delete...</Menu.Item>
        </Menu.Content>
      </Menu>
    </Flex>
  );
};

export default Page;
