import { type ComponentProps } from 'react';

export interface AmountProps extends ComponentProps<'span'> {
  /**
   * The monetary value to display.
   * For exact precision beyond 2^53, pass either:
   *   - a `string` — supports decimals (e.g. "1299" or "12.99")
   *   - a `bigint` — integer-only; treated as already in major units, so
   *     `valueInMinorUnits` is ignored when value is a bigint
   * @default 0
   * @example
   * valueInMinorUnits=true: 1299 => "$12.99"
   * valueInMinorUnits=false: 12.99 => "$12.99"
   * bigint: 1299n => "$1,299.00" (always major units)
   */
  value: number | string | bigint;

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

  /**
   * Render the formatted number without a currency symbol, code, or name.
   * Locale-driven separators, grouping, and fraction digits are preserved.
   * When true, `currencyDisplay` is ignored.
   * @default false
   * @example
   * <Amount value={1299} hideCurrency /> => "12.99"
   */
  hideCurrency?: boolean;
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
 * Detects whether the runtime implements Intl.NumberFormat V3 string-precision
 * support (Chrome 106+, Firefox 116+, Safari 15.4+, Node 19+). On V3 runtimes,
 * `format(string)` preserves exact precision; on older runtimes the string is
 * coerced via `Number()` first, losing precision beyond 2^53. Memoized so the
 * probe runs at most once per session.
 */
let _supportsIntlStringPrecision: boolean | undefined;
function supportsIntlStringPrecision(): boolean {
  if (_supportsIntlStringPrecision !== undefined) {
    return _supportsIntlStringPrecision;
  }
  try {
    // 20-digit value whose tail (`...112`) is lost when coerced to Number.
    const probe = new Intl.NumberFormat('en-US').format(
      '11111111111111111112' as unknown as number
    );
    _supportsIntlStringPrecision =
      probe.replace(/[^\d]/g, '') === '11111111111111111112';
  } catch {
    _supportsIntlStringPrecision = false;
  }
  return _supportsIntlStringPrecision;
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
export const Amount = ({
  value = 0,
  currency = 'USD',
  locale = 'en-US',
  hideDecimals = false,
  currencyDisplay = 'symbol',
  minimumFractionDigits,
  maximumFractionDigits,
  groupDigits = true,
  valueInMinorUnits = true,
  hideCurrency = false,
  ...props
}: AmountProps) => {
  try {
    if (
      typeof value === 'number' &&
      Math.abs(value) > Number.MAX_SAFE_INTEGER
    ) {
      console.warn(
        `Warning: The number ${value} exceeds JavaScript's safe integer limit (${Number.MAX_SAFE_INTEGER}). ` +
          'For large numbers, pass the value as a bigint or string to maintain precision.'
      );
    }

    const validCurrency = isValidCurrency(currency) ? currency : 'USD';
    if (validCurrency !== currency) {
      console.warn(`Invalid currency code: ${currency}. Falling back to USD.`);
    }

    const decimals = getCurrencyDecimals(validCurrency);

    // Convert minor → major units. Three input shapes: bigint, string, number.
    // bigint is always treated as already in major units (it cannot represent
    // fractions), so `valueInMinorUnits` is ignored for bigint.
    let baseValue: number | string | bigint;
    if (typeof value === 'bigint') {
      baseValue = value;
    } else if (valueInMinorUnits && decimals > 0) {
      if (typeof value === 'string') {
        const isNegative = value.startsWith('-');
        const digits = isNegative ? value.slice(1) : value;
        const padded = digits.padStart(decimals + 1, '0');
        const major = padded.slice(0, -decimals);
        const minor = padded.slice(-decimals);
        baseValue = `${isNegative ? '-' : ''}${major}.${minor}`;
      } else {
        baseValue = value / Math.pow(10, decimals);
      }
    } else {
      baseValue = value;
    }

    // Remove decimals when hideDecimals is true. bigint has no decimals, so
    // it's a no-op there.
    let finalBaseValue: number | string | bigint;
    if (!hideDecimals) {
      finalBaseValue = baseValue;
    } else if (typeof baseValue === 'bigint') {
      finalBaseValue = baseValue;
    } else if (typeof baseValue === 'string') {
      finalBaseValue = baseValue.split('.')[0];
    } else {
      finalBaseValue = Math.trunc(baseValue);
    }

    // For style: 'decimal' (hideCurrency), Intl uses min=0/max=3 by default,
    // ignoring the currency's decimal count. Mirror the currency-style behavior
    // by defaulting both to `decimals` so round amounts like 1200 (USD) still
    // render as "12.00" instead of "12". User-provided values win.
    let resolvedMinFrac = hideDecimals
      ? 0
      : (minimumFractionDigits ?? (hideCurrency ? decimals : undefined));
    let resolvedMaxFrac = hideDecimals
      ? 0
      : (maximumFractionDigits ?? (hideCurrency ? decimals : undefined));

    // In hideCurrency mode, the currency-decimal default applied to the
    // unspecified bound can invert min > max when the user provides only
    // one of the two (e.g. maximumFractionDigits=1 with USD's default min
    // of 2). Intl throws RangeError on inversion — clamp the *defaulted*
    // side toward the user-provided side.
    if (
      hideCurrency &&
      !hideDecimals &&
      resolvedMinFrac !== undefined &&
      resolvedMaxFrac !== undefined
    ) {
      if (
        minimumFractionDigits === undefined &&
        maximumFractionDigits !== undefined &&
        resolvedMinFrac > resolvedMaxFrac
      ) {
        resolvedMinFrac = resolvedMaxFrac;
      } else if (
        maximumFractionDigits === undefined &&
        minimumFractionDigits !== undefined &&
        resolvedMaxFrac < resolvedMinFrac
      ) {
        resolvedMaxFrac = resolvedMinFrac;
      }
    }

    const formatOptions: Intl.NumberFormatOptions = {
      minimumFractionDigits: resolvedMinFrac,
      maximumFractionDigits: resolvedMaxFrac,
      useGrouping: groupDigits,
      ...(hideCurrency
        ? { style: 'decimal' }
        : {
            style: 'currency',
            currency: validCurrency.toUpperCase(),
            currencyDisplay
          })
    };

    if (
      typeof finalBaseValue === 'string' &&
      finalBaseValue.replace(/\D/g, '').length > 15 &&
      !supportsIntlStringPrecision()
    ) {
      console.warn(
        'Amount: this runtime does not support Intl.NumberFormat V3 string precision ' +
          '(requires Chrome 106+, Firefox 116+, Safari 15.4+, or Node 19+). ' +
          'Large string values may lose precision when formatted. ' +
          'Pass a bigint for exact integer formatting on older runtimes.'
      );
    }

    const formattedValue = new Intl.NumberFormat(
      locale,
      formatOptions
      // @ts-expect-error TS lib types omit `string` from format() params, but Intl.NumberFormat accepts numeric strings at runtime — needed for large values that would lose precision as `number`.
    ).format(finalBaseValue);

    return <span {...props}>{formattedValue}</span>;
  } catch (error) {
    console.error('Error formatting amount:', error);
    return <span {...props}>{String(value)}</span>;
  }
};

Amount.displayName = 'Amount';
