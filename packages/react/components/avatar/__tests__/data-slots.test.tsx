import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getAllSlots, getSlot } from '~/test-utils/data-slots';
import { Avatar, AvatarGroup } from '../avatar';

describe('Avatar data-slot contract', () => {
  it('exposes the fallback slot before the image loads', () => {
    const { container } = render(
      <Avatar src='https://example.com/avatar.png' alt='JD' fallback='JD' />
    );
    expectSlots(container, ['avatar', 'avatar-image', 'avatar-fallback']);
  });

  it('exposes the image slot once loaded, replacing the fallback', async () => {
    const rendered = render(
      <Avatar src='https://example.com/avatar.png' alt='JD' fallback='JD' />
    );
    fireEvent.load(rendered.container.querySelector('img')!);
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
