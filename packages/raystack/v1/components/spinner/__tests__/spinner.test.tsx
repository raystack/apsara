import { render, screen } from '../../../test-utils';
import { Button } from '../../button';
import { Spinner } from '../spinner';

describe('Spinner', () => {
  it('renders correctly with default props', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status', { hidden: true });
    const poles = spinner.getElementsByClassName('pole');
    
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('spinner-size-1');
    expect(spinner).toHaveClass('spinner-color-default');
    expect(poles).toHaveLength(8);
  });

  it.each([1, 2, 3, 4, 5, 6] as const)('renders with size %i', (size) => {
    render(<Spinner size={size} />);
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toHaveClass(`spinner-size-${size}`);
  });

  it('renders with inverted color', () => {
    render(<Spinner color="inverted" />);
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toHaveClass('spinner-color-inverted');
  });

  it('accepts custom className', () => {
    const customClass = 'my-custom-class';
    render(<Spinner className={customClass} />);
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toHaveClass(customClass);
    expect(spinner).toHaveClass('spinner');
  });

  it('verifies animation properties', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status', { hidden: true });
    const pole = spinner.querySelector('.pole');
    
    expect(pole).toHaveClass('pole');
  });

  it('has correct accessibility attributes', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toHaveAttribute('role', 'status');
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders properly inside a button', () => {
    render(
      <Button>
        Loading <Spinner />
      </Button>
    );
    
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toBeInTheDocument();
    expect(spinner.closest('button')).toBeInTheDocument();
  });

  it('maintains container boundaries', () => {
    const { container } = render(
      <div style={{ width: '100px', height: '100px' }}>
        <Spinner size={6} />
      </div>
    );
    
    const spinner = screen.getByRole('status', { hidden: true });
    const spinnerRect = spinner.getBoundingClientRect();
    const containerRect = (container.firstChild as HTMLElement).getBoundingClientRect();
    
    expect(spinnerRect.width).toBeLessThanOrEqual(containerRect.width);
    expect(spinnerRect.height).toBeLessThanOrEqual(containerRect.height);
  });
}); 