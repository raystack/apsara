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
