/* `DayKey`s throughout, so nothing here takes a zone; callers convert at their boundary. */
import {
  type DayKey,
  endOfMonthKey,
  isDayKey,
  monthOf,
  startOfMonthKey
} from '../date-adapter';

export type Scale = 'day' | 'month' | 'quarter' | 'halfYear' | 'year';

export interface ScaleValue {
  date: DayKey;
  scale: Scale;
}

export interface Period {
  start: DayKey;
  end: DayKey;
}

export const SCALES: readonly Scale[] = [
  'day',
  'month',
  'quarter',
  'halfYear',
  'year'
];

export function isScale(value: string): value is Scale {
  return (SCALES as readonly string[]).includes(value);
}

export function periodOf(date: DayKey, scale: Scale): Period {
  const key = requireKey(date);
  if (scale === 'day') return { start: key, end: key };
  /* A month's last day is the only edge that moves with the calendar. */
  if (scale === 'month') {
    return { start: startOfMonthKey(key), end: endOfMonthKey(key) };
  }
  const year = key.slice(0, 4);
  const [start, end] = FIXED_EDGES[scale](monthOf(key));
  return { start: `${year}-${start}`, end: `${year}-${end}` };
}

const QUARTERS: readonly (readonly [string, string])[] = [
  ['01-01', '03-31'],
  ['04-01', '06-30'],
  ['07-01', '09-30'],
  ['10-01', '12-31']
];

const FIXED_EDGES: Record<
  Exclude<Scale, 'day' | 'month'>,
  (month: number) => readonly [string, string]
> = {
  quarter: month => QUARTERS[Math.floor((month - 1) / 3)],
  halfYear: month => (month <= 6 ? ['01-01', '06-30'] : ['07-01', '12-31']),
  year: () => ['01-01', '12-31']
};

export function anchorOf(period: Period, trailing: boolean): DayKey {
  return trailing ? period.end : period.start;
}

export function convertScale(
  value: ScaleValue,
  to: Scale,
  trailing: boolean
): ScaleValue {
  return { date: anchorOf(periodOf(value.date, to), trailing), scale: to };
}

export interface AvailabilityOptions {
  trailing?: boolean;
  min?: DayKey;
  max?: DayKey;
}

/* Tests the date the period produces, so `trailing` moves the answer. */
export function isAvailable(
  date: DayKey,
  scale: Scale,
  { trailing = false, min, max }: AvailabilityOptions = {}
): boolean {
  const produced = anchorOf(periodOf(date, scale), trailing);
  if (min !== undefined && produced < requireKey(min)) return false;
  if (max !== undefined && produced > requireKey(max)) return false;
  return true;
}

function requireKey(key: DayKey): DayKey {
  if (!isDayKey(key)) {
    throw new RangeError(`Not a YYYY-MM-DD day: ${JSON.stringify(key)}`);
  }
  return key;
}
