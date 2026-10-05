import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Search } from '../search';
import styles from '../search.module.css';

describe('Search', () => {
  describe('Basic Rendering', () => {
    it('renders search container with role', () => {
      render(<Search />);
      const search = screen.getByRole('search');
      expect(search).toBeInTheDocument();
    });

    it('renders input field', () => {
      render(<Search />);
      const input = screen.getByRole('searchbox');
      expect(input).toBeInTheDocument();
    });

    it('forwards ref to input', () => {
      const ref = vi.fn();
      render(<Search ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });

    it('shows search icon by default', () => {
      const { container } = render(<Search />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('replaces the search icon with a custom leadingIcon', () => {
      const { container } = render(
        <Search leadingIcon={<span data-testid='custom-icon' />} />
      );
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeNull();
    });

    it('hides the leading icon when leadingIcon is null', () => {
      const { container } = render(<Search leadingIcon={null} />);
      expect(
        container.querySelector('[data-slot="input-leading-icon"]')
      ).toBeNull();
    });

    it('applies default placeholder', () => {
      render(<Search />);
      const input = screen.getByPlaceholderText('Search');
      expect(input).toBeInTheDocument();
    });

    it('uses custom placeholder', () => {
      render(<Search placeholder='Search users...' />);
      const input = screen.getByPlaceholderText('Search users...');
      expect(input).toBeInTheDocument();
    });

    it('sets aria-label from placeholder', () => {
      render(<Search placeholder='Search items' />);
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('aria-label', 'Search items');
    });
  });

  describe('Value and Change', () => {
    it('displays value', () => {
      render(<Search value='test query' />);
      const input = screen.getByRole('searchbox') as HTMLInputElement;
      expect(input.value).toBe('test query');
    });

    it('calls onChange when typing', () => {
      const handleChange = vi.fn();
      render(<Search onChange={handleChange} />);
      const input = screen.getByRole('searchbox');

      fireEvent.change(input, { target: { value: 'new value' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('works as uncontrolled component', () => {
      render(<Search />);
      const input = screen.getByRole('searchbox') as HTMLInputElement;

      fireEvent.change(input, { target: { value: 'search term' } });
      expect(input.value).toBe('search term');
    });
  });

  describe('Clear Button', () => {
    it('does not show clear button by default', () => {
      render(<Search value='test' />);
      expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
    });

    it('shows clear button when showClearButton and value exist', () => {
      render(<Search showClearButton value='test' />);
      expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
    });

    it('renders clear button regardless of value (CSS hides it when empty)', () => {
      render(<Search showClearButton value='' />);
      expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
    });

    it('calls onClear when clear button clicked', () => {
      const handleClear = vi.fn();
      render(<Search showClearButton value='test' onClear={handleClear} />);

      const clearButton = screen.getByLabelText('Clear search');
      fireEvent.click(clearButton);
      expect(handleClear).toHaveBeenCalled();
    });

    it('stops propagation on clear button click', () => {
      const handleClear = vi.fn();
      const handleClick = vi.fn();

      render(
        <div onClick={handleClick}>
          <Search showClearButton value='test' onClear={handleClear} />
        </div>
      );

      const clearButton = screen.getByLabelText('Clear search');
      fireEvent.click(clearButton);

      expect(handleClear).toHaveBeenCalled();
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('disables clear button when search is disabled', () => {
      render(<Search showClearButton value='test' disabled />);

      const clearButton = screen.getByLabelText('Clear search');
      expect(clearButton).toBeDisabled();
    });

    it('does not call onClear when disabled', () => {
      const handleClear = vi.fn();
      render(
        <Search showClearButton value='test' onClear={handleClear} disabled />
      );

      const clearButton = screen.getByLabelText('Clear search');
      fireEvent.click(clearButton);
      expect(handleClear).not.toHaveBeenCalled();
    });

    it('does not clear or call onClear when readOnly', () => {
      const handleClear = vi.fn();
      render(
        <Search
          showClearButton
          defaultValue='test'
          onClear={handleClear}
          readOnly
        />
      );

      fireEvent.click(screen.getByLabelText('Clear search'));
      expect(screen.getByRole('searchbox')).toHaveValue('test');
      expect(handleClear).not.toHaveBeenCalled();
    });
  });

  describe('Sizes', () => {
    it('renders default size', () => {
      render(<Search />);
      const input = screen.getByRole('searchbox');
      expect(input).toBeInTheDocument();
    });

    it('renders small size', () => {
      render(<Search size='small' />);
      const input = screen.getByRole('searchbox');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('defaults to default variant', () => {
      render(<Search />);
      const input = screen.getByRole('searchbox');
      expect(input).toBeInTheDocument();
    });

    it('renders borderless variant', () => {
      render(<Search variant='borderless' />);
      const input = screen.getByRole('searchbox');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Width', () => {
    it('defaults to 100% width', () => {
      const { container } = render(<Search />);
      const searchContainer = container.querySelector(`.${styles.container}`);
      expect(searchContainer).toHaveStyle({ width: '100%' });
    });

    it('sets custom width', () => {
      const { container } = render(<Search width='300px' />);
      const searchContainer = container.querySelector(`.${styles.container}`);
      expect(searchContainer).toHaveStyle({ width: '300px' });
    });
  });

  describe('Disabled State', () => {
    it('disables input when disabled', () => {
      render(<Search disabled />);
      const input = screen.getByRole('searchbox');
      expect(input).toBeDisabled();
    });

    it('does not call onChange when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Search disabled onChange={handleChange} />);
      const input = screen.getByRole('searchbox');

      await user.type(input, 'test');

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Input Props', () => {
    it('passes className to input', () => {
      render(<Search className='custom-search' />);
      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass('custom-search');
    });

    it('supports onFocus event', () => {
      const handleFocus = vi.fn();
      render(<Search onFocus={handleFocus} />);
      const input = screen.getByRole('searchbox');

      fireEvent.focus(input);
      expect(handleFocus).toHaveBeenCalled();
    });

    it('supports onBlur event', () => {
      const handleBlur = vi.fn();
      render(<Search onBlur={handleBlur} />);
      const input = screen.getByRole('searchbox');

      fireEvent.blur(input);
      expect(handleBlur).toHaveBeenCalled();
    });

    it('supports onKeyDown event', () => {
      const handleKeyDown = vi.fn();
      render(<Search onKeyDown={handleKeyDown} />);
      const input = screen.getByRole('searchbox');

      fireEvent.keyDown(input, { key: 'Enter' });
      expect(handleKeyDown).toHaveBeenCalled();
    });

    it('supports name attribute', () => {
      render(<Search name='search-field' />);
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('name', 'search-field');
    });

    it('supports id attribute', () => {
      render(<Search id='search-input' />);
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('id', 'search-input');
    });
  });

  describe('Type', () => {
    it('defaults to type="search"', () => {
      render(<Search />);
      expect(screen.getByRole('searchbox')).toHaveAttribute('type', 'search');
    });

    it('lets type be overridden', () => {
      render(<Search type='text' />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });
  });

  describe('Ref', () => {
    it('passes the input element to the consumer ref', () => {
      let node: HTMLInputElement | null = null;
      render(
        <Search
          ref={el => {
            node = el;
          }}
        />
      );
      expect(node).toBe(screen.getByRole('searchbox'));
    });
  });

  describe('Clear with Escape', () => {
    it('clears, calls onClear with the keyboard event, and stops propagation', async () => {
      const user = userEvent.setup();
      const handleClear = vi.fn();
      const parentKeyDown = vi.fn();
      render(
        <div onKeyDown={parentKeyDown}>
          <Search value='test' onClear={handleClear} />
        </div>
      );
      const input = screen.getByRole('searchbox');

      await user.click(input);
      await user.keyboard('{Escape}');

      expect(handleClear).toHaveBeenCalledTimes(1);
      expect(handleClear.mock.calls[0][0].type).toBe('keydown');
      expect(handleClear.mock.calls[0][0].key).toBe('Escape');
      expect(input).toHaveFocus();
      expect(parentKeyDown).not.toHaveBeenCalled();
    });

    it('lets Escape bubble when the input is empty', async () => {
      const user = userEvent.setup();
      const handleClear = vi.fn();
      const parentKeyDown = vi.fn();
      render(
        <div onKeyDown={parentKeyDown}>
          <Search value='' onClear={handleClear} />
        </div>
      );

      await user.click(screen.getByRole('searchbox'));
      await user.keyboard('{Escape}');

      expect(handleClear).not.toHaveBeenCalled();
      expect(parentKeyDown).toHaveBeenCalledTimes(1);
    });

    it('does nothing when disabled', () => {
      const handleClear = vi.fn();
      render(<Search value='test' onClear={handleClear} disabled />);

      fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Escape' });
      expect(handleClear).not.toHaveBeenCalled();
    });

    it('does nothing when readOnly', async () => {
      const user = userEvent.setup();
      const handleClear = vi.fn();
      render(<Search value='test' onClear={handleClear} readOnly />);

      await user.click(screen.getByRole('searchbox'));
      await user.keyboard('{Escape}');
      expect(handleClear).not.toHaveBeenCalled();
    });

    it('does nothing when the consumer onKeyDown prevents default', async () => {
      const user = userEvent.setup();
      const handleClear = vi.fn();
      render(
        <Search
          value='test'
          onClear={handleClear}
          onKeyDown={e => e.preventDefault()}
        />
      );

      await user.click(screen.getByRole('searchbox'));
      await user.keyboard('{Escape}');
      expect(handleClear).not.toHaveBeenCalled();
    });

    it('clears an uncontrolled input and fires onChange', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Search onChange={handleChange} />);
      const input = screen.getByRole('searchbox') as HTMLInputElement;

      await user.type(input, 'abc');
      handleChange.mockClear();
      await user.keyboard('{Escape}');

      expect(input.value).toBe('');
      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Clear button focus and events', () => {
    it('passes the mouse event to onClear and focuses the input', async () => {
      const user = userEvent.setup();
      const handleClear = vi.fn();
      render(<Search showClearButton value='test' onClear={handleClear} />);

      await user.click(screen.getByLabelText('Clear search'));

      expect(handleClear).toHaveBeenCalledTimes(1);
      expect(handleClear.mock.calls[0][0].type).toBe('click');
      expect(document.activeElement).toBe(screen.getByRole('searchbox'));
    });

    it('clears an uncontrolled input and fires onChange', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Search showClearButton onChange={handleChange} />);
      const input = screen.getByRole('searchbox') as HTMLInputElement;

      await user.type(input, 'abc');
      handleChange.mockClear();
      await user.click(screen.getByLabelText('Clear search'));

      expect(input.value).toBe('');
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(input).toHaveFocus();
    });
  });

  describe('Controlled without onClear', () => {
    it('clears on Escape through onValueChange and stops propagation', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      const parentKeyDown = vi.fn();
      render(
        <div onKeyDown={parentKeyDown}>
          <Search value='test' onValueChange={handleValueChange} />
        </div>
      );

      await user.click(screen.getByRole('searchbox'));
      await user.keyboard('{Escape}');

      expect(handleValueChange).toHaveBeenCalledTimes(1);
      expect(handleValueChange.mock.calls[0][0]).toBe('');
      expect(parentKeyDown).not.toHaveBeenCalled();
    });

    it('clears on clear click through onValueChange', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      render(
        <Search
          showClearButton
          value='test'
          onValueChange={handleValueChange}
        />
      );

      await user.click(screen.getByLabelText('Clear search'));

      expect(handleValueChange).toHaveBeenCalledTimes(1);
      expect(handleValueChange.mock.calls[0][0]).toBe('');
      expect(screen.getByRole('searchbox')).toHaveFocus();
    });
  });
});
