import type { EditorFormat } from './core/schema';
import type { EditorAction } from './core/shortcuts';
import {
  BLOCK_DEFAULTS,
  HEADING_DEFAULTS,
  PARAGRAPH_DEFAULT
} from './editor-defaults';
import type { EditorSlashItem } from './editor-types';

interface Builtin {
  /** The format the item needs. The menu hides the item without it. */
  format?: EditorFormat;
  /** The action whose shortcut the row shows. */
  action?: EditorAction;
}

const builtins = new WeakMap<EditorSlashItem, Builtin>();

function builtin(item: EditorSlashItem, meta: Builtin): EditorSlashItem {
  builtins.set(item, meta);
  return item;
}

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
  builtin(
    {
      id: 'paragraph',
      label: 'Text',
      group: 'Text',
      keywords: ['paragraph', 'plain'],
      icon: <TextIcon />,
      run: editor => editor.commands.setParagraph()
    },
    { action: 'paragraph' }
  ),
  builtin(
    {
      id: 'heading1',
      label: 'Heading 1',
      group: 'Text',
      keywords: ['h1', 'title'],
      icon: <Heading1 />,
      run: editor => editor.commands.setHeading(1)
    },
    { format: 'heading', action: 'heading1' }
  ),
  builtin(
    {
      id: 'heading2',
      label: 'Heading 2',
      group: 'Text',
      keywords: ['h2', 'subtitle'],
      icon: <Heading2 />,
      run: editor => editor.commands.setHeading(2)
    },
    { format: 'heading', action: 'heading2' }
  ),
  builtin(
    {
      id: 'heading3',
      label: 'Heading 3',
      group: 'Text',
      keywords: ['h3'],
      icon: <Heading3 />,
      run: editor => editor.commands.setHeading(3)
    },
    { format: 'heading', action: 'heading3' }
  ),
  builtin(
    {
      id: 'bulletList',
      label: 'Bulleted list',
      group: 'Lists',
      keywords: ['unordered', 'ul', 'bullet'],
      icon: <BulletIcon />,
      run: editor => editor.commands.toggleList('bulletList')
    },
    { format: 'bulletList', action: 'bulletList' }
  ),
  builtin(
    {
      id: 'orderedList',
      label: 'Numbered list',
      group: 'Lists',
      keywords: ['ordered', 'ol'],
      icon: <NumberedIcon />,
      run: editor => editor.commands.toggleList('orderedList')
    },
    { format: 'orderedList', action: 'orderedList' }
  ),
  builtin(
    {
      id: 'taskList',
      label: 'Checklist',
      group: 'Lists',
      keywords: ['todo', 'task', 'checkbox'],
      icon: <ChecklistIcon />,
      run: editor => editor.commands.toggleList('taskList')
    },
    { format: 'taskList', action: 'taskList' }
  ),
  builtin(
    {
      id: 'blockquote',
      label: 'Quote',
      group: 'Blocks',
      keywords: ['blockquote', 'citation'],
      icon: <QuoteIcon />,
      run: editor => editor.commands.toggleBlock('blockquote')
    },
    { format: 'blockquote', action: 'blockquote' }
  ),
  builtin(
    {
      id: 'codeBlock',
      label: 'Code block',
      group: 'Blocks',
      keywords: ['code', 'pre', 'snippet'],
      icon: <CodeBlockIcon />,
      run: editor => editor.commands.toggleBlock('codeBlock')
    },
    { format: 'codeBlock', action: 'codeBlock' }
  ),
  builtin(
    {
      id: 'horizontalRule',
      label: 'Divider',
      group: 'Blocks',
      keywords: ['hr', 'rule', 'separator', 'line'],
      icon: <DividerIcon />,
      run: editor => editor.commands.insertHorizontalRule()
    },
    { format: 'horizontalRule' }
  )
];

export function builtinSlashItem(item: EditorSlashItem): Builtin | undefined {
  return builtins.get(item);
}
