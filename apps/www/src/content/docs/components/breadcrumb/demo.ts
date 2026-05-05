'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

export const getCode = (props: ComponentPropsType) => {
  return `<Breadcrumb${getPropsString(props)}>
        <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
        <Breadcrumb.Separator/>
        <Breadcrumb.Item href="#">Products</Breadcrumb.Item>
        <Breadcrumb.Separator/>
        <Breadcrumb.Item href="#" current>Shoes</Breadcrumb.Item>
      </Breadcrumb>`;
};

export const playground = {
  type: 'playground',
  controls: {
    size: {
      type: 'select',
      options: ['small', 'medium'],
      defaultValue: 'medium'
    }
  },
  getCode
};

export const sizeDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Small',
      code: `
  <Breadcrumb size="small">
    <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="#">Products</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="#" current>Shoes</Breadcrumb.Item>
  </Breadcrumb>`
    },
    {
      name: 'Medium',
      code: `
  <Breadcrumb size="medium">
    <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="#">Products</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="#" current>Shoes</Breadcrumb.Item>
  </Breadcrumb>`
    }
  ]
};

export const separatorDemo = {
  type: 'code',
  code: `
  <Flex gap="medium" direction="column">
    <Breadcrumb>
      <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
      <Breadcrumb.Separator>|</Breadcrumb.Separator>
      <Breadcrumb.Item href="#">Products</Breadcrumb.Item>
      <Breadcrumb.Separator>|</Breadcrumb.Separator>
      <Breadcrumb.Item href="#" current>Shoes</Breadcrumb.Item>
    </Breadcrumb>
    <Breadcrumb>
      <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
      <Breadcrumb.Separator>-</Breadcrumb.Separator>
      <Breadcrumb.Item href="#">Products</Breadcrumb.Item>
      <Breadcrumb.Separator>-</Breadcrumb.Separator>
      <Breadcrumb.Item href="#" current>Shoes</Breadcrumb.Item>
    </Breadcrumb>
  </Flex>`
};

export const ellipsisDemo = {
  type: 'code',
  code: `
  <Breadcrumb>
    <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Ellipsis/>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="#" current>Shoes</Breadcrumb.Item>
  </Breadcrumb>`
};

export const dropdownDemo = {
  type: 'code',
  code: `
  <Breadcrumb>
    <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="#">Category</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item dropdownItems={[
        { children: 'Option 1', onClick: () => {console.log('Option 1')}},
        { children: 'Option 2', onClick: () => {console.log('Option 2')}}
      ]}>Subcategory</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="#">Current Page</Breadcrumb.Item>
  </Breadcrumb>`
};

export const dropdownLinksDemo = {
  type: 'code',
  code: `
  <Breadcrumb>
    <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item dropdownItems={[
        { children: 'Electronics', render: <a href="#" target="_blank" rel="noopener noreferrer" /> },
        { children: 'Clothing', render: <a href="#" /> },
        { children: 'Books', onClick: () => {console.log('Books')}}
      ]}>Categories</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="#" current>Current</Breadcrumb.Item>
  </Breadcrumb>`
};

export const asDemo = {
  type: 'code',
  code: `
  <Breadcrumb>
    <Breadcrumb.Item href="#" render={<NextLink />}>Home</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="#" render={<NextLink />}>Playground</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="#" current>Docs</Breadcrumb.Item>
  </Breadcrumb>`
};

export const disabledDemo = {
  type: 'code',
  code: `
  <Breadcrumb>
    <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item disabled>Loading…</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="#" current>Products</Breadcrumb.Item>
  </Breadcrumb>`
};

export const iconsDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Leading Icon',
      code: `
      <Breadcrumb>
        <Breadcrumb.Item href="#" leadingIcon={<BellIcon />}>Home</Breadcrumb.Item>
        <Breadcrumb.Separator/>
        <Breadcrumb.Item href="#" leadingIcon={<FilterIcon />}>Documents</Breadcrumb.Item>
        <Breadcrumb.Separator/>
        <Breadcrumb.Item href="#" leadingIcon={<ShoppingBagFilledIcon />}>Settings</Breadcrumb.Item>
      </Breadcrumb>`
    },
    {
      name: 'Trailing Icon',
      code: `
      <Breadcrumb>
        <Breadcrumb.Item href="#" trailingIcon={<BellIcon />}>Home</Breadcrumb.Item>
        <Breadcrumb.Separator/>
        <Breadcrumb.Item href="#" trailingIcon={<FilterIcon />}>Documents</Breadcrumb.Item>
        <Breadcrumb.Separator/>
        <Breadcrumb.Item href="#" trailingIcon={<ShoppingBagFilledIcon />}>Settings</Breadcrumb.Item>
      </Breadcrumb>`
    },
    {
      name: 'Both Icons',
      code: `
      <Breadcrumb>
        <Breadcrumb.Item href="#" leadingIcon={<BellIcon />} trailingIcon={<FilterIcon />}>Home</Breadcrumb.Item>
        <Breadcrumb.Separator/>
        <Breadcrumb.Item href="#" leadingIcon={<FilterIcon />} trailingIcon={<ShoppingBagFilledIcon />}>Documents</Breadcrumb.Item>
        <Breadcrumb.Separator/>
        <Breadcrumb.Item href="#" leadingIcon={<ShoppingBagFilledIcon />} trailingIcon={<BellIcon />}>Settings</Breadcrumb.Item>
      </Breadcrumb>`
    },
    {
      name: 'Only Icon',
      code: `
      <Breadcrumb>
        <Breadcrumb.Item href="#" leadingIcon={<BellIcon />}/>
        <Breadcrumb.Separator/>
        <Breadcrumb.Item href="#" leadingIcon={<FilterIcon />}/>
        <Breadcrumb.Separator/>
        <Breadcrumb.Item href="#" leadingIcon={<ShoppingBagFilledIcon />}/>
      </Breadcrumb>`
    }
  ]
};
