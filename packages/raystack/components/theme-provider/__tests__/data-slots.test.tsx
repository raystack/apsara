import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { ThemeSwitcher } from '../switcher';
import { Theme } from '../theme';

// jsdom doesn't ship these; the root Theme needs them on mount.
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

beforeEach(() => {
  localStorageMock.getItem.mockReset();
});

describe('Theme data-slot contract', () => {
  it('exposes the script slot at the root', () => {
    const { container } = render(
      <Theme>
        <div>child</div>
      </Theme>
    );
    expect(getSlot(container, 'theme-script')?.tagName).toBe('SCRIPT');
  });

  it('exposes the scope slot for a nested scope with overrides', () => {
    const { container } = render(
      <Theme>
        <Theme accentColor='orange' data-testid='outer'>
          <Theme forcedTheme='dark'>
            <div>nested</div>
          </Theme>
        </Theme>
      </Theme>
    );
    expectSlots(container, ['theme-scope']);
  });

  it('renders no wrapper for a nested scope with no overrides', () => {
    const { container } = render(
      <Theme>
        <Theme>
          <div data-testid='child'>child</div>
        </Theme>
      </Theme>
    );
    expect(getSlot(container, 'theme-scope')).toBeNull();
  });

  it('exposes the switcher slot', () => {
    const { container } = render(
      <Theme>
        <ThemeSwitcher />
      </Theme>
    );
    expect(getSlot(container, 'theme-switcher')).not.toBeNull();
  });
});
