import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Label } from '../label';

describe('Label data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(<Label required={false}>Name</Label>);
    expectSlots(container, ['label', 'label-indicator']);
    expect(getSlot(container, 'label')?.tagName).toBe('LABEL');
  });

  it('reuses the indicator slot for the required indicator', () => {
    const { container } = render(
      <Label required requiredText='(required)'>
        Name
      </Label>
    );
    expect(getSlot(container, 'label-indicator')?.textContent).toBe(
      '(required)'
    );
  });

  it('omits the indicator slot when no indicator renders', () => {
    const { container } = render(<Label>Name</Label>);
    expect(getSlot(container, 'label-indicator')).toBeNull();

    const { container: requiredNoText } = render(<Label required>Name</Label>);
    expect(getSlot(requiredNoText, 'label-indicator')).toBeNull();
  });

  it('lets callers override the slot name', () => {
    const { container } = render(<Label data-slot='custom'>Name</Label>);
    expect(getSlot(container, 'custom')).not.toBeNull();
    expect(getSlot(container, 'label')).toBeNull();
  });
});
