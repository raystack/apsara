"use client";

import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  return `<Breadcrumb
    items={[
      { label: 'Home', href: '/' },
      { label: 'Category', href: '/category' },
      { label: 'Subcategory', href: '/category/subcategory' },
      { label: 'Current Page', href: '/category/subcategory/current' }
    ]}
    ${getPropsString(props)}/>`;
};

export const playground = {
  type: "playground",
  controls: {
    size: {
      type: "select",
      options: ["small", "medium"],
      defaultValue: "medium",
    },
    maxVisibleItems: {
      type: "number",
      defaultValue: 5,
      min: 1,
    },
    separator: {
      type: "text",
      initialValue: "/",
    },
  },
  getCode,
};

export const sizeDemo = {
  type: "code",
  code: `
  <Flex gap="medium" direction="column">
    <Breadcrumb size="small" items={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: "Shoes", href: "/products/shoes" }]} />
    <Breadcrumb size="medium" items={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: "Shoes", href: "/products/shoes" }]} />
  </Flex>`,
};

export const separatorDemo = {
  type: "code",
  code: `
  <Flex gap="medium" direction="column">
    <Breadcrumb separator=">" items={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: "Shoes", href: "/products/shoes" }]} />
    <Breadcrumb separator="|" items={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: "Shoes", href: "/products/shoes" }]} />
  </Flex>`,
};

export const maxVisibleItemsDemo = {
  type: "code",
  code: `
  <Breadcrumb maxVisibleItems={3} items={[
    { label: "Home", href: "/" },
    { label: "Category", href: "/category" },
    { label: "Subcategory", href: "/subcategory" },
    { label: "Product", href: "/product" },
    { label: "Details", href: "/details" }
  ]} />`,
};

export const dropdownDemo = {
  type: "code",
  code: `
  <Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Category', href: '/category' },
    { 
      label: 'Subcategory', 
      href: '/category/subcategory',
      dropdownItems: [
        { label: 'Option 1', href: '/category/subcategory/option1' },
        { label: 'Option 2', href: '/category/subcategory/option2' }
      ]
    },
    { label: 'Current Page', href: '/category/subcategory/current' }
  ]}
/>`,
};

export const iconsDemo = {
  type: "code",
  tabs: [
    {
      name: "Text with Icon",
      code: `
      <Breadcrumb
        items={[
          { 
            label: 'Home', 
            href: '/',
            icon: <>O</>
          },
          { 
            label: 'Documents', 
            href: '/documents',
            icon: <>O</>
          },
          { 
            label: 'Settings', 
            href: '/settings',
            icon: <>O</>
          }
        ]}
      />`,
    },
    {
      name: "Only Icon",
      code: `
      <Breadcrumb
        items={[
          { 
            label: '', 
            href: '/',
            icon: <>O</>
          },
          { 
            label: '', 
            href: '/documents',
            icon: <>O</>
          },
          { 
            label: '', 
            href: '/settings',
            icon: <>O</>
          }
        ]}
      />`,
    },
  ],
};
