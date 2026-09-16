import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getSlot } from '~/test-utils/data-slots';
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

  describe('Date Filter Type', () => {
    it('renders the date picker without crashing when no value is set', () => {
      // Regression: an unset date chip seeds its value with '' and forwarded
      // that string to DatePicker, whose controlled-sync effect ran
      // `valueProp?.getTime()` → "getTime is not a function".
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
      expect(screen.getByDisplayValue('27 May 2026')).toBeInTheDocument();
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
      expect(screen.getByDisplayValue('27 May 2026')).toBeInTheDocument();
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
      expect(screen.getByDisplayValue('27 May 2026')).toBeInTheDocument();
    });

    /* Ported from the `dateFormat` case: the prop is gone, and `formatValue`
       is the forwarded prop whose effect is visible in the field. */
    it('forwards calendarProps to the calendar', () => {
      render(
        <FilterChip
          label='Created'
          columnType={FilterType.date}
          value={new Date(2026, 4, 27)}
          calendarProps={{
            formatValue: value =>
              value instanceof Date ? `day-${value.getDate()}` : 'period'
          }}
        />
      );
      expect(screen.getByDisplayValue('day-27')).toBeInTheDocument();
    });

    /* The shallow `slotProps.input` merge let a consumer object replace the
       chip's own, dropping the class that sizes the field. */
    it('keeps its own class when a consumer passes calendarProps.className', () => {
      const { container } = render(
        <FilterChip
          label='Created'
          columnType={FilterType.date}
          value={new Date(2026, 4, 27)}
          calendarProps={{ className: 'consumer-calendar' }}
        />
      );
      const root = container.querySelector('[data-slot="calendar-preview"]');
      expect(root).toHaveClass('consumer-calendar');
      expect(root?.className.split(' ').length).toBeGreaterThan(1);
    });

    it('composes a consumer onValueChange rather than replacing its own', () => {
      const consumer = vi.fn();
      const onValueChange = vi.fn();
      render(
        <FilterChip
          label='Created'
          columnType={FilterType.date}
          value={new Date(2026, 4, 27)}
          onValueChange={onValueChange}
          calendarProps={{ onValueChange: consumer }}
        />
      );
      const input = screen.getByDisplayValue('27 May 2026');
      fireEvent.change(input, { target: { value: '28 May 2026' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(consumer).toHaveBeenCalled();
      expect(onValueChange).toHaveBeenCalled();
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

/* Reference C: the cell shows the value's annotation at the value's own scale,
   and nothing mounts a calendar until the popover opens. */
describe('FilterChip as the DataView calendar filter cell', () => {
  it('annotates a day value with no calendar in the tree', () => {
    const { container } = render(
      <FilterChip
        label='When'
        columnType={FilterType.date}
        value={new Date(2026, 7, 15)}
      />
    );
    expect(screen.getByDisplayValue('15 Aug 2026')).toBeInTheDocument();
    expect(getSlot(container, 'calendar-preview-days')).toBeNull();
    expect(getSlot(container, 'calendar-preview-content')).toBeNull();
  });

  it.each([
    [{ date: '2026-08-15', scale: 'day' }, '15 Aug 2026'],
    [{ date: '2026-08-01', scale: 'month' }, 'Aug 2026'],
    [{ date: '2026-07-01', scale: 'quarter' }, 'Q3 2026']
  ] as const)('annotates %o at its own scale', (value, expected) => {
    const { container } = render(
      <FilterChip
        label='When'
        columnType={FilterType.date}
        value={value}
        calendarProps={{
          scales: ['day', 'month', 'quarter', 'halfYear', 'year']
        }}
      />
    );
    expect(screen.getByDisplayValue(expected)).toBeInTheDocument();
    expect(getSlot(container, 'calendar-preview-content')).toBeNull();
  });
});
