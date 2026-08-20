import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Tabs } from '../tabs';

describe('Tabs data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <Tabs defaultValue='one'>
        <Tabs.List>
          <Tabs.Tab value='one' leadingIcon={<span>icon</span>}>
            One
          </Tabs.Tab>
          <Tabs.Tab value='two'>Two</Tabs.Tab>
        </Tabs.List>
        <Tabs.Content value='one'>Panel one</Tabs.Content>
        <Tabs.Content value='two'>Panel two</Tabs.Content>
      </Tabs>
    );
    expectSlots(container, [
      'tabs',
      'tabs-list',
      'tabs-indicator',
      'tabs-tab',
      'tabs-tab-icon',
      'tabs-content'
    ]);
  });

  it('omits the tab icon slot when no leadingIcon is given', () => {
    const { container } = render(
      <Tabs defaultValue='one'>
        <Tabs.List>
          <Tabs.Tab value='one'>One</Tabs.Tab>
        </Tabs.List>
        <Tabs.Content value='one'>Panel one</Tabs.Content>
      </Tabs>
    );
    expect(getSlot(container, 'tabs-tab-icon')).toBeNull();
  });

  it('lets a caller-provided data-slot win over the default (DataView contract)', () => {
    const { container } = render(
      <Tabs data-slot='data-view-view-switcher' defaultValue='one'>
        <Tabs.List>
          <Tabs.Tab data-slot='data-view-view-switcher-tab' value='one'>
            One
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Content value='one'>Panel one</Tabs.Content>
      </Tabs>
    );
    expect(getSlot(container, 'data-view-view-switcher')).not.toBeNull();
    expect(getSlot(container, 'data-view-view-switcher-tab')).not.toBeNull();
    expect(getSlot(container, 'tabs')).toBeNull();
    expect(getSlot(container, 'tabs-tab')).toBeNull();
  });
});
