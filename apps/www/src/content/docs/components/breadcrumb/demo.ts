'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
  return `<Breadcrumb${getPropsString(props)}>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Separator/>
        <Breadcrumb.Item href="/products">Products</Breadcrumb.Item>
        <Breadcrumb.Separator/>
        <Breadcrumb.Item href="/products/shoes" current>Shoes</Breadcrumb.Item>
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
    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="/products">Products</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="/products/shoes" current>Shoes</Breadcrumb.Item>
  </Breadcrumb>`
    },
    {
      name: 'Medium',
      code: `
  <Breadcrumb size="medium">
    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="/products">Products</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="/products/shoes" current>Shoes</Breadcrumb.Item>
  </Breadcrumb>`
    }
  ]
};

export const separatorDemo = {
  type: 'code',
  code: `
  <Flex gap="medium" direction="column">
    <Breadcrumb>
      <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
      <Breadcrumb.Separator>|</Breadcrumb.Separator>
      <Breadcrumb.Item href="/products">Products</Breadcrumb.Item>
      <Breadcrumb.Separator>|</Breadcrumb.Separator>
      <Breadcrumb.Item href="/products/shoes" current>Shoes</Breadcrumb.Item>
    </Breadcrumb>
    <Breadcrumb>
      <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
      <Breadcrumb.Separator>-</Breadcrumb.Separator>
      <Breadcrumb.Item href="/products">Products</Breadcrumb.Item>
      <Breadcrumb.Separator>-</Breadcrumb.Separator>
      <Breadcrumb.Item href="/products/shoes" current>Shoes</Breadcrumb.Item>
    </Breadcrumb>
  </Flex>`
};

export const ellipsisDemo = {
  type: 'code',
  code: `
  <Breadcrumb>
    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Ellipsis/>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="/products/shoes" current>Shoes</Breadcrumb.Item>
  </Breadcrumb>`
};

export const maxItemsDemo = {
  type: 'code',
  code: `
  <Breadcrumb maxItems={4}>
    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="/products">Products</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="/electronics">Electronics</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="/laptops">Laptops</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="/gaming" current>Gaming</Breadcrumb.Item>
  </Breadcrumb>`
};

export const itemsBeforeCollapseDemo = {
  type: 'code',
  code: `
  <Breadcrumb maxItems={5} itemsBeforeCollapse={2}>
    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="/products">Products</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="/electronics">Electronics</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="/laptops">Laptops</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="/gaming">Gaming</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="/accessories">Accessories</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="/footwear" current>Footwear</Breadcrumb.Item>
  </Breadcrumb>`
};

export const dropdownDemo = {
  type: 'code',
  code: `
  <Breadcrumb>
    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="/category">Category</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item dropdownItems={[
        { label: 'Option 1', onClick: () => {console.log('Option 1')}},
        { label: 'Option 2', onClick: () => {console.log('Option 2')}}
      ]}>Subcategory</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="/category/subcategory/current">Current Page</Breadcrumb.Item>
  </Breadcrumb>`
};
export const asDemo = {
  type: 'code',
  code: `
  <Breadcrumb>
    <Breadcrumb.Item href="/home" as={<NextLink href="/" />}>Home</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="/playground" as={<NextLink />}>Playground</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="/docs" current>Docs</Breadcrumb.Item>
  </Breadcrumb>`
};

export const disabledDemo = {
  type: 'code',
  code: `
  <Breadcrumb>
    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item disabled>Loading…</Breadcrumb.Item>
    <Breadcrumb.Separator/>
    <Breadcrumb.Item href="/products" current>Products</Breadcrumb.Item>
  </Breadcrumb>`
};

export const iconsDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Text with Icon',
      code: `
      <Breadcrumb>
        <Breadcrumb.Item href="/" leadingIcon={<BellIcon />}>Home</Breadcrumb.Item>
        <Breadcrumb.Separator/>
        <Breadcrumb.Item href="/documents" leadingIcon={<FilterIcon />}>Documents</Breadcrumb.Item>
        <Breadcrumb.Separator/>
        <Breadcrumb.Item href="/settings" leadingIcon={<ShoppingBagFilledIcon />}>Settings</Breadcrumb.Item>
      </Breadcrumb>`
    },
    {
      name: 'Only Icon',
      code: `
      <Breadcrumb>
        <Breadcrumb.Item href="/" leadingIcon={<BellIcon />}/>
        <Breadcrumb.Separator/>
        <Breadcrumb.Item href="/documents" leadingIcon={<FilterIcon />}/>
        <Breadcrumb.Separator/>
        <Breadcrumb.Item href="/settings" leadingIcon={<ShoppingBagFilledIcon />}/>
      </Breadcrumb>`
    }
  ]
};
