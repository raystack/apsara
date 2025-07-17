import { forwardRef } from 'react';

export interface AmountProps {
  /**
   * The monetary value to display
   * For large numbers (> 2^53), pass the value as string to maintain precision
   * @default 0
   * @example
   * valueInMinorUnits=true: 1299 => "$12.99"
   * valueInMinorUnits=false: 12.99 => "$12.99"
   */
  value: number | string;

  /**
   * ISO 4217 currency code
   * @default 'USD'
   */
  currency?: string;

  /**
   * Whether the value is in minor units (cents, paise, etc.)
   * If true, the value will be converted based on the currency's decimal places
   * If false, the value will be used as is
   * @default true
   * @example
   * USD: 1299 => $12.99 (2 decimals)
   * JPY: 1299 => ¥1,299 (0 decimals)
   * BHD: 1299 => BHD 1.299 (3 decimals)
   */
  valueInMinorUnits?: boolean;

  /**
   * BCP 47 language tag
   * @default 'en-US'
   * @example 'en-US', 'de-DE', 'ja-JP'
   */
  locale?: string;

  /**
   * Truncates decimal places
   * @default false
   */
  hideDecimals?: boolean;

  /**
   * Currency display format
   * @default 'symbol'
   * @example 'symbol' - $12.99, 'code' - USD 12.99, 'name' - 12.99 US Dollars
   */
  currencyDisplay?: 'symbol' | 'code' | 'name';

  /**
   * Number of minimum fraction digits
   * @default undefined (uses currency's default)
   */
  minimumFractionDigits?: number;

  /**
   * Number of maximum fraction digits
   * @default undefined (uses currency's default)
   */
  maximumFractionDigits?: number;

  /**
   * Group digits (e.g., thousand separators)
   * @default true
   */
  groupDigits?: boolean;
}

/**
 * Get the number of decimal places for a currency
 */
function getCurrencyDecimals(currency: string): number {
  try {
    const formatter = new Intl.NumberFormat('en', {
      style: 'currency',
      currency: currency.toUpperCase()
    });

    // Format a number and count the decimal places
    const formatted = formatter.format(1); // Get string representation of 1 unit with currency symbol
    const match = formatted.match(/\.([\d]+)/); // Extract the decimal part
    return match ? match[1].length : 0;
  } catch {
    // Default to 2 decimal places
    return 2;
  }
}

/**
 * Check if a currency is valid
 */
function isValidCurrency(currency: string): boolean {
  try {
    new Intl.NumberFormat('en', {
      style: 'currency',
      currency: currency.toUpperCase()
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Amount component for displaying monetary values.
 * Automatically formats currencies using Intl.NumberFormat.
 * Inherits styling from parent Text component.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Text>
 *   Total: <Amount value={1299} />  // Shows as "$12.99"
 * </Text>
 *
 * // With different currency and locale
 * <Text>
 *   Prix: <Amount value={1299} currency="EUR" locale="fr-FR" />  // Shows as "12,99 €"
 * </Text>
 *
 * // Without decimals
 * <Text>
 *   Price: <Amount value={1299} hideDecimals />  // Shows as "$12"
 * </Text>
 *
 * // With currency code
 * <Text>
 *   Amount: <Amount value={1299} currencyDisplay="code" />  // Shows as "USD 12.99"
 * </Text>
 *
 * // With value in major units
 * <Text>
 *   Amount: <Amount value={12.99} valueInMinorUnits={false} />  // Shows as "$12.99"
 * </Text>
 *
 * // With groupDigits (default is true)
 * <Text>
 *   Amount: <Amount value={129999999} groupDigits />  // Shows as "$129,999,999.99"
 * </Text>
 * ```
 */
export const Amount = forwardRef<HTMLSpanElement, AmountProps>(
  (
    {
      value = 0,
      currency = 'USD',
      locale = 'en-US',
      hideDecimals = false,
      currencyDisplay = 'symbol',
      minimumFractionDigits,
      maximumFractionDigits,
      groupDigits = true,
      valueInMinorUnits = true
    },
    ref
  ) => {
    try {
      if (
        typeof value === 'number' &&
        Math.abs(value) > Number.MAX_SAFE_INTEGER
      ) {
        console.warn(
          `Warning: The number ${value} exceeds JavaScript's safe integer limit (${Number.MAX_SAFE_INTEGER}). ` +
            'For large numbers, pass the value as a string to maintain precision.'
        );
      }

      const validCurrency = isValidCurrency(currency) ? currency : 'USD';
      if (validCurrency !== currency) {
        console.warn(
          `Invalid currency code: ${currency}. Falling back to USD.`
        );
      }

      const decimals = getCurrencyDecimals(validCurrency);

      // Handle minor units - use string manipulation for strings and Math.pow for numbers
      const baseValue =
        valueInMinorUnits && decimals > 0
          ? typeof value === 'string'
            ? value.slice(0, -decimals) + '.' + value.slice(-decimals)
            : value / Math.pow(10, decimals)
          : value;

      // Remove decimals if hideDecimals is true - handle string and number separately
      // Note: Not all numbers passed is converted to string as methods like Math.trunc
      // or toString cannot handle large numbers thus, we need to handle it separately (large numbers passed in value throws console warning).
      const finalBaseValue = hideDecimals
        ? typeof baseValue === 'string'
          ? baseValue.split('.')[0]
          : Math.trunc(baseValue)
        : baseValue;

      const formattedValue = new Intl.NumberFormat(locale, {
        style: 'currency' as const,
        currency: validCurrency.toUpperCase(),
        currencyDisplay,
        minimumFractionDigits: hideDecimals ? 0 : minimumFractionDigits,
        maximumFractionDigits: hideDecimals ? 0 : maximumFractionDigits,
        useGrouping: groupDigits
        // @ts-ignore - Handling large numbers as string or number, so we need to pass the value as string or number.
      }).format(finalBaseValue);

      return <span ref={ref}>{formattedValue}</span>;
    } catch (error) {
      console.error('Error formatting amount:', error);
      return <span ref={ref}>{value}</span>;
    }
  }
);

Amount.displayName = 'Amount';
