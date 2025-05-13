"use client";

import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  return `
  <DropdownMenu${getPropsString(props)}>
    <DropdownMenu.Trigger asChild>
      <Button>Actions</Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Group>
        <DropdownMenu.Item>Assign member...</DropdownMenu.Item>
        <DropdownMenu.Item>Subscribe...</DropdownMenu.Item>
        <DropdownMenu.Item>Rename...</DropdownMenu.Item>
      </DropdownMenu.Group>
      <DropdownMenu.Separator />
      <DropdownMenu.Label>Actions</DropdownMenu.Label>
      <DropdownMenu>
        <DropdownMenu.TriggerItem>
          Export
        </DropdownMenu.TriggerItem>
        <DropdownMenu.Content>
          <DropdownMenu>
            <DropdownMenu.Item>All (.zip)</DropdownMenu.Item>
            <DropdownMenu.TriggerItem>
              CSV
            </DropdownMenu.TriggerItem>
            <DropdownMenu.Content>
              <DropdownMenu.Item>All</DropdownMenu.Item>
              <DropdownMenu.Item>3 Months</DropdownMenu.Item>
              <DropdownMenu.Item>6 Months</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenu.TriggerItem>
              PDF
            </DropdownMenu.TriggerItem>
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
        trailingIcon={
          <Text size="micro" variant="secondary">
            ⌘⇧D
          </Text>
        }>
        Delete...
      </DropdownMenu.Item>
    </DropdownMenu.Content>
    </DropdownMenu>`;
};

export const playground = {
  type: "playground",
  controls: {
    autocomplete: {
      type: "checkbox",
      defaultValue: false,
    },
  },
  getCode,
};

export const basicDemo = {
  type: "code",
  code: `
  <DropdownMenu>
    <DropdownMenu.Trigger asChild>
      <Button color="neutral">Open Menu</Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Item>Profile</DropdownMenu.Item>
      <DropdownMenu.Item>Settings</DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.Item>Logout</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu>`,
};
export const iconsDemo = {
  type: "code",
  code: `
  <DropdownMenu>
    <DropdownMenu.Trigger asChild>
      <Button color="neutral">Actions</Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Item leadingIcon={<>📝</>}>Edit</DropdownMenu.Item>
      <DropdownMenu.Item leadingIcon={<>📋</>} trailingIcon={<>⌘C</>}>Copy</DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.Item leadingIcon={<>🗑️</>}>Delete</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu>`,
};

export const customDemo = {
  type: "code",
  code: `
  <DropdownMenu>
    <DropdownMenu.Trigger asChild>
      <Button color="neutral">More</Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Label>Actions</DropdownMenu.Label>
      <DropdownMenu.Group>
        <DropdownMenu.Item>New File</DropdownMenu.Item>
        <DropdownMenu.Item>New Folder</DropdownMenu.Item>
      </DropdownMenu.Group>
      <DropdownMenu.Separator />
      <DropdownMenu.Label>Sort By</DropdownMenu.Label>
      <DropdownMenu.Group>
        <DropdownMenu.Item>Name</DropdownMenu.Item>
        <DropdownMenu.Item>Date</DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu>`,
};

export const autocompleteDemo = {
  type: "code",
  tabs: [
    {
      name: "Default Autocomplete",
      code: `
      <DropdownMenu autocomplete>
      <DropdownMenu.Trigger asChild>
        <Button color="neutral">Default Autocomplete</Button>
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
    </DropdownMenu>`,
    },
    {
      name: "Manual Autocomplete",
      code: `
      function ManualDemo(){
        const items = [
          "Assign member...",
          "Subscribe...",
          "Rename...",
          "Copy",
          "Delete...",
        ];

        const [simpleSearchQuery, setSimpleSearchQuery] = React.useState("");
        return <DropdownMenu
                autocomplete
                autocompleteMode="manual"
                onSearch={value => setSimpleSearchQuery(value)}>
                <DropdownMenu.Trigger asChild>
                  <Button color="neutral">Manual Autocomplete</Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content searchPlaceholder="Search">
                  {items
                    .filter(item => item.toLowerCase().includes(simpleSearchQuery))
                    .map((item, index) => (
                      <DropdownMenu.Item key={index}>{item}</DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
              </DropdownMenu>
  }`,
    },
  ],
};

export const linearDemo = {
  type: "code",
  previewCode: false,
  code: `<LinearDropdownDemo />`,
  codePreview: [
    {
      label: "index.tsx",
      code: `function LinearDropdownDemo() {
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
    <DropdownMenu
      autocomplete
      autocompleteMode="manual"
      onSearch={(value: string) => setSearchQuery(value)}>
      <DropdownMenu.Trigger asChild>
        <Button>Actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content searchPlaceholder="Search">
        {renderDropdownMenu(dropdownMenuData, searchQuery)}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
`,
    },
    {
      label: "utils.ts",
      code: `function filterDropdownMenuItems(
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
          label: fullPath,
        } as DropdownMenuItem);
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

  return results.slice(0, 8);
}`,
    },
    {
      label: "data.ts",
      code: `type DropdownMenuItem =
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
];`,
    },
  ],
};
