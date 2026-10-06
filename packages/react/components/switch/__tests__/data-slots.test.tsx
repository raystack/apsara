import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { expectSlots } from '~/test-utils/data-slots';
import { Switch } from '../switch';

describe('Switch data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(<Switch />);
    expectSlots(container, ['switch', 'switch-thumb']);
  });
});
