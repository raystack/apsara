import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Fieldset } from '../fieldset';

describe('Fieldset data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(<Fieldset legend='Address'>content</Fieldset>);
    expectSlots(container, ['fieldset', 'fieldset-legend']);
  });

  it('omits the legend slot when no legend is provided', () => {
    const { container } = render(<Fieldset>content</Fieldset>);
    expect(getSlot(container, 'fieldset')).not.toBeNull();
    expect(getSlot(container, 'fieldset-legend')).toBeNull();
  });

  it('exposes the legend slot via the sub-component API', () => {
    const { container } = render(
      <Fieldset>
        <Fieldset.Legend>Address</Fieldset.Legend>
        content
      </Fieldset>
    );
    expect(getSlot(container, 'fieldset-legend')).not.toBeNull();
  });
});
