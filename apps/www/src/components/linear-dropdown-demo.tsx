import { Avatar, Button, Flex, Menu, Text } from '@raystack/apsara';
import { Calendar, ChevronRight, Download } from 'lucide-react';
import { Fragment, ReactNode, useState } from 'react';

type MenuItem =
  | {
      type: 'item';
      label: string | string[];
      disabled?: boolean;
      trailingIcon?: ReactNode;
      leadingIcon?: ReactNode;
    }
  | { type: 'separator' }
  | { type: 'group'; label: string; items: MenuItem[] }
  | {
      type: 'submenu';
      label: string;
      items: MenuItem[];
      trailingIcon?: ReactNode;
      leadingIcon?: ReactNode;
    };

const menuData: MenuItem[] = [
  {
    type: 'group',
    label: 'Actions',
    items: [
      {
        type: 'submenu',
        label: 'Assign member...',
        items: [
          {
            type: 'item',
            label: 'Rohan',
            leadingIcon: (
              <Avatar size={2} radius='full' fallback='R' color='cyan' />
            )
          },
          {
            type: 'item',
            label: 'Rohil',
            leadingIcon: (
              <Avatar size={2} radius='full' fallback='R' color='orange' />
            )
          },
          {
            type: 'item',
            label: 'Gaurav',
            leadingIcon: (
              <Avatar size={2} radius='full' fallback='G' color='sky' />
            )
          },
          {
            type: 'item',
            label: 'Abhishek',
            leadingIcon: (
              <Avatar size={2} radius='full' fallback='A' color='iris' />
            )
          },
          {
            type: 'item',
            label: 'Aman',
            leadingIcon: (
              <Avatar size={2} radius='full' fallback='A' color='purple' />
            )
          },
          {
            type: 'item',
            label: 'Risabh',
            leadingIcon: (
              <Avatar size={2} radius='full' fallback='R' color='gold' />
            )
          },
          {
            type: 'item',
            label: 'Ajinkya',
            leadingIcon: (
              <Avatar size={2} radius='full' fallback='A' color='crimson' />
            )
          }
        ]
      },
      { type: 'item', label: 'Subscribe...' },
      { type: 'item', label: 'Rename...' }
    ]
  },
  { type: 'separator' },
  {
    type: 'group',
    label: 'More',
    items: [
      {
        type: 'submenu',
        label: 'Export',
        items: [
          {
            type: 'item',
            label: 'All (.zip)',
            leadingIcon: <Download size={16} />
          },
          {
            type: 'submenu',
            label: 'CSV',
            leadingIcon: <Download size={16} />,
            items: [
              {
                type: 'item',
                label: 'All',
                leadingIcon: <Calendar size={16} />
              },
              {
                type: 'item',
                label: '3 Months',
                leadingIcon: <Calendar size={16} />
              },
              {
                type: 'item',
                label: '6 Months',
                leadingIcon: <Calendar size={16} />
              }
            ]
          },
          {
            type: 'submenu',
            label: 'PDF',
            leadingIcon: <Download size={16} />,
            items: [
              {
                type: 'item',
                label: 'All',
                leadingIcon: <Calendar size={16} />
              },
              {
                type: 'item',
                label: '3 Months',
                leadingIcon: <Calendar size={16} />
              },
              {
                type: 'item',
                label: '6 Months',
                leadingIcon: <Calendar size={16} />
              }
            ]
          }
        ]
      },
      { type: 'item', label: 'Copy', disabled: true },
      {
        type: 'item',
        label: 'Delete...',
        trailingIcon: (
          <Text size='micro' variant='secondary'>
            ⌘⇧D
          </Text>
        )
      }
    ]
  }
];

function filterMenuItems(
  items: MenuItem[],
  query: string,
  path: string[] = [],
  isInsideSubmenu = false
): MenuItem[] {
  if (!query?.length) return items;
  const normalizedQuery = query.trim().toLowerCase();
  const results: MenuItem[] = [];

  for (const item of items) {
    if (item.type === 'separator') continue;

    if (item.type === 'item') {
      const fullPath = isInsideSubmenu ? [...path, item.label] : [item.label];
      const flatLabel = fullPath.join(' ').toLowerCase();
      if (flatLabel.includes(normalizedQuery)) {
        results.push({
          ...item,
          label: fullPath
        } as MenuItem);
      }
    }

    if (item.type === 'submenu') {
      const nested = filterMenuItems(
        item.items,
        query,
        [...path, item.label],
        true
      );
      results.push(...nested);
    }

    if (item.type === 'group') {
      const nested = filterMenuItems(item.items, query, path, isInsideSubmenu);
      results.push(...nested);
    }
  }

  return results.slice(0, 8);
}

export default function LinearMenuDemo() {
  const [searchQuery, setSearchQuery] = useState('');

  const renderMenu = (items: MenuItem[], query: string) => {
    const filteredItems = filterMenuItems(items, query);

    if (searchQuery && filteredItems.length === 0) {
      return (
        <div>
          <Text>No results</Text>
        </div>
      );
    }

    return filteredItems.map((item, index) => {
      switch (item.type) {
        case 'group':
          return (
            <Menu.Group key={index}>
              <Menu.Label>{item.label}</Menu.Label>
              {item.items && renderMenu(item.items, query)}
            </Menu.Group>
          );
        case 'separator':
          return <Menu.Separator key={index} />;
        case 'submenu':
          return (
            <Menu.Submenu key={index}>
              <Menu.SubmenuTrigger
                trailingIcon={item.trailingIcon}
                leadingIcon={item.leadingIcon}
              >
                {item.label}
              </Menu.SubmenuTrigger>
              <Menu.SubmenuContent>
                {item.items && renderMenu(item.items, query)}
              </Menu.SubmenuContent>
            </Menu.Submenu>
          );
        case 'item':
          return (
            <Menu.Item
              key={index}
              disabled={item.disabled}
              trailingIcon={item.trailingIcon}
              leadingIcon={item.leadingIcon}
            >
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
    <Flex style={{ padding: 50 }}>
      <Menu
        autocomplete
        autocompleteMode='manual'
        onInputValueChange={(value: string) => setSearchQuery(value)}
      >
        <Menu.Trigger render={<Button />}>Actions</Menu.Trigger>
        <Menu.Content searchPlaceholder='Search'>
          {renderMenu(menuData, searchQuery)}
        </Menu.Content>
      </Menu>
    </Flex>
  );
}
