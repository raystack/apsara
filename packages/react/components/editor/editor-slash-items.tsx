import { activeTextStyle } from './core/commands';
import type { EditorFormat, EditorHeadingLevel } from './core/schema';
import type { EditorAction } from './core/shortcuts';
import {
  BLOCK_DEFAULTS,
  HEADING_DEFAULTS,
  PARAGRAPH_DEFAULT
} from './editor-defaults';
import type { EditorApi, EditorSlashItem } from './editor-types';

interface Builtin {
  /** The format the item needs. The menu hides the item without it. */
  format?: EditorFormat;
  /** The action whose shortcut the row shows. */
  action?: EditorAction;
  /** Whether the command can run at the caret, or the block already has its type. */
  applies: (editor: EditorApi) => boolean;
}

function heading(level: EditorHeadingLevel): Builtin {
  return {
    format: 'heading',
    action: `heading${level}`,
    applies: editor =>
      editor.can.setHeading(level) ||
      activeTextStyle(editor.getState()) === level
  };
}

// Keyed by `id`, so a copy of a built-in item, such as `{ ...item }`, keeps
// its shortcut and its format check.
const builtins = new Map<string, Builtin>([
  [
    'paragraph',
    {
      action: 'paragraph',
      applies: editor =>
        editor.can.setParagraph() ||
        activeTextStyle(editor.getState()) === 'paragraph'
    }
  ],
  ['heading1', heading(1)],
  ['heading2', heading(2)],
  ['heading3', heading(3)],
  [
    'bulletList',
    {
      format: 'bulletList',
      action: 'bulletList',
      applies: editor => editor.can.toggleList('bulletList')
    }
  ],
  [
    'orderedList',
    {
      format: 'orderedList',
      action: 'orderedList',
      applies: editor => editor.can.toggleList('orderedList')
    }
  ],
  [
    'taskList',
    {
      format: 'taskList',
      action: 'taskList',
      applies: editor => editor.can.toggleList('taskList')
    }
  ],
  [
    'blockquote',
    {
      format: 'blockquote',
      action: 'blockquote',
      applies: editor => editor.can.toggleBlock('blockquote')
    }
  ],
  [
    'codeBlock',
    {
      format: 'codeBlock',
      action: 'codeBlock',
      applies: editor => editor.can.toggleBlock('codeBlock')
    }
  ],
  [
    'horizontalRule',
    {
      format: 'horizontalRule',
      applies: editor => editor.can.insertHorizontalRule()
    }
  ]
]);

const { Icon: TextIcon } = PARAGRAPH_DEFAULT;
const Heading1 = HEADING_DEFAULTS[1].Icon;
const Heading2 = HEADING_DEFAULTS[2].Icon;
const Heading3 = HEADING_DEFAULTS[3].Icon;
const BulletIcon = BLOCK_DEFAULTS.bulletList.Icon;
const NumberedIcon = BLOCK_DEFAULTS.orderedList.Icon;
const ChecklistIcon = BLOCK_DEFAULTS.taskList.Icon;
const QuoteIcon = BLOCK_DEFAULTS.blockquote.Icon;
const CodeBlockIcon = BLOCK_DEFAULTS.codeBlock.Icon;
const DividerIcon = BLOCK_DEFAULTS.horizontalRule.Icon;

/** The built-in slash commands. Spread them to add your own. */
export const defaultSlashItems: EditorSlashItem[] = [
  {
    id: 'paragraph',
    label: 'Text',
    group: 'Text',
    keywords: ['paragraph', 'plain'],
    icon: <TextIcon />,
    run: editor => editor.commands.setParagraph()
  },
  {
    id: 'heading1',
    label: 'Heading 1',
    group: 'Text',
    keywords: ['h1', 'title'],
    icon: <Heading1 />,
    run: editor => editor.commands.setHeading(1)
  },
  {
    id: 'heading2',
    label: 'Heading 2',
    group: 'Text',
    keywords: ['h2', 'subtitle'],
    icon: <Heading2 />,
    run: editor => editor.commands.setHeading(2)
  },
  {
    id: 'heading3',
    label: 'Heading 3',
    group: 'Text',
    keywords: ['h3'],
    icon: <Heading3 />,
    run: editor => editor.commands.setHeading(3)
  },
  {
    id: 'bulletList',
    label: 'Bulleted list',
    group: 'Lists',
    keywords: ['unordered', 'ul', 'bullet'],
    icon: <BulletIcon />,
    run: editor => editor.commands.toggleList('bulletList')
  },
  {
    id: 'orderedList',
    label: 'Numbered list',
    group: 'Lists',
    keywords: ['ordered', 'ol'],
    icon: <NumberedIcon />,
    run: editor => editor.commands.toggleList('orderedList')
  },
  {
    id: 'taskList',
    label: 'Checklist',
    group: 'Lists',
    keywords: ['todo', 'task', 'checkbox'],
    icon: <ChecklistIcon />,
    run: editor => editor.commands.toggleList('taskList')
  },
  {
    id: 'blockquote',
    label: 'Quote',
    group: 'Blocks',
    keywords: ['blockquote', 'citation'],
    icon: <QuoteIcon />,
    run: editor => editor.commands.toggleBlock('blockquote')
  },
  {
    id: 'codeBlock',
    label: 'Code block',
    group: 'Blocks',
    keywords: ['code', 'pre', 'snippet'],
    icon: <CodeBlockIcon />,
    run: editor => editor.commands.toggleBlock('codeBlock')
  },
  {
    id: 'horizontalRule',
    label: 'Divider',
    group: 'Blocks',
    keywords: ['hr', 'rule', 'separator', 'line'],
    icon: <DividerIcon />,
    run: editor => editor.commands.insertHorizontalRule()
  }
];

export function builtinSlashItem(item: EditorSlashItem): Builtin | undefined {
  return builtins.get(item.id);
}
