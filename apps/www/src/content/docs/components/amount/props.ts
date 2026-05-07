export interface AmountProps {
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
