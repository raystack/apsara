import styles from './gap.module.css';

export const gapVariants = {
  1: styles['gap-1'],
  2: styles['gap-2'],
  3: styles['gap-3'],
  4: styles['gap-4'],
  5: styles['gap-5'],
  6: styles['gap-6'],
  7: styles['gap-7'],
  8: styles['gap-8'],
  9: styles['gap-9'],
  10: styles['gap-10'],
  11: styles['gap-11'],
  12: styles['gap-12'],
  13: styles['gap-13'],
  14: styles['gap-14'],
  15: styles['gap-15'],
  16: styles['gap-16'],
  17: styles['gap-17']
} as const;

export const columnGapVariants = {
  1: styles['column-gap-1'],
  2: styles['column-gap-2'],
  3: styles['column-gap-3'],
  4: styles['column-gap-4'],
  5: styles['column-gap-5'],
  6: styles['column-gap-6'],
  7: styles['column-gap-7'],
  8: styles['column-gap-8'],
  9: styles['column-gap-9'],
  10: styles['column-gap-10'],
  11: styles['column-gap-11'],
  12: styles['column-gap-12'],
  13: styles['column-gap-13'],
  14: styles['column-gap-14'],
  15: styles['column-gap-15'],
  16: styles['column-gap-16'],
  17: styles['column-gap-17']
} as const;

export const rowGapVariants = {
  1: styles['row-gap-1'],
  2: styles['row-gap-2'],
  3: styles['row-gap-3'],
  4: styles['row-gap-4'],
  5: styles['row-gap-5'],
  6: styles['row-gap-6'],
  7: styles['row-gap-7'],
  8: styles['row-gap-8'],
  9: styles['row-gap-9'],
  10: styles['row-gap-10'],
  11: styles['row-gap-11'],
  12: styles['row-gap-12'],
  13: styles['row-gap-13'],
  14: styles['row-gap-14'],
  15: styles['row-gap-15'],
  16: styles['row-gap-16'],
  17: styles['row-gap-17']
} as const;

export type GapValue = keyof typeof gapVariants;
