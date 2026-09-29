'use client';

import { EditorBlockButton } from './editor-block-button';
import { EditorContent } from './editor-content';
import { EditorFloatingToolbar } from './editor-floating-toolbar';
import { EditorHeadingMenu } from './editor-heading-menu';
import { EditorHistoryButton } from './editor-history-button';
import { EditorLinkButton } from './editor-link-button';
import { EditorListMenu } from './editor-list-menu';
import { EditorMarkButton } from './editor-mark-button';
import { EditorMentions } from './editor-mentions';
import { EditorRoot } from './editor-root';
import { EditorSlashMenu } from './editor-slash-menu';
import { EditorToolbar } from './editor-toolbar';

export const Editor = Object.assign(EditorRoot, {
  Content: EditorContent,
  Toolbar: EditorToolbar,
  FloatingToolbar: EditorFloatingToolbar,
  MarkButton: EditorMarkButton,
  BlockButton: EditorBlockButton,
  HeadingMenu: EditorHeadingMenu,
  ListMenu: EditorListMenu,
  LinkButton: EditorLinkButton,
  HistoryButton: EditorHistoryButton,
  SlashMenu: EditorSlashMenu,
  Mentions: EditorMentions
});
