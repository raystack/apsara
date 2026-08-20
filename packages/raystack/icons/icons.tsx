'use client';

// The 31 icons Apsara's own components draw, and the one place that pairs a key
// with a drawing. A key names the job or the glyph, never the library, so a
// change of icon library is an edit to this file and nothing else.
//
// This file is the shape the documentation asks a consumer to write for an icon
// Apsara does not ship: `createIcon` is public, and our icons are built the
// same way theirs are.
//
// Every call carries `/*#__PURE__*/`. That annotation is what lets a bundler
// drop an unused key — and its lucide import — out of this single module.
// `icons/__tests__/bundle.test.ts` measures that it still does.

import {
  ArrowDown,
  ArrowDownWideNarrow,
  ArrowUp,
  ArrowUpNarrowWide,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  Copy,
  Ellipsis,
  Expand,
  FileText,
  Info,
  ListFilter,
  Minus,
  Moon,
  PanelLeft,
  Plus,
  Search,
  Shrink,
  SlidersHorizontal,
  Square,
  Sun,
  Table,
  TriangleAlert,
  X
} from 'lucide-react';
import { ReactComponent as CoPilot } from './assets/co-pilot.svg';
import { createIcon } from './create-icon';

export const ArrowDownIcon = /*#__PURE__*/ createIcon(
  'ArrowDownIcon',
  ArrowDown
);
export const ArrowUpIcon = /*#__PURE__*/ createIcon('ArrowUpIcon', ArrowUp);
/** Draws lucide `CalendarDays`, not lucide `Calendar`. The key is ours. */
export const CalendarIcon = /*#__PURE__*/ createIcon(
  'CalendarIcon',
  CalendarDays
);
export const CheckIcon = /*#__PURE__*/ createIcon('CheckIcon', Check);
export const ChevronDownIcon = /*#__PURE__*/ createIcon(
  'ChevronDownIcon',
  ChevronDown
);
export const ChevronLeftIcon = /*#__PURE__*/ createIcon(
  'ChevronLeftIcon',
  ChevronLeft
);
export const ChevronRightIcon = /*#__PURE__*/ createIcon(
  'ChevronRightIcon',
  ChevronRight
);
/** Clears an input. Shares a drawing with `ErrorIcon`, not a key. */
export const ClearIcon = /*#__PURE__*/ createIcon('ClearIcon', CircleX);
export const CoPilotIcon = /*#__PURE__*/ createIcon('CoPilotIcon', CoPilot);
export const CopyIcon = /*#__PURE__*/ createIcon('CopyIcon', Copy);
export const DisplayIcon = /*#__PURE__*/ createIcon(
  'DisplayIcon',
  SlidersHorizontal
);
export const EllipsisIcon = /*#__PURE__*/ createIcon('EllipsisIcon', Ellipsis);
/** The error status of a Toast. Shares a drawing with `ClearIcon`. */
export const ErrorIcon = /*#__PURE__*/ createIcon('ErrorIcon', CircleX);
export const ExpandIcon = /*#__PURE__*/ createIcon('ExpandIcon', Expand);
export const FileTextIcon = /*#__PURE__*/ createIcon('FileTextIcon', FileText);
export const FilterIcon = /*#__PURE__*/ createIcon('FilterIcon', ListFilter);
export const InfoIcon = /*#__PURE__*/ createIcon('InfoIcon', Info);
export const MinusIcon = /*#__PURE__*/ createIcon('MinusIcon', Minus);
export const MoonIcon = /*#__PURE__*/ createIcon('MoonIcon', Moon);
export const PanelLeftIcon = /*#__PURE__*/ createIcon(
  'PanelLeftIcon',
  PanelLeft
);
export const PlusIcon = /*#__PURE__*/ createIcon('PlusIcon', Plus);
export const SearchIcon = /*#__PURE__*/ createIcon('SearchIcon', Search);
export const ShrinkIcon = /*#__PURE__*/ createIcon('ShrinkIcon', Shrink);
export const SortAscendingIcon = /*#__PURE__*/ createIcon(
  'SortAscendingIcon',
  ArrowUpNarrowWide
);
export const SortDescendingIcon = /*#__PURE__*/ createIcon(
  'SortDescendingIcon',
  ArrowDownWideNarrow
);
export const StopIcon = /*#__PURE__*/ createIcon('StopIcon', Square);
export const SuccessIcon = /*#__PURE__*/ createIcon('SuccessIcon', CircleCheck);
export const SunIcon = /*#__PURE__*/ createIcon('SunIcon', Sun);
export const TableIcon = /*#__PURE__*/ createIcon('TableIcon', Table);
export const WarningIcon = /*#__PURE__*/ createIcon(
  'WarningIcon',
  TriangleAlert
);
export const XIcon = /*#__PURE__*/ createIcon('XIcon', X);
