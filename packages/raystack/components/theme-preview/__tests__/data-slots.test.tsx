import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';

import { clearThemeStorageCache } from '../store';
import { ThemePreviewSwitcher } from '../switcher';
import { ThemePreview } from '../theme-preview';
import { installLocalStorage, installMatchMedia } from './mocks';

beforeEach(() => {
  installLocalStorage();
  installMatchMedia(false);
  clearThemeStorageCache();
});

describe('ThemePreview data-slot contract', () => {
  it('exposes the theme element slot', () => {
    const { container } = render(
      <ThemePreview>
        <div>child</div>
      </ThemePreview>
    );
    expectSlots(container, ['theme-preview']);
  });

  it('exposes the script slot only for a persisted namespace', () => {
    const { container: plain } = render(<ThemePreview>child</ThemePreview>);
    expect(getSlot(plain, 'theme-preview-script')).toBeNull();

    const { container: persisted } = render(
      <ThemePreview persistKey='app'>child</ThemePreview>
    );
    expect(getSlot(persisted, 'theme-preview-script')?.tagName).toBe('SCRIPT');
  });

  it('exposes the slot on a nested scope too', () => {
    const { container } = render(
      <ThemePreview>
        <ThemePreview defaultValue={{ accentColor: 'orange' }}>
          <div>nested</div>
        </ThemePreview>
      </ThemePreview>
    );
    expect(
      container.querySelectorAll('[data-slot="theme-preview"]')
    ).toHaveLength(2);
  });

  it('exposes the switcher slot', () => {
    const { container } = render(
      <ThemePreview>
        <ThemePreviewSwitcher />
      </ThemePreview>
    );
    expectSlots(container, ['theme-preview-switcher']);
  });
});
