import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { ColorPicker } from '../color-picker';

const mockCopy = vi.fn();
vi.mock('~/hooks/useCopyToClipboard', () => ({
  useCopyToClipboard: () => ({ copy: mockCopy })
}));

// Mock scrollIntoView for test environment (ColorPicker.Mode renders a Select)
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true
});

describe('ColorPicker data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <ColorPicker>
        <ColorPicker.Area />
        <ColorPicker.Hue />
        <ColorPicker.Alpha />
        <ColorPicker.Input />
      </ColorPicker>
    );
    expectSlots(container, [
      'color-picker',
      'color-picker-area',
      'color-picker-area-thumb',
      'color-picker-hue',
      'color-picker-alpha',
      'color-picker-alpha-gradient',
      'color-picker-input'
    ]);
    // Hue and Alpha both render the shared slider primitives.
    expect(
      container.querySelectorAll('[data-slot="color-picker-slider-control"]')
        .length
    ).toBe(2);
    expect(
      container.querySelectorAll('[data-slot="color-picker-slider-track"]')
        .length
    ).toBe(2);
    expect(
      container.querySelectorAll('[data-slot="color-picker-slider-thumb"]')
        .length
    ).toBe(2);
  });

  it('renders the oklch canvas slot in oklch mode', () => {
    const { container } = render(
      <ColorPicker mode='oklch'>
        <ColorPicker.Area />
      </ColorPicker>
    );
    expect(getSlot(container, 'color-picker-area-canvas')).not.toBeNull();
  });

  it('omits the canvas slot in non-oklch modes', () => {
    const { container } = render(
      <ColorPicker mode='hex'>
        <ColorPicker.Area />
      </ColorPicker>
    );
    expect(getSlot(container, 'color-picker-area-canvas')).toBeNull();
  });

  it('exposes the mode trigger slot and its content slot when open', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ColorPicker>
        <ColorPicker.Mode />
      </ColorPicker>
    );
    expect(getSlot(container, 'color-picker-mode')).not.toBeNull();

    await user.click(screen.getByRole('combobox'));
    await screen.findByRole('listbox');
    expect(getSlot(document.body, 'color-picker-mode-content')).not.toBeNull();
  });
});
