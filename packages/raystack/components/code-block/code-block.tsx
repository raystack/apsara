import { Select } from '../select';
import { CodeBlockCode } from './code-block-code';
import { CodeBlockContent } from './code-block-content';
import { CodeBlockCopyButton } from './code-block-copy-button';
import {
  CodeBlockAction,
  CodeBlockHeader,
  CodeBlockLabel
} from './code-block-header';
import {
  CodeBlockLanguageSelect,
  CodeBlockLanguageSelectTrigger
} from './code-block-language-select';
import { CodeBlockRoot } from './code-block-root';

export const CodeBlock = Object.assign(CodeBlockRoot, {
  Header: CodeBlockHeader,
  Content: CodeBlockContent,
  Label: CodeBlockLabel,
  Action: CodeBlockAction,
  LanguageSelect: CodeBlockLanguageSelect,
  LanguageSelectTrigger: CodeBlockLanguageSelectTrigger,
  LanguageSelectContent: Select.Content as typeof Select.Content,
  LanguageSelectItem: Select.Item as typeof Select.Item,
  CopyButton: CodeBlockCopyButton,
  Code: CodeBlockCode
});
