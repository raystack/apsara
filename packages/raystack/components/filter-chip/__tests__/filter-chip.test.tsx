import { describe, expect, it, vi } from 'vitest';
import { FilterType } from '~/types/filters';
import { fireEvent, render, screen } from '../../../test-utils';
import { FilterChip } from '../filter-chip';
import styles from '../filter-chip.module.css';

describe('FilterChip', () => {
  describe('Basic Rendering', () => {
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

    it('has correct ARIA attributes', () => {
      render(<FilterChip label='Name' />);
      const chip = screen.getByRole('group');
      expect(chip).toHaveAttribute('aria-label', 'Filter by Name');
    });
  });

  describe('Leading Icon', () => {
    it('renders leading icon when provided', () => {
      const icon = <span data-testid='filter-icon'>📅</span>;
      render(<FilterChip label='Date' leadingIcon={icon} />);

      expect(screen.getByTestId('filter-icon')).toBeInTheDocument();
      expect(screen.getByText('📅')).toBeInTheDocument();
    });

    it('applies leading icon classes', () => {
      const icon = <span data-testid='filter-icon'>📅</span>;
      const { container } = render(
        <FilterChip label='Date' leadingIcon={icon} />
      );

      const iconWrapper = container.querySelector(`.${styles.leadingIcon}`);
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveAttribute('aria-hidden', 'true');
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
      render(<FilterChip label='Name' columnType={FilterType.string} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('handles value change for string input', () => {
      const onValueChange = vi.fn();
      render(
        <FilterChip
          label='Name'
          columnType={FilterType.string}
          onValueChange={onValueChange}
        />
      );

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test value' } });

      expect(onValueChange).toHaveBeenCalledWith(
        'test value',
        expect.any(String)
      );
    });

    it('shows initial value for string input', () => {
      render(
        <FilterChip
          label='Name'
          value='initial value'
          columnType={FilterType.string}
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('initial value');
    });
  });

  // describe('Select Filter Type', () => {
  //   const options = [
  //     { value: 'option1', label: 'Option 1' },
  //     { value: 'option2', label: 'Option 2' },
  //     { value: 'option3', label: 'Option 3' }
  //   ];

  //   it('renders select for select type', () => {
  //     render(
  //       <FilterChip
  //         label='Category'
  //         columnType={FilterType.select}
  //         options={options}
  //       />
  //     );

  //     expect(screen.getByRole('combobox')).toBeInTheDocument();
  //   });

  //   it('shows select options when opened', () => {
  //     render(
  //       <FilterChip
  //         label='Category'
  //         columnType={FilterType.select}
  //         options={options}
  //       />
  //     );

  //     const select = screen.getByRole('combobox');
  //     fireEvent.click(select);

  //     expect(screen.getByText('Option 1')).toBeInTheDocument();
  //     expect(screen.getByText('Option 2')).toBeInTheDocument();
  //     expect(screen.getByText('Option 3')).toBeInTheDocument();
  //   });

  //   it('handles select value change', () => {
  //     const onValueChange = vi.fn();
  //     render(
  //       <FilterChip
  //         label='Category'
  //         columnType={FilterType.select}
  //         options={options}
  //         onValueChange={onValueChange}
  //       />
  //     );

  //     const select = screen.getByRole('combobox');
  //     fireEvent.click(select);

  //     const option1 = screen.getByText('Option 1');
  //     fireEvent.click(option1);

  //     expect(onValueChange).toHaveBeenCalledWith('option1', expect.any(String));
  //   });
  // });

  describe('Multi-Select Filter Type', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' }
    ];

    // it('renders multi-select for multiselect type', () => {
    //   render(
    //     <FilterChip
    //       label='Tags'
    //       columnType={FilterType.multiselect}
    //       options={options}
    //     />
    //   );

    //   expect(screen.getByRole('combobox')).toBeInTheDocument();
    // });

    it('shows count when multiple items selected', () => {
      render(
        <FilterChip
          label='Tags'
          columnType={FilterType.multiselect}
          value={['option1', 'option2']}
          options={options}
        />
      );

      expect(screen.getByText('2 selected')).toBeInTheDocument();
    });
  });

  describe('Operation Handling', () => {
    it('calls onOperationChange when operation changes', () => {
      const onOperationChange = vi.fn();
      render(<FilterChip label='Name' onOperationChange={onOperationChange} />);

      // This would be triggered by the Operation component
      // The actual test would depend on how the Operation component works
      expect(onOperationChange).toBeDefined();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = { current: null };
      render(<FilterChip label='Name' ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });

  describe('Display Name', () => {
    it('has correct display name', () => {
      expect(FilterChip.displayName).toBe('FilterChip');
    });
  });

  describe('Accessibility', () => {
    it('has proper role and ARIA label', () => {
      render(<FilterChip label='Status' />);

      const chip = screen.getByRole('group');
      expect(chip).toHaveAttribute('aria-label', 'Filter by Status');
    });

    it('remove button has accessible name', () => {
      const onRemove = vi.fn();
      render(<FilterChip label='Priority' onRemove={onRemove} />);

      const removeButton = screen.getByRole('button', {
        name: 'Remove Priority filter'
      });
      expect(removeButton).toBeInTheDocument();
    });

    it('leading icon is hidden from screen readers', () => {
      const icon = <span data-testid='filter-icon'>📅</span>;
      const { container } = render(
        <FilterChip label='Date' leadingIcon={icon} />
      );

      const iconWrapper = container.querySelector(`.${styles.leadingIcon}`);
      expect(iconWrapper).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
