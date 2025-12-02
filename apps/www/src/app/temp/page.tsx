'use client';

import { Button, Flex, Navbar, Search, Text } from '@raystack/apsara';
import { FilterIcon, OrganizationIcon } from '@raystack/apsara/icons';
import { useState } from 'react';

export default function TempPage() {
  const [searchValue, setSearchValue] = useState('');

  // Dummy data
  const dummyItems = [
    {
      id: 1,
      name: 'Item 1',
      description: 'This is a description for item 1',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Item 2',
      description: 'This is a description for item 2',
      status: 'Pending'
    },
    {
      id: 3,
      name: 'Item 3',
      description: 'This is a description for item 3',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Item 4',
      description: 'This is a description for item 4',
      status: 'Inactive'
    },
    {
      id: 5,
      name: 'Item 5',
      description: 'This is a description for item 5',
      status: 'Active'
    }
  ];

  return (
    <Flex direction='column' style={{ minHeight: '100vh' }}>
      <Navbar sticky>
        <Navbar.Start>
          <Text size='small' weight='medium'>
            Explore
          </Text>
        </Navbar.Start>
        <Navbar.End>
          <Search
            placeholder='Search an AOI'
            value={searchValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchValue(e.target.value)
            }
            onClear={() => setSearchValue('')}
            size='small'
            style={{ width: '200px' }}
          />
          <Button
            variant='outline'
            size='small'
            color='neutral'
            leadingIcon={<FilterIcon />}
          >
            Draw AOI
          </Button>
          <Button
            variant='outline'
            size='small'
            color='neutral'
            leadingIcon={<OrganizationIcon />}
          >
            Upload AOI
          </Button>
        </Navbar.End>
      </Navbar>

      <Flex
        direction='column'
        style={{
          padding: '32px',
          flex: 1,
          backgroundColor: 'var(--rs-color-background-base-primary)'
        }}
      >
        <Text size='large' weight='medium' style={{ marginBottom: '24px' }}>
          Dummy Data
        </Text>

        <Flex direction='column' gap={4} style={{ maxWidth: '800px' }}>
          {dummyItems.map(item => (
            <Flex
              key={item.id}
              direction='column'
              gap={2}
              style={{
                padding: '16px',
                border: '1px solid var(--rs-color-border-base-primary)',
                borderRadius: 'var(--rs-radius-2)',
                backgroundColor: 'var(--rs-color-background-base-primary)'
              }}
            >
              <Flex justify='between' align='center'>
                <Text size='regular' weight='medium'>
                  {item.name}
                </Text>
                <Text
                  size='small'
                  style={{
                    padding: '4px 8px',
                    borderRadius: 'var(--rs-radius-1)',
                    backgroundColor:
                      item.status === 'Active'
                        ? 'var(--rs-color-background-success-primary)'
                        : item.status === 'Pending'
                          ? 'var(--rs-color-background-attention-primary)'
                          : 'var(--rs-color-background-neutral-secondary)'
                  }}
                >
                  {item.status}
                </Text>
              </Flex>
              <Text
                size='small'
                style={{ color: 'var(--rs-color-foreground-base-secondary)' }}
              >
                {item.description}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
}
