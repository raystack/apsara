import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { expectSlots } from '~/test-utils/data-slots';
import { Toggle } from '../toggle';

describe('Toggle data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(<Toggle>Bold</Toggle>);
    expectSlots(container, ['toggle', 'toggle-content']);
  });

  it('exposes the group slot', () => {
    const { container } = render(
      <Toggle.Group>
        <Toggle value='a'>A</Toggle>
        <Toggle value='b'>B</Toggle>
      </Toggle.Group>
    );
    expectSlots(container, ['toggle-group', 'toggle', 'toggle-content']);
  });
});
