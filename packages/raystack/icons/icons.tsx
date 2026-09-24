'use client';

// Keep the `/*#__PURE__*/` annotation on every call: it is what lets a bundler
// drop an unused key and its lucide import out of this module.

import {
  ArrowDown,
  ArrowDownWideNarrow,
  ArrowUp,
  ArrowUpNarrowWide,
  Bold,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  Code,
  Copy,
  Ellipsis,
  Expand,
  ExternalLink,
  FileText,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Info,
  Italic,
  Link,
  List,
  ListFilter,
  ListOrdered,
  ListTodo,
  Minus,
  Moon,
  PanelLeft,
  Plus,
  Redo2,
  Search,
  Shrink,
  SlidersHorizontal,
  Sparkles,
  Square,
  SquareCode,
  Strikethrough,
  Sun,
  Table,
  TextQuote,
  TriangleAlert,
  Type,
  Underline,
  Undo2,
  Unlink,
  X
} from 'lucide-react';
import { createIcon } from './create-icon';

export const ArrowDownIcon = /*#__PURE__*/ createIcon(
  'ArrowDownIcon',
  ArrowDown
);
export const ArrowUpIcon = /*#__PURE__*/ createIcon('ArrowUpIcon', ArrowUp);
export const BoldIcon = /*#__PURE__*/ createIcon('BoldIcon', Bold);
/** Draws lucide `CalendarDays`, not lucide `Calendar`. */
export const CalendarIcon = /*#__PURE__*/ createIcon(
  'CalendarIcon',
  CalendarDays
);
export const CheckIcon = /*#__PURE__*/ createIcon('CheckIcon', Check);
export const ChecklistIcon = /*#__PURE__*/ createIcon(
  'ChecklistIcon',
  ListTodo
);
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
/** Marks an AI affordance. The ChatPanel trigger draws it. */
export const CoPilotIcon = /*#__PURE__*/ createIcon('CoPilotIcon', Sparkles);
export const CodeBlockIcon = /*#__PURE__*/ createIcon(
  'CodeBlockIcon',
  SquareCode
);
export const CodeIcon = /*#__PURE__*/ createIcon('CodeIcon', Code);
export const CopyIcon = /*#__PURE__*/ createIcon('CopyIcon', Copy);
export const DisplayIcon = /*#__PURE__*/ createIcon(
  'DisplayIcon',
  SlidersHorizontal
);
export const EllipsisIcon = /*#__PURE__*/ createIcon('EllipsisIcon', Ellipsis);
/** The error status of a Toast. Shares a drawing with `ClearIcon`. */
export const ErrorIcon = /*#__PURE__*/ createIcon('ErrorIcon', CircleX);
export const ExpandIcon = /*#__PURE__*/ createIcon('ExpandIcon', Expand);
export const ExternalLinkIcon = /*#__PURE__*/ createIcon(
  'ExternalLinkIcon',
  ExternalLink
);
export const FileTextIcon = /*#__PURE__*/ createIcon('FileTextIcon', FileText);
export const FilterIcon = /*#__PURE__*/ createIcon('FilterIcon', ListFilter);
export const Heading1Icon = /*#__PURE__*/ createIcon('Heading1Icon', Heading1);
export const Heading2Icon = /*#__PURE__*/ createIcon('Heading2Icon', Heading2);
export const Heading3Icon = /*#__PURE__*/ createIcon('Heading3Icon', Heading3);
export const Heading4Icon = /*#__PURE__*/ createIcon('Heading4Icon', Heading4);
export const InfoIcon = /*#__PURE__*/ createIcon('InfoIcon', Info);
export const ItalicIcon = /*#__PURE__*/ createIcon('ItalicIcon', Italic);
export const LinkIcon = /*#__PURE__*/ createIcon('LinkIcon', Link);
export const ListIcon = /*#__PURE__*/ createIcon('ListIcon', List);
export const MinusIcon = /*#__PURE__*/ createIcon('MinusIcon', Minus);
export const MoonIcon = /*#__PURE__*/ createIcon('MoonIcon', Moon);
export const NumberedListIcon = /*#__PURE__*/ createIcon(
  'NumberedListIcon',
  ListOrdered
);
export const PanelLeftIcon = /*#__PURE__*/ createIcon(
  'PanelLeftIcon',
  PanelLeft
);
export const PlusIcon = /*#__PURE__*/ createIcon('PlusIcon', Plus);
export const QuoteIcon = /*#__PURE__*/ createIcon('QuoteIcon', TextQuote);
export const RedoIcon = /*#__PURE__*/ createIcon('RedoIcon', Redo2);
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
export const StrikethroughIcon = /*#__PURE__*/ createIcon(
  'StrikethroughIcon',
  Strikethrough
);
export const SuccessIcon = /*#__PURE__*/ createIcon('SuccessIcon', CircleCheck);
export const SunIcon = /*#__PURE__*/ createIcon('SunIcon', Sun);
export const TableIcon = /*#__PURE__*/ createIcon('TableIcon', Table);
/** Regular text, in the editor's text style menu. */
export const TextIcon = /*#__PURE__*/ createIcon('TextIcon', Type);
export const UnderlineIcon = /*#__PURE__*/ createIcon(
  'UnderlineIcon',
  Underline
);
/** Restores a value to its default — the calendar's reset. */
export const UndoIcon = /*#__PURE__*/ createIcon('UndoIcon', Undo2);
export const UnlinkIcon = /*#__PURE__*/ createIcon('UnlinkIcon', Unlink);
export const WarningIcon = /*#__PURE__*/ createIcon(
  'WarningIcon',
  TriangleAlert
);
export const XIcon = /*#__PURE__*/ createIcon('XIcon', X);
