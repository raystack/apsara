"use client";

import { Breadcrumb, Flex } from "@raystack/apsara/v1";
import PlaygroundLayout from "./playground-layout";

export function BreadcrumbExamples() {
  return (
    <PlaygroundLayout title="Breadcrumb">
      <Flex gap="medium" direction="column">
        <Breadcrumb
          size="small"
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: "Shoes", href: "/products/shoes" },
          ]}
        />
        <Breadcrumb
          size="medium"
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: "Shoes", href: "/products/shoes" },
          ]}
        />
        <Breadcrumb
          maxVisibleItems={3}
          items={[
            { label: "Home", href: "/" },
            { label: "Category", href: "/category" },
            { label: "Subcategory", href: "/subcategory" },
            { label: "Product", href: "/product" },
            { label: "Details", href: "/details" },
          ]}
        />
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Category", href: "/category" },
            {
              label: "Subcategory",
              href: "/category/subcategory",
              dropdownItems: [
                { label: "Option 1", href: "/category/subcategory/option1" },
                { label: "Option 2", href: "/category/subcategory/option2" },
              ],
            },
            { label: "Current Page", href: "/category/subcategory/current" },
          ]}
        />
      </Flex>
    </PlaygroundLayout>
  );
}
