import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { expectSlots } from '~/test-utils/data-slots';
import { Radio } from '../radio';

describe('Radio data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <Radio.Group defaultValue='a'>
        <Radio value='a' />
        <Radio value='b' />
      </Radio.Group>
    );
    expectSlots(container, ['radio-group', 'radio', 'radio-indicator']);
  });
});
