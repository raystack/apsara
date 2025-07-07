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
  code: `
  <Flex gap="medium" direction="column">
     <Breadcrumb size="small">
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Separator/>
        <Breadcrumb.Item href="/products">Products</Breadcrumb.Item>
        <Breadcrumb.Separator/>
        <Breadcrumb.Item href="/products/shoes" current>Shoes</Breadcrumb.Item>
      </Breadcrumb>
     <Breadcrumb size="medium">
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Separator/>
        <Breadcrumb.Item href="/products">Products</Breadcrumb.Item>
        <Breadcrumb.Separator/>
        <Breadcrumb.Item href="/products/shoes" current>Shoes</Breadcrumb.Item>
      </Breadcrumb>
  </Flex>`
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

export const iconsDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Text with Icon',
      code: `
      <Breadcrumb>
        <Breadcrumb.Item href="/" leadingIcon={<>H</>}>Home</Breadcrumb.Item>
        <Breadcrumb.Separator/>
        <Breadcrumb.Item href="/documents" leadingIcon={<>D</>}>Documents</Breadcrumb.Item>
        <Breadcrumb.Separator/>
        <Breadcrumb.Item href="/settings" leadingIcon={<>S</>}>Settings</Breadcrumb.Item>
      </Breadcrumb>`
    },
    {
      name: 'Only Icon',
      code: `
      <Breadcrumb>
        <Breadcrumb.Item href="/" leadingIcon={<>H</>}/>
        <Breadcrumb.Separator/>
        <Breadcrumb.Item href="/documents" leadingIcon={<>D</>}/>
        <Breadcrumb.Separator/>
        <Breadcrumb.Item href="/settings" leadingIcon={<>S</>}/>
      </Breadcrumb>`
    }
  ]
};
