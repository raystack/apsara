import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';

import { clearThemeStorageCache } from '../store';
import { ThemeSwitcher } from '../switcher';
import { Theme } from '../theme';
import { installLocalStorage, installMatchMedia } from './mocks';

beforeEach(() => {
  installLocalStorage();
  installMatchMedia(false);
  clearThemeStorageCache();
});

describe('Theme data-slot contract', () => {
  it('exposes the theme element slot', () => {
    const { container } = render(
      <Theme>
        <div>child</div>
      </Theme>
    );
    expectSlots(container, ['theme']);
  });

  it('exposes the script slot only when there is something to patch', () => {
    const { container: plain } = render(
      <Theme defaultValue={{ appearance: 'light' }}>child</Theme>
    );
    expect(getSlot(plain, 'theme-script')).toBeNull();

    const { container: persisted } = render(
      <Theme persistKey='app'>child</Theme>
    );
    expect(getSlot(persisted, 'theme-script')?.tagName).toBe('SCRIPT');
  });

  it('exposes the slot on a nested scope too', () => {
    const { container } = render(
      <Theme>
        <Theme defaultValue={{ accentColor: 'orange' }}>
          <div>nested</div>
        </Theme>
      </Theme>
    );
    expect(container.querySelectorAll('[data-slot="theme"]')).toHaveLength(2);
  });

  it('exposes the switcher slot', () => {
    const { container } = render(
      <Theme>
        <ThemeSwitcher />
      </Theme>
    );
    expectSlots(container, ['theme-switcher']);
  });
});
