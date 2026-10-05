import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';
import { toInstant } from '../date-filters';

const pad = (value: number, width = 2) => String(value).padStart(width, '0');
const MONTHS = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
const WEEKDAYS = 'Sun Mon Tue Wed Thu Fri Sat'.split(' ');

/* Each UTC instant within 2 hours of a month or year boundary, and a mid-month one. */
function instants(): Date[] {
  const result: Date[] = [];
  for (const [year, month] of [
    [2025, 11],
    [2026, 0],
    [2026, 1],
    [2026, 2],
    [2026, 8],
    [2024, 1]
  ]) {
    const boundary = Date.UTC(year, month, 1);
    for (const minutes of [-120, -90, -30, 0, 30, 90, 120]) {
      result.push(new Date(boundary + minutes * 60_000));
    }
  }
  result.push(new Date(Date.UTC(2026, 7, 15, 12, 34, 56, 789)));
  return result;
}

const OFFSETS = [0, 330, -420, 840, -600, 120];

function offsetParts(minutes: number) {
  const sign = minutes < 0 ? '-' : '+';
  const hours = pad(Math.floor(Math.abs(minutes) / 60));
  const rest = pad(Math.abs(minutes) % 60);
  return { sign, hours, rest };
}

/* The wall-clock fields of `date` at `offset` minutes east of UTC. */
function wall(date: Date, offset: number) {
  const shifted = new Date(date.getTime() + offset * 60_000);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth(),
    day: shifted.getUTCDate(),
    weekday: shifted.getUTCDay(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
    second: shifted.getUTCSeconds()
  };
}

function strings(): string[] {
  const result: string[] = [];
  for (const date of instants()) {
    result.push(date.toISOString());
    result.push(date.toUTCString());
    for (const offset of OFFSETS) {
      const w = wall(date, offset);
      const { sign, hours, rest } = offsetParts(offset);
      const day = `${w.year}-${pad(w.month + 1)}-${pad(w.day)}`;
      const time = `${pad(w.hour)}:${pad(w.minute)}:${pad(w.second)}`;
      result.push(`${day}T${time}${sign}${hours}:${rest}`);
      result.push(`${day}T${time}${sign}${hours}${rest}`);
      if (rest === '00') {
        result.push(`${day}T${time}${sign}${hours}`);
        result.push(`${day} ${time} ${sign}${hours}`);
      }
      result.push(`${day}T${time}${sign}${hours}:${rest}[Etc/Unknown]`);
      const hour12 = w.hour % 12 || 12;
      const meridiem = w.hour < 12 ? 'AM' : 'PM';
      result.push(
        `${MONTHS[w.month]} ${w.day} ${w.year} ${hour12}:${pad(w.minute)} ${meridiem} ${sign}${hours}${rest}`
      );
      result.push(
        `${WEEKDAYS[w.weekday]}, ${pad(w.day)} ${MONTHS[w.month]} ${w.year} ${time} ${offset === 0 ? 'GMT' : `${sign}${hours}${rest}`}`
      );
    }
    const local = wall(date, -date.getTimezoneOffset());
    const day = `${local.year}-${pad(local.month + 1)}-${pad(local.day)}`;
    result.push(day);
    result.push(`${day} ${pad(local.hour)}:${pad(local.minute)}`);
    result.push(`${day}T${pad(local.hour)}:${pad(local.minute)}:00`);
    result.push(`${local.month + 1}/${local.day}/${local.year}`);
  }
  return result;
}

function inputs(): unknown[] {
  const result: unknown[] = [...strings()];
  for (const date of instants()) {
    result.push(date.getTime(), new Date(date), dayjs(date));
  }
  return result;
}

const readByDayjs = (value: unknown) => {
  const parsed = dayjs(value as dayjs.ConfigType);
  return parsed.isValid() ? parsed.valueOf() : null;
};

const readByAdapter = (value: unknown) => toInstant(value)?.getTime() ?? null;

/* dayjs read a bracketed zone as `new Date` does, which ignores the offset
   before it. */
const BRACKETED = /\]$/;

/* An ISO time with a two-digit offset, which dayjs rejected. parseISO reads it. */
const ISO_HOUR_OFFSET = /^\d{4}-\d{2}-\d{2}T[\d:]+[+-]\d{2}$/;

describe('toInstant against dayjs', () => {
  it('agrees on every generated input', () => {
    const differences = inputs()
      .filter(
        input =>
          typeof input !== 'string' ||
          !(BRACKETED.test(input) || ISO_HOUR_OFFSET.test(input))
      )
      .map(input => ({
        input: String(input),
        dayjs: readByDayjs(input),
        toInstant: readByAdapter(input)
      }))
      .filter(row => row.dayjs !== row.toInstant);
    expect(differences).toEqual([]);
  });

  it('reads an ISO time with a two-digit offset, which dayjs rejected', () => {
    const hourOffsets = strings().filter(one => ISO_HOUR_OFFSET.test(one));
    expect(hourOffsets.length).toBeGreaterThan(0);
    for (const input of hourOffsets) {
      expect(readByDayjs(input)).toBeNull();
      expect(readByAdapter(input)).toBe(new Date(`${input}:00`).getTime());
    }
  });

  it('reads a bracketed zone by the offset before it', () => {
    for (const input of strings().filter(one => BRACKETED.test(one))) {
      expect(readByAdapter(input)).toBe(
        new Date(input.replace(/\[.*\]$/, '')).getTime()
      );
    }
  });
});
