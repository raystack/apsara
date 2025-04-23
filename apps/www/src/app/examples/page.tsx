"use client";
import { Button, DropdownMenu, Flex, Text } from "@raystack/apsara/v1";
import React, { Fragment, ReactNode, useState } from "react";
import { Calendar, ChevronRight, Download } from "lucide-react";

type DropdownMenuItem =
  | {
      type: "item";
      label: string | string[];
      disabled?: boolean;
      trailingIcon?: ReactNode;
      leadingIcon?: ReactNode;
    }
  | { type: "separator" }
  | { type: "group"; label: string; items: DropdownMenuItem[] }
  | {
      type: "submenu";
      label: string;
      items: DropdownMenuItem[];
      trailingIcon?: ReactNode;
      leadingIcon?: ReactNode;
    };

const dropdownMenuData: DropdownMenuItem[] = [
  {
    type: "group",
    label: "Heading",
    items: [
      { type: "item", label: "Assign member..." },
      { type: "item", label: "Subscribe..." },
      { type: "item", label: "Rename..." },
    ],
  },
  { type: "separator" },
  {
    type: "group",
    label: "Actions",
    items: [
      {
        type: "submenu",
        label: "Export",
        items: [
          {
            type: "item",
            label: "All (.zip)",
            leadingIcon: <Download size={16} />,
          },
          {
            type: "submenu",
            label: "CSV",
            leadingIcon: <Download size={16} />,
            items: [
              {
                type: "item",
                label: "All",
                leadingIcon: <Calendar size={16} />,
              },
              {
                type: "item",
                label: "3 Months",
                leadingIcon: <Calendar size={16} />,
              },
              {
                type: "item",
                label: "6 Months",
                leadingIcon: <Calendar size={16} />,
              },
            ],
          },
          {
            type: "submenu",
            label: "PDF",
            leadingIcon: <Download size={16} />,
            items: [
              {
                type: "item",
                label: "All",
                leadingIcon: <Calendar size={16} />,
              },
              {
                type: "item",
                label: "3 Months",
                leadingIcon: <Calendar size={16} />,
              },
              {
                type: "item",
                label: "6 Months",
                leadingIcon: <Calendar size={16} />,
              },
            ],
          },
        ],
      },
      { type: "item", label: "Copy", disabled: true },
      {
        type: "item",
        label: "Delete...",
        trailingIcon: (
          <Text size="micro" variant="secondary">
            ⌘⇧D
          </Text>
        ),
      },
    ],
  },
];

type FilteredDropdownItem = Omit<
  Extract<DropdownMenuItem, { type: "item" }>,
  "label"
> & {
  label: string[]; // path as array
};

function filterDropdownMenuItems(
  items: DropdownMenuItem[],
  query: string,
  path: string[] = [],
  isInsideSubmenu = false,
): DropdownMenuItem[] {
  if (!query?.length) return items;
  const normalizedQuery = query.trim().toLowerCase();
  const results: DropdownMenuItem[] = [];

  for (const item of items) {
    if (item.type === "separator") continue;

    if (item.type === "item") {
      const fullPath = isInsideSubmenu ? [...path, item.label] : [item.label];
      const flatLabel = fullPath.join(" ").toLowerCase();
      if (flatLabel.includes(normalizedQuery)) {
        results.push({
          ...item,
          // Overwrite `label` to be a string array
          label: fullPath,
        } as DropdownMenuItem); // Type casting to keep TypeScript happy
      }
    }

    if (item.type === "submenu") {
      const nested = filterDropdownMenuItems(
        item.items,
        query,
        [...path, item.label],
        true,
      );
      results.push(...nested);
    }

    if (item.type === "group") {
      const nested = filterDropdownMenuItems(
        item.items,
        query,
        path,
        isInsideSubmenu,
      );
      results.push(...nested);
    }
  }

  return results;
}

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const renderDropdownMenu = (items: DropdownMenuItem[], query: string) => {
    const filteredItems = filterDropdownMenuItems(items, query);

    if (searchQuery && filteredItems.length === 0) {
      return <div className="no-results">No results</div>;
    }

    return filteredItems.map((item, index) => {
      switch (item.type) {
        case "group":
          return (
            <DropdownMenu.Group key={index}>
              <DropdownMenu.Label>{item.label}</DropdownMenu.Label>
              {item.items && renderDropdownMenu(item.items, query)}
            </DropdownMenu.Group>
          );
        case "separator":
          return <DropdownMenu.Separator key={index} />;
        case "submenu":
          return (
            <DropdownMenu key={index}>
              <DropdownMenu.TriggerItem
                trailingIcon={item.trailingIcon}
                leadingIcon={item.leadingIcon}>
                {item.label}
              </DropdownMenu.TriggerItem>
              <DropdownMenu.Content>
                {item.items && renderDropdownMenu(item.items, query)}
              </DropdownMenu.Content>
            </DropdownMenu>
          );
        case "item":
          return (
            <DropdownMenu.Item
              key={index}
              disabled={item.disabled}
              trailingIcon={item.trailingIcon}
              leadingIcon={item.leadingIcon}>
              {Array.isArray(item.label)
                ? item.label.map((part, i) => (
                    <Fragment key={i}>
                      {i > 0 && <ChevronRight size={12} />}
                      {part}
                    </Fragment>
                  ))
                : item.label}
            </DropdownMenu.Item>
          );
        default:
          return null;
      }
    });
  };

  return (
    <Flex
      justify="center"
      align="start"
      style={{ height: "100vh", paddingTop: 80 }}
      gap="large"
      wrap="wrap">
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button color="neutral">Dropdown Menu</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content searchPlaceholder="Search">
          {renderDropdownMenu(dropdownMenuData, "")}
        </DropdownMenu.Content>
      </DropdownMenu>
      <DropdownMenu autocomplete>
        <DropdownMenu.Trigger asChild>
          <Button color="neutral">Autcomplete Dropdown Menu</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content searchPlaceholder="Search">
          <DropdownMenu.Group>
            <DropdownMenu.Label>Heading</DropdownMenu.Label>
            <DropdownMenu.Item>Assign member...</DropdownMenu.Item>
            <DropdownMenu.Item>Subscribe...</DropdownMenu.Item>
            <DropdownMenu.Item>Rename...</DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Label>Actions</DropdownMenu.Label>
          <DropdownMenu autocomplete>
            <DropdownMenu.TriggerItem>Export</DropdownMenu.TriggerItem>
            <DropdownMenu.Content>
              <DropdownMenu.Item>All (.zip)</DropdownMenu.Item>
              <DropdownMenu>
                <DropdownMenu.TriggerItem>CSV</DropdownMenu.TriggerItem>
                <DropdownMenu.Content>
                  <DropdownMenu.Item>All</DropdownMenu.Item>
                  <DropdownMenu.Item>3 Months</DropdownMenu.Item>
                  <DropdownMenu.Item>6 Months</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenu.TriggerItem>PDF</DropdownMenu.TriggerItem>
                <DropdownMenu.Content>
                  <DropdownMenu.Item>All</DropdownMenu.Item>
                  <DropdownMenu.Item>3 Months</DropdownMenu.Item>
                  <DropdownMenu.Item>6 Months</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
            </DropdownMenu.Content>
          </DropdownMenu>
          <DropdownMenu.Item disabled>Copy</DropdownMenu.Item>
          <DropdownMenu.Item
            value="remove"
            trailingIcon={
              <Text size="micro" variant="secondary">
                ⌘⇧D
              </Text>
            }>
            Delete...
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <DropdownMenu
        autocomplete
        autocompleteMode="manual"
        onSearch={(value: string) => setSearchQuery(value)}>
        <DropdownMenu.Trigger asChild>
          <Button color="neutral">Manual Autocomplete Dropdown</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content searchPlaceholder="Search">
          {renderDropdownMenu(dropdownMenuData, searchQuery)}
        </DropdownMenu.Content>
      </DropdownMenu>
    </Flex>
  );
};

export default Page;
