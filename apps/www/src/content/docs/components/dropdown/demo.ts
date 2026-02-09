'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
  return `
  <Menu${getPropsString(props)}>
    <Menu.Trigger render={<Button />}>
      Actions
    </Menu.Trigger>
    <Menu.Content>
      <Menu.Group>
        <Menu.Item>Assign member...</Menu.Item>
        <Menu.Item>Subscribe...</Menu.Item>
        <Menu.Item>Rename...</Menu.Item>
      </Menu.Group>
      <Menu.Separator />
      <Menu.Label>Actions</Menu.Label>
      <Menu.SubMenu>
        <Menu.SubTrigger>
          Export
        </Menu.SubTrigger>
        <Menu.SubContent>
          <Menu.SubMenu>
            <Menu.Item>All (.zip)</Menu.Item>
            <Menu.SubTrigger>
              CSV
            </Menu.SubTrigger>
            <Menu.SubContent>
              <Menu.Item>All</Menu.Item>
              <Menu.Item>3 Months</Menu.Item>
              <Menu.Item>6 Months</Menu.Item>
            </Menu.SubContent>
          </Menu.SubMenu>
          <Menu.SubMenu>
            <Menu.SubTrigger>
              PDF
            </Menu.SubTrigger>
            <Menu.SubContent>
              <Menu.Item>All</Menu.Item>
              <Menu.Item>3 Months</Menu.Item>
              <Menu.Item>6 Months</Menu.Item>
            </Menu.SubContent>
          </Menu.SubMenu>
        </Menu.SubContent>
      </Menu.SubMenu>
      <Menu.Item disabled>Copy</Menu.Item>
      <Menu.Item
        trailingIcon={
          <Text size="micro" variant="secondary">
            ⌘⇧D
          </Text>
        }>
        Delete...
      </Menu.Item>
    </Menu.Content>
    </Menu>`;
};

export const playground = {
  type: 'playground',
  controls: {
    autocomplete: {
      type: 'checkbox',
      defaultValue: false
    }
  },
  getCode
};

export const basicDemo = {
  type: 'code',
  code: `
  <Menu>
    <Menu.Trigger render={<Button color="neutral" />}>
      Open Menu
    </Menu.Trigger>
    <Menu.Content>
      <Menu.Item>Profile</Menu.Item>
      <Menu.Item>Settings</Menu.Item>
      <Menu.Separator />
      <Menu.Item>Logout</Menu.Item>
    </Menu.Content>
  </Menu>`
};
export const iconsDemo = {
  type: 'code',
  code: `
  <Menu>
    <Menu.Trigger render={<Button color="neutral" />}>
      Actions
    </Menu.Trigger>
    <Menu.Content>
      <Menu.Item leadingIcon={<>📝</>}>Edit</Menu.Item>
      <Menu.Item leadingIcon={<>📋</>} trailingIcon={<>⌘C</>}>Copy</Menu.Item>
      <Menu.Separator />
      <Menu.Item leadingIcon={<>🗑️</>}>Delete</Menu.Item>
    </Menu.Content>
  </Menu>`
};

export const customDemo = {
  type: 'code',
  code: `
  <Menu>
    <Menu.Trigger render={<Button color="neutral" />}>
      More
    </Menu.Trigger>
    <Menu.Content>
      <Menu.Label>Actions</Menu.Label>
      <Menu.Group>
        <Menu.Item>New File</Menu.Item>
        <Menu.Item>New Folder</Menu.Item>
      </Menu.Group>
      <Menu.Separator />
      <Menu.Label>Sort By</Menu.Label>
      <Menu.Group>
        <Menu.Item>Name</Menu.Item>
        <Menu.Item>Date</Menu.Item>
      </Menu.Group>
    </Menu.Content>
  </Menu>`
};

export const autocompleteDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Default Autocomplete',
      code: `
      <Menu autocomplete>
      <Menu.Trigger render={<Button color="neutral" />}>
        Default Autocomplete
      </Menu.Trigger>
      <Menu.Content searchPlaceholder="Search">
        <Menu.Group>
          <Menu.Label>Heading</Menu.Label>
          <Menu.Item>Assign member...</Menu.Item>
          <Menu.Item>Subscribe...</Menu.Item>
          <Menu.Item>Rename...</Menu.Item>
        </Menu.Group>
        <Menu.Separator />
        <Menu.Label>Actions</Menu.Label>
        <Menu.SubMenu>
          <Menu.SubTrigger>Export</Menu.SubTrigger>
          <Menu.SubContent>
            <Menu.Item>All (.zip)</Menu.Item>
            <Menu.SubMenu>
              <Menu.SubTrigger>CSV</Menu.SubTrigger>
              <Menu.SubContent>
                <Menu.Item>All</Menu.Item>
                <Menu.Item>3 Months</Menu.Item>
                <Menu.Item>6 Months</Menu.Item>
              </Menu.SubContent>
            </Menu.SubMenu>
            <Menu.SubMenu>
              <Menu.SubTrigger>PDF</Menu.SubTrigger>
              <Menu.SubContent>
                <Menu.Item>All</Menu.Item>
                <Menu.Item>3 Months</Menu.Item>
                <Menu.Item>6 Months</Menu.Item>
              </Menu.SubContent>
            </Menu.SubMenu>
          </Menu.SubContent>
        </Menu.SubMenu>
        <Menu.Item disabled>Copy</Menu.Item>
        <Menu.Item
          value="remove"
          trailingIcon={
            <Text size="micro" variant="secondary">
              ⌘⇧D
            </Text>
          }>
          Delete...
        </Menu.Item>
      </Menu.Content>
    </Menu>`
    },
    {
      name: 'Manual Autocomplete',
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
        return <Menu
                autocomplete
                autocompleteMode="manual"
                onSearch={value => setSimpleSearchQuery(value)}>
                <Menu.Trigger render={<Button color="neutral" />}>
                  Manual Autocomplete
                </Menu.Trigger>
                <Menu.Content searchPlaceholder="Search">
                  {items
                    .filter(item => item.toLowerCase().includes(simpleSearchQuery))
                    .map((item, index) => (
                      <Menu.Item key={index}>{item}</Menu.Item>
                    ))}
                </Menu.Content>
              </Menu>
  }`
    }
  ]
};

export const linearDemo = {
  type: 'code',
  previewCode: false,
  code: `<LinearDropdownDemo />`,
  codePreview: [
    {
      label: 'index.tsx',
      code: `function LinearDropdownDemo() {
  const [searchQuery, setSearchQuery] = useState("");

  const renderMenu = (items: DropdownMenuItem[], query: string) => {
    const filteredItems = filterDropdownMenuItems(items, query);

    if (searchQuery && filteredItems.length === 0) {
      return <div className="no-results">No results</div>;
    }

    return filteredItems.map((item, index) => {
      switch (item.type) {
        case "group":
          return (
            <Menu.Group key={index}>
              <Menu.Label>{item.label}</Menu.Label>
              {item.items && renderMenu(item.items, query)}
            </Menu.Group>
          );
        case "separator":
          return <Menu.Separator key={index} />;
        case "submenu":
          return (
            <Menu.SubMenu key={index}>
              <Menu.SubTrigger
                trailingIcon={item.trailingIcon}
                leadingIcon={item.leadingIcon}>
                {item.label}
              </Menu.SubTrigger>
              <Menu.SubContent>
                {item.items && renderMenu(item.items, query)}
              </Menu.SubContent>
            </Menu.SubMenu>
          );
        case "item":
          return (
            <Menu.Item
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
            </Menu.Item>
          );
        default:
          return null;
      }
    });
  };

  return (
    <Menu
      autocomplete
      autocompleteMode="manual"
      onSearch={(value: string) => setSearchQuery(value)}>
      <Menu.Trigger render={<Button />}>
        Actions
      </Menu.Trigger>
      <Menu.Content searchPlaceholder="Search">
        {renderMenu(dropdownMenuData, searchQuery)}
      </Menu.Content>
    </Menu>
  );
}
`
    },
    {
      label: 'utils.ts',
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
}`
    },
    {
      label: 'data.ts',
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
];`
    }
  ]
};
