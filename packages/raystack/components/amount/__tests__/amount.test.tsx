import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '../../../test-utils';
import { Amount } from '../amount';

describe('Amount', () => {
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<Amount value={1299} />);
      expect(screen.getByText('$12.99')).toBeInTheDocument();
    });

    it('renders as span element', () => {
      const { container } = render(<Amount value={1000} />);
      const amount = container.querySelector('span');
      expect(amount).toBeInTheDocument();
      expect(amount?.tagName).toBe('SPAN');
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
    it('handles value in minor units (default)', () => {
      render(<Amount value={1299} valueInMinorUnits={true} />);
      expect(screen.getByText('$12.99')).toBeInTheDocument();
    });

    it('handles value in major units', () => {
      render(<Amount value={12.99} valueInMinorUnits={false} />);
      expect(screen.getByText('$12.99')).toBeInTheDocument();
    });

    // it('handles string values for large numbers', () => {
    //   render(<Amount value='999999999999999999' />);
    //   const element = screen.getByText((content, element) => {
    //     return element?.tagName === 'SPAN' && content.includes('999');
    //   });
    //   expect(element).toBeInTheDocument();
    // });

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
    it('renders USD currency (default)', () => {
      render(<Amount value={1299} currency='USD' />);
      expect(screen.getByText('$12.99')).toBeInTheDocument();
    });

    it('renders EUR currency', () => {
      render(<Amount value={1299} currency='EUR' locale='en-US' />);
      expect(screen.getByText('€12.99')).toBeInTheDocument();
    });

    it('renders GBP currency', () => {
      render(<Amount value={1299} currency='GBP' locale='en-US' />);
      expect(screen.getByText('£12.99')).toBeInTheDocument();
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
  });

  describe('Locale Support', () => {
    it('renders with US locale (default)', () => {
      render(<Amount value={123456789} />);
      expect(screen.getByText('$1,234,567.89')).toBeInTheDocument();
    });

    it('renders with German locale', () => {
      render(<Amount value={1299} currency='EUR' locale='de-DE' />);
      const element = screen.getByText(content => {
        return content.includes('12,99');
      });
      expect(element).toBeInTheDocument();
    });

    it('renders with French locale', () => {
      render(<Amount value={1299} currency='EUR' locale='fr-FR' />);
      const element = screen.getByText(content => {
        return content.includes('12,99');
      });
      expect(element).toBeInTheDocument();
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

    it('displays currency as symbol (default)', () => {
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

    // it('handles empty string value', () => {
    //   render(<Amount value='' />);
    //   expect(screen.getByText('$0.00')).toBeInTheDocument();
    // });

    // it('handles very large numbers as strings', () => {
    //   render(<Amount value='99999999999999999999' valueInMinorUnits={false} />);
    //   const element = screen.getByText((content, element) => {
    //     return element?.tagName === 'SPAN' && content.includes('999');
    //   });
    //   expect(element).toBeInTheDocument();
    // });

    it('handles error in formatting gracefully', () => {
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

    it('handles decimal values correctly', () => {
      render(<Amount value={12.345} valueInMinorUnits={false} />);
      expect(screen.getByText('$12.35')).toBeInTheDocument();
    });

    it('handles zero with hideDecimals', () => {
      render(<Amount value={0} hideDecimals />);
      expect(screen.getByText('$0')).toBeInTheDocument();
    });

    it('handles negative values with hideDecimals', () => {
      render(<Amount value={-1299} hideDecimals />);
      expect(screen.getByText('-$12')).toBeInTheDocument();
    });
  });

  describe('Complex Scenarios', () => {
    it('formats large amounts with grouping', () => {
      render(<Amount value={999999999} />);
      expect(screen.getByText('$9,999,999.99')).toBeInTheDocument();
    });

    it('handles combination of options', () => {
      render(
        <Amount
          value={123456789}
          currency='EUR'
          locale='de-DE'
          currencyDisplay='code'
          groupDigits={true}
        />
      );
      const element = screen.getByText(content => {
        return content.includes('EUR') && content.includes('1.234.567');
      });
      expect(element).toBeInTheDocument();
    });

    it('handles BHD currency with 3 decimal places', () => {
      render(<Amount value={1299} currency='BHD' />);
      expect(screen.getByText('BHD 1.299')).toBeInTheDocument();
    });

    it('handles currencies with no decimal places', () => {
      render(<Amount value={1299} currency='KRW' />);
      expect(screen.getByText('₩1,299')).toBeInTheDocument();
    });
  });
});
