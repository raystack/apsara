import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Checkbox } from '../checkbox';

describe('Checkbox data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(<Checkbox defaultChecked />);
    expectSlots(container, ['checkbox', 'checkbox-indicator', 'checkbox-icon']);
  });

  it('keeps the indicator slot but omits the icon while unchecked', () => {
    const { container } = render(<Checkbox />);
    expect(getSlot(container, 'checkbox-indicator')).not.toBeNull();
    expect(getSlot(container, 'checkbox-icon')).toBeNull();
  });

  it('reuses the icon slot for the indeterminate icon', () => {
    const { container } = render(<Checkbox indeterminate />);
    expect(getSlot(container, 'checkbox-icon')).not.toBeNull();
  });

  it('exposes the group slot', () => {
    const { container } = render(
      <Checkbox.Group defaultValue={[]}>
        <Checkbox value='a' />
        <Checkbox value='b' />
      </Checkbox.Group>
    );
    expectSlots(container, ['checkbox-group', 'checkbox']);
  });
});
