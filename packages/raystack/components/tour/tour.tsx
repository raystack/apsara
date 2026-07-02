'use client';

import { TourContent } from './tour-content';
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
import { TourRoot } from './tour-root';

export const Tour = Object.assign(TourRoot, {
  Overlay: TourOverlay,
  Content: TourContent,
  Title: TourTitle,
  Description: TourDescription,
  Progress: TourProgress,
  Next: TourNext,
  Prev: TourPrev,
  Skip: TourSkip,
  Close: TourClose
});
