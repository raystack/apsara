import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
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

    it('forwards calendarProps to the underlying DatePicker', () => {
      // dateFormat is the easiest forwarded prop to observe — the formatted
      // string in the input changes when it lands on DatePicker.
      render(
        <FilterChip
          label='Created'
          columnType={FilterType.date}
          value={new Date(2026, 4, 27)}
          calendarProps={{ dateFormat: 'DD/MM/YYYY' }}
        />
      );
      expect(screen.getByDisplayValue('27/05/2026')).toBeInTheDocument();
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
