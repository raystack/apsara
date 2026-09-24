import {
  type MarkSpec,
  type NodeSpec,
  Schema,
  type TagParseRule
} from 'prosemirror-model';
import { isSafeHref } from './link';
import type { MentionAttrs } from './mention';

/** A mark that a toolbar button can toggle. */
export type EditorMark = 'bold' | 'italic' | 'underline' | 'strike' | 'code';

export type EditorList = 'bulletList' | 'orderedList' | 'taskList';

export type EditorHeadingLevel = 1 | 2 | 3 | 4;

/** A node or mark that `formats` can allow. */
export type EditorFormat =
  | EditorMark
  | EditorList
  | 'link'
  | 'heading'
  | 'blockquote'
  | 'codeBlock'
  | 'horizontalRule'
  | 'mention';

export const EDITOR_FORMATS: readonly EditorFormat[] = [
  'bold',
  'italic',
  'underline',
  'strike',
  'code',
  'link',
  'heading',
  'blockquote',
  'codeBlock',
  'bulletList',
  'orderedList',
  'taskList',
  'horizontalRule',
  'mention'
];

export const HEADING_LEVELS: readonly EditorHeadingLevel[] = [1, 2, 3, 4];

function readLanguage(element: HTMLElement): string | null {
  const code = element.querySelector('code') ?? element;
  const match = code.className.match(/(?:^|\s)language-([\w-]+)/);
  return match ? match[1] : element.getAttribute('data-language');
}

export const mentionNodeSpec: NodeSpec = {
  inline: true,
  group: 'inline',
  // Atomic: the cursor never enters it, so it deletes and moves as one unit.
  atom: true,
  selectable: true,
  // ProseMirror makes inline atoms draggable by default, which would let a
  // chip be dropped into the middle of a word.
  draggable: false,
  attrs: {
    id: {},
    label: {},
    type: { default: 'mention' },
    trigger: { default: '@' }
  },
  parseDOM: [
    {
      tag: 'span[data-mention-id]',
      getAttrs: dom => {
        const el = dom as HTMLElement;
        return {
          id: el.getAttribute('data-mention-id') ?? '',
          label: el.getAttribute('data-mention-label') ?? el.textContent,
          type: el.getAttribute('data-mention-type') ?? 'mention',
          trigger: el.getAttribute('data-mention-trigger') ?? '@'
        };
      }
    }
  ],
  // Used for the clipboard's `text/html` flavour and for `editorToHTML`. On
  // screen the node view owns the element. Pasting this back restores the chip
  // with its id.
  toDOM: node => {
    const { id, label, type, trigger } = node.attrs as MentionAttrs;
    return [
      'span',
      {
        'data-mention-id': id,
        'data-mention-label': label,
        'data-mention-type': type,
        'data-mention-trigger': trigger
      },
      `${trigger}${label}`
    ];
  }
};

export const paragraphNodeSpec: NodeSpec = {
  content: 'inline*',
  group: 'block',
  parseDOM: [{ tag: 'p' }],
  toDOM: () => ['p', 0]
};

export const hardBreakNodeSpec: NodeSpec = {
  inline: true,
  group: 'inline',
  selectable: false,
  parseDOM: [{ tag: 'br' }],
  toDOM: () => ['br']
};

const headingNodeSpec: NodeSpec = {
  attrs: { level: { default: 1 } },
  content: 'inline*',
  group: 'block',
  defining: true,
  parseDOM: [1, 2, 3, 4, 5, 6].map(
    (level): TagParseRule => ({
      tag: `h${level}`,
      attrs: { level: Math.min(level, 4) }
    })
  ),
  toDOM: node => [`h${node.attrs.level}`, 0]
};

const blockquoteNodeSpec: NodeSpec = {
  content: 'block+',
  group: 'block',
  defining: true,
  parseDOM: [{ tag: 'blockquote' }],
  toDOM: () => ['blockquote', 0]
};

const codeBlockNodeSpec: NodeSpec = {
  attrs: { language: { default: null } },
  content: 'text*',
  marks: '',
  group: 'block',
  code: true,
  defining: true,
  parseDOM: [
    {
      tag: 'pre',
      preserveWhitespace: 'full',
      getAttrs: dom => ({ language: readLanguage(dom as HTMLElement) })
    }
  ],
  toDOM: node => [
    'pre',
    [
      'code',
      { class: node.attrs.language ? `language-${node.attrs.language}` : null },
      0
    ]
  ]
};

const bulletListNodeSpec: NodeSpec = {
  content: 'listItem+',
  group: 'block',
  parseDOM: [{ tag: 'ul' }],
  toDOM: () => ['ul', 0]
};

const orderedListNodeSpec: NodeSpec = {
  attrs: { start: { default: 1 } },
  content: 'listItem+',
  group: 'block',
  parseDOM: [
    {
      tag: 'ol',
      getAttrs: dom => {
        const start = (dom as HTMLElement).getAttribute('start');
        return { start: start ? Number(start) || 1 : 1 };
      }
    }
  ],
  toDOM: node =>
    node.attrs.start === 1
      ? ['ol', 0]
      : ['ol', { start: String(node.attrs.start) }, 0]
};

const listItemNodeSpec: NodeSpec = {
  content: 'paragraph block*',
  defining: true,
  parseDOM: [{ tag: 'li' }],
  toDOM: () => ['li', 0]
};

// Tiptap's markup, so task lists copied from Tiptap or novel paste as tasks.
const taskListNodeSpec: NodeSpec = {
  content: 'taskItem+',
  group: 'block',
  parseDOM: [{ tag: 'ul[data-type="taskList"]', priority: 51 }],
  toDOM: () => ['ul', { 'data-type': 'taskList' }, 0]
};

const taskItemNodeSpec: NodeSpec = {
  attrs: { checked: { default: false } },
  content: 'paragraph block*',
  defining: true,
  parseDOM: [
    {
      tag: 'li[data-type="taskItem"]',
      priority: 51,
      getAttrs: dom => ({
        checked: (dom as HTMLElement).getAttribute('data-checked') === 'true'
      })
    }
  ],
  toDOM: node => [
    'li',
    {
      'data-type': 'taskItem',
      'data-checked': node.attrs.checked ? 'true' : 'false'
    },
    [
      'label',
      [
        'input',
        { type: 'checkbox', checked: node.attrs.checked ? 'checked' : null }
      ]
    ],
    ['div', 0]
  ]
};

const horizontalRuleNodeSpec: NodeSpec = {
  group: 'block',
  parseDOM: [{ tag: 'hr' }],
  toDOM: () => ['hr']
};

const linkMarkSpec: MarkSpec = {
  attrs: { href: {} },
  inclusive: false,
  parseDOM: [
    {
      tag: 'a[href]',
      getAttrs: dom => {
        const href = (dom as HTMLElement).getAttribute('href');
        return href && isSafeHref(href) ? { href } : false;
      }
    }
  ],
  toDOM: mark => [
    'a',
    {
      href: isSafeHref(mark.attrs.href) ? mark.attrs.href : null,
      rel: 'noopener noreferrer nofollow'
    },
    0
  ]
};

const boldMarkSpec: MarkSpec = {
  parseDOM: [
    { tag: 'strong' },
    // Google Docs wraps a whole paste in `<b style="font-weight: normal">`.
    {
      tag: 'b',
      getAttrs: dom =>
        (dom as HTMLElement).style.fontWeight !== 'normal' && null
    },
    { style: 'font-weight=400', clearMark: mark => mark.type.name === 'bold' },
    {
      style: 'font-weight',
      getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null
    }
  ],
  toDOM: () => ['strong', 0]
};

const italicMarkSpec: MarkSpec = {
  parseDOM: [
    { tag: 'i' },
    { tag: 'em' },
    { style: 'font-style=italic' },
    {
      style: 'font-style=normal',
      clearMark: mark => mark.type.name === 'italic'
    }
  ],
  toDOM: () => ['em', 0]
};

const underlineMarkSpec: MarkSpec = {
  parseDOM: [
    { tag: 'u' },
    { style: 'text-decoration=underline' },
    { style: 'text-decoration-line=underline' }
  ],
  toDOM: () => ['u', 0]
};

const strikeMarkSpec: MarkSpec = {
  parseDOM: [
    { tag: 's' },
    { tag: 'del' },
    { tag: 'strike' },
    { style: 'text-decoration=line-through' },
    { style: 'text-decoration-line=line-through' }
  ],
  toDOM: () => ['s', 0]
};

const codeMarkSpec: MarkSpec = {
  code: true,
  parseDOM: [{ tag: 'code' }],
  toDOM: () => ['code', 0]
};

const schemaCache = new Map<string, Schema>();

/**
 * Builds the schema for a `formats` allowlist. Paragraphs, text and hard
 * breaks are always present. Schemas are cached by their format set, so every
 * editor with the same formats shares one schema.
 */
export function buildSchema(
  formats: readonly EditorFormat[] = EDITOR_FORMATS
): Schema {
  const allowed = new Set(formats);
  const key = EDITOR_FORMATS.filter(format => allowed.has(format)).join(',');
  const cached = schemaCache.get(key);
  if (cached) return cached;

  const has = (format: EditorFormat) => allowed.has(format);
  // Order matters: the first `block` node is the default block, and marks
  // earlier in the list render outside later ones.
  const nodes: Record<string, NodeSpec> = {
    doc: { content: 'block+' },
    paragraph: paragraphNodeSpec,
    text: { group: 'inline' }
  };
  if (has('heading')) nodes.heading = headingNodeSpec;
  if (has('blockquote')) nodes.blockquote = blockquoteNodeSpec;
  if (has('codeBlock')) nodes.codeBlock = codeBlockNodeSpec;
  if (has('bulletList')) nodes.bulletList = bulletListNodeSpec;
  if (has('orderedList')) nodes.orderedList = orderedListNodeSpec;
  if (has('bulletList') || has('orderedList'))
    nodes.listItem = listItemNodeSpec;
  if (has('taskList')) {
    nodes.taskList = taskListNodeSpec;
    nodes.taskItem = taskItemNodeSpec;
  }
  if (has('horizontalRule')) nodes.horizontalRule = horizontalRuleNodeSpec;
  nodes.hardBreak = hardBreakNodeSpec;
  if (has('mention')) nodes.mention = mentionNodeSpec;

  const marks: Record<string, MarkSpec> = {};
  if (has('link')) marks.link = linkMarkSpec;
  if (has('bold')) marks.bold = boldMarkSpec;
  if (has('italic')) marks.italic = italicMarkSpec;
  if (has('underline')) marks.underline = underlineMarkSpec;
  if (has('strike')) marks.strike = strikeMarkSpec;
  if (has('code')) marks.code = codeMarkSpec;

  const schema = new Schema({ nodes, marks });
  schemaCache.set(key, schema);
  return schema;
}

/** Whether `schema` has the node or mark behind a format. */
export function hasFormat(schema: Schema, format: EditorFormat): boolean {
  return format in schema.nodes || format in schema.marks;
}
