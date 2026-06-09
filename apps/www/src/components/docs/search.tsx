'use client';
import {
  ChevronDownIcon,
  ColorWheelIcon,
  ComponentInstanceIcon,
  CornersIcon,
  Cross1Icon,
  DashboardIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  MixIcon,
  ReaderIcon,
  RocketIcon,
  ShadowIcon,
  SpaceBetweenVerticallyIcon,
  TextIcon
} from '@radix-ui/react-icons';
import {
  Command,
  Dialog,
  EmptyState,
  IconButton,
  Spinner
} from '@raystack/apsara';
import {
  flattenTree,
  type Item as PageItem,
  Root
} from 'fumadocs-core/page-tree';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { useRouter } from 'next/navigation';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { getFileFromUrl, getFolderFromUrl } from '@/lib/utils';
import styles from './search.module.css';

type Item = Omit<PageItem, 'type'> & {
  items?: Item[];
  id: string;
};
type SearchItems = {
  heading: string;
  items: Item[];
};

/* Map known page slugs to icons; everything else falls back to a generic one. */
const PAGE_ICONS: Record<string, typeof MagnifyingGlassIcon> = {
  docs: ReaderIcon,
  'getting-started': RocketIcon,
  styling: MixIcon,
  overview: DashboardIcon,
  colors: ColorWheelIcon,
  typography: TextIcon,
  spacing: SpaceBetweenVerticallyIcon,
  radius: CornersIcon,
  effects: ShadowIcon
};
const FallbackPageIcon = ComponentInstanceIcon;

const getPageIcon = (url: string): typeof MagnifyingGlassIcon =>
  PAGE_ICONS[getFileFromUrl(url)] ?? FallbackPageIcon;

export default function DocsSearch({ pageTree }: { pageTree: Root }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  /* Manual expand/collapse overrides; reset on query change. */
  const [openOverrides, setOpenOverrides] = useState<Record<string, boolean>>(
    {}
  );

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

    /* Default view: overview + foundations grouped by folder; components are
       excluded until the user searches. */
    const items = flattened.reduce<Record<string, Item[]>>((acc, item) => {
      const folder = getFolderFromUrl(item.url);
      if (folder === 'components') return acc;
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
  const isLoading = isSearching && query.isLoading;
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

    return Object.entries(grouped).map(([heading, items]) => ({
      heading,
      items: Object.values(items)
    }));
  }, [results]);

  const items = !isSearching ? defaultItems : searchResults;

  /* The `items` prop opts Command out of built-in filtering/unwrapping —
     results are pre-filtered by fumadocs and the grouped layout stays intact. */
  const itemValues = useMemo(
    () =>
      items.flatMap(section =>
        section.items.flatMap(item => [
          item.id,
          ...(item.items?.map(sub => sub.id) ?? [])
        ])
      ),
    [items]
  );

  /* Auto-open sub-details only when the match came from a sub-detail, not the
     page title; a title match keeps its sub-details collapsed. */
  const queryLower = trimmedQuery.toLowerCase();
  const titleMatches = (item: Item) =>
    typeof item.name === 'string' &&
    item.name.toLowerCase().includes(queryLower);
  const autoOpen = (item: Item) =>
    isSearching && (item.items?.length ?? 0) > 0 && !titleMatches(item);
  const isOpen = (item: Item) =>
    item.id in openOverrides ? openOverrides[item.id] : autoOpen(item);
  const toggleOpen = (item: Item) =>
    setOpenOverrides(prev => ({ ...prev, [item.id]: !isOpen(item) }));

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
      <Dialog.Trigger render={<IconButton size={3} aria-label='Search docs' />}>
        <MagnifyingGlassIcon />
      </Dialog.Trigger>
      <Dialog.Content
        style={{ width: 512 }}
        showCloseButton={false}
        className={styles.searchContainer}
      >
        <Command
          items={itemValues}
          mode='none'
          value={search}
          onValueChange={value => {
            setSearch(value);
            setOpenOverrides({});
          }}
        >
          <div className={styles.inputContainer}>
            <Command.Input
              leadingIcon={<MagnifyingGlassIcon />}
              placeholder='Search docs'
              autoComplete='off'
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
          </div>
          <Command.Content className={styles.searchList}>
            <Command.Empty className={styles.searchEmpty}>
              {isLoading ? (
                <Spinner size={5} aria-label='Searching docs' />
              ) : (
                <EmptyState
                  variant='empty1'
                  heading='No result found'
                  subHeading='The keyword you’re searching for isn’t in the document—try using a different term.'
                  icon={<ExclamationTriangleIcon />}
                />
              )}
            </Command.Empty>
            {items.map((section, index) => (
              <Fragment key={section.heading}>
                <Command.Group>
                  <Command.Label className={styles.searchGroupLabel}>
                    {section.heading}
                  </Command.Label>
                  {section.items.map(item => {
                    const ItemIcon = getPageIcon(item.url);
                    const hasSubItems = (item.items?.length ?? 0) > 0;
                    const expanded = isOpen(item);
                    return (
                      <Fragment key={item.id}>
                        <Command.Item
                          value={item.id}
                          onClick={() => handleSelect(item.url)}
                          leadingIcon={<ItemIcon />}
                          trailingIcon={
                            hasSubItems ? (
                              <button
                                type='button'
                                aria-label={
                                  expanded
                                    ? 'Collapse section'
                                    : 'Expand section'
                                }
                                aria-expanded={expanded}
                                className={styles.searchAccordionToggle}
                                onPointerDown={e => e.stopPropagation()}
                                onClick={e => {
                                  e.stopPropagation();
                                  toggleOpen(item);
                                }}
                              >
                                <ChevronDownIcon
                                  className={
                                    expanded
                                      ? styles.searchChevronOpen
                                      : styles.searchChevron
                                  }
                                />
                              </button>
                            ) : undefined
                          }
                          className={styles.searchItem}
                        >
                          {item.name}
                        </Command.Item>
                        {hasSubItems && expanded ? (
                          <div className={styles.searchSubItemsContainer}>
                            {item.items?.map(subItem => (
                              <Command.Item
                                key={subItem.id}
                                value={subItem.id}
                                onClick={() => handleSelect(subItem.url)}
                              >
                                {subItem.name}
                              </Command.Item>
                            ))}
                          </div>
                        ) : null}
                      </Fragment>
                    );
                  })}
                </Command.Group>
                {index < items.length - 1 && <Command.Separator />}
              </Fragment>
            ))}
          </Command.Content>
        </Command>
      </Dialog.Content>
    </Dialog>
  );
}
