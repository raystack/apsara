'use client';
import { getFileFromUrl, getFolderFromUrl } from '@/lib/utils';
import {
  Cross1Icon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from '@radix-ui/react-icons';
import {
  Command,
  Dialog,
  EmptyState,
  Flex,
  IconButton,
  Text
} from '@raystack/apsara';
import { cx } from 'class-variance-authority';
import {
  type Item as PageItem,
  Root,
  flattenTree
} from 'fumadocs-core/page-tree';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { useRouter } from 'next/navigation';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import styles from './search.module.css';

type Item = Omit<PageItem, 'type'> & {
  items?: Item[];
  id: string;
};
type SearchItems = {
  heading: string;
  items: Item[];
};

export default function DocsSearch({ pageTree }: { pageTree: Root }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { search, setSearch, query } = useDocsSearch({
    type: 'fetch'
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const defaultItems = useMemo<SearchItems[]>(() => {
    if (!pageTree?.children?.length) return [];
    const flattened = flattenTree(pageTree.children);
    if (!flattened.length) return [];

    const items = flattened
      .slice(0, 10)
      .reduce<Record<string, Item[]>>((acc, item) => {
        const folder = getFolderFromUrl(item.url);
        if (!acc[folder]) {
          acc[folder] = [];
        }
        acc[folder].push({ ...item, id: item.url });
        return acc;
      }, {});
    return Object.entries(items).map(([heading, items]) => ({
      heading,
      items
    }));
  }, [pageTree]);

  const trimmedQuery = search.trim();
  const isSearching = trimmedQuery.length > 0;
  const results =
    isSearching && query.data && query.data !== 'empty' ? query.data : [];

  const searchResults = useMemo<SearchItems[]>(() => {
    if (results.length === 0) return [];

    const grouped = results.reduce<Record<string, Record<string, Item>>>(
      (acc, result) => {
        const folder = getFolderFromUrl(result.url);
        const file = getFileFromUrl(result.url);
        if (!acc[folder]) acc[folder] = {};
        if (!acc[folder][file])
          acc[folder][file] = {
            name: file,
            url: result.url,
            items: [],
            id: result.id
          };
        const isTopLevel = result.type === 'page';
        if (isTopLevel) {
          acc[folder][file] = {
            ...acc[folder][file],
            name: result.content,
            url: result.url,
            id: result.id
          };
        } else {
          acc[folder][file].items?.push({
            name: result.content,
            url: result.url,
            id: result.id
          });
        }
        return acc;
      },
      {}
    );
    console.log('grouped', grouped);

    return Object.entries(grouped).map(([heading, items]) => ({
      heading,
      items: Object.values(items)
    }));
  }, [results]);

  const items = !isSearching ? defaultItems : searchResults;

  const handleSelect = useCallback(
    (url: string) => {
      setOpen(false);
      setSearch('');
      router.push(url);
    },
    [router, setSearch]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <IconButton size={3} aria-label='Search docs'>
          <MagnifyingGlassIcon />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content width={512} className={styles.searchContainer}>
        <Command className={styles.searchCommand} filter={() => 1}>
          <Flex className={styles.inputContainer} align='center'>
            <Command.Input
              placeholder='Search docs'
              value={search}
              onValueChange={setSearch}
              autoComplete='off'
              className={styles.input}
            />
            {search.length > 0 && (
              <IconButton
                size={2}
                aria-label='Clear search'
                onClick={() => setSearch('')}
                className={styles.searchClearButton}
              >
                <Cross1Icon />
              </IconButton>
            )}
          </Flex>
          <Command.List className={styles.searchList}>
            <Command.Empty>
              <EmptyState
                variant='empty1'
                heading='No result found'
                subHeading='The keyword you’re searching for isn’t in the document—try using a different term.'
                icon={<ExclamationTriangleIcon />}
              />
            </Command.Empty>
            {items.map((section, index) => (
              <div key={section.heading}>
                <Command.Group
                  heading={section.heading}
                  className={styles.searchGroup}
                >
                  {section.items.map(item => (
                    <Fragment key={item.url}>
                      <Command.Item
                        key={item.id}
                        value={item.id}
                        onSelect={() => handleSelect(item.url)}
                        className={styles.searchItem}
                      >
                        <Text size='small' variant='primary' lineClamp={1}>
                          {item.name}
                        </Text>
                      </Command.Item>
                      {item.items?.length && item.items.length > 0 && (
                        <div className={styles.searchSubItemsContainer}>
                          {item.items?.map(subItem => (
                            <Command.Item
                              key={subItem.id}
                              value={subItem.id}
                              onSelect={() => handleSelect(subItem.url)}
                              className={cx(
                                styles.searchItem,
                                styles.searchSubItem
                              )}
                            >
                              <Text
                                size='small'
                                variant='primary'
                                lineClamp={1}
                              >
                                {subItem.name}
                              </Text>
                            </Command.Item>
                          ))}
                        </div>
                      )}
                    </Fragment>
                  ))}
                </Command.Group>
                {index < defaultItems.length - 1 && <Command.Separator />}
              </div>
            ))}
          </Command.List>
        </Command>
      </Dialog.Content>
    </Dialog>
  );
}
