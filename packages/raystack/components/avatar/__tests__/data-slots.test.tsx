import { render } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { expectSlots, getAllSlots, getSlot } from '~/test-utils/data-slots';
import { Avatar, AvatarGroup } from '../avatar';

// jsdom has no real image decoder; simulate a successful async load so
// Base UI's AvatarPrimitive.Image moves past the loading status and renders.
class MockImage extends EventTarget {
  _src: string = '';
  _complete: boolean = false;
  onload: (() => void) | null = null;

  get src() {
    return this._src;
  }

  set src(src: string) {
    if (!src) return;
    this._src = src;
    setTimeout(() => {
      this._complete = true;
      this.onload?.();
      this.dispatchEvent(new Event('load'));
    }, 0);
  }

  get complete() {
    return this._complete;
  }

  get naturalWidth() {
    return this._complete ? 300 : 0;
  }

  get naturalHeight() {
    return this._complete ? 300 : 0;
  }
}

describe('Avatar data-slot contract', () => {
  const ogImage = window.Image;

  beforeAll(() => {
    window.Image = MockImage as unknown as typeof Image;
  });

  afterAll(() => {
    window.Image = ogImage;
  });

  it('exposes the fallback slot before the image loads', () => {
    const { container } = render(
      <Avatar src='https://example.com/avatar.png' alt='JD' fallback='JD' />
    );
    expectSlots(container, ['avatar', 'avatar-fallback']);
  });

  it('exposes the image slot once loaded, replacing the fallback', async () => {
    const rendered = render(
      <Avatar src='https://example.com/avatar.png' alt='JD' fallback='JD' />
    );
    await rendered.findByRole('img');
    expectSlots(rendered.container, ['avatar', 'avatar-image']);
    expect(
      rendered.container.querySelector('[data-slot="avatar-fallback"]')
    ).toBeNull();
  });

  it('exposes group slots for each avatar plus the overflow avatar', () => {
    const { container } = render(
      <AvatarGroup max={1}>
        <Avatar fallback='A' />
        <Avatar fallback='B' />
        <Avatar fallback='C' />
      </AvatarGroup>
    );
    expect(getSlot(container, 'avatar-group')).not.toBeNull();
    expect(getAllSlots(container, 'avatar-group-item')).toHaveLength(2);
  });
});
