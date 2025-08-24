'use client';
import IconDetails, { IconDetailsProps } from '@/components/icon-details';
import IconEmpty from '@/components/icon-details/icon-empty';
import { Search, Tabs } from '@raystack/apsara';
import * as Icons from '@raystack/apsara/icons';
import { cx } from 'class-variance-authority';
import { useState } from 'react';
import style from './page.module.css';

type TabType = 'normal' | 'filled';

const FILTERS: Record<TabType, (data: any) => Boolean> = {
  normal: ([name]) => !name.includes('Filled'),
  filled: ([name]) => name.includes('Filled')
};

const Page = () => {
  const [tab, setTab] = useState<TabType>('normal');
  const [search, setSearch] = useState('');
  const [icon, setIcon] = useState<IconDetailsProps | null>(null);

  return (
    <div className={style.container}>
      <main className={style.main}>
        <div className={style.content}>
          <div className={cx(style.info, 'prose')}>
            <h1>Apsara Icons</h1>
            <p>
              A search input component with built-in search icon and optional
              clear button.
            </p>
          </div>
          <div className={style.controls}>
            <Tabs value={tab} onValueChange={value => setTab(value as TabType)}>
              <Tabs.List>
                <Tabs.Trigger value='normal'>Normal</Tabs.Trigger>
                <Tabs.Trigger value='filled'>Filled</Tabs.Trigger>
              </Tabs.List>
            </Tabs>
            <div className={style.spacer} />
            <Search
              placeholder='Search...'
              showClearButton
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClear={() => setSearch('')}
            />
          </div>
          <div className={style.icons}>
            {Object.entries(Icons)
              .filter(FILTERS[tab])
              .filter(([name]) =>
                name.toLowerCase().includes(search.toLowerCase())
              )
              .map(([name, Icon]) => (
                <div
                  key={name}
                  className={cx(
                    style.icon,
                    name === icon?.name ? style.active : ''
                  )}
                  onClick={() => setIcon({ name, icon: Icon })}
                >
                  <div className={style.iconImage}>
                    <Icon width={36} height={36} />
                  </div>
                  <p className={style.iconText}>{name}</p>
                </div>
              ))}
          </div>
        </div>
      </main>
      <aside className={style.aside}>
        {icon ? <IconDetails {...icon} /> : <IconEmpty />}
      </aside>
    </div>
  );
};

export default Page;
