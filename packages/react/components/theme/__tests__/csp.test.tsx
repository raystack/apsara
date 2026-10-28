import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { ScrollArea } from '../../scroll-area';
import { clearThemeStorageCache } from '../store';
import { Theme } from '../theme';
import { installLocalStorage, installMatchMedia } from './mocks';

beforeEach(() => {
  installLocalStorage();
  installMatchMedia(false);
  clearThemeStorageCache();
});

// React hoists Base UI's style into <head> and inserts it once per document,
// so this file holds a single render.
describe('nonce for Base UI', () => {
  it('reaches the inline style Base UI renders, through a nested theme', () => {
    render(
      <Theme nonce='abc123'>
        <Theme defaultValue={{ accentColor: 'mint' }}>
          <ScrollArea>content</ScrollArea>
        </Theme>
      </Theme>
    );
    const style = document.head.querySelector(
      'style[data-href="base-ui-disable-scrollbar"]'
    );
    expect(style).not.toBeNull();
    expect(style).toHaveAttribute('nonce', 'abc123');
  });
});
