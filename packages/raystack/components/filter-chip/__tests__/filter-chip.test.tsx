import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { defaultFormatValue } from '~/components/calendar-preview/calendar-preview-root';
import { getAllSlots, getSlot } from '~/test-utils/data-slots';
import { FilterType } from '~/types/filters';
import { FilterChip } from '../filter-chip';
import styles from '../filter-chip.module.css';

describe('FilterChip', () => {
  describe('Rendering', () => {
    it('renders with label', () => {
      render(<FilterChip label='Name' />);
      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('applies default variant classes', () => {
      const { container } = render(<FilterChip label='Test' />);
      const chip = container.querySelector(`.${styles.chip}`);
      expect(chip).toBeInTheDocument();
      expect(chip).toHaveClass(styles['chip-default']);
    });

    it('applies text variant', () => {
      const { container } = render(<FilterChip label='Test' variant='text' />);
      const chip = container.querySelector(`.${styles.chip}`);
      expect(chip).toBeInTheDocument();
      expect(chip).toHaveAttribute('data-variant', 'text');
    });

    it('applies custom className', () => {
      const { container } = render(
        <FilterChip label='Test' className='custom-chip' />
      );
      const chip = container.querySelector('.custom-chip');
      expect(chip).toBeInTheDocument();
      expect(chip).toHaveClass(styles.chip);
    });

    it('renders leading icon when provided', () => {
      const icon = <span data-testid='filter-icon'>📅</span>;
      render(<FilterChip label='Date' leadingIcon={icon} />);

      expect(screen.getByTestId('filter-icon')).toBeInTheDocument();
      expect(screen.getByText('📅')).toBeInTheDocument();
    });
  });

  describe('Remove Functionality', () => {
    it('shows remove button when onRemove is provided', () => {
      const onRemove = vi.fn();
      render(<FilterChip label='Name' onRemove={onRemove} />);

      const removeButton = screen.getByRole('button', {
        name: 'Remove Name filter'
      });
      expect(removeButton).toBeInTheDocument();
    });

    it('calls onRemove when remove button is clicked', () => {
      const onRemove = vi.fn();
      render(<FilterChip label='Name' onRemove={onRemove} />);

      const removeButton = screen.getByRole('button', {
        name: 'Remove Name filter'
      });
      fireEvent.click(removeButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it('does not show remove button when onRemove is not provided', () => {
      render(<FilterChip label='Name' />);

      const removeButton = screen.queryByRole('button', {
        name: 'Remove Name filter'
      });
      expect(removeButton).not.toBeInTheDocument();
    });
  });

  describe('String Filter Type', () => {
    it('renders input field for string type', () => {
      const { container } = render(
        <FilterChip label='Name' columnType={FilterType.string} />
      );

      const input = container.querySelector(
        `.${styles.inputFieldWrapper} input`
      );
      expect(input).toBeInTheDocument();
    });

    it('handles value change for string input', () => {
      const onValueChange = vi.fn();
      const { container } = render(
        <FilterChip
          label='Name'
          columnType={FilterType.string}
          onValueChange={onValueChange}
        />
      );

      const input = container.querySelector(
        `.${styles.inputFieldWrapper} input`
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'test value' } });

      expect(onValueChange).toHaveBeenCalledWith(
        'test value',
        expect.any(String)
      );
    });

    it('shows initial value for string input', () => {
      const { container } = render(
        <FilterChip
          label='Name'
          value='initial value'
          columnType={FilterType.string}
        />
      );

      const input = container.querySelector(
        `.${styles.inputFieldWrapper} input`
      );
      expect(input).toHaveValue('initial value');
    });
  });

  describe('Number Filter Type', () => {
    const getInput = (container: HTMLElement) =>
      container.querySelector(
        `.${styles.inputFieldWrapper} input`
      ) as HTMLInputElement;

    it('emits a number, not a string, for numeric input', () => {
      const onValueChange = vi.fn();
      const { container } = render(
        <FilterChip
          label='Size'
          columnType={FilterType.number}
          onValueChange={onValueChange}
        />
      );

      fireEvent.change(getInput(container), { target: { value: '42' } });

      expect(onValueChange).toHaveBeenCalledWith(42, expect.any(String));
    });

    it('rejects non-numeric input', () => {
      const onValueChange = vi.fn();
      const { container } = render(
        <FilterChip
          label='Size'
          columnType={FilterType.number}
          onValueChange={onValueChange}
        />
      );

      const input = getInput(container);
      fireEvent.change(input, { target: { value: 'abc' } });

      expect(onValueChange).not.toHaveBeenCalled();
      expect(input).toHaveValue('');
    });

    it('rejects a partially numeric paste wholesale', () => {
      const onValueChange = vi.fn();
      const { container } = render(
        <FilterChip
          label='Size'
          columnType={FilterType.number}
          onValueChange={onValueChange}
        />
      );

      const input = getInput(container);
      fireEvent.change(input, { target: { value: '12ab' } });

      expect(onValueChange).not.toHaveBeenCalled();
      expect(input).toHaveValue('');
    });

    it('keeps intermediate states typeable', () => {
      const onValueChange = vi.fn();
      const { container } = render(
        <FilterChip
          label='Size'
          columnType={FilterType.number}
          onValueChange={onValueChange}
        />
      );

      const input = getInput(container);

      fireEvent.change(input, { target: { value: '-' } });
      expect(input).toHaveValue('-');

      fireEvent.change(input, { target: { value: '1.' } });
      expect(input).toHaveValue('1.');

      expect(onValueChange).toHaveBeenNthCalledWith(1, '-', expect.any(String));
      expect(onValueChange).toHaveBeenNthCalledWith(2, 1, expect.any(String));
    });

    it('emits a trailing decimal as the number it parses to', () => {
      const onValueChange = vi.fn();
      const { container } = render(
        <FilterChip
          label='Size'
          columnType={FilterType.number}
          onValueChange={onValueChange}
        />
      );

      const input = getInput(container);

      fireEvent.change(input, { target: { value: '1.' } });
      expect(onValueChange).toHaveBeenLastCalledWith(1, expect.any(String));

      fireEvent.change(input, { target: { value: '1.5' } });
      expect(onValueChange).toHaveBeenLastCalledWith(1.5, expect.any(String));
    });

    it('rejects a second decimal point', () => {
      const onValueChange = vi.fn();
      const { container } = render(
        <FilterChip
          label='Size'
          columnType={FilterType.number}
          onValueChange={onValueChange}
        />
      );

      const input = getInput(container);
      fireEvent.change(input, { target: { value: '1.2' } });
      fireEvent.change(input, { target: { value: '1.2.' } });

      expect(input).toHaveValue('1.2');
      expect(onValueChange).toHaveBeenCalledTimes(1);
    });

    it('rejects input that parses to Infinity', () => {
      const onValueChange = vi.fn();
      const { container } = render(
        <FilterChip
          label='Size'
          columnType={FilterType.number}
          onValueChange={onValueChange}
        />
      );

      const input = getInput(container);
      fireEvent.change(input, { target: { value: '9'.repeat(309) } });

      expect(onValueChange).not.toHaveBeenCalled();
      expect(input).toHaveValue('');
    });

    it('shows a numeric value without an exponent', () => {
      const { container: small } = render(
        <FilterChip label='Size' value={1e-7} columnType={FilterType.number} />
      );
      const { container: large } = render(
        <FilterChip label='Size' value={1e21} columnType={FilterType.number} />
      );

      expect(getInput(small)).toHaveValue('0.0000001');
      expect(getInput(large)).toHaveValue('1000000000000000000000');
    });

    it('shows a numeric value and starts empty for a non-numeric one', () => {
      const { container: numeric } = render(
        <FilterChip label='Size' value={-1.5} columnType={FilterType.number} />
      );
      const { container: nonNumeric } = render(
        <FilterChip label='Size' value='abc' columnType={FilterType.number} />
      );

      expect(getInput(numeric)).toHaveValue('-1.5');
      expect(getInput(nonNumeric)).toHaveValue('');
    });

    it('emits an empty string when the field is cleared', () => {
      const onValueChange = vi.fn();
      const { container } = render(
        <FilterChip
          label='Size'
          value={7}
          columnType={FilterType.number}
          onValueChange={onValueChange}
        />
      );

      fireEvent.change(getInput(container), { target: { value: '' } });

      expect(onValueChange).toHaveBeenCalledWith('', expect.any(String));
    });
  });

  describe('Date Filter Type', () => {
    it('renders the calendar without crashing when no value is set', () => {
      expect(() =>
        render(<FilterChip label='Created' columnType={FilterType.date} />)
      ).not.toThrow();
      expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
    });

    it('parses a serialized string date value instead of rendering blank', () => {
      render(
        <FilterChip
          label='Created'
          columnType={FilterType.date}
          value='2026-05-27'
        />
      );
      expect(
        screen.getByDisplayValue(
          defaultFormatValue(new Date(2026, 4, 27), 'day')
        )
      ).toBeInTheDocument();
    });

    it('parses an epoch number value', () => {
      // Local-component Date so the timestamp is timezone-stable.
      render(
        <FilterChip
          label='Created'
          columnType={FilterType.date}
          value={new Date(2026, 4, 27).getTime()}
        />
      );
      expect(
        screen.getByDisplayValue(
          defaultFormatValue(new Date(2026, 4, 27), 'day')
        )
      ).toBeInTheDocument();
    });

    it('coerces an unparseable value to unselected instead of crashing', () => {
      expect(() =>
        render(
          <FilterChip
            label='Created'
            columnType={FilterType.date}
            value='not-a-date'
          />
        )
      ).not.toThrow();
      expect(screen.getByPlaceholderText('Select date')).toHaveValue('');
    });

    it('formats a Date value with the default month-as-text format', () => {
      // Local-component Date so the formatted string is timezone-stable.
      render(
        <FilterChip
          label='Created'
          columnType={FilterType.date}
          value={new Date(2026, 4, 27)}
        />
      );
      expect(
        screen.getByDisplayValue(
          defaultFormatValue(new Date(2026, 4, 27), 'day')
        )
      ).toBeInTheDocument();
    });

    it('forwards calendarProps to the calendar', () => {
      render(
        <FilterChip
          label='Created'
          columnType={FilterType.date}
          value={new Date(2026, 4, 27)}
          calendarProps={{
            formatValue: (date, timeZone) =>
              `${date.getDate()} ${timeZone ?? 'local'}`
          }}
        />
      );
      expect(screen.getByDisplayValue('27 local')).toBeInTheDocument();
    });

    it('emits the typed date', () => {
      const onValueChange = vi.fn();
      render(
        <FilterChip
          label='Created'
          columnType={FilterType.date}
          onValueChange={onValueChange}
        />
      );
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.change(input, { target: { value: '27 May 2026' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(onValueChange).toHaveBeenCalledWith(
        new Date(2026, 4, 27),
        expect.any(String)
      );
    });

    it('emits an empty value when the date is cleared', () => {
      const onValueChange = vi.fn();
      render(
        <FilterChip
          label='Created'
          columnType={FilterType.date}
          value={new Date(2026, 4, 27)}
          onValueChange={onValueChange}
        />
      );
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.blur(input);
      expect(onValueChange).toHaveBeenCalledWith('', expect.any(String));
      expect(input).toHaveValue('');
    });

    const isOpen = () =>
      getSlot(document.body, 'calendar-preview-content') !== null;
    const clickDay = (day: string) => {
      const cell = getAllSlots(document.body, 'calendar-preview-day').find(
        one =>
          getSlot(one, 'calendar-preview-day-number')?.textContent === day &&
          !one.hasAttribute('data-outside')
      ) as HTMLElement;
      fireEvent.pointerDown(cell);
      act(() => cell.focus());
      fireEvent.click(cell);
    };

    it('closes the calendar when a day is picked', async () => {
      const onValueChange = vi.fn();
      render(
        <FilterChip
          label='Created'
          columnType={FilterType.date}
          value={new Date(2026, 4, 27)}
          onValueChange={onValueChange}
        />
      );
      const input = screen.getByPlaceholderText('Select date');
      act(() => input.focus());
      expect(isOpen()).toBe(true);
      clickDay('12');
      expect(onValueChange).toHaveBeenCalledWith(
        new Date(2026, 4, 12),
        expect.any(String)
      );
      await act(() => new Promise(resolve => setTimeout(resolve, 100)));
      expect(isOpen()).toBe(false);
    });

    it('keeps the calendar open when the picked day is cleared', () => {
      render(
        <FilterChip
          label='Created'
          columnType={FilterType.date}
          value={new Date(2026, 4, 27)}
        />
      );
      fireEvent.focus(screen.getByPlaceholderText('Select date'));
      clickDay('27');
      expect(isOpen()).toBe(true);
    });

    it('forwards slotProps to the input and the popup', () => {
      const { container } = render(
        <FilterChip
          label='Created'
          columnType={FilterType.date}
          calendarProps={{
            slotProps: {
              input: {
                placeholder: 'Pick a day',
                classNames: { container: 'custom-input' }
              },
              popover: { className: 'custom-popup' }
            }
          }}
        />
      );
      const input = screen.getByPlaceholderText('Pick a day');
      expect(container.querySelector('.custom-input')).toHaveClass(
        styles.dateField
      );
      fireEvent.focus(input);
      expect(
        getSlot(document.body, 'calendar-preview-content')?.querySelector(
          '.custom-popup'
        )
      ).toBeInTheDocument();
    });

    it('shows the calendar icon only with showCalendarIcon', () => {
      const icons = (showCalendarIcon?: boolean) =>
        render(
          <FilterChip
            label='Created'
            columnType={FilterType.date}
            calendarProps={{ showCalendarIcon }}
          />
        ).container.querySelectorAll('[data-slot="filter-chip-value"] svg')
          .length;
      expect(icons()).toBe(0);
      expect(icons(true)).toBe(1);
    });

    it('reports a typed error through onErrorChange', () => {
      const onErrorChange = vi.fn();
      render(
        <FilterChip
          label='Created'
          columnType={FilterType.date}
          calendarProps={{ onErrorChange }}
        />
      );
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'not a date' } });
      expect(onErrorChange).toHaveBeenLastCalledWith('Invalid date');
      fireEvent.change(input, { target: { value: '27 May 2026' } });
      expect(onErrorChange).toHaveBeenLastCalledWith(undefined);
    });

    it('keeps a typed error when a string value rerenders the chip', () => {
      function Parent() {
        const [error, setError] = useState<string>();
        return (
          <>
            <span data-testid='error'>{error}</span>
            <FilterChip
              label='Created'
              columnType={FilterType.date}
              value='2026-05-27'
              calendarProps={{ onErrorChange: setError }}
            />
          </>
        );
      }
      render(<Parent />);
      const input = screen.getByDisplayValue(
        defaultFormatValue(new Date(2026, 4, 27), 'day')
      );
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'not a date' } });
      expect(input).toHaveValue('not a date');
      expect(screen.getByTestId('error')).toHaveTextContent('Invalid date');
    });

    it('does not select a day when slotProps.input is disabled', () => {
      const onValueChange = vi.fn();
      render(
        <FilterChip
          label='Created'
          columnType={FilterType.date}
          value={new Date(2026, 4, 27)}
          onValueChange={onValueChange}
          calendarProps={{ slotProps: { input: { disabled: true } } }}
        />
      );
      fireEvent.click(
        getSlot(document.body, 'calendar-preview-trigger') as HTMLElement
      );
      if (isOpen()) clickDay('12');
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('Forwarded HTML attributes', () => {
    it('forwards arbitrary HTML attributes onto the root div', () => {
      render(
        <FilterChip
          label='Name'
          id='my-filter'
          data-testid='filter-root'
          title='Tooltip'
        />
      );

      const root = screen.getByTestId('filter-root');
      expect(root).toHaveAttribute('id', 'my-filter');
      expect(root).toHaveAttribute('title', 'Tooltip');
    });
  });
});
