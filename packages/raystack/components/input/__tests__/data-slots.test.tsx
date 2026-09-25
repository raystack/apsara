import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getAllSlots, getSlot } from '~/test-utils/data-slots';
import { Input } from '../input';

describe('Input data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <Input
        leadingIcon={<span>l</span>}
        trailingIcon={<span>t</span>}
        prefix='https://'
        suffix='.com'
        chips={[{ label: 'One' }, { label: 'Two' }, { label: 'Three' }]}
        maxChipsVisible={2}
      />
    );
    expectSlots(container, [
      'input-container',
      'input-leading-icon',
      'input-prefix',
      'input-chip-container',
      'input-chip',
      'input-chip-overflow',
      'input',
      'input-suffix',
      'input-trailing-icon'
    ]);
  });

  it('puts the input slot on the input element itself', () => {
    const { container } = render(<Input />);
    expect(getSlot(container, 'input')?.tagName).toBe('INPUT');
  });

  it('lets callers override the input slot via props', () => {
    const { container } = render(<Input data-slot='search-input' />);
    expect(getSlot(container, 'input')).toBeNull();
    expect(getSlot(container, 'search-input')?.tagName).toBe('INPUT');
  });

  it('renders one chip slot per visible chip', () => {
    const { container } = render(
      <Input
        chips={[{ label: 'One' }, { label: 'Two' }, { label: 'Three' }]}
        maxChipsVisible={2}
      />
    );
    expect(getAllSlots(container, 'input-chip')).toHaveLength(2);
  });

  it('omits optional slots when their parts are absent', () => {
    const { container } = render(<Input />);
    expect(getSlot(container, 'input-leading-icon')).toBeNull();
    expect(getSlot(container, 'input-trailing-icon')).toBeNull();
    expect(getSlot(container, 'input-prefix')).toBeNull();
    expect(getSlot(container, 'input-suffix')).toBeNull();
    expect(getSlot(container, 'input-chip')).toBeNull();
    expect(getSlot(container, 'input-chip-overflow')).toBeNull();
  });
});
