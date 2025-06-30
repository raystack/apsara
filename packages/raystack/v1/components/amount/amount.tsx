import { forwardRef } from 'react';

export interface AmountProps {
  /**
   * The monetary value to display
   * @example
   * valueInMinorUnits=true: 1299 => "$12.99"
   * valueInMinorUnits=false: 12.99 => "$12.99"
   */
  value: number;

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
  useGrouping?: boolean;
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
 * // With useGrouping (default is true)
 * <Text>
 *   Amount: <Amount value={129999999} useGrouping />  // Shows as "$129,999,999.99"
 * </Text>
 * ```
 */
export const Amount = forwardRef<HTMLSpanElement, AmountProps>(
  (
    {
      value,
      currency = 'USD',
      locale = 'en-US',
      hideDecimals = false,
      currencyDisplay = 'symbol',
      minimumFractionDigits,
      maximumFractionDigits,
      useGrouping = true,
      valueInMinorUnits = true
    },
    ref
  ) => {
    const validCurrency = isValidCurrency(currency) ? currency : 'USD';
    if (validCurrency !== currency) {
      console.warn(`Invalid currency code: ${currency}. Falling back to USD.`);
    }

    const getBaseValue = (currencyCode: string) => {
      const decimals = getCurrencyDecimals(currencyCode);
      const baseValue = valueInMinorUnits
        ? value / Math.pow(10, decimals)
        : value;
      return hideDecimals ? Math.trunc(baseValue) : baseValue;
    };

    const getFormatterConfig = (
      currencyCode: string
    ): Intl.NumberFormatOptions => ({
      style: 'currency' as const,
      currency: currencyCode,
      currencyDisplay,
      minimumFractionDigits: hideDecimals ? 0 : minimumFractionDigits,
      maximumFractionDigits: hideDecimals ? 0 : maximumFractionDigits,
      useGrouping
    });

    const baseValue = getBaseValue(validCurrency);
    const formattedValue = new Intl.NumberFormat(
      locale,
      getFormatterConfig(validCurrency.toUpperCase())
    ).format(baseValue);

    return <span ref={ref}>{formattedValue}</span>;
  }
);

Amount.displayName = 'Amount';
