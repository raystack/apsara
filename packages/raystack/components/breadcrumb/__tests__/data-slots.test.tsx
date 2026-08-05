import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getAllSlots, getSlot } from '~/test-utils/data-slots';
import { Breadcrumb } from '../breadcrumb';

describe('Breadcrumb data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <Breadcrumb>
        <Breadcrumb.Item
          href='#'
          leadingIcon={<span>lead</span>}
          trailingIcon={<span>trail</span>}
        >
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Ellipsis />
        <Breadcrumb.Item current>Current</Breadcrumb.Item>
      </Breadcrumb>
    );
    expectSlots(container, [
      'breadcrumb',
      'breadcrumb-list',
      'breadcrumb-item',
      'breadcrumb-link',
      'breadcrumb-leading-icon',
      'breadcrumb-item-text',
      'breadcrumb-trailing-icon',
      'breadcrumb-separator',
      'breadcrumb-ellipsis'
    ]);
  });

  it('omits leading/trailing icon slots when not provided', () => {
    const { container } = render(
      <Breadcrumb>
        <Breadcrumb.Item href='#'>Plain</Breadcrumb.Item>
      </Breadcrumb>
    );
    expect(getSlot(container, 'breadcrumb-leading-icon')).toBeNull();
    expect(getSlot(container, 'breadcrumb-trailing-icon')).toBeNull();
  });

  it('exposes a link slot on disabled/current items rendered as spans', () => {
    const { container } = render(
      <Breadcrumb>
        <Breadcrumb.Item disabled>Disabled</Breadcrumb.Item>
      </Breadcrumb>
    );
    const link = getSlot(container, 'breadcrumb-link');
    expect(link).not.toBeNull();
    expect(link?.tagName).toBe('SPAN');
  });

  it('exposes dropdown slots when the item opens a menu', () => {
    render(
      <Breadcrumb>
        <Breadcrumb.Item
          dropdownItems={[{ children: 'Electronics' }, { children: 'Books' }]}
        >
          Categories
        </Breadcrumb.Item>
      </Breadcrumb>
    );

    expect(
      getSlot(document.body, 'breadcrumb-dropdown-trigger')
    ).not.toBeNull();

    fireEvent.click(screen.getByText('Categories'));

    expectSlots(document.body, [
      'breadcrumb-dropdown-trigger',
      'breadcrumb-dropdown-icon'
    ]);
    expect(getAllSlots(document.body, 'breadcrumb-dropdown-item')).toHaveLength(
      2
    );
  });
});
