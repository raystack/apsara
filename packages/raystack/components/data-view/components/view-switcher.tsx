'use client';

import { cx } from 'class-variance-authority';
import { Tabs } from '../../tabs';
import styles from '../data-view.module.css';
import { useDataView } from '../hooks/useDataView';

export interface DataViewViewSwitcherProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Tab-based switcher for the configured `views`. Reads `views` and `activeView`
 * from `DataView` context and writes through `setActiveView`. Renders nothing
 * when `views` is unset or has fewer than two entries.
 */
export function ViewSwitcher({
  className,
  size = 'small'
}: DataViewViewSwitcherProps) {
  const { views, activeView, setActiveView } = useDataView();
  if (!views || views.length < 2) return null;
  return (
    <Tabs
      value={activeView}
      onValueChange={v => setActiveView(v)}
      size={size}
      className={cx(styles.viewSwitcher, className)}
    >
      <Tabs.List>
        {views.map(v => (
          <Tabs.Tab key={v.value} value={v.value} leadingIcon={v.icon}>
            {v.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
}

ViewSwitcher.displayName = 'DataView.ViewSwitcher';
