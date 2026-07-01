'use client';

import { TourOverlay } from './tour-overlay';
import {
  TourClose,
  TourDescription,
  TourNext,
  TourPrev,
  TourProgress,
  TourSkip,
  TourTitle
} from './tour-parts';
import { TourPopover } from './tour-popover';
import { TourRoot } from './tour-root';

export const Tour = Object.assign(TourRoot, {
  Overlay: TourOverlay,
  Popover: TourPopover,
  Title: TourTitle,
  Description: TourDescription,
  Progress: TourProgress,
  Next: TourNext,
  Prev: TourPrev,
  Skip: TourSkip,
  Close: TourClose
});
