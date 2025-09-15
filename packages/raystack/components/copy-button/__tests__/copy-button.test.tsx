import { render, screen } from '@testing-library/react';
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

    // it('has data-test-id attribute', () => {
    //   render(<CopyButton text='Copy me' />);
    //   expect(screen.getByTestId('copy-button')).toBeInTheDocument();
    // });

    it('shows copy icon initially', () => {
      const { container } = render(<CopyButton text='Copy me' />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  // describe('Copy Functionality', () => {
  //   it('copies text to clipboard on click', async () => {
  //     render(<CopyButton text='Hello World' />);
  //     const button = screen.getByRole('button');

  //     fireEvent.click(button);

  //     await waitFor(() => {
  //       expect(mockCopy).toHaveBeenCalledWith('Hello World');
  //     });
  //   });

  // it('shows success icon after copying', async () => {
  //   const { container } = render(<CopyButton text='Copy me' />);
  //   const button = screen.getByRole('button');

  //   fireEvent.click(button);

  //   await waitFor(() => {
  //     const svg = container.querySelector('svg');
  //     expect(svg).toBeInTheDocument();
  //   });
  // });

  // it('resets icon after timeout', async () => {
  //   vi.useFakeTimers();
  //   const { container } = render(
  //     <CopyButton text='Copy me' resetTimeout={500} />
  //   );
  //   const button = screen.getByRole('button');

  //   fireEvent.click(button);

  //   await waitFor(() => {
  //     expect(mockCopy).toHaveBeenCalled();
  //   });

  //   vi.advanceTimersByTime(500);

  //   await waitFor(() => {
  //     const svg = container.querySelector('svg');
  //     expect(svg).toBeInTheDocument();
  //   });

  //   vi.useRealTimers();
  // });

  // it('does not reset icon when resetIcon is false', async () => {
  //   vi.useFakeTimers();
  //   const { container } = render(
  //     <CopyButton text='Copy me' resetIcon={false} />
  //   );
  //   const button = screen.getByRole('button');

  //   fireEvent.click(button);

  //   await waitFor(() => {
  //     expect(mockCopy).toHaveBeenCalled();
  //   });

  //   const iconAfterClick = container.querySelector('svg');

  //   vi.advanceTimersByTime(2000);

  //   const iconAfterTimeout = container.querySelector('svg');
  //   expect(iconAfterClick).toBe(iconAfterTimeout);

  //   vi.useRealTimers();
  // });
});

// describe('Error Handling', () => {
//   it('does not change icon when copy fails', async () => {
//     mockCopy.mockResolvedValue(false);
//     const { container } = render(<CopyButton text='Copy me' />);
//     const button = screen.getByRole('button');
//     const initialIcon = container.querySelector('svg')?.outerHTML;

//     fireEvent.click(button);

//     await waitFor(() => {
//       expect(mockCopy).toHaveBeenCalled();
//     });

//     const iconAfterClick = container.querySelector('svg')?.outerHTML;
//     expect(iconAfterClick).toBe(initialIcon);
//   });
// });

describe('Props', () => {
  it('passes through IconButton props', () => {
    render(<CopyButton text='Copy me' size={3} className='custom-class' />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  // it('supports custom reset timeout', async () => {
  //   vi.useFakeTimers();
  //   render(<CopyButton text='Copy me' resetTimeout={2000} />);
  //   const button = screen.getByRole('button');

  //   fireEvent.click(button);

  //   await waitFor(() => {
  //     expect(mockCopy).toHaveBeenCalled();
  //   });

  //   vi.advanceTimersByTime(1000);
  //   // Icon should still be success icon

  //   vi.advanceTimersByTime(1000);
  //   // Now icon should reset

  //   vi.useRealTimers();
  // });

  // it('copies different text values', async () => {
  //   const { rerender } = render(<CopyButton text='First text' />);

  //   fireEvent.click(screen.getByRole('button'));
  //   await waitFor(() => {
  //     expect(mockCopy).toHaveBeenCalledWith('First text');
  //   });

  //   rerender(<CopyButton text='Second text' />);

  //   fireEvent.click(screen.getByRole('button'));
  //   await waitFor(() => {
  //     expect(mockCopy).toHaveBeenCalledWith('Second text');
  //   });
  // });
});

// describe('Multiple Clicks', () => {
//   it('handles multiple rapid clicks', async () => {
//     render(<CopyButton text='Copy me' />);
//     const button = screen.getByRole('button');

//     fireEvent.click(button);
//     fireEvent.click(button);
//     fireEvent.click(button);

//     await waitFor(() => {
//       expect(mockCopy).toHaveBeenCalledTimes(3);
//     });
//   });
// });
// });
