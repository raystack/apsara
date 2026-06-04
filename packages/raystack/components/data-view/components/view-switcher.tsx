'use client';

import { Tabs } from '../../tabs';
import { useDataView } from '../hooks/useDataView';

interface ViewSwitcherProps {
  size?: 'small' | 'medium' | 'large';
}

/**
 * Tab-based switcher for the configured `views`. Internal to
 * `DataView.DisplayControls` — reads `views` and `activeView` from context and
 * writes through `setActiveView`. Renders nothing when `views` is unset or has
 * fewer than two entries. Each tab shows the view's optional `leadingIcon`.
 */
export function ViewSwitcher({ size = 'small' }: ViewSwitcherProps) {
  const { views, activeView, setActiveView } = useDataView();
  if (!views || views.length < 2) return null;
  return (
    <Tabs value={activeView} onValueChange={v => setActiveView(v)} size={size}>
      <Tabs.List>
        {views.map(v => (
          <Tabs.Tab key={v.value} value={v.value} leadingIcon={v.leadingIcon}>
            {v.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
}
