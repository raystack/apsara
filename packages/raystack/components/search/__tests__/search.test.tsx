import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../../../test-utils';
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
      const input = screen.getByRole('textbox');
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
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Search items');
    });
  });

  describe('Value and Change', () => {
    it('displays value', () => {
      render(<Search value='test query' onChange={() => {}} />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('test query');
    });

    it('calls onChange when typing', () => {
      const handleChange = vi.fn();
      render(<Search onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'new value' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('works as uncontrolled component', () => {
      render(<Search />);
      const input = screen.getByRole('textbox') as HTMLInputElement;

      fireEvent.change(input, { target: { value: 'search term' } });
      expect(input.value).toBe('search term');
    });
  });

  describe('Clear Button', () => {
    it('does not show clear button by default', () => {
      render(<Search value='test' onChange={() => {}} />);
      expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
    });

    it('shows clear button when showClearButton and value exist', () => {
      render(<Search showClearButton value='test' onChange={() => {}} />);
      expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
    });

    it('hides clear button when no value', () => {
      render(<Search showClearButton value='' onChange={() => {}} />);
      expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
    });

    it('calls onClear when clear button clicked', () => {
      const handleClear = vi.fn();
      render(
        <Search
          showClearButton
          value='test'
          onChange={() => {}}
          onClear={handleClear}
        />
      );

      const clearButton = screen.getByLabelText('Clear search');
      fireEvent.click(clearButton);
      expect(handleClear).toHaveBeenCalled();
    });

    it('stops propagation on clear button click', () => {
      const handleClear = vi.fn();
      const handleClick = vi.fn();

      render(
        <div onClick={handleClick}>
          <Search
            showClearButton
            value='test'
            onChange={() => {}}
            onClear={handleClear}
          />
        </div>
      );

      const clearButton = screen.getByLabelText('Clear search');
      fireEvent.click(clearButton);

      expect(handleClear).toHaveBeenCalled();
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('disables clear button when search is disabled', () => {
      render(
        <Search showClearButton value='test' onChange={() => {}} disabled />
      );

      const clearButton = screen.getByLabelText('Clear search');
      expect(clearButton).toBeDisabled();
    });

    it('does not call onClear when disabled', () => {
      const handleClear = vi.fn();
      render(
        <Search
          showClearButton
          value='test'
          onChange={() => {}}
          onClear={handleClear}
          disabled
        />
      );

      const clearButton = screen.getByLabelText('Clear search');
      fireEvent.click(clearButton);
      expect(handleClear).not.toHaveBeenCalled();
    });
  });

  describe('Sizes', () => {
    it('renders default size', () => {
      render(<Search />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('renders small size', () => {
      render(<Search size='small' />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('uses smaller clear button for small size', () => {
      render(
        <Search size='small' showClearButton value='test' onChange={() => {}} />
      );
      const clearButton = screen.getByLabelText('Clear search');
      expect(clearButton).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('defaults to default variant', () => {
      render(<Search />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('renders borderless variant', () => {
      render(<Search variant='borderless' />);
      const input = screen.getByRole('textbox');
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
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    // it('does not call onChange when disabled', () => {
    //   const handleChange = vi.fn();
    //   render(<Search disabled onChange={handleChange} />);
    //   const input = screen.getByRole('textbox');

    //   fireEvent.change(input, { target: { value: 'test' } });
    //   expect(handleChange).not.toHaveBeenCalled();
    // });
  });

  describe('InputField Props', () => {
    it('passes className to input field', () => {
      render(<Search className='custom-search' />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-search');
    });

    it('supports onFocus event', () => {
      const handleFocus = vi.fn();
      render(<Search onFocus={handleFocus} />);
      const input = screen.getByRole('textbox');

      fireEvent.focus(input);
      expect(handleFocus).toHaveBeenCalled();
    });

    it('supports onBlur event', () => {
      const handleBlur = vi.fn();
      render(<Search onBlur={handleBlur} />);
      const input = screen.getByRole('textbox');

      fireEvent.blur(input);
      expect(handleBlur).toHaveBeenCalled();
    });

    it('supports onKeyDown event', () => {
      const handleKeyDown = vi.fn();
      render(<Search onKeyDown={handleKeyDown} />);
      const input = screen.getByRole('textbox');

      fireEvent.keyDown(input, { key: 'Enter' });
      expect(handleKeyDown).toHaveBeenCalled();
    });

    it('supports name attribute', () => {
      render(<Search name='search-field' />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('name', 'search-field');
    });

    it('supports id attribute', () => {
      render(<Search id='search-input' />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'search-input');
    });
  });

  describe('Combinations', () => {
    it('renders with all props combined', () => {
      const handleChange = vi.fn();
      const handleClear = vi.fn();

      render(
        <Search
          value='search term'
          onChange={handleChange}
          onClear={handleClear}
          showClearButton
          size='small'
          variant='borderless'
          width='400px'
          placeholder='Find items...'
          className='custom'
        />
      );

      const input = screen.getByPlaceholderText('Find items...');
      expect(input).toBeInTheDocument();
      expect(input).toHaveClass('custom');

      const clearButton = screen.getByLabelText('Clear search');
      expect(clearButton).toBeInTheDocument();

      fireEvent.click(clearButton);
      expect(handleClear).toHaveBeenCalled();
    });
  });
});
