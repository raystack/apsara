'use client';

// The 32 icons Apsara's own components draw: the one place that pairs a key
// with a drawing. A key names the job or the glyph, never the library, so
// changing icon library is an edit to this file and nothing else.
//
// Keep the `/*#__PURE__*/` annotation on every call. It is what lets a bundler
// drop an unused key — and its lucide import — out of this single module;
// `icons/__tests__/bundle.test.ts` checks that it still does.

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
  Sparkles,
  Square,
  Sun,
  Table,
  TriangleAlert,
  Undo2,
  X
} from 'lucide-react';
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
/** Marks an AI affordance — the ChatPanel trigger draws it. */
export const CoPilotIcon = /*#__PURE__*/ createIcon('CoPilotIcon', Sparkles);
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
/** Reverts a control to the value it was given, not a general history undo. */
export const UndoIcon = /*#__PURE__*/ createIcon('UndoIcon', Undo2);
export const WarningIcon = /*#__PURE__*/ createIcon(
  'WarningIcon',
  TriangleAlert
);
export const XIcon = /*#__PURE__*/ createIcon('XIcon', X);
