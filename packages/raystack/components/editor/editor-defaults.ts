import type { ComponentType } from 'react';
import {
  BoldIcon,
  ChecklistIcon,
  CodeBlockIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  ItalicIcon,
  ListIcon,
  MinusIcon,
  NumberedListIcon,
  QuoteIcon,
  StrikethroughIcon,
  TextIcon,
  UnderlineIcon
} from '~/icons';
import type { EditorBlock } from './core/commands';
import type { EditorHeadingLevel, EditorList, EditorMark } from './core/schema';
import type { EditorAction } from './core/shortcuts';

interface ControlDefault {
  label: string;
  Icon: ComponentType;
  action?: EditorAction;
}

export const MARK_DEFAULTS: Record<EditorMark, ControlDefault> = {
  bold: { label: 'Bold', Icon: BoldIcon, action: 'bold' },
  italic: { label: 'Italic', Icon: ItalicIcon, action: 'italic' },
  underline: {
    label: 'Underline',
    Icon: UnderlineIcon,
    action: 'underline'
  },
  strike: {
    label: 'Strikethrough',
    Icon: StrikethroughIcon,
    action: 'strike'
  },
  code: { label: 'Inline code', Icon: CodeIcon, action: 'code' }
};

export const BLOCK_DEFAULTS: Record<EditorBlock, ControlDefault> = {
  blockquote: { label: 'Quote', Icon: QuoteIcon, action: 'blockquote' },
  codeBlock: {
    label: 'Code block',
    Icon: CodeBlockIcon,
    action: 'codeBlock'
  },
  bulletList: {
    label: 'Bulleted list',
    Icon: ListIcon,
    action: 'bulletList'
  },
  orderedList: {
    label: 'Numbered list',
    Icon: NumberedListIcon,
    action: 'orderedList'
  },
  taskList: { label: 'Checklist', Icon: ChecklistIcon, action: 'taskList' },
  horizontalRule: { label: 'Divider', Icon: MinusIcon }
};

export const LIST_TYPES: readonly EditorList[] = [
  'bulletList',
  'orderedList',
  'taskList'
];

export const PARAGRAPH_DEFAULT: ControlDefault = {
  label: 'Text',
  Icon: TextIcon,
  action: 'paragraph'
};

export const HEADING_DEFAULTS: Record<EditorHeadingLevel, ControlDefault> = {
  1: { label: 'Heading 1', Icon: Heading1Icon, action: 'heading1' },
  2: { label: 'Heading 2', Icon: Heading2Icon, action: 'heading2' },
  3: { label: 'Heading 3', Icon: Heading3Icon, action: 'heading3' },
  4: { label: 'Heading 4', Icon: Heading4Icon, action: 'heading4' }
};
