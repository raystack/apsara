import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getAllSlots, getSlot } from '~/test-utils/data-slots';
import { Field } from '../../field';
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

  /* Focus never leaves the input in this composition, so no focus event
     follows the close for the reopen guard to consume. */
  it('opens on focus again after Escape closed it', () => {
    const { input } = renderPicker();
    /* Real focus, so the guard can see where it is; the event drives it. */
    input.focus();
    fireEvent.focus(input);
    expect(isOpen()).toBe(true);

    fireEvent.keyDown(
      getSlot(document.body, 'calendar-preview-content') as HTMLElement,
      { key: 'Escape' }
    );
    expect(isOpen()).toBe(false);

    fireEvent.focus(input);
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
    for (const text of ['2', '20', '20/', '20/0', '20/05', '20 May 2027']) {
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
    ['20 May 2027', new Date(2027, 4, 20)],
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
      reason: 'unparseable',
      message: 'Invalid input'
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
      reason: 'unparseable',
      message: 'Invalid input'
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
      reason: 'out-of-bounds',
      message: 'Invalid input'
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
      reason: 'unavailable',
      message: 'Invalid input'
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
    const { input } = renderPicker({
      minDate: new Date(2026, 7, 10),
      onValueChange
    });
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

/* `aria-invalid` alone reached only assistive tech: Input paints its error
   border from `data-invalid`, so a sighted user saw an untouched field. These
   pin both attributes together -- dropping either one silently restores that. */
describe('CalendarPreview.Input invalid marking', () => {
  it('marks nothing before anything is typed', () => {
    const { input } = renderPicker();
    expect(input).not.toHaveAttribute('data-invalid');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it.each([
    ['unparseable', {}, 'not a date'],
    ['out-of-bounds', { minDate: new Date(2026, 7, 10) }, '01/08/2026'],
    [
      'unavailable',
      { isDateUnavailable: (date: Date) => date.getDate() === 12 },
      '12/08/2026'
    ]
  ])('marks the field invalid for %s text', (_reason, props, text) => {
    const { input } = renderPicker(props);
    fireEvent.change(input, { target: { value: text } });
    expect(input).toHaveAttribute('data-invalid');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  /* Input paints the border from `:has(.input-field[data-invalid])`, so what
     the style depends on is the marked input sitting inside the container --
     not the slot name, which this part overrides with its own. */
  it('marks the input inside the container the border is keyed on', () => {
    const { container, input } = renderPicker();
    fireEvent.change(input, { target: { value: 'not a date' } });
    const wrapper = container.querySelector('[data-slot="input-container"]');
    expect(wrapper?.querySelector('input[data-invalid]')).toBe(input);
  });

  it('unmarks the field once the text parses again', () => {
    const { input } = renderPicker();
    fireEvent.change(input, { target: { value: 'nope' } });
    expect(input).toHaveAttribute('data-invalid');
    fireEvent.change(input, { target: { value: '20/05/2027' } });
    expect(input).not.toHaveAttribute('data-invalid');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('unmarks the field when it is emptied', () => {
    const { input } = renderPicker({ defaultValue: new Date(2026, 7, 20) });
    fireEvent.change(input, { target: { value: 'nope' } });
    expect(input).toHaveAttribute('data-invalid');
    fireEvent.change(input, { target: { value: '' } });
    expect(input).not.toHaveAttribute('data-invalid');
  });

  /* A failed commit keeps the draft rather than discarding the typing, so the
     mark has to survive the blur that failed to commit it. */
  it('stays marked after a blur that could not commit', () => {
    const { input } = renderPicker({ defaultValue: new Date(2026, 7, 20) });
    fireEvent.change(input, { target: { value: 'garbage' } });
    fireEvent.blur(input);
    expect(input.value).toBe('garbage');
    expect(input).toHaveAttribute('data-invalid');
  });

  it('never marks a field that cannot be typed into', () => {
    const { input } = renderPicker({ readOnly: true });
    fireEvent.change(input, { target: { value: 'not a date' } });
    expect(input).not.toHaveAttribute('data-invalid');
  });

  /* Field marks its control invalid for errors this input cannot see — a
     failed submit, a server response. Setting the attributes to `undefined`
     while valid erased that, because these props land after Field's. */
  it('leaves an error Field set alone while its own text is valid', () => {
    const { container } = render(
      <Field error='Server said no'>
        <CalendarPreview today={TODAY}>
          <CalendarPreview.Trigger>
            <CalendarPreview.Input />
          </CalendarPreview.Trigger>
        </CalendarPreview>
      </Field>
    );
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input).toHaveAttribute('data-invalid');
  });
});

describe('CalendarPreview.Input error messages', () => {
  const reasons = [
    ['unparseable', {}, 'not a date'],
    ['out-of-bounds', { minDate: new Date(2026, 7, 10) }, '01/08/2026'],
    [
      'unavailable',
      { isDateUnavailable: (date: Date) => date.getDate() === 12 },
      '12/08/2026'
    ]
  ] as const;

  it.each(reasons)('defaults to one flat message for %s', (_r, props, text) => {
    const onValidityChange = vi.fn();
    const { input } = renderPicker(props, { onValidityChange });
    fireEvent.change(input, { target: { value: text } });
    expect(onValidityChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ valid: false, message: 'Invalid input' })
    );
  });

  it('carries no message while the text is valid', () => {
    const onValidityChange = vi.fn();
    const { input } = renderPicker({}, { onValidityChange });
    fireEvent.change(input, { target: { value: 'nope' } });
    fireEvent.change(input, { target: { value: '20/05/2027' } });
    expect(onValidityChange).toHaveBeenLastCalledWith({ valid: true });
  });

  it('takes a custom message for a reason', () => {
    const onValidityChange = vi.fn();
    const { input } = renderPicker(
      {},
      { onValidityChange, errorMessages: { unparseable: 'Use DD/MM/YYYY' } }
    );
    fireEvent.change(input, { target: { value: 'not a date' } });
    expect(onValidityChange).toHaveBeenLastCalledWith({
      valid: false,
      reason: 'unparseable',
      message: 'Use DD/MM/YYYY'
    });
  });

  /* A partial override is the common case: one reason worded for the field,
     the rest left alone. */
  it('leaves the reasons it was not given on the default', () => {
    const onValidityChange = vi.fn();
    const { input } = renderPicker(
      { minDate: new Date(2026, 7, 10) },
      { onValidityChange, errorMessages: { unparseable: 'Use DD/MM/YYYY' } }
    );
    fireEvent.change(input, { target: { value: 'not a date' } });
    expect(onValidityChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ message: 'Use DD/MM/YYYY' })
    );
    fireEvent.change(input, { target: { value: '01/08/2026' } });
    expect(onValidityChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        reason: 'out-of-bounds',
        message: 'Invalid input'
      })
    );
  });

  /* The reason is unchanged across these keystrokes, so only a message that
     is part of the comparison makes this re-fire. */
  it('re-reports when only the message changed', () => {
    const onValidityChange = vi.fn();
    const { rerender, input } = renderPicker(
      {},
      { onValidityChange, errorMessages: { unparseable: 'First' } }
    );
    fireEvent.change(input, { target: { value: 'nope' } });
    expect(onValidityChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ message: 'First' })
    );
    rerender(
      <CalendarPreview today={TODAY} defaultMonth={AUGUST}>
        <CalendarPreview.Trigger>
          <CalendarPreview.Input
            onValidityChange={onValidityChange}
            errorMessages={{ unparseable: 'Second' }}
          />
        </CalendarPreview.Trigger>
      </CalendarPreview>
    );
    fireEvent.change(input, { target: { value: 'nope!' } });
    expect(onValidityChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ message: 'Second' })
    );
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
      '20 Aug 2026'
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

describe('CalendarPreview.Trigger is an anchor around a field', () => {
  it('drops the button role and the tab stop when it wraps an input', () => {
    const { container } = renderPicker();
    const trigger = getSlot(container, 'calendar-preview-trigger');
    expect(trigger).not.toHaveAttribute('role', 'button');
    expect(trigger).toHaveAttribute('tabindex', '-1');
  });

  it('keeps both when it wraps only a label', () => {
    const { container } = render(
      <CalendarPreview today={TODAY} defaultMonth={AUGUST}>
        <CalendarPreview.Trigger />
        <CalendarPreview.Content>
          <CalendarPreview.Days />
        </CalendarPreview.Content>
      </CalendarPreview>
    );
    const trigger = getSlot(container, 'calendar-preview-trigger');
    expect(trigger).toHaveAttribute('role', 'button');
    expect(trigger).not.toHaveAttribute('tabindex', '-1');
  });

  it('opens on a pointer press, which no longer races the focus handler', () => {
    const { input } = renderPicker();
    fireEvent.pointerDown(input);
    fireEvent.focus(input);
    fireEvent.pointerUp(input);
    fireEvent.click(input);
    expect(isOpen()).toBe(true);
  });

  it('stays open when a press moves between two fields of a range', () => {
    const { container } = render(
      <CalendarPreview selection='range' today={TODAY} defaultMonth={AUGUST}>
        <CalendarPreview.Trigger>
          <CalendarPreview.Input field='start' />
          <CalendarPreview.Input field='end' />
        </CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Days />
        </CalendarPreview.Content>
      </CalendarPreview>
    );
    const [start, end] = getAllSlots(container, 'calendar-preview-input');
    fireEvent.focus(start);
    expect(isOpen()).toBe(true);
    fireEvent.pointerDown(end);
    fireEvent.focus(end);
    fireEvent.pointerUp(end);
    fireEvent.click(end);
    expect(isOpen()).toBe(true);
  });
});

describe('CalendarPreview.Input drops a rejected draft on an outside write', () => {
  it('clears the text and the invalid state when a day is clicked', () => {
    const onValidityChange = vi.fn();
    const { container, input } = renderPicker({}, { onValidityChange });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'not a date' } });
    expect(input).toHaveAttribute('data-invalid');

    const cell = getAllSlots(document.body, 'calendar-preview-day').find(
      one =>
        getSlot(one, 'calendar-preview-day-number')?.textContent === '12' &&
        !one.hasAttribute('data-outside')
    ) as HTMLElement;
    fireEvent.click(cell);

    expect(input.value).toBe('12 Aug 2026');
    expect(input).not.toHaveAttribute('data-invalid');
    expect(onValidityChange).toHaveBeenLastCalledWith({ valid: true });
    expect(container).toBeTruthy();
  });

  it('leaves a draft alone while the value has not moved', () => {
    const { input } = renderPicker();
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'not a date' } });
    fireEvent.change(input, { target: { value: 'still not' } });
    expect(input.value).toBe('still not');
  });
});

describe('CalendarPreview.Trigger and the focus a dismissal gives back', () => {
  const pressOutside = () => {
    fireEvent.pointerDown(document.body);
    fireEvent.mouseDown(document.body);
    fireEvent.click(document.body);
  };

  it('does not reopen on the focus an outside press hands back', () => {
    const onOpenChange = vi.fn();
    const { input } = renderPicker({ onOpenChange });
    /* Real focus, so the close can see the trigger still holding it. */
    input.focus();
    fireEvent.focus(input);
    expect(isOpen()).toBe(true);

    pressOutside();
    expect(isOpen()).toBe(false);
    const calls = onOpenChange.mock.calls;
    expect(calls[calls.length - 1][1].reason).toBe('outside-press');

    fireEvent.focus(input);
    expect(isOpen()).toBe(false);
  });

  /* Base UI restores focus after an outside press only where
     `focus({ preventScroll })` is supported, and jsdom ignores the options
     object outright, so the assertion below cannot fail without this. */
  const withPreventScroll = () => {
    const focus = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function patched(options?: FocusOptions) {
      void options?.preventScroll;
      return focus.call(this);
    };
    return () => {
      HTMLElement.prototype.focus = focus;
    };
  };

  const pressOutsideOff = (input: HTMLInputElement) => {
    fireEvent.pointerDown(document.body);
    input.blur();
    fireEvent.mouseDown(document.body);
    fireEvent.click(document.body);
  };

  it('leaves focus where an outside press put it', async () => {
    const restore = withPreventScroll();
    try {
      const { input } = renderPicker();
      input.focus();
      fireEvent.focus(input);
      expect(isOpen()).toBe(true);

      pressOutsideOff(input);
      expect(isOpen()).toBe(false);
      await act(async () => {
        await Promise.resolve();
      });
      expect(document.activeElement).not.toBe(input);
    } finally {
      restore();
    }
  });

  it('gives focus back to the input on Escape', async () => {
    const { input } = renderPicker();
    input.focus();
    fireEvent.focus(input);
    expect(isOpen()).toBe(true);

    fireEvent.keyDown(input, { key: 'Escape' });
    expect(isOpen()).toBe(false);
    await act(async () => {
      await Promise.resolve();
    });
    expect(document.activeElement).toBe(input);
  });

  it('releases the guard on the next press when no focus comes back', () => {
    const { input } = renderPicker();
    fireEvent.focus(input);
    pressOutside();
    expect(isOpen()).toBe(false);

    fireEvent.pointerDown(input);
    fireEvent.focus(input);
    expect(isOpen()).toBe(true);
  });
});

describe('CalendarPreview.Trigger beside a Body that owns the input', () => {
  const composition = (
    <>
      <CalendarPreview.Trigger />
      <CalendarPreview.Content>
        <CalendarPreview.Body />
      </CalendarPreview.Content>
    </>
  );

  it('stays a button while an input it does not own is mounted', () => {
    const { container } = render(
      <CalendarPreview today={TODAY} defaultMonth={AUGUST} defaultOpen>
        {composition}
      </CalendarPreview>
    );
    expect(
      getSlot(document.body, 'calendar-preview-input')
    ).toBeInTheDocument();

    const trigger = getSlot(container, 'calendar-preview-trigger');
    expect(trigger).toHaveAttribute('role', 'button');
    expect(trigger).not.toHaveAttribute('tabindex', '-1');
  });

  it('still gives up the role for an input of its own', () => {
    const { container } = renderPicker();
    expect(getSlot(container, 'calendar-preview-trigger')).not.toHaveAttribute(
      'role',
      'button'
    );
  });
});

describe('CalendarPreview picker props the review left open', () => {
  /* `onValueChange` is inherited from `Input`, so a consumer passing it used
     to replace the handler that keeps the draft — and Enter then committed
     nothing at all. */
  it('composes a consumer onValueChange rather than replacing it', () => {
    const onInputValueChange = vi.fn();
    const onValueChange = vi.fn();
    const { input } = renderPicker(
      { onValueChange },
      { onValueChange: onInputValueChange }
    );

    fireEvent.change(input, { target: { value: '20/05/2027' } });
    expect(onInputValueChange).toHaveBeenCalled();
    expect(onInputValueChange.mock.calls[0][0]).toBe('20/05/2027');

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0][0]).toEqual(new Date(2027, 4, 20));
  });

  /* Retained text is judged against the bounds, and the bounds can move while
     it sits there. */
  it('re-judges drafted text when the bounds move under it', () => {
    const { input, rerender } = renderPicker({
      minDate: new Date(2026, 7, 10)
    });
    fireEvent.change(input, { target: { value: '05/08/2026' } });
    expect(input).toHaveAttribute('data-invalid');

    rerender(
      <CalendarPreview
        today={TODAY}
        defaultMonth={AUGUST}
        minDate={new Date(2026, 7, 1)}
      >
        <CalendarPreview.Trigger>
          <CalendarPreview.Input />
        </CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Days />
        </CalendarPreview.Content>
      </CalendarPreview>
    );

    expect(input.value).toBe('05/08/2026');
    expect(input).not.toHaveAttribute('data-invalid');
  });

  it('reports the recovered validity to the consumer', () => {
    const onValidityChange = vi.fn();
    const { input, rerender } = renderPicker(
      { maxDate: new Date(2026, 7, 10) },
      { onValidityChange }
    );
    fireEvent.change(input, { target: { value: '20/08/2026' } });
    expect(onValidityChange).toHaveBeenLastCalledWith({
      valid: false,
      reason: 'out-of-bounds',
      message: 'Invalid input'
    });

    rerender(
      <CalendarPreview
        today={TODAY}
        defaultMonth={AUGUST}
        maxDate={new Date(2026, 7, 31)}
      >
        <CalendarPreview.Trigger>
          <CalendarPreview.Input onValidityChange={onValidityChange} />
        </CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Days />
        </CalendarPreview.Content>
      </CalendarPreview>
    );

    expect(onValidityChange).toHaveBeenLastCalledWith({ valid: true });
  });

  /* Without an `.Input` the trigger is the control, so it carries the tab
     stop — Base UI adds none to a rendered `div`. */
  it('gives a trigger with no input a tab stop of its own', () => {
    const { container } = render(
      <CalendarPreview today={TODAY} defaultMonth={AUGUST}>
        <CalendarPreview.Trigger />
        <CalendarPreview.Content>
          <CalendarPreview.Days />
        </CalendarPreview.Content>
      </CalendarPreview>
    );
    const trigger = getSlot(container, 'calendar-preview-trigger');
    expect(trigger).toHaveAttribute('role', 'button');
    expect(trigger).toHaveAttribute('tabindex', '0');
  });

  it('keeps a trigger around an input out of the tab order', () => {
    const { container } = renderPicker();
    expect(getSlot(container, 'calendar-preview-trigger')).toHaveAttribute(
      'tabindex',
      '-1'
    );
  });
});

/* Base UI moves focus to the first tabbable element in the popup, which around
   a field is the previous-month button — so opening the picker took focus off
   the field the user had just clicked and nothing they typed landed. */
describe('CalendarPreview.Content initial focus', () => {
  /* Long enough that Base UI's own initial-focus pass has certainly run — at
     0ms these assertions pass whether or not focus would have moved. */
  const settle = () => new Promise(resolve => setTimeout(resolve, 100));

  it('leaves focus on the field the popover opened from', async () => {
    const { input } = renderPicker();
    input.focus();
    fireEvent.focus(input);
    await settle();

    expect(isOpen()).toBe(true);
    expect(document.activeElement).toBe(input);
  });

  it('still takes typed text once it is open', async () => {
    const onValueChange = vi.fn();
    const { input } = renderPicker({ onValueChange });
    input.focus();
    fireEvent.focus(input);
    await settle();

    fireEvent.change(input, { target: { value: '20/05/2027' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange.mock.calls[0][0]).toEqual(new Date(2027, 4, 20));
  });

  it('keeps both range fields reachable, so a range fills by keyboard', async () => {
    const utils = render(
      <CalendarPreview selection='range' today={TODAY} defaultMonth={AUGUST}>
        <CalendarPreview.Trigger>
          <CalendarPreview.Input field='start' />
          <CalendarPreview.Input field='end' />
        </CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Days />
        </CalendarPreview.Content>
      </CalendarPreview>
    );
    const [start, end] = getAllSlots(
      utils.container,
      'calendar-preview-input'
    ) as HTMLInputElement[];

    start.focus();
    fireEvent.focus(start);
    await settle();
    expect(document.activeElement).toBe(start);

    fireEvent.change(start, { target: { value: '10 Aug 2026' } });
    fireEvent.keyDown(start, { key: 'Enter' });
    fireEvent.change(end, { target: { value: '20 Aug 2026' } });
    fireEvent.keyDown(end, { key: 'Enter' });

    expect(start.value).toBe('10 Aug 2026');
    expect(end.value).toBe('20 Aug 2026');
  });

  /* The other half: with nothing to keep focus for, the popup takes it. */
  it('still moves focus into the popup when the trigger wraps no input', async () => {
    const utils = render(
      <CalendarPreview today={TODAY} defaultMonth={AUGUST}>
        <CalendarPreview.Trigger />
        <CalendarPreview.Content>
          <CalendarPreview.Days />
        </CalendarPreview.Content>
      </CalendarPreview>
    );
    const trigger = getSlot(
      utils.container,
      'calendar-preview-trigger'
    ) as HTMLElement;

    trigger.focus();
    await settle();
    expect(document.activeElement).not.toBe(trigger);
    expect(
      getSlot(document.body, 'calendar-preview-content')?.contains(
        document.activeElement
      )
    ).toBe(true);
  });
});
