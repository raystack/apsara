import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { TextArea } from '../text-area';

describe('TextArea data-slot contract', () => {
  it('exposes the text-area slot on the textarea element', () => {
    const { container } = render(<TextArea />);
    expectSlots(container, ['text-area']);
    expect(getSlot(container, 'text-area')?.tagName).toBe('TEXTAREA');
  });

  it('lets callers override the slot via props', () => {
    const { container } = render(<TextArea data-slot='custom' />);
    expect(getSlot(container, 'text-area')).toBeNull();
    expect(getSlot(container, 'custom')?.tagName).toBe('TEXTAREA');
  });
});
