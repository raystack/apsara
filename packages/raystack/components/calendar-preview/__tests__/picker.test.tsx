import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getSlot } from '~/test-utils/data-slots';
import { CalendarPreview } from '../calendar-preview';

const TODAY = new Date(2026, 7, 15);
const AUGUST = new Date(2026, 7, 1);

function renderPicker(props = {}, inputProps = {}) {
  const utils = render(
    <CalendarPreview today={TODAY} defaultMonth={AUGUST} {...props}>
      <CalendarPreview.Trigger>
        <CalendarPreview.Input {...inputProps} />
      </CalendarPreview.Trigger>
      <CalendarPreview.Content>
        <CalendarPreview.Days />
      </CalendarPreview.Content>
    </CalendarPreview>
  );
  const input = getSlot(
    utils.container,
    'calendar-preview-input'
  ) as HTMLInputElement;
  return { ...utils, input };
}

const isOpen = () =>
  getSlot(document.body, 'calendar-preview-content') !== null;

describe('CalendarPreview picker composition', () => {
  it('renders a trigger and a typeable input, and no button', () => {
    const { container, input } = renderPicker();
    expect(getSlot(container, 'calendar-preview-trigger')).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    /* The trigger wraps a control, and a control inside a button is not
       focusable on its own. */
    expect(getSlot(container, 'calendar-preview-trigger')?.tagName).not.toBe(
      'BUTTON'
    );
  });

  it('opens on focus', () => {
    const { input } = renderPicker();
    expect(isOpen()).toBe(false);
    fireEvent.focus(input);
    expect(isOpen()).toBe(true);
  });

  it('reports a single open when focus opens it', () => {
    const onOpenChange = vi.fn();
    const { input } = renderPicker({ onOpenChange });
    fireEvent.focus(input);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0][0]).toBe(true);
    /* Base UI's own reason, forwarded rather than re-declared. */
    expect(onOpenChange.mock.calls[0][1].reason).toBe('trigger-focus');
  });

  it('stays open after focusing — it does not immediately re-close', () => {
    const onOpenChange = vi.fn();
    const { input } = renderPicker({ onOpenChange });
    fireEvent.focus(input);
    expect(isOpen()).toBe(true);
    expect(onOpenChange.mock.calls.filter(call => call[0] === false)).toEqual(
      []
    );
  });

  it('mounts no Select anywhere, open or closed', () => {
    const { input } = renderPicker();
    const count = () =>
      document.body.querySelectorAll(
        'select,[role="combobox"],[role="listbox"],[data-slot^="select"]'
      ).length;
    expect(count()).toBe(0);
    fireEvent.focus(input);
    expect(count()).toBe(0);
  });

  it('honours a controlled open', () => {
    render(
      <CalendarPreview today={TODAY} open>
        <CalendarPreview.Trigger>
          <CalendarPreview.Input />
        </CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Days />
        </CalendarPreview.Content>
      </CalendarPreview>
    );
    expect(isOpen()).toBe(true);
  });

  it('never opens while disabled', () => {
    const onOpenChange = vi.fn();
    const { input } = renderPicker({ disabled: true, onOpenChange });
    fireEvent.focus(input);
    expect(isOpen()).toBe(false);
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});

describe('CalendarPreview.Input commit', () => {
  it('commits on Enter', () => {
    const onValueChange = vi.fn();
    const { input } = renderPicker({ onValueChange });
    fireEvent.change(input, { target: { value: '20/05/2027' } });
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0][0]).toEqual(new Date(2027, 4, 20));
    expect(onValueChange.mock.calls[0][1].reason).toBe('input');
  });

  it('commits on blur', () => {
    const onValueChange = vi.fn();
    const { input } = renderPicker({ onValueChange });
    fireEvent.change(input, { target: { value: '20/05/2027' } });
    fireEvent.blur(input);
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0][0]).toEqual(new Date(2027, 4, 20));
  });

  it('commits on an outside click, through the blur it causes', () => {
    const onValueChange = vi.fn();
    const { input } = renderPicker({ onValueChange });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '20/05/2027' } });
    fireEvent.blur(input, { relatedTarget: document.body });
    fireEvent.pointerDown(document.body);
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0][0]).toEqual(new Date(2027, 4, 20));
  });

  it('emits nothing while typing', () => {
    const onValueChange = vi.fn();
    const { input } = renderPicker({ onValueChange });
    for (const text of ['2', '20', '20/', '20/0', '20/05', '20/05/2027']) {
      fireEvent.change(input, { target: { value: text } });
    }
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('keeps partial input visible instead of committing it', () => {
    const onValueChange = vi.fn();
    const { input } = renderPicker({ onValueChange });
    fireEvent.change(input, { target: { value: '2' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input.value).toBe('2');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it.each([
    ['20/05/2027', new Date(2027, 4, 20)],
    ['5/5/2027', new Date(2027, 4, 5)],
    ['2027-05-20', new Date(2027, 4, 20)]
  ])('accepts %s at day scale', (text, expected) => {
    const onValueChange = vi.fn();
    const { input } = renderPicker({ onValueChange });
    fireEvent.change(input, { target: { value: text } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange.mock.calls[0][0]).toEqual(expected);
  });

  /* Coarser scales parse, but have nowhere to go until the scale switcher
     lands, so they must not commit a day the user never typed. */
  it('refuses a coarser scale until the scale views ship', () => {
    const onValueChange = vi.fn();
    const onValidityChange = vi.fn();
    const { input } = renderPicker({ onValueChange }, { onValidityChange });
    fireEvent.change(input, { target: { value: 'May 2027' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(onValidityChange).toHaveBeenLastCalledWith({
      valid: false,
      reason: 'unparseable'
    });
  });

  it('clears on an emptied field when clearable', () => {
    const onValueChange = vi.fn();
    const { input } = renderPicker({
      defaultValue: new Date(2026, 7, 20),
      onValueChange
    });
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange.mock.calls[0][0]).toBeNull();
    expect(onValueChange.mock.calls[0][1].reason).toBe('clear');
  });

  it('renders the committed value through formatValue', () => {
    const { input } = renderPicker({
      defaultValue: new Date(2026, 7, 20),
      formatValue: () => 'CUSTOM'
    });
    expect(input.value).toBe('CUSTOM');
  });

  it('shows the placeholder when there is no value', () => {
    const { input } = renderPicker();
    expect(input.value).toBe('');
    expect(input).toHaveAttribute('placeholder', 'Select date');
  });
});

describe('CalendarPreview.Input validity', () => {
  it('reports unparseable text', () => {
    const onValidityChange = vi.fn();
    const { input } = renderPicker({}, { onValidityChange });
    fireEvent.change(input, { target: { value: 'not a date' } });
    expect(onValidityChange).toHaveBeenLastCalledWith({
      valid: false,
      reason: 'unparseable'
    });
  });

  it('does not re-fire on consecutive invalid keystrokes', () => {
    const onValidityChange = vi.fn();
    const { input } = renderPicker({}, { onValidityChange });
    fireEvent.change(input, { target: { value: 'no' } });
    fireEvent.change(input, { target: { value: 'nop' } });
    fireEvent.change(input, { target: { value: 'nope' } });
    expect(onValidityChange).toHaveBeenCalledTimes(1);
  });

  it('reports a date outside the bounds separately from an unavailable one', () => {
    const onValidityChange = vi.fn();
    const { input } = renderPicker(
      { minDate: new Date(2026, 7, 10), maxDate: new Date(2026, 7, 20) },
      { onValidityChange }
    );
    fireEvent.change(input, { target: { value: '01/08/2026' } });
    expect(onValidityChange).toHaveBeenLastCalledWith({
      valid: false,
      reason: 'out-of-bounds'
    });
  });

  it('reports a day the consumer rejected as unavailable', () => {
    const onValidityChange = vi.fn();
    const { input } = renderPicker(
      { isDateUnavailable: (date: Date) => date.getDate() === 12 },
      { onValidityChange }
    );
    fireEvent.change(input, { target: { value: '12/08/2026' } });
    expect(onValidityChange).toHaveBeenLastCalledWith({
      valid: false,
      reason: 'unavailable'
    });
  });

  it('recovers to valid once the text parses again', () => {
    const onValidityChange = vi.fn();
    const { input } = renderPicker({}, { onValidityChange });
    fireEvent.change(input, { target: { value: 'nope' } });
    fireEvent.change(input, { target: { value: '20/05/2027' } });
    expect(onValidityChange).toHaveBeenLastCalledWith({ valid: true });
  });

  it('does not commit an out-of-bounds date', () => {
    const onValueChange = vi.fn();
    const { input } = renderPicker({ minDate: new Date(2026, 7, 10) });
    fireEvent.change(input, { target: { value: '01/08/2026' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('commits nothing while readOnly', () => {
    const onValueChange = vi.fn();
    const { input } = renderPicker({ readOnly: true, onValueChange });
    fireEvent.change(input, { target: { value: '20/05/2027' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe('CalendarPreview.Trigger content', () => {
  it('renders the formatted value when given no children', () => {
    const { container } = render(
      <CalendarPreview today={TODAY} defaultValue={new Date(2026, 7, 20)}>
        <CalendarPreview.Trigger />
      </CalendarPreview>
    );
    expect(getSlot(container, 'calendar-preview-trigger')).toHaveTextContent(
      '20/08/2026'
    );
  });

  it('renders the placeholder when there is no value', () => {
    const { container } = render(
      <CalendarPreview today={TODAY}>
        <CalendarPreview.Trigger placeholder='Pick a day' />
      </CalendarPreview>
    );
    expect(getSlot(container, 'calendar-preview-trigger')).toHaveTextContent(
      'Pick a day'
    );
  });

  it('lets a consumer replace the element through render', () => {
    render(
      <CalendarPreview today={TODAY}>
        <CalendarPreview.Trigger render={<span data-custom='true' />} />
      </CalendarPreview>
    );
    expect(screen.getByText('Select date')).toHaveAttribute(
      'data-custom',
      'true'
    );
  });
});
