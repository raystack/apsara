export { default as editorStyles } from './editor.module.css';
export {
  deriveDocDetails,
  docFromMarkup,
  docFromText,
  type EditorDocDetails,
  isDocEmpty,
  serializeMarkup,
  serializeText
} from './markup';
// ProseMirror-free, so `PromptInput`'s root, textarea and mention registry can
// import straight from here without dragging the engine into their graph.
export {
  type EditorMention,
  isTriggerCharacter,
  type MentionAttrs,
  mentionKey,
  serializeMention,
  trimDetails
} from './mention';
export type { MentionPortal } from './mention-node-view';
export { editorSchema } from './schema';
export {
  type SuggestionAnchor,
  type SuggestionGroup,
  SuggestionMenu,
  type SuggestionMenuItem,
  type SuggestionMenuProps,
  suggestionOptionId
} from './suggestion-menu';
export {
  dismissSuggestion,
  insertMention,
  type SuggestionState
} from './suggestion-plugin';
export {
  type EditorActions,
  type UseEditorOptions,
  type UseEditorResult,
  useEditor
} from './use-editor';
