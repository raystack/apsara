import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CopyButton } from '../copy-button';

// Mock the clipboard API
const mockCopy = vi.fn();
vi.mock('~/hooks/useCopyToClipboard', () => ({
  useCopyToClipboard: () => ({
    copy: mockCopy
  })
}));

describe('CopyButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCopy.mockResolvedValue(true);
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Basic Rendering', () => {
    it('renders as a button', () => {
      render(<CopyButton text='Copy me' />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('shows copy icon initially', () => {
      const { container } = render(<CopyButton text='Copy me' />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('passes through IconButton props', () => {
      render(<CopyButton text='Copy me' size={3} className='custom-class' />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('Copy Functionality', () => {
    it('copies text to clipboard on click', async () => {
      render(<CopyButton text='Hello World' />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockCopy).toHaveBeenCalledWith('Hello World');
    });

    it('copies different text values', async () => {
      const { rerender } = render(<CopyButton text='First text' />);

      fireEvent.click(screen.getByRole('button'));
      expect(mockCopy).toHaveBeenCalledWith('First text');

      rerender(<CopyButton text='Second text' />);

      fireEvent.click(screen.getByRole('button'));
      expect(mockCopy).toHaveBeenCalledWith('Second text');
    });
  });
});
