import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Amount } from '../amount';

describe('Amount', () => {
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<Amount value={1299} />);
      expect(screen.getByText('$12.99')).toBeInTheDocument();
    });

    it('renders zero value correctly', () => {
      render(<Amount value={0} />);
      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });

    it('renders negative values correctly', () => {
      render(<Amount value={-1299} />);
      expect(screen.getByText('-$12.99')).toBeInTheDocument();
    });

    it('accepts ref', () => {
      const ref = vi.fn();
      render(<Amount value={1299} ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Value Handling', () => {
    it('handles value in minor units', () => {
      render(<Amount value={1299} valueInMinorUnits={true} />);
      expect(screen.getByText('$12.99')).toBeInTheDocument();
    });

    it('handles value in major units', () => {
      render(<Amount value={1299} valueInMinorUnits={false} />);
      expect(screen.getByText('$1,299.00')).toBeInTheDocument();
    });

    it('handles decimal string values', () => {
      render(<Amount value='1299' valueInMinorUnits={true} />);
      expect(screen.getByText('$12.99')).toBeInTheDocument();
    });

    it('warns when number exceeds safe integer limit', () => {
      const consoleSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => null);
      render(<Amount value={Number.MAX_SAFE_INTEGER + 1} />);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("exceeds JavaScript's safe integer limit")
      );
      consoleSpy.mockRestore();
    });
  });

  describe('Currency Support', () => {
    it('renders USD currency by default', () => {
      render(<Amount value={1299} currency='USD' />);
      expect(screen.getByText('$12.99')).toBeInTheDocument();
    });

    it('renders EUR currency', () => {
      render(<Amount value={1299} currency='EUR' locale='en-US' />);
      expect(screen.getByText('€12.99')).toBeInTheDocument();
    });

    it('renders JPY currency (no decimals)', () => {
      render(<Amount value={1299} currency='JPY' locale='en-US' />);
      expect(screen.getByText('¥1,299')).toBeInTheDocument();
    });

    it('handles invalid currency code', () => {
      const consoleSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => null);
      render(<Amount value={1299} currency='INVALID' />);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Invalid currency code: INVALID. Falling back to USD.'
      );
      expect(screen.getByText('$12.99')).toBeInTheDocument();
      consoleSpy.mockRestore();
    });

    it('handles lowercase currency codes', () => {
      render(<Amount value={1299} currency='eur' locale='en-US' />);
      expect(screen.getByText('€12.99')).toBeInTheDocument();
    });

    it('handles currencies with no decimal places', () => {
      render(<Amount value={1299} currency='KRW' />);
      expect(screen.getByText('₩1,299')).toBeInTheDocument();
    });
  });

  describe('Locale Support', () => {
    it('renders with US locale by default', () => {
      render(<Amount value={123456789} />);
      expect(screen.getByText('$1,234,567.89')).toBeInTheDocument();
    });

    it('renders with Japanese locale', () => {
      render(<Amount value={1299} currency='JPY' locale='ja-JP' />);
      expect(screen.getByText('￥1,299')).toBeInTheDocument();
    });
  });

  describe('Display Options', () => {
    it('hides decimals when hideDecimals is true', () => {
      render(<Amount value={1299} hideDecimals />);
      expect(screen.getByText('$12')).toBeInTheDocument();
    });

    it('hides decimals with string values', () => {
      render(<Amount value='1299' hideDecimals />);
      expect(screen.getByText('$12')).toBeInTheDocument();
    });

    it('displays currency as symbol by default', () => {
      render(<Amount value={1299} currencyDisplay='symbol' />);
      expect(screen.getByText('$12.99')).toBeInTheDocument();
    });

    it('displays currency as code', () => {
      render(<Amount value={1299} currencyDisplay='code' />);
      expect(screen.getByText('USD 12.99')).toBeInTheDocument();
    });

    it('displays currency as name', () => {
      render(<Amount value={1299} currencyDisplay='name' />);
      expect(screen.getByText('12.99 US dollars')).toBeInTheDocument();
    });

    it('groups digits by default', () => {
      render(<Amount value={123456789} />);
      expect(screen.getByText('$1,234,567.89')).toBeInTheDocument();
    });

    it('does not group digits when groupDigits is false', () => {
      render(<Amount value={123456789} groupDigits={false} />);
      expect(screen.getByText('$1234567.89')).toBeInTheDocument();
    });
  });

  describe('Fraction Digits', () => {
    it('respects minimumFractionDigits', () => {
      render(<Amount value={1200} minimumFractionDigits={3} />);
      expect(screen.getByText('$12.000')).toBeInTheDocument();
    });

    it('respects maximumFractionDigits', () => {
      render(<Amount value={1234} maximumFractionDigits={1} />);
      expect(screen.getByText('$12.3')).toBeInTheDocument();
    });

    it('overrides fraction digits when hideDecimals is true', () => {
      render(
        <Amount
          value={1299}
          hideDecimals
          minimumFractionDigits={2}
          maximumFractionDigits={2}
        />
      );
      expect(screen.getByText('$12')).toBeInTheDocument();
    });

    it('handles both minimum and maximum fraction digits', () => {
      render(
        <Amount
          value={1200}
          minimumFractionDigits={1}
          maximumFractionDigits={3}
        />
      );
      expect(screen.getByText('$12.0')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined value', () => {
      // @ts-ignore - Testing edge case
      render(<Amount value={undefined} />);
      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });

    it('handles null value', () => {
      // @ts-ignore - Testing edge case
      render(<Amount value={null} />);
      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });

    it('handles error in formatting', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => null);
      // Force an error by providing invalid locale
      render(<Amount value={1299} locale='invalid-locale' />);
      // Should fallback to showing raw value or handle gracefully
      const element = screen.getByText((_, element) => {
        return element?.tagName === 'SPAN';
      });
      expect(element).toBeInTheDocument();
      consoleSpy.mockRestore();
    });
  });
});
