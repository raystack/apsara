/** An editor action that has a keyboard shortcut. */
export type EditorAction =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'code'
  | 'link'
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  | 'blockquote'
  | 'codeBlock'
  | 'undo'
  | 'redo'
  | 'focusToolbar';

/**
 * Keys in ProseMirror keymap syntax. The same string builds the keymap and
 * renders the key caps, so a label cannot drift from its binding.
 */
export const defaultShortcuts: Readonly<Record<EditorAction, string>> = {
  bold: 'Mod-b',
  italic: 'Mod-i',
  underline: 'Mod-u',
  strike: 'Mod-Shift-x',
  code: 'Mod-e',
  link: 'Mod-k',
  paragraph: 'Mod-Alt-0',
  heading1: 'Mod-Alt-1',
  heading2: 'Mod-Alt-2',
  heading3: 'Mod-Alt-3',
  heading4: 'Mod-Alt-4',
  bulletList: 'Mod-Shift-8',
  orderedList: 'Mod-Shift-9',
  taskList: 'Mod-Shift-7',
  blockquote: 'Alt-Shift-.',
  codeBlock: 'Mod-Shift-\\',
  undo: 'Mod-z',
  redo: 'Mod-Shift-z',
  focusToolbar: 'Alt-F10'
};

export type EditorShortcuts = Partial<Record<EditorAction, string | false>>;

export function resolveShortcuts(
  overrides?: EditorShortcuts
): Record<EditorAction, string | false> {
  return { ...defaultShortcuts, ...overrides };
}

/** The same test prosemirror-keymap uses, so a label and its binding agree on `Mod`. */
export function isMac(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    /Mac|iP(hone|[oa]d)/.test(navigator.platform)
  );
}

const MAC_MODIFIERS: Record<string, string> = {
  mod: '⌘',
  cmd: '⌘',
  meta: '⌘',
  ctrl: '⌃',
  control: '⌃',
  alt: '⌥',
  shift: '⇧'
};

const MODIFIERS: Record<string, string> = {
  mod: 'Ctrl',
  cmd: 'Meta',
  meta: 'Meta',
  ctrl: 'Ctrl',
  control: 'Ctrl',
  alt: 'Alt',
  shift: 'Shift'
};

const KEY_LABELS: Record<string, string> = {
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  Escape: 'Esc',
  ' ': 'Space',
  Space: 'Space'
};

/**
 * Turns a keymap string into key cap labels, one per `Kbd`.
 * `formatShortcut('Mod-Shift-x')` is `['⌘', '⇧', 'X']` on macOS and
 * `['Ctrl', 'Shift', 'X']` elsewhere.
 */
export function formatShortcut(key: string, mac = isMac()): string[] {
  // A trailing `-` is the minus key, as in prosemirror-keymap.
  const parts = key.split(/-(?!$)/);
  const last = parts.pop() ?? '';
  const modifiers = mac ? MAC_MODIFIERS : MODIFIERS;
  const labels = parts.map(part => modifiers[part.toLowerCase()] ?? part);
  labels.push(
    KEY_LABELS[last] ?? (last.length === 1 ? last.toUpperCase() : last)
  );
  return labels;
}
