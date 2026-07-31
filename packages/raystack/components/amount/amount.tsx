import { cx } from 'class-variance-authority';
import { type ComponentProps } from 'react';
import styles from './amount.module.css';

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
   * Large strings: "999999999999999" => "$9,999,999,999,999.99"
   * BigInt: 1299n => "$1,299.00" (always major units)
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
   * @example 'symbol' - $12.99 (may show "US$" in non-US locales), 'narrowSymbol' - $12.99 (always the narrow symbol), 'code' - USD 12.99, 'name' - 12.99 US Dollars
   */
  currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code' | 'name';

  /**
   * Number formatting notation.
   * 'compact' abbreviates large values — useful for dashboards and summary views.
   * Compact rounds aggressively by design; avoid it when the value must render exactly.
   * @default 'standard'
   * @example
   * 'standard' - $1,200,000.00, 'compact' - $1.2M
   */
  notation?: 'standard' | 'compact';

  /**
   * When to show the +/- sign — useful for gains/losses.
   * @default 'auto'
   * @example
   * 'auto' - -$12.99, 'always' - +$12.99, 'exceptZero' - +$12.99 but $0.00, 'never' - $12.99
   */
  signDisplay?: 'auto' | 'always' | 'exceptZero' | 'never';

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

  /**
   * Use fixed-width (tabular) figures so digits align vertically across rows —
   * ideal for tables and lists of amounts. Set to false in running text,
   * where proportional figures look more natural.
   * @default true
   */
  tabularNums?: boolean;
}

/**
 * Intl.NumberFormat construction is expensive, and Amount often renders
 * hundreds of times in a table. Cache instances module-wide, keyed by
 * locale + options. The cap guards against unbounded growth when
 * locales/currencies are dynamic.
 */
const FORMATTER_CACHE_LIMIT = 64;
const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(
  locale: string,
  options: Intl.NumberFormatOptions
): Intl.NumberFormat {
  const key = `${locale}|${JSON.stringify(options)}`;
  let formatter = formatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, options);
    if (formatterCache.size >= FORMATTER_CACHE_LIMIT) formatterCache.clear();
    formatterCache.set(key, formatter);
  }
  return formatter;
}

interface CurrencyInfo {
  valid: boolean;
  decimals: number;
}

const currencyInfoCache = new Map<string, CurrencyInfo>();

/**
 * Resolve a currency's validity and decimal places in one cached lookup.
 */
function getCurrencyInfo(currency: string): CurrencyInfo {
  const code = currency.toUpperCase();
  let info = currencyInfoCache.get(code);
  if (!info) {
    try {
      const formatter = getFormatter('en', {
        style: 'currency',
        currency: code
      });
      info = {
        valid: true,
        decimals: formatter.resolvedOptions().maximumFractionDigits ?? 2
      };
    } catch {
      info = { valid: false, decimals: 2 };
    }
    currencyInfoCache.set(code, info);
  }
  return info;
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
 * // Compact notation for dashboards
 * <Text>
 *   Revenue: <Amount value={120000000} notation="compact" />  // Shows as "$1.2M"
 * </Text>
 *
 * // Signed amounts for gains/losses
 * <Text>
 *   Change: <Amount value={1299} signDisplay="always" />  // Shows as "+$12.99"
 * </Text>
 * ```
 */
export const Amount = ({
  value = 0,
  currency = 'USD',
  locale = 'en-US',
  hideDecimals = false,
  currencyDisplay = 'symbol',
  notation = 'standard',
  signDisplay = 'auto',
  minimumFractionDigits,
  maximumFractionDigits,
  groupDigits = true,
  valueInMinorUnits = true,
  hideCurrency = false,
  tabularNums = true,
  className,
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

    const currencyInfo = getCurrencyInfo(currency);
    const validCurrency = currencyInfo.valid ? currency : 'USD';
    if (!currencyInfo.valid) {
      console.warn(`Invalid currency code: ${currency}. Falling back to USD.`);
    }

    const decimals = currencyInfo.valid
      ? currencyInfo.decimals
      : getCurrencyInfo('USD').decimals;

    /**
     * Convert minor → major units.
     * Three input shapes: bigint, string, number.
     * BigInt is always treated as already in major units (it cannot represent fractions),
     * so `valueInMinorUnits` is ignored for BigInt.
     */
    let baseValue: number | string | bigint;
    if (typeof value === 'bigint') {
      baseValue = value;
    } else if (valueInMinorUnits && decimals > 0) {
      if (typeof value === 'string') {
        const isNegative = value.startsWith('-');
        const unsigned = isNegative ? value.slice(1) : value;
        const [intPart, fracPart = ''] = unsigned.split('.');
        // Shift the existing decimal point left by `decimals` without
        // round-tripping through Number — preserves precision for large strings
        // and handles decimal strings like "12.99" (=> "0.1299" for USD).
        const allDigits = intPart + fracPart;
        const fracLen = fracPart.length + decimals;
        const padded = allDigits.padStart(fracLen + 1, '0');
        const major = padded.slice(0, -fracLen);
        const minor = padded.slice(-fracLen);
        baseValue = `${isNegative ? '-' : ''}${major}.${minor}`;
      } else {
        baseValue = value / Math.pow(10, decimals);
      }
    } else {
      baseValue = value;
    }

    // Remove decimals when hideDecimals is true. BigInt has no decimals, so it's a no-op there.
    const finalBaseValue: number | string | bigint = !hideDecimals
      ? baseValue
      : typeof baseValue === 'bigint'
        ? baseValue
        : typeof baseValue === 'string'
          ? baseValue.split('.')[0]
          : Math.trunc(baseValue);

    /**
     * Always format in currency mode — Intl's currency-style handles fraction digits per the currency,
     * locale-correct grouping/separators,
     * and auto-clamps when only one of min/max is user-provided.
     * For hideCurrency, we then strip the currency token from the output via formatToParts(),
     * which avoids the divergent defaults of style: 'decimal'.
     */
    const formatOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: validCurrency.toUpperCase(),
      currencyDisplay,
      notation,
      signDisplay,
      minimumFractionDigits: hideDecimals ? 0 : minimumFractionDigits,
      maximumFractionDigits: hideDecimals ? 0 : maximumFractionDigits,
      useGrouping: groupDigits
    };

    const formatter = getFormatter(locale, formatOptions);

    /**
     * For hideCurrency, strip the `currency` parts and trim leading/trailing
     * whitespace that locales like de-DE leave behind
     * (e.g. "1.234,56 €" becomes "1.234,56 " before the trim).
     * Otherwise format directly.
     */
    const formattedValue: string = hideCurrency
      ? formatter
          .formatToParts(
            // @ts-expect-error TS lib types omit `string` from formatToParts() params, but Intl accepts numeric strings at runtime.
            finalBaseValue
          )
          .filter(p => p.type !== 'currency')
          .map(p => p.value)
          .join('')
          .trim()
      : formatter.format(
          // @ts-expect-error TS lib types omit `string` from format() params, but Intl.NumberFormat accepts numeric strings at runtime — needed for large values that would lose precision as `number`.
          finalBaseValue
        );

    return (
      <span {...props} className={cx(tabularNums && styles.tabular, className)}>
        {formattedValue}
      </span>
    );
  } catch (error) {
    console.error('Error formatting amount:', error);
    return (
      <span {...props} className={cx(tabularNums && styles.tabular, className)}>
        {String(value)}
      </span>
    );
  }
};

Amount.displayName = 'Amount';
